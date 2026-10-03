import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import worker from '../worker.mjs';
import {hasAccess,sessionToken} from '../access.mjs';
const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const issuer='https://example.clerk.accounts.dev',origin='https://math.example.com';
function token(overrides={}){const t=Math.floor(Date.now()/1000);const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');const input=enc({alg:'RS256',typ:'JWT',kid:'test'})+'.'+enc({iss:issuer,sub:'user_1',sid:'sess_1',azp:origin,iat:t,nbf:t-5,exp:t+60,...overrides});return input+'.'+sign('RSA-SHA256',Buffer.from(input),privateKey).toString('base64url');}
function env(rows=[]){return {SITE_URL:origin,CLERK_PUBLISHABLE_KEY:'pk_test_example',CLERK_ISSUER:issuer,CLERK_JWT_KEY:publicKey.export({type:'spki',format:'pem'}),STRIPE_SECRET_KEY:'sk_test_example',STRIPE_PRICE_ID:'price_example',STRIPE_WEBHOOK_SECRET:'whsec_example',DB:{prepare(){return {bind(){return this},all:async()=>({results:rows})}}},ASSETS:{fetch:async()=>new Response('protected image',{headers:{'Content-Type':'image/png'}})}};}
const request=(path,jwt,extra={})=>new Request(origin+path,{...extra,headers:{...(jwt?{Cookie:`__session=${jwt}`} : {}),...extra.headers}});
test('only active unexpired subscriptions grant access',()=>{for(const status of ['canceled','past_due','unpaid','trialing','incomplete'])assert.equal(hasAccess([{status,access_until:101}],100),false);assert.equal(hasAccess([{status:'active',access_until:100}],100),false);assert.equal(hasAccess([{status:'active',access_until:101}],100),true);});
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
