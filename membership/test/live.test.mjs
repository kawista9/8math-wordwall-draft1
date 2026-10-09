import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './db.mjs';
import {liveAPI,validSlot,tutoringAmount,reconcileBooking} from '../live.mjs';
const now=()=>Math.floor(Date.now()/1000),allowed=async()=>true,customer=async()=> 'cus_student';
function env(){return {DB:database(),OWNER_USER_ID:'owner'};}
test('48 hour lead and entitlement based tutoring pricing',async()=>{
 assert.equal(validSlot(172900,100),true);assert.equal(validSlot(172899,100),false);
 const e=env();e.DB.raw.prepare('INSERT INTO subscriptions(subscription_id,user_id,status,access_until,plan) VALUES(?,?,?,?,?)').run('sub','individual','active',now()+1000,'individual');
 assert.equal(await tutoringAmount('individual',e),2500);assert.equal(await tutoringAmount('teacher_student',e),5000);
 e.DB.raw.prepare('UPDATE subscriptions SET access_until=0').run();assert.equal(await tutoringAmount('individual',e),5000);
});
test('questions require membership, instructor controls are protected, questions stay private',async()=>{
 const e=env();assert.equal((await liveAPI('/api/live/question',{kind:'advance',body:'test'},'student',e,{},async()=>false,customer)).status,403);
 assert.equal((await liveAPI('/api/live/settings',{},'student',e,{},allowed,customer)).status,403);
 assert.equal((await liveAPI('/api/live/question',{kind:'chat',body:'test'},'student',e,{},allowed,customer)).status,409);
 await liveAPI('/api/live/question',{kind:'advance',body:'<script>mine</script>'},'student',e,{},allowed,customer);
 await liveAPI('/api/live/question',{kind:'advance',body:'other'},'other',e,{},allowed,customer);
 const d=await(await liveAPI('/api/live/status',{},'student',e,{},allowed,customer)).json();assert.equal(d.questions.length,1);assert.equal(d.questions[0].user_id,undefined);
 const admin=await(await liveAPI('/api/live/status',{},'owner',e,{},allowed,customer)).json();assert.equal(admin.questions.length,2);
});
async function request(e,user,start=now()+200000){
 assert.equal((await liveAPI('/api/tutoring/request',{startsAt:start,topic:'Geometry',email:'learner@example.com'},user,e,{},allowed,customer)).status,200);
 return e.DB.raw.prepare('SELECT * FROM tutoring_requests WHERE user_id=? ORDER BY rowid DESC').get(user);
}
test('instructor approval enforces notice, ownership and overlap',async()=>{
 const e=env(),start=now()+200000,a=await request(e,'student',start),b=await request(e,'other',start+100);
 assert.equal((await liveAPI('/api/tutoring/approve',{id:a.id,startsAt:start},'student',e,{},allowed,customer)).status,403);
 assert.equal((await liveAPI('/api/tutoring/approve',{id:a.id,startsAt:now()+1000},'owner',e,{},allowed,customer)).status,400);
 assert.equal((await liveAPI('/api/tutoring/approve',{id:a.id,startsAt:start},'owner',e,{},allowed,customer)).status,200);
 assert.equal((await liveAPI('/api/tutoring/approve',{id:b.id,startsAt:start+100},'owner',e,{},allowed,customer)).status,409);
 assert.equal((await liveAPI('/api/tutoring/approve',{id:b.id,startsAt:start+3600},'owner',e,{},allowed,customer)).status,200);
 const status=await(await liveAPI('/api/tutoring/status',{},'student',e,{},allowed,customer)).json();assert.equal(status.requests.length,1);assert.equal(status.bookings.length,1);
});
test('payment requires approval and belongs to learner; separate one time checkout',async()=>{
 const e=env(),r=await request(e,'student');let calls=0;
 const stripe={checkout:{sessions:{create:async data=>{calls++;assert.equal(data.mode,'payment');assert.equal(data.line_items[0].price_data.unit_amount,5000);assert.equal(data.subscription_data,undefined);return {id:'cs',client_secret:'secret'};},retrieve:async()=>({status:'open',client_secret:'secret'})}}};
 assert.equal((await liveAPI('/api/tutoring/checkout',{bookingId:r.id},'student',e,stripe,allowed,customer)).status,403);
 await liveAPI('/api/tutoring/approve',{id:r.id,startsAt:r.starts_at},'owner',e,stripe,allowed,customer);assert.equal(calls,0);
 const b=e.DB.raw.prepare('SELECT * FROM tutoring_bookings').get();
 assert.equal((await liveAPI('/api/tutoring/checkout',{bookingId:b.id},'other',e,stripe,allowed,customer)).status,403);
 assert.equal((await liveAPI('/api/tutoring/checkout',{bookingId:b.id,amount:1},'student',e,stripe,allowed,customer)).status,200);
 assert.equal((await liveAPI('/api/tutoring/checkout',{bookingId:b.id},'student',e,stripe,allowed,customer)).status,200);assert.equal(calls,1);
});
test('expired approved checkout retains reserved appointment',async()=>{
 const e=env(),r=await request(e,'student');await liveAPI('/api/tutoring/approve',{id:r.id,startsAt:r.starts_at},'owner',e,{},allowed,customer);
 e.DB.raw.prepare("UPDATE tutoring_bookings SET state='pending',checkout_id='cs'").run();const b=e.DB.raw.prepare('SELECT * FROM tutoring_bookings').get();
 await reconcileBooking(b,e,{checkout:{sessions:{retrieve:async()=>({status:'expired',metadata:{tutoring_booking:b.id,word_wall_user_id:'student'}})}}});
 assert.equal(e.DB.raw.prepare('SELECT state FROM tutoring_bookings').get().state,'approved');assert.equal(e.DB.raw.prepare('SELECT state FROM tutoring_slots').get().state,'held');
});
test('only verified payment confirms booking; expired sessions release reservations',async()=>{
 const e=env();e.DB.raw.prepare("INSERT INTO tutoring_slots VALUES('slot',?,'held','booking')").run(now()+200000);
 e.DB.raw.prepare("INSERT INTO tutoring_bookings(id,slot_id,user_id,amount,topic,checkout_id,created_at) VALUES('booking','slot','student',5000,'Math','cs',?)").run(now());
 const b=e.DB.raw.prepare('SELECT * FROM tutoring_bookings').get();let session={status:'complete',payment_status:'paid',amount_total:2500,currency:'usd',metadata:{tutoring_booking:'booking',word_wall_user_id:'student'}};
 const stripe={checkout:{sessions:{retrieve:async()=>session}}};await reconcileBooking(b,e,stripe);assert.equal(e.DB.raw.prepare('SELECT state FROM tutoring_slots').get().state,'held');
 session={...session,amount_total:5000,customer_details:{email:'contact@example.com'}};await reconcileBooking(b,e,stripe);assert.equal(e.DB.raw.prepare('SELECT state FROM tutoring_slots').get().state,'paid');assert.equal(e.DB.raw.prepare('SELECT contact_email FROM tutoring_bookings').get().contact_email,'contact@example.com');
 e.DB.raw.prepare("UPDATE tutoring_slots SET state='held'").run();e.DB.raw.prepare("UPDATE tutoring_bookings SET state='pending'").run();session={...session,status:'expired',payment_status:'unpaid'};await reconcileBooking(b,e,stripe);assert.equal(e.DB.raw.prepare('SELECT state FROM tutoring_slots').get().state,'open');
});
