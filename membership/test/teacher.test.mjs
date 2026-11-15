import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './db.mjs';
import {teacherPhases,subscriptionRecord,completeTeacherSetup,cancelSubscription,validatePrices} from '../billing.mjs';
import {createJoinLink,joinClass} from '../roster.mjs';
const prices={STRIPE_INDIVIDUAL_PRICE_ID:'price_i',STRIPE_TEACHER_PRICE_ID:'price_t',STRIPE_TEACHER_INTRO_PRICE_ID:'price_intro'};
function priceAPI(wrong=false){return {retrieve:async id=>({active:true,currency:'usd',unit_amount:wrong?999:id==='price_i'?1200:id==='price_t'?4999:2499,recurring:{interval:id==='price_intro'?'week':'month',interval_count:id==='price_intro'?2:1,usage_type:'licensed'}})};}
test('teacher schedule preserves free 14 days, paid 14 days, monthly renewal without proration',()=>{
 const phases=teacherPhases(prices,'teacher');
 assert.equal(phases[0].trial,true);assert.deepEqual(phases[0].duration,{interval:'week',interval_count:2});
 assert.equal(phases[1].trial,undefined);assert.equal(phases[1].items[0].price,'price_intro');assert.deepEqual(phases[1].duration,{interval:'week',interval_count:2});
 assert.equal(phases[2].items[0].price,'price_t');assert.deepEqual(phases[2].duration,{interval:'month',interval_count:1});
 assert.ok(phases.every(p=>p.proration_behavior==='none'));assert.equal(phases[2].billing_cycle_anchor,'phase_start');
});
test('checkout refuses a mispriced Stripe product',async()=>{await validatePrices({prices:priceAPI()},prices);await assert.rejects(validatePrices({prices:priceAPI(true)},prices));});
test('trial access stops at trial end and canceled access is bounded',()=>{
 const sub={id:'sub_t',status:'trialing',trial_end:100,items:{data:[{price:{id:'price_intro'},current_period_end:200}]}};
 assert.equal(subscriptionRecord(sub,prices).until,100);assert.equal(subscriptionRecord(sub,prices).plan,'teacher');
 assert.equal(subscriptionRecord({...sub,status:'active',cancel_at:150},prices).until,150);
 assert.equal(subscriptionRecord({...sub,pause_collection:{}},prices).status,'paused');
});
test('completed setup starts exactly one schedule with verified customer/card and releases to monthly billing',async()=>{
 const DB=database();DB.raw.prepare('INSERT INTO customers VALUES (?,?)').run('teacher','cus_t');DB.raw.prepare('INSERT INTO teacher_offers(user_id,checkout_id) VALUES (?,?)').run('teacher','cs_t');
 const env={...prices,DB};let creations=0;
 const stripe={customers:{update:async(id,data)=>{assert.equal(id,'cus_t');assert.equal(data.invoice_settings.default_payment_method,'pm_t');}},prices:priceAPI(),setupIntents:{retrieve:async()=>({status:'succeeded',customer:'cus_t',payment_method:'pm_t'})},subscriptionSchedules:{list:()=>({async *[Symbol.asyncIterator](){}}),create:async(data,options)=>{creations++;assert.equal(data.default_settings.default_payment_method,undefined);assert.equal(data.start_date,'now');assert.equal(data.end_behavior,'release');assert.equal(data.phases[1].items[0].price,'price_intro');assert.equal(options.idempotencyKey,'teacher-offer-cs_t');return {id:'schedule_t'};}}};
 const session={id:'cs_t',mode:'setup',status:'complete',customer:'cus_t',setup_intent:'seti_t',metadata:{plan:'teacher_offer',word_wall_user_id:'teacher'}};
 await completeTeacherSetup(session,'teacher',env,stripe);await completeTeacherSetup(session,'teacher',env,stripe);assert.equal(creations,1);
 assert.equal(DB.raw.prepare('SELECT used FROM teacher_offers').get().used,1);
});
test('setup cannot start billing using another customer’s card',async()=>{
 const DB=database();DB.raw.prepare('INSERT INTO customers VALUES (?,?)').run('teacher','cus_t');DB.raw.prepare('INSERT INTO teacher_offers(user_id,checkout_id) VALUES (?,?)').run('teacher','cs_t');
 await assert.rejects(completeTeacherSetup({id:'cs_t',mode:'setup',status:'complete',customer:'cus_t',setup_intent:'seti_t',metadata:{plan:'teacher_offer',word_wall_user_id:'teacher'}},'teacher',{...prices,DB},{setupIntents:{retrieve:async()=>({status:'succeeded',customer:'cus_attacker',payment_method:'pm_x'})}}));
});
test('cancellation removes future price changes before canceling next renewal',async()=>{const calls=[];await cancelSubscription({id:'sub_t',schedule:'schedule_t'},{subscriptionSchedules:{release:async()=>calls.push('release')},subscriptions:{update:async(id,data)=>{assert.equal(data.cancel_at_period_end,true);calls.push('cancel');}}});assert.deepEqual(calls,['release','cancel']);});
test('150 seats enforced atomically, duplicate joins free, removal frees a seat, rotated link invalidated',async()=>{
 const env={DB:database(),SITE_URL:'https://math.example.com'};const link=await createJoinLink('teacher',env),code=new URL(link).searchParams.get('join');
 const body={code,displayName:'Learner'};
 for(let i=0;i<150;i++)assert.equal((await joinClass('student_'+i,body,env,async()=>true)).joined,true);
 assert.equal((await joinClass('student_0',body,env,async()=>true)).joined,true);
 assert.equal((await joinClass('student_150',body,env,async()=>true)).status,409);
 env.DB.raw.prepare('DELETE FROM learners WHERE learner_id=?').run('student_0');
 assert.equal((await joinClass('student_150',body,env,async()=>true)).joined,true);
 await createJoinLink('teacher',env);
 assert.equal((await joinClass('student_151',body,env,async()=>true)).status,403);
 assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS n FROM learners').get().n,150);
});
test('inactive teacher and teacher self-enrollment denied',async()=>{
 const env={DB:database(),SITE_URL:'https://math.example.com'};const code=new URL(await createJoinLink('teacher',env)).searchParams.get('join');
 assert.equal((await joinClass('student',{code,displayName:'Name'},env,async()=>false)).status,403);
 assert.equal((await joinClass('teacher',{code,displayName:'Name'},env,async()=>true)).status,403);
});
