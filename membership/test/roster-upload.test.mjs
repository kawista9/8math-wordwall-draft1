import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import {database} from './db.mjs';
import {classCode,joinClass,uploadRoster} from '../roster.mjs';
import {parseRosterCSV} from '../roster-csv.mjs';
import worker from '../worker.mjs';
import {generateKeyPairSync,sign} from 'node:crypto';
// Clerk's runtime uses the replaceable global fetch in test mode.
process.env.NODE_ENV='test';
const headers='First Name,Last Name,School Email\r\n';
test('CSV handles BOM, CRLF, reordered columns and quoted commas',()=>{
 assert.deepEqual(parseRosterCSV('\uFEFFSchool Email,Last Name,First Name\r\nA@School.edu,"Smith, Jr.",Alex\r\n'),[{firstName:'Alex',lastName:'Smith, Jr.',email:'a@school.edu'}]);
 assert.equal(parseRosterCSV(headers+'"Alex ""AJ""",Smith,a@school.edu')[0].firstName,'Alex "AJ"');
});
test('CSV rejects duplicate emails, malformed rows, empty names and more than 150 students',()=>{
 for(const text of [headers+'A,B,x@school.edu\nC,D,X@school.edu',headers+'A,B',headers+',B,x@school.edu',headers+'"A,B,x@school.edu',headers+Array.from({length:151},(_,i)=>`A,B,s${i}@school.edu`).join('\n')])assert.throws(()=>parseRosterCSV(text));
});
test('class code persists, accepts formatting, rotates and preserves enrolled learners',async()=>{
 const env={DB:database()};const code=await classCode('t',env);assert.match(code,/^[A-HJ-NP-Z2-9]{12}$/);assert.equal(await classCode('t',env),code);
 assert.equal((await joinClass('s',{code:code.toLowerCase().match(/.{4}/g).join('-'),displayName:'Learner'},env,async()=>true)).joined,true);
 const fresh=await classCode('t',env,true);assert.notEqual(code,fresh);
 assert.equal((await joinClass('s2',{code,displayName:'Learner'},env,async()=>true)).status,403);
 assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS n FROM learners').get().n,1);
 assert.equal((await joinClass('s2',{code:fresh,displayName:'Learner'},env,async()=>false)).status,403);
});
test('uploads are teacher scoped, replace only uploaded lists, and invalid uploads preserve prior data',async()=>{
 const env={DB:database()};const rows=[{firstName:'A',lastName:'B',email:'A@school.edu'}];
 assert.equal((await uploadRoster('t',{rows},env)).saved,1);await uploadRoster('other',{rows},env);
 const code=await classCode('t',env);await joinClass('student',{code,displayName:'A B'},env,async()=>true);
 assert.equal((await uploadRoster('t',{rows:[...rows,...rows]},env)).status,400);
 assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS n FROM roster_uploads').get().n,2);
 await uploadRoster('t',{rows:[{firstName:'C',lastName:'D',email:'c@school.edu'}]},env);
 assert.equal(env.DB.raw.prepare("SELECT email FROM roster_uploads WHERE teacher_id='other'").get().email,'a@school.edu');
 assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS n FROM learners').get().n,1);
});
const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
function auth(user){const now=Math.floor(Date.now()/1000);const h=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');const p=Buffer.from(JSON.stringify({sub:user,sid:'session',iss:'https://test.clerk.accounts.dev',azp:'https://test.example.com',iat:now,nbf:now-5,exp:now+60})).toString('base64url');return `${h}.${p}.${sign('RSA-SHA256',Buffer.from(`${h}.${p}`),privateKey).toString('base64url')}`;}
function env(){return {DB:database(),SITE_URL:'https://test.example.com',CLERK_PUBLISHABLE_KEY:'pk_test_x',CLERK_ISSUER:'https://test.clerk.accounts.dev',CLERK_JWT_KEY:publicKey.export({type:'spki',format:'pem'}),STRIPE_SECRET_KEY:'sk_test_x',STRIPE_PUBLISHABLE_KEY:'pk_test_x',STRIPE_INDIVIDUAL_PRICE_ID:'i',STRIPE_TEACHER_PRICE_ID:'t',STRIPE_TEACHER_INTRO_PRICE_ID:'intro',STRIPE_WEBHOOK_SECRET:'whsec_x'};}
function request(path,user,body={}){return new Request('https://test.example.com'+path,{method:'POST',headers:{Authorization:'Bearer '+auth(user),Origin:'https://test.example.com','Content-Type':'application/json'},body:JSON.stringify(body)});}
test('roster APIs deny non-teachers and isolate teacher class data',async()=>{
 const e=env();for(const path of ['/api/roster','/api/roster-upload','/api/class-code'])assert.equal((await worker.fetch(request(path,'learner'),e)).status,403);
 e.DB.raw.prepare('INSERT INTO subscriptions VALUES (?,?,?,?,?,?)').run('sub','teacher','active',Math.floor(Date.now()/1000)+3600,'teacher',0);
 const saved=await worker.fetch(request('/api/roster-upload','teacher',{rows:[{firstName:'A',lastName:'B',email:'a@school.edu'}]}),e);assert.equal(saved.status,200);
 const res=await worker.fetch(request('/api/roster','teacher'),e);assert.equal(res.status,200);const body=await res.json();assert.equal(body.uploaded.length,1);assert.equal(body.code.length,12);
});

test('authenticated status resolves the verified Clerk email, grants content, and ignores a forged request email',async()=>{
 const e=env();e.CLERK_SECRET_KEY='sk_test_mock';
 e.ASSETS={fetch:async()=>new Response('protected word wall')};
 e.DB.raw.prepare('INSERT INTO subscriptions VALUES (?,?,?,?,?,?)').run('sub','teacher','active',Math.floor(Date.now()/1000)+3600,'teacher',0);
 await uploadRoster('teacher',{rows:[{firstName:'Alex',lastName:'Rivera',email:'student@school.edu'}]},e);
 let lookupUser='attacker';
 const backend=mock.method(globalThis,'fetch',async(input,options)=>{
  const url=String(input instanceof Request?input.url:input);
  assert.equal(url,`https://api.clerk.com/v1/users/${lookupUser}`);
  const headers=new Headers(options?.headers || (input instanceof Request?input.headers:undefined));
  assert.equal(headers.get('Authorization'),'Bearer sk_test_mock');
  return Response.json({object:'user',id:lookupUser,email_addresses:[{id:'email_1',object:'email_address',linked_to:[],email_address:lookupUser==='student'?'student@school.edu':'attacker@school.edu',verification:{status:'verified'}}]});
 });
 try {
  const forged=await worker.fetch(request('/api/status','attacker',{email:'student@school.edu',userId:'student',emailVerified:true}),e);
  assert.equal(forged.status,200);assert.equal((await forged.json()).active,false);
  lookupUser='student';
  const response=await worker.fetch(request('/api/status','student'),e);assert.equal(response.status,200);
  const body=await response.json();assert.equal(body.active,true);assert.equal(body.ownMembership,false);assert.equal(body.hasCustomer,false);assert.equal(body.enrollment.enrolled,1);
  const content=()=>worker.fetch(new Request('https://test.example.com/lesson.html',{headers:{Authorization:'Bearer '+auth('student')}}),e);
  assert.equal((await content()).status,200);
  e.DB.raw.prepare("UPDATE subscriptions SET access_until=0 WHERE user_id='teacher'").run();
  assert.equal((await content()).status,403);
 } finally {backend.mock.restore();}
});

test('Clerk lookup failure never activates a roster learner and does not break existing paid access',async()=>{
 const e=env();e.CLERK_SECRET_KEY='sk_test_mock';
 e.DB.raw.prepare('INSERT INTO subscriptions VALUES (?,?,?,?,?,?)').run('sub','paid','active',Math.floor(Date.now()/1000)+3600,'individual',0);
 const backend=mock.method(globalThis,'fetch',async()=>Response.json({errors:[{code:'authentication_invalid',message:'Invalid key'}]},{status:401}));
 try {
  const pending=await worker.fetch(request('/api/status','student'),e);
  assert.equal(pending.status,200);const p=await pending.json();assert.equal(p.active,false);assert.equal(p.enrollment.state,'error');
  const paid=await worker.fetch(request('/api/status','paid'),e);
  assert.equal(paid.status,200);assert.equal((await paid.json()).active,true);
 } finally {backend.mock.restore();}
});
