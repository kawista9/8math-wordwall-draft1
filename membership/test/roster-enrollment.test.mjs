import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './db.mjs';
import {uploadRoster,classCode,joinClass} from '../roster.mjs';
import {enrollVerifiedLearner,verifiedEmails,removeLearner,rosterWithStatus,autoEnroll} from '../roster-enrollment.mjs';

const row=email=>({firstName:'Alex',lastName:'Rivera',email});
const profile=(id,email,status='verified')=>({id,emailAddresses:[{emailAddress:email,verification:{status}}]});
const active=async()=>true;
const count=env=>env.DB.raw.prepare('SELECT COUNT(*) AS n FROM learners').get().n;

test('rostered learner activates on verified email without a class code; repeated login uses one seat',async()=>{
 const env={DB:database()};await uploadRoster('teacher',{rows:[row('Alex@School.edu')]},env);
 assert.equal((await rosterWithStatus('teacher',env))[0].enrollment_status,'Awaiting first sign-in');
 const user=profile('student','ALEX@school.edu');
 assert.equal((await enrollVerifiedLearner('student',user,env,active)).enrolled,1);
 assert.equal((await enrollVerifiedLearner('student',user,env,active)).enrolled,1);
 assert.equal(count(env),1);
 assert.equal(env.DB.raw.prepare('SELECT display_name FROM learners').get().display_name,'Alex Rivera');
 assert.equal((await rosterWithStatus('teacher',env))[0].enrollment_status,'Active');
});

test('unverified, foreign-user, banned, and unrelated email profiles cannot claim roster access',async()=>{
 const env={DB:database()};await uploadRoster('teacher',{rows:[row('student@school.edu')]},env);
 for(const p of [profile('student','student@school.edu','unverified'),profile('someone_else','student@school.edu'),profile('student','other@school.edu'),{...profile('student','student@school.edu'),banned:true},{...profile('student','student@school.edu'),locked:true}]){
  assert.equal((await enrollVerifiedLearner('student',p,env,active)).enrolled,0);
 }
 assert.equal(count(env),0);
});

test('verified aliases are distinct and unverified secondary emails are excluded',async()=>{
 const env={DB:database()};await uploadRoster('teacher',{rows:[row('karistamwilliams+teacherlearner1@gmail.com')]},env);
 const wrong=profile('student','karistamwilliams+teacherlearner2@gmail.com');
 wrong.emailAddresses.push({emailAddress:'karistamwilliams+teacherlearner1@gmail.com',verification:{status:'unverified'}});
 assert.equal((await enrollVerifiedLearner('student',wrong,env,active)).enrolled,0);
 wrong.emailAddresses[1].verification.status='verified';
 assert.equal((await enrollVerifiedLearner('student',wrong,env,active)).enrolled,1);
});

test('only matching active teachers enroll a learner; self-enrollment is excluded',async()=>{
 const env={DB:database()};for(const teacher of ['active','expired','student','unrelated'])await uploadRoster(teacher,{rows:[row(teacher==='unrelated'?'other@school.edu':'student@school.edu')]},env);
 const result=await enrollVerifiedLearner('student',profile('student','student@school.edu'),env,async t=>t!=='expired');
 assert.equal(result.enrolled,1);assert.equal(count(env),1);
 assert.equal(env.DB.raw.prepare('SELECT teacher_id FROM learners').get().teacher_id,'active');
});

test('existing accounts activate after later roster upload; replacing pending roster removes its eligibility',async()=>{
 const env={DB:database()},user=profile('student','student@school.edu');
 assert.equal((await enrollVerifiedLearner('student',user,env,active)).enrolled,0);
 await uploadRoster('teacher',{rows:[row('student@school.edu')]},env);
 await uploadRoster('teacher',{rows:[row('replacement@school.edu')]},env);
 assert.equal((await enrollVerifiedLearner('student',user,env,active)).enrolled,0);
 await uploadRoster('teacher',{rows:[row('student@school.edu')]},env);
 assert.equal((await enrollVerifiedLearner('student',user,env,active)).enrolled,1);
});

test('removal survives refresh and re-upload; explicit class-code joining can restore access',async()=>{
 const env={DB:database()},user=profile('student','student@school.edu');
 await uploadRoster('teacher',{rows:[row('student@school.edu')]},env);
 await enrollVerifiedLearner('student',user,env,active);
 await removeLearner('other','student',env);assert.equal(count(env),1);
 await removeLearner('teacher','student',env);assert.equal(count(env),0);
 await uploadRoster('teacher',{rows:[row('student@school.edu')]},env);
 assert.equal((await enrollVerifiedLearner('student',user,env,active)).enrolled,0);
 assert.equal((await rosterWithStatus('teacher',env))[0].enrollment_status,'Removed');
 const code=await classCode('teacher',env);
 assert.equal((await joinClass('student',{code,displayName:'Alex'},env,active)).joined,true);
 assert.equal((await rosterWithStatus('teacher',env))[0].enrollment_status,'Active');
});

test('new unrostered learners can still join by code',async()=>{
 const env={DB:database()};await uploadRoster('teacher',{rows:[row('student@school.edu')]},env);
 assert.equal((await enrollVerifiedLearner('new',profile('new','new@school.edu'),env,active)).enrolled,0);
 const code=await classCode('teacher',env);
 assert.equal((await joinClass('new',{code,displayName:'New learner'},env,active)).joined,true);
});

test('automatic enrollment obeys 150-seat cap; existing matching learner is recognized at capacity',async()=>{
 const env={DB:database()};const insert=env.DB.raw.prepare('INSERT INTO learners VALUES (?,?,?,?)');
 for(let i=0;i<150;i++)insert.run('teacher','s'+i,'Name',1);
 await uploadRoster('teacher',{rows:[row('student@school.edu'),row('existing@school.edu')]},env);
 const full=await enrollVerifiedLearner('new',profile('new','student@school.edu'),env,active);
 assert.equal(full.full,true);assert.equal(full.enrolled,0);assert.equal(count(env),150);
 assert.equal((await enrollVerifiedLearner('s0',profile('s0','existing@school.edu'),env,active)).enrolled,1);
 await removeLearner('teacher','s1',env);
 assert.equal((await enrollVerifiedLearner('new',profile('new','student@school.edu'),env,active)).enrolled,1);
 assert.equal(count(env),150);
});

test('missing Clerk secret is explicit and grants no enrollment',async()=>{
 const env={DB:database()};assert.equal((await autoEnroll('student',env,active)).state,'unavailable');assert.equal(count(env),0);
 assert.deepEqual(verifiedEmails(null,'student'),[]);
});
