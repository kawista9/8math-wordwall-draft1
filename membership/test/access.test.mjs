import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import worker from '../worker.mjs';
import {database} from './db.mjs';
import {hasAccess,sessionToken} from '../access.mjs';
const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const issuer='https://example.clerk.accounts.dev',origin='https://math.example.com';
function token(overrides={}){const t=Math.floor(Date.now()/1000);const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');const input=enc({alg:'RS256',typ:'JWT',kid:'test'})+'.'+enc({iss:issuer,sub:'user_1',sid:'sess_1',azp:origin,iat:t,nbf:t-5,exp:t+60,...overrides});return input+'.'+sign('RSA-SHA256',Buffer.from(input),privateKey).toString('base64url');}
function env(rows=[]){return {SITE_URL:origin,CLERK_PUBLISHABLE_KEY:'pk_test_example',CLERK_ISSUER:issuer,CLERK_JWT_KEY:publicKey.export({type:'spki',format:'pem'}),STRIPE_SECRET_KEY:'sk_test_example',STRIPE_PUBLISHABLE_KEY:'pk_test_example',STRIPE_INDIVIDUAL_PRICE_ID:'price_individual',STRIPE_TEACHER_PRICE_ID:'price_teacher',STRIPE_TEACHER_INTRO_PRICE_ID:'price_intro',STRIPE_WEBHOOK_SECRET:'whsec_example',DB:{prepare(){return {bind(){return this},first:async()=>null,all:async()=>({results:rows})}}},ASSETS:{fetch:async()=>new Response('protected image',{headers:{'Content-Type':'image/png'}})}};}
const request=(path,jwt,extra={})=>new Request(origin+path,{...extra,headers:{...(jwt?{Cookie:`__session=${jwt}`} : {}),...extra.headers}});
test('only active unexpired subscriptions grant access',()=>{for(const status of ['canceled','past_due','unpaid','incomplete'])assert.equal(hasAccess([{status,access_until:101}],100),false);assert.equal(hasAccess([{status:'active',access_until:100}],100),false);assert.equal(hasAccess([{status:'active',access_until:101}],100),true);});
test('cookie parsing selects exact session cookie',()=>assert.equal(sessionToken(new Request(origin,{headers:{cookie:'not__session=wrong; __session=right'}})),'right'));
test('anonymous navigation redirects to membership',async()=>{const r=await worker.fetch(request('/'),env());assert.equal(r.status,302);assert.equal(r.headers.get('location'),origin+'/account');});
test('direct protected image denies anonymous requests',async()=>assert.equal((await worker.fetch(request('/assets/anchor.png'),env())).status,401));
test('valid sign-in alone cannot fetch content',async()=>assert.equal((await worker.fetch(request('/assets/anchor.png',token()),env())).status,403));
test('paid learner receives protected asset without shared caching',async()=>{const r=await worker.fetch(request('/assets/anchor.png',token()),env([{status:'active',access_until:Math.floor(Date.now()/1000)+3600}]));assert.equal(r.status,200);assert.equal(await r.text(),'protected image');assert.equal(r.headers.get('cache-control'),'private, no-store');});
test('wrong issuer, wrong origin and expired tokens are denied',async()=>{for(const claims of [{iss:'https://attacker.example'},{azp:'https://attacker.example'},{exp:1}])assert.equal((await worker.fetch(request('/assets/anchor.png',token(claims)),env())).status,401);});
test('forged session cannot grant access',async()=>assert.equal((await worker.fetch(request('/assets/anchor.png','forged'),env())).status,401));
test('cross-origin billing mutation rejected before Stripe',async()=>assert.equal((await worker.fetch(request('/api/checkout',token(),{method:'POST',headers:{Origin:'https://attacker.example'}}),env())).status,403));
test('unconfigured deployment fails closed',async()=>assert.equal((await worker.fetch(request('/assets/anchor.png'),{ASSETS:env().ASSETS})).status,503));
test('invalid payment webhook rejected',async()=>assert.equal((await worker.fetch(request('/api/stripe/webhook',null,{method:'POST',body:'{}',headers:{'stripe-signature':'bad'}}),env())).status,400));

test('class learner access follows teacher trial and cancellation, without requiring a personal purchase',async()=>{
 const e=env();e.DB=database();const now=Math.floor(Date.now()/1000);
 e.DB.raw.prepare("INSERT INTO subscriptions(subscription_id,user_id,status,access_until,plan) VALUES (?,?,?,?,?)").run('sub_t','teacher_1','trialing',now+3600,'teacher');
 e.DB.raw.prepare('INSERT INTO learners VALUES (?,?,?,?)').run('teacher_1','user_1','Kaiden',now);
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,200);
 e.DB.raw.exec("UPDATE subscriptions SET status='canceled'");
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,403);
 e.DB.raw.exec("UPDATE subscriptions SET status='active'");
 e.DB.raw.exec('DELETE FROM learners');
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,403);
});
test('non-teacher cannot view rosters',async()=>{const e=env();e.DB=database();const r=await worker.fetch(request('/api/roster',token(),{method:'POST',headers:{Origin:origin}}),e);assert.equal(r.status,403);});
test('teacher checkout requires consent, collects a card without charging, and reuses open sessions',async()=>{
 const e=env();e.DB=database();const original=globalThis.fetch;const sent=[];let created=0;
 globalThis.fetch=async(url,options={})=>{
  const u=new URL(String(url)),path=u.pathname;
  const respond=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
  if(path.startsWith('/v1/prices/')){const id=path.split('/').pop();return respond({id,active:true,currency:'usd',unit_amount:id==='price_individual'?1200:id==='price_teacher'?4999:2499,recurring:{interval:id==='price_intro'?'week':'month',interval_count:id==='price_intro'?2:1,usage_type:'licensed'}});}
  if(path==='/v1/customers'){return respond({id:'cus_t'});}
  if(path==='/v1/subscriptions')return respond({data:[],has_more:false});
  if(path==='/v1/checkout/sessions' && options.method==='POST'){
   const body=new URLSearchParams(options.body);sent.push(body);created++;
   return respond({id:'cs_t',client_secret:'cs_t_secret_example',ui_mode:'embedded_page',status:'open',mode:'setup'});
  }
  if(path==='/v1/checkout/sessions/cs_t')return respond({id:'cs_t',status:'open',client_secret:'cs_t_secret_example'});
  if(path==='/v1/checkout/sessions')return respond({data:created?[{id:'cs_t',client_secret:'cs_t_secret_example',ui_mode:'embedded_page',status:'open',mode:'setup',metadata:{word_wall_user_id:'user_1',plan:'teacher_offer'}}]:[],has_more:false});
  throw new Error('Unexpected Stripe call: '+path);
 };
 try{
  const post=body=>worker.fetch(request('/api/checkout',token(),{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)}),e);
  assert.equal((await post({plan:'teacher',accepted:false})).status,400);
  let result=await post({plan:'teacher',accepted:true});assert.equal(result.status,200);assert.equal((await result.json()).clientSecret,'cs_t_secret_example');
  assert.equal(sent[0].get('ui_mode'),'embedded_page');assert.equal(sent[0].get('redirect_on_completion'),'never');assert.equal(sent[0].get('success_url'),null);assert.equal(sent[0].get('mode'),'setup');assert.equal(sent[0].get('line_items[0][price]'),null);
  assert.match(sent[0].get('custom_text[submit][message]'),/\$24\.99.*\$49\.99/);
  assert.equal((await post({plan:'teacher',accepted:true})).status,200);assert.equal(created,1);
  assert.equal(e.DB.raw.prepare('SELECT COUNT(*) AS n FROM checkout_locks').get().n,0);
 }finally{globalThis.fetch=original;}
});

 test('complimentary access protects assets, expires, revokes, and grants no teacher roster',async()=>{
 const e=env();e.DB=database();e.OWNER_USER_ID='user_owner';
 const post=(path,body,claims={sub:'user_owner'},originHeader=origin)=>worker.fetch(request(path,token(claims),{method:'POST',headers:{Origin:originHeader,'Content-Type':'application/json'},body:JSON.stringify(body)}),e);
 const grant={userId:'user_1',label:'Individual learner',expiresAt:null};
 assert.equal((await post('/api/complimentary/grant',grant,{sub:'user_1'})).status,403);
 assert.equal((await post('/api/complimentary/grant',grant,{sub:'user_owner'},'https://attacker.example')).status,403);
 assert.equal((await post('/api/complimentary/grant',grant)).status,200);
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,200);
 assert.equal((await post('/api/roster',{}, {sub:'user_1'})).status,403);
 assert.equal((await post('/api/complimentary/list',{}, {sub:'user_1'})).status,403);
 assert.equal((await post('/api/complimentary/revoke',{userId:'user_1'})).status,200);
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,403);
 assert.equal((await post('/api/complimentary/grant',{...grant,expiresAt:Math.floor(Date.now()/1000)+1000})).status,200);
 e.DB.raw.exec('UPDATE complimentary_access SET expires_at=1');
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,403);
 e.DB.raw.prepare("INSERT INTO subscriptions(subscription_id,user_id,status,access_until,plan) VALUES('paid','user_1','active',?,'individual')").run(Math.floor(Date.now()/1000)+1000);
 await post('/api/complimentary/revoke',{userId:'user_1'});
 assert.equal((await worker.fetch(request('/assets/chart.png',token()),e)).status,200);
 assert.equal(e.DB.raw.prepare('SELECT COUNT(*) AS n FROM subscriptions').get().n,1);
 });

