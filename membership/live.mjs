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
  let request=null;try{request=await env.DB.prepare('SELECT id FROM tutoring_requests WHERE booking_id=?').bind(booking.id).first();}catch{}
  if(request){await env.DB.prepare("UPDATE tutoring_bookings SET state='approved',checkout_id=NULL WHERE id=? AND state='pending'").bind(booking.id).run();}
  else await env.DB.batch([
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
  try{await env.DB.prepare('SELECT id FROM tutoring_requests LIMIT 1').first();}catch{return response({error:'Tutoring requests are being set up. Please check back soon.'},503);}
  const held=await env.DB.prepare("SELECT b.* FROM tutoring_bookings b JOIN tutoring_slots s ON s.booking_id=b.id WHERE s.state='held'").all();
  for(const b of held.results)await reconcileBooking(b,env,stripe);
  const requests=owner?await env.DB.prepare('SELECT * FROM tutoring_requests ORDER BY created_at DESC LIMIT 100').all():await env.DB.prepare('SELECT * FROM tutoring_requests WHERE user_id=? ORDER BY created_at DESC LIMIT 50').bind(user).all();
  const bookings=owner?await env.DB.prepare('SELECT b.*,s.starts_at FROM tutoring_bookings b JOIN tutoring_slots s ON s.id=b.slot_id ORDER BY b.created_at DESC LIMIT 100').all():await env.DB.prepare('SELECT b.id,b.topic,b.amount,b.state,b.lesson_url,s.starts_at FROM tutoring_bookings b JOIN tutoring_slots s ON s.id=b.slot_id WHERE b.user_id=? ORDER BY b.created_at DESC LIMIT 50').bind(user).all();
  return response({requests:requests.results,bookings:bookings.results,amount:await tutoringAmount(user,env),owner});
 }
 if(path==='/api/tutoring/request'){
  const start=Number(body.startsAt),topic=questionBody(body.topic),email=typeof body.email==='string'?body.email.trim():'';
  if(!validSlot(start,now))return response({error:'Request a time at least 48 hours from now.'},400);
  if(!topic||!email||email.length>254||!/^\S+@\S+\.\S+$/.test(email))return response({error:'Add your math topic and a valid contact email.'},400);
  const result=await env.DB.prepare("INSERT INTO tutoring_requests(id,user_id,starts_at,alternatives,topic,contact_email,created_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM tutoring_requests WHERE user_id=? AND state='requested')<5").bind(crypto.randomUUID(),user,start,questionBody(body.alternatives),topic,email,now,user).run();
  if(!result.meta?.changes&&!result.changes)return response({error:'You already have five requests awaiting a response.'},429);
  return response({requested:true});
 }
 if(path==='/api/tutoring/approve'||path==='/api/tutoring/decline'){
  if(!owner)return response({error:'Only the instructor can approve tutoring requests.'},403);
  const request=await env.DB.prepare('SELECT * FROM tutoring_requests WHERE id=?').bind(String(body.id)).first();
  if(!request||request.state!=='requested')return response({error:'This request has already been handled.'},409);
  if(path.endsWith('decline')){await env.DB.prepare("UPDATE tutoring_requests SET state='declined' WHERE id=? AND state='requested'").bind(request.id).run();return response({saved:true});}
  const start=Number(body.startsAt);
  if(!validSlot(start,now))return response({error:'Approve a time at least 48 hours from now.'},400);
  const slotId=crypto.randomUUID(),bookingId=crypto.randomUUID(),amount=await tutoringAmount(request.user_id,env);
  // Reserve the hour and create the approval atomically. No charge is made here.
  const results=await env.DB.batch([
   env.DB.prepare("INSERT INTO tutoring_slots(id,starts_at,state,booking_id) SELECT ?,?,'held',? WHERE EXISTS(SELECT 1 FROM tutoring_requests WHERE id=? AND state='requested') AND NOT EXISTS(SELECT 1 FROM tutoring_slots WHERE state!='closed' AND starts_at>? AND starts_at<?)").bind(slotId,start,bookingId,request.id,start-3600,start+3600),
   env.DB.prepare("INSERT INTO tutoring_bookings(id,slot_id,user_id,amount,topic,contact_email,state,created_at) SELECT ?,?,?,?,?,?,'approved',? WHERE EXISTS(SELECT 1 FROM tutoring_slots WHERE id=? AND booking_id=?)").bind(bookingId,slotId,request.user_id,amount,request.topic,request.contact_email,now,slotId,bookingId),
   env.DB.prepare("UPDATE tutoring_requests SET state='approved',booking_id=? WHERE id=? AND state='requested' AND EXISTS(SELECT 1 FROM tutoring_bookings WHERE id=?)").bind(bookingId,request.id,bookingId)
  ]);
  const booking=await env.DB.prepare('SELECT id FROM tutoring_bookings WHERE id=?').bind(bookingId).first();
  if(!booking)return response({error:'That hour overlaps an appointment or this request was already handled.'},409);
  return response({approved:true});
 }
 if(path==='/api/tutoring/slot')return response({error:'Tutoring now uses requests followed by instructor approval.'},410);
 if(path==='/api/tutoring/details'){
  if(!owner)return response({error:'Only the instructor can set lesson details.'},403);
  let url;try{url=new URL(body.url);if(url.protocol!=='https:'||url.username||url.password)throw Error();}catch{return response({error:'Enter a valid HTTPS lesson link.'},400);}
  await env.DB.prepare("UPDATE tutoring_bookings SET lesson_url=? WHERE id=? AND state='paid'").bind(url.href,String(body.id)).run();
  return response({saved:true});
 }
 if(path==='/api/tutoring/checkout'){
  const booking=await env.DB.prepare('SELECT b.*,s.starts_at FROM tutoring_bookings b JOIN tutoring_slots s ON s.id=b.slot_id WHERE b.id=? AND b.user_id=?').bind(String(body.bookingId),user).first();
  if(!booking||!['approved','pending'].includes(booking.state))return response({error:'An approved tutoring request is required before payment.'},403);
  if(!validSlot(booking.starts_at,now))return response({error:'This appointment is now less than 48 hours away. Please contact the instructor to arrange another time.'},409);
  if(booking.checkout_id){
   await reconcileBooking(booking,env,stripe);
   const session=await stripe.checkout.sessions.retrieve(booking.checkout_id);
   if(session.status==='open')return response({clientSecret:session.client_secret});
   return response({error:'This payment session is no longer open. Refresh your requests.'},409);
  }
  const claim=await env.DB.prepare("UPDATE tutoring_bookings SET state='pending' WHERE id=? AND state='approved' AND checkout_id IS NULL").bind(booking.id).run();
  if(!claim.meta?.changes&&!claim.changes)return response({error:'Payment is already being prepared. Please try again shortly.'},409);
  const attempt=crypto.randomUUID();
  let created=false;
  try{
   const customer=await customerFor(user,env,stripe);
   const session=await stripe.checkout.sessions.create({customer,mode:'payment',ui_mode:'embedded_page',redirect_on_completion:'never',managed_payments:{enabled:false},expires_at:Math.floor(Date.now()/1000)+1860,allowed_payment_method_types:['card'],metadata:{tutoring_booking:booking.id,word_wall_user_id:user},line_items:[{price_data:{currency:'usd',unit_amount:booking.amount,product_data:{name:'Private math tutoring — one hour'}},quantity:1}],custom_text:{submit:{message:'One-time payment for your approved tutoring hour. Separate from membership. Appointment: '+new Date(booking.starts_at*1000).toISOString()}}},{idempotencyKey:'tutoring-'+booking.id+'-'+attempt});
   created=true;
   await env.DB.prepare('UPDATE tutoring_bookings SET checkout_id=? WHERE id=?').bind(session.id,booking.id).run();
   return response({clientSecret:session.client_secret});
  }catch(error){
   if(!created&&error.type==='StripeInvalidRequestError')await env.DB.prepare("UPDATE tutoring_bookings SET state='approved' WHERE id=? AND checkout_id IS NULL").bind(booking.id).run();
   throw error;
  }
 }
 return response({error:'Not found'},404);
}
