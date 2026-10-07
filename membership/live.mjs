import {hasAccess} from './access.mjs';
export const LEAD_SECONDS=48*60*60;
export function validSlot(start,now){return Number.isInteger(start)&&start>=now+LEAD_SECONDS;}
export function questionBody(value){return typeof value==='string'?value.trim().slice(0,2000):'';}
export function videoId(value){return typeof value==='string'&&/^[\w-]{11}$/.test(value)?value:'';}
export async function tutoringAmount(user,env){
 const rows=await env.DB.prepare('SELECT status,access_until,plan FROM subscriptions WHERE user_id=?').bind(user).all();
 // Prices derive from active entitlements, never the role picker.
 if(rows.results.some(r=>r.plan==='individual'&&hasAccess([r])))return 2500;
 return 5000;
}
export async function reconcileBooking(booking,env,stripe){
 if(!booking?.checkout_id||booking.state==='paid')return;
 const session=await stripe.checkout.sessions.retrieve(booking.checkout_id);
 if(session.metadata?.tutoring_booking!==booking.id||session.metadata?.word_wall_user_id!==booking.user_id)return;
 if(session.payment_status==='paid'&&session.amount_total===booking.amount&&session.currency==='usd'){
  await env.DB.batch([
   env.DB.prepare("UPDATE tutoring_bookings SET state='paid',contact_email=? WHERE id=?").bind(session.customer_details?.email||null,booking.id),
   env.DB.prepare("UPDATE tutoring_slots SET state='paid' WHERE id=? AND booking_id=?").bind(booking.slot_id,booking.id)
  ]);
 }else if(session.status==='expired'){
  await env.DB.batch([
   env.DB.prepare("UPDATE tutoring_bookings SET state='expired' WHERE id=? AND state='pending'").bind(booking.id),
   env.DB.prepare("UPDATE tutoring_slots SET state='open',booking_id=NULL WHERE id=? AND booking_id=? AND state='held'").bind(booking.slot_id,booking.id)
  ]);
 }
}
export async function liveAPI(path,body,user,env,stripe,allowed,customerFor){
 const owner=!!env.OWNER_USER_ID&&user===env.OWNER_USER_ID;
 const now=Math.floor(Date.now()/1000);
 const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 try{await env.DB.prepare('SELECT id FROM live_settings WHERE id=1').first();}catch{return response({error:'Live lessons and tutoring are being set up. Please check back soon.'},503);}
 if(!owner&&!await allowed(user,env))return response({error:'An active membership or teacher class enrollment is required.'},403);
 if(path==='/api/live/status'){
  const settings=await env.DB.prepare('SELECT * FROM live_settings WHERE id=1').first();
  const questions=owner?await env.DB.prepare('SELECT id,kind,body,created_at FROM live_questions WHERE removed=0 ORDER BY created_at DESC LIMIT 100').all():await env.DB.prepare('SELECT id,kind,body,created_at FROM live_questions WHERE user_id=? AND removed=0 ORDER BY created_at DESC LIMIT 50').bind(user).all();
  return response({settings,questions:questions.results,owner});
 }
 if(path==='/api/live/question'){
  const text=questionBody(body.body);
  if(!text||!['advance','chat'].includes(body.kind))return response({error:'Enter a math question (up to 2,000 characters).'},400);
  const settings=await env.DB.prepare('SELECT is_live FROM live_settings WHERE id=1').first();
  if(body.kind==='chat'&&!settings?.is_live)return response({error:'Live questions open when the lesson starts.'},409);
  const count=await env.DB.prepare('SELECT COUNT(*) AS n FROM live_questions WHERE user_id=? AND created_at>?').bind(user,now-3600).first();
  if(count.n>=20)return response({error:'You have submitted 20 questions this hour. Please wait before sending another.'},429);
  await env.DB.prepare('INSERT INTO live_questions(id,user_id,kind,body,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),user,body.kind,text,now).run();
  return response({saved:true});
 }
 if(path==='/api/live/settings'||path==='/api/live/remove'){
  if(!owner)return response({error:'Only the instructor can manage lessons.'},403);
  if(path.endsWith('remove')){await env.DB.prepare('UPDATE live_questions SET removed=1 WHERE id=?').bind(String(body.id)).run();return response({saved:true});}
  const id=videoId(body.videoId);
  if(body.videoId&&!id)return response({error:'Enter the 11-character YouTube video ID.'},400);
  if(body.isLive&&!id)return response({error:'Add the YouTube video ID before going live.'},400);
  const start=body.startsAt===null?null:Number(body.startsAt);
  if(start!==null&&!Number.isInteger(start))return response({error:'Choose a valid session time.'},400);
  await env.DB.prepare('UPDATE live_settings SET video_id=?,is_live=?,starts_at=? WHERE id=1').bind(id,body.isLive?1:0,start).run();
  return response({saved:true});
 }
 if(path==='/api/tutoring/status'){
  const held=await env.DB.prepare("SELECT b.* FROM tutoring_bookings b JOIN tutoring_slots s ON s.booking_id=b.id WHERE s.state='held'").all();
  for(const b of held.results)await reconcileBooking(b,env,stripe);
  const slots=await env.DB.prepare("SELECT id,starts_at FROM tutoring_slots WHERE state='open' AND starts_at>=? ORDER BY starts_at LIMIT 100").bind(now+LEAD_SECONDS).all();
  const bookings=owner?await env.DB.prepare('SELECT b.*,s.starts_at FROM tutoring_bookings b JOIN tutoring_slots s ON s.id=b.slot_id ORDER BY b.created_at DESC LIMIT 100').all():await env.DB.prepare('SELECT b.id,b.topic,b.amount,b.state,b.lesson_url,s.starts_at FROM tutoring_bookings b JOIN tutoring_slots s ON s.id=b.slot_id WHERE b.user_id=? ORDER BY b.created_at DESC LIMIT 50').bind(user).all();
  return response({slots:slots.results,bookings:bookings.results,amount:await tutoringAmount(user,env),owner});
 }
 if(path==='/api/tutoring/slot'){
  if(!owner)return response({error:'Only the instructor can publish appointments.'},403);
  const start=Number(body.startsAt);
  if(!validSlot(start,now))return response({error:'Appointments must start at least 48 hours from now.'},400);
  const clash=await env.DB.prepare("SELECT id FROM tutoring_slots WHERE state!='closed' AND starts_at>? AND starts_at<?").bind(start-3600,start+3600).first();
  if(clash)return response({error:'That hour overlaps an existing appointment.'},409);
  const result=await env.DB.prepare("INSERT INTO tutoring_slots(id,starts_at) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM tutoring_slots WHERE state!='closed' AND starts_at>? AND starts_at<?)").bind(crypto.randomUUID(),start,start-3600,start+3600).run();
  if(!result.meta?.changes&&!result.changes)return response({error:'That hour overlaps an existing appointment.'},409);
  return response({saved:true});
 }
 if(path==='/api/tutoring/details'){
  if(!owner)return response({error:'Only the instructor can set lesson details.'},403);
  let url;try{url=new URL(body.url);if(url.protocol!=='https:'||url.username||url.password)throw Error();}catch{return response({error:'Enter a valid HTTPS lesson link.'},400);}
  await env.DB.prepare("UPDATE tutoring_bookings SET lesson_url=? WHERE id=? AND state='paid'").bind(url.href,String(body.id)).run();
  return response({saved:true});
 }
 if(path==='/api/tutoring/checkout'){
  const topic=questionBody(body.topic);
  if(!topic)return response({error:'Tell me what you want to work on.'},400);
  const slot=await env.DB.prepare('SELECT * FROM tutoring_slots WHERE id=?').bind(String(body.slotId)).first();
  if(!slot||!validSlot(slot.starts_at,now))return response({error:'Choose an appointment at least 48 hours ahead.'},409);
  if(slot.state==='held'){
   const existing=await env.DB.prepare('SELECT * FROM tutoring_bookings WHERE id=?').bind(slot.booking_id).first();
   await reconcileBooking(existing,env,stripe);
   if(existing?.user_id===user&&existing.checkout_id){const s=await stripe.checkout.sessions.retrieve(existing.checkout_id);if(s.status==='open')return response({clientSecret:s.client_secret});}
  }
  const id=crypto.randomUUID(),amount=await tutoringAmount(user,env);
  const claim=await env.DB.prepare("UPDATE tutoring_slots SET state='held',booking_id=? WHERE id=? AND state='open'").bind(id,slot.id).run();
  if(!claim.meta?.changes&&!claim.changes)return response({error:'That appointment is being booked. Choose another hour.'},409);
  let created=false;
  try{
   await env.DB.prepare('INSERT INTO tutoring_bookings(id,slot_id,user_id,amount,topic,created_at) VALUES(?,?,?,?,?,?)').bind(id,slot.id,user,amount,topic,now).run();
   const customer=await customerFor(user,env,stripe);
   const session=await stripe.checkout.sessions.create({customer,mode:'payment',ui_mode:'embedded_page',redirect_on_completion:'never',managed_payments:{enabled:false},expires_at:Math.floor(Date.now()/1000)+1860,allowed_payment_method_types:['card'],metadata:{tutoring_booking:id,word_wall_user_id:user},line_items:[{price_data:{currency:'usd',unit_amount:amount,product_data:{name:'Private math tutoring — one hour'}},quantity:1}],custom_text:{submit:{message:'One-time payment for one hour of private tutoring. Separate from your word wall membership. Appointment: '+new Date(slot.starts_at*1000).toISOString()}}},{idempotencyKey:'tutoring-'+id});
   created=true;
   await env.DB.prepare('UPDATE tutoring_bookings SET checkout_id=? WHERE id=?').bind(session.id,id).run();
   return response({clientSecret:session.client_secret});
  }catch(error){
   // Keep the hold if Stripe created a session: never resell an hour with a payable session.
   if(!created)await env.DB.batch([env.DB.prepare("UPDATE tutoring_slots SET state='open',booking_id=NULL WHERE id=? AND booking_id=?").bind(slot.id,id),env.DB.prepare("UPDATE tutoring_bookings SET state='failed' WHERE id=?").bind(id)]);
   throw error;
  }
 }
 return response({error:'Not found'},404);
}