test('dashboard and directory are restricted to the configured owner',async()=>{
 const e=env();e.DB=database();e.OWNER_USER_ID='user_owner';
 assert.equal((await worker.fetch(request('/dashboard'),e)).status,401);
 assert.equal((await worker.fetch(request('/dashboard',token()),e)).status,403);
 const now=Math.floor(Date.now()/1000);
 e.DB.raw.prepare("INSERT INTO subscriptions(subscription_id,user_id,status,access_until,plan) VALUES('sub_1','user_1','active',?,'individual')").run(now+3600);
 assert.equal((await worker.fetch(request('/dashboard',token()),e)).status,403);
 const page=await worker.fetch(request('/dashboard',token({sub:'user_owner'})),e);
 assert.equal(page.status,200);assert.equal(page.headers.get('cache-control'),'private, no-store');assert.match(await page.text(),/Owner Dashboard/);
 const post=(sub,originHeader=origin)=>worker.fetch(request('/api/dashboard',token({sub}),{method:'POST',headers:{Origin:originHeader}}),e);
 assert.equal((await post('user_1')).status,403);
 assert.equal((await post('user_owner','https://attacker.example')).status,403);
 const records=await post('user_owner');assert.equal(records.status,200);
 const data=await records.json();assert.equal(data.subscriptions[0].user_id,'user_1');assert.deepEqual(data.learners,[]);
});
