import { verifyToken } from '@clerk/backend';
import Stripe from 'stripe';
import { hasAccess, sessionToken, sameOrigin, escapeHTML as esc } from './access.mjs';
import {page} from './page.mjs';
import {livePage} from './live-page.mjs';
import {liveAPI,reconcileBooking} from './live.mjs';
import {subscriptionRecord,completeTeacherSetup,validatePrices,cancelSubscription,SEAT_LIMIT,TEACHER_OFFER} from './billing.mjs';
import {createJoinLink,joinClass} from './roster.mjs';
const json = (data, status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
function stripeClient(env) { return new Stripe(env.STRIPE_SECRET_KEY,{httpClient:Stripe.createFetchHttpClient(),maxNetworkRetries:2}); }
async function identity(req,env) {
 const token = sessionToken(req);
 if (!token) return null;
 try {
  const claims = await verifyToken(token,{jwtKey:env.CLERK_JWT_KEY,authorizedParties:[env.SITE_URL]});
  if (claims.iss !== env.CLERK_ISSUER || !claims.sub || !claims.sid) return null;
  return claims.sub;
 } catch { return null; }
}
async function ownAccess(user,env,plan) {
 const rows=await env.DB.prepare('SELECT status,access_until,plan FROM subscriptions WHERE user_id=?').bind(user).all();
 return hasAccess(rows.results.filter(row=>!plan || row.plan===plan));
}
async function teacherActive(user,env){return ownAccess(user,env,'teacher');}
async function allowed(user,env) {
 if(env.OWNER_USER_ID && user===env.OWNER_USER_ID)return true;
 if(await ownAccess(user,env))return true;
 const rows=await env.DB.prepare("SELECT s.status,s.access_until FROM learners l JOIN subscriptions s ON s.user_id=l.teacher_id WHERE l.learner_id=? AND s.plan='teacher'").bind(user).all();
 return hasAccess(rows.results);
}
async function syncCustomer(customer,user,env,stripe) {
 // A Checkout return URL grants nothing: retrieve the completed session server-side.
 const offer=await env.DB.prepare('SELECT * FROM teacher_offers WHERE user_id=?').bind(user).first();
 if(offer && !offer.used){
  const session=await stripe.checkout.sessions.retrieve(offer.checkout_id);
  if(session.status==='complete')await completeTeacherSetup(session,user,env,stripe);
 }
 const list=await stripe.subscriptions.list({customer,status:'all',limit:100});
 if(list.has_more)throw new Error('Subscription reconciliation needs pagination');
 const statements=[env.DB.prepare('DELETE FROM subscriptions WHERE user_id=?').bind(user)];
 for(const sub of list.data){
  const row=subscriptionRecord(sub,env);
  if(row)statements.push(env.DB.prepare('INSERT INTO subscriptions(subscription_id,user_id,status,access_until,plan,canceling) VALUES (?,?,?,?,?,?)').bind(row.id,user,row.status,row.until,row.plan,Number(row.canceling)));
 }
 await env.DB.batch(statements);
}
async function customerFor(user,env,stripe) {
 let row=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
 if (row) return row.customer_id;
 const customer=await stripe.customers.create({metadata:{word_wall_user_id:user}},{idempotencyKey:`word-wall-customer-${user}`});
 await env.DB.prepare('INSERT OR IGNORE INTO customers(user_id,customer_id) VALUES (?,?)').bind(user,customer.id).run();
 row=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
 return row.customer_id;
}
function configured(env) { return ['DB','SITE_URL','CLERK_PUBLISHABLE_KEY','CLERK_ISSUER','CLERK_JWT_KEY','STRIPE_SECRET_KEY','STRIPE_PUBLISHABLE_KEY','STRIPE_INDIVIDUAL_PRICE_ID','STRIPE_TEACHER_PRICE_ID','STRIPE_TEACHER_INTRO_PRICE_ID','STRIPE_WEBHOOK_SECRET'].every(k=>!!env[k]); }
export default {
 async fetch(req,env) {
  const url=new URL(req.url), path=url.pathname;
  try {
   if (['/membership-client.js','/live-client.js'].includes(path) && req.method==='GET') return env.ASSETS.fetch(req);
   if (path==='/api/config' && req.method==='GET') return json({publishableKey:env.CLERK_PUBLISHABLE_KEY || '',stripePublishableKey:env.STRIPE_PUBLISHABLE_KEY || '',configured:configured(env)});
   if (path==='/account' && req.method==='GET') return new Response(page(env),{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
   if(path==='/live' && req.method==='GET')return new Response(livePage(),{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
   if(path==='/api/live/public' && req.method==='GET'){let settings=null;try{settings=await env.DB.prepare('SELECT video_id,is_live,starts_at FROM live_settings WHERE id=1').first();}catch{}return json({settings});}
   if (!configured(env)) return json({error:'Membership setup is still in progress. Please check back soon.'},503);
   const stripe=stripeClient(env);
   if (path==='/api/stripe/webhook' && req.method==='POST') {
    let event;
    try { event=await stripe.webhooks.constructEventAsync(await req.text(),req.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET,undefined,Stripe.createSubtleCryptoProvider()); }
    catch { return json({error:'Invalid webhook signature'},400); }
    if (event.type.startsWith('customer.subscription.') || event.type==='checkout.session.completed' || event.type==='invoice.paid' || event.type==='invoice.payment_failed') {
     const obj=event.data.object;
     if(obj.metadata?.tutoring_booking){const booking=await env.DB.prepare('SELECT * FROM tutoring_bookings WHERE id=?').bind(obj.metadata.tutoring_booking).first();await reconcileBooking(booking,env,stripe);return json({received:true});}
     const customer=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
     const row=customer && await env.DB.prepare('SELECT user_id FROM customers WHERE customer_id=?').bind(customer).first();
     if (row) await syncCustomer(customer,row.user_id,env,stripe);
    }
    return json({received:true});
   }
   const user=await identity(req,env);
   if (!user) {
    if(path.startsWith('/api/')) return json({error:'Please sign in.'},401);
    if(req.headers.get('sec-fetch-dest')==='document' || path==='/' || path==='/index.html') return Response.redirect(`${env.SITE_URL}/account`,302);
    return json({error:'Sign in required'},401);
   }
   if(path.startsWith('/api/')) {
    if(req.method!=='POST') return json({error:'Method not allowed'},405);
    if(!sameOrigin(req,env.SITE_URL)) return json({error:'Invalid request origin'},403);
    if(path.startsWith('/api/live/')||path.startsWith('/api/tutoring/'))return await liveAPI(path,await req.json(),user,env,stripe,allowed,customerFor);
    if(path==='/api/status') {
     const customer=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
     if(customer)await syncCustomer(customer.customer_id,user,env,stripe);
     const rows=await env.DB.prepare('SELECT status,access_until,plan,canceling FROM subscriptions WHERE user_id=?').bind(user).all();
     const activeRows=rows.results.filter(row=>hasAccess([row]));
     const offer=await env.DB.prepare('SELECT used FROM teacher_offers WHERE user_id=?').bind(user).first();
     return json({active:await allowed(user,env),hasCustomer:!!customer,teacher:activeRows.some(row=>row.plan==='teacher'),ownMembership:activeRows.length>0,canceling:activeRows.some(row=>row.canceling),accessUntil:activeRows.length?Math.max(...activeRows.map(r=>r.access_until)):null,teacherOfferUsed:!!offer?.used});
    }
    if(path==='/api/checkout') {
     const body=await req.json();
     if(!['individual','teacher'].includes(body.plan) || body.accepted!==true)return json({error:'Choose a membership and agree to its payment schedule.'},400);
     const lock=crypto.randomUUID();
     const now=Math.floor(Date.now()/1000);
     const acquired=await env.DB.prepare('INSERT INTO checkout_locks(user_id,token,expires_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET token=excluded.token,expires_at=excluded.expires_at WHERE checkout_locks.expires_at < ?').bind(user,lock,now+120,now).run();
     if(!acquired.meta?.changes && !acquired.changes)return json({error:'A checkout is already being prepared. Please try again shortly.'},409);
     try {
     await validatePrices(stripe,env);
     const customer=await customerFor(user,env,stripe);
     await syncCustomer(customer,user,env,stripe);
     const subscriptions=await stripe.subscriptions.list({customer,status:'all',limit:100});
     if(subscriptions.has_more || subscriptions.data.some(sub=>subscriptionRecord(sub,env) && !['canceled','incomplete_expired'].includes(sub.status)))return json({error:'You already have a subscription. Manage or cancel it before starting another.'},409);
     const offer=await env.DB.prepare('SELECT * FROM teacher_offers WHERE user_id=?').bind(user).first();
     const promo=body.plan==='teacher' && !offer?.used;
     const variant=promo?'teacher_offer':body.plan;
     const sessions=await stripe.checkout.sessions.list({customer,status:'open',limit:100});
     const existing=sessions.data.find(s=>s.metadata?.word_wall_user_id===user && s.metadata?.plan===variant);
     if(existing?.ui_mode==='embedded_page'){const session=await stripe.checkout.sessions.retrieve(existing.id);return json({clientSecret:session.client_secret});}
     // Expire old open sessions before switching plans so a learner cannot buy both.
     for(const session of sessions.data)if(session.metadata?.word_wall_user_id===user)await stripe.checkout.sessions.expire(session.id);
     const common={customer,client_reference_id:user,metadata:{word_wall_user_id:user,plan:variant},ui_mode:'embedded_page',redirect_on_completion:'never',managed_payments:{enabled:false}};
     const params=promo?{...common,mode:'setup',currency:'usd',setup_intent_data:{metadata:{word_wall_user_id:user,offer:'teacher_launch_v1'}},custom_text:{submit:{message:`Teacher membership: ${TEACHER_OFFER} One teacher and up to 150 learners. By saving your card you authorize these automatic charges.`}}}:{...common,mode:'subscription',line_items:[{price:body.plan==='teacher'?env.STRIPE_TEACHER_PRICE_ID:env.STRIPE_INDIVIDUAL_PRICE_ID,quantity:1}],subscription_data:{metadata:{word_wall_user_id:user,plan:body.plan}}};
     const checkout=await stripe.checkout.sessions.create(params,{idempotencyKey:`checkout-${user}-${lock}`});
     if(promo)await env.DB.prepare('INSERT INTO teacher_offers(user_id,checkout_id) VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET checkout_id=excluded.checkout_id WHERE teacher_offers.used=0').bind(user,checkout.id).run();
     return json({clientSecret:checkout.client_secret});
     } finally {await env.DB.prepare('DELETE FROM checkout_locks WHERE user_id=? AND token=?').bind(user,lock).run();}
    }
    if(path==='/api/cancel') {
     const body=await req.json();
     if(body.confirm!==true)return json({error:'Confirm cancellation first.'},400);
     const mapping=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
     if(!mapping)return json({error:'No subscription found.'},404);
     await syncCustomer(mapping.customer_id,user,env,stripe);
     const list=await stripe.subscriptions.list({customer:mapping.customer_id,status:'all',limit:100});
     for(const sub of list.data)if(subscriptionRecord(sub,env) && ['active','trialing','past_due','unpaid'].includes(sub.status))await cancelSubscription(sub,stripe);
     await syncCustomer(mapping.customer_id,user,env,stripe);
     return json({canceling:true});
    }
    if(path==='/api/join') {
     const result=await joinClass(user,await req.json(),env,teacherActive);
     return json(result,result.status || 200);
    }
    if(['/api/roster','/api/class-link','/api/remove-learner'].includes(path)) {
     if(!await teacherActive(user,env))return json({error:'An active teacher membership is required.'},403);
     if(path==='/api/class-link')return json({url:await createJoinLink(user,env)});
     if(path==='/api/remove-learner'){
      const body=await req.json();
      if(typeof body.learnerId!=='string')return json({error:'Choose a learner.'},400);
      await env.DB.prepare('DELETE FROM learners WHERE teacher_id=? AND learner_id=?').bind(user,body.learnerId).run();
      return json({removed:true});
     }
     const rows=await env.DB.prepare('SELECT learner_id,display_name FROM learners WHERE teacher_id=? ORDER BY joined_at').bind(user).all();
     return json({learners:rows.results,limit:SEAT_LIMIT});
    }
    if(path==='/api/portal') {
     const row=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
     if(!row) return json({error:'No subscription account yet.'},404);
     const portal=await stripe.billingPortal.sessions.create({customer:row.customer_id,return_url:`${env.SITE_URL}/account`});
     return json({url:portal.url});
    }
    return json({error:'Not found'},404);
   }
   if(!['GET','HEAD'].includes(req.method)) return json({error:'Method not allowed'},405);
   if(!await allowed(user,env)) {
    if(req.headers.get('sec-fetch-dest')==='document' || path==='/' || path==='/index.html') return Response.redirect(`${env.SITE_URL}/account`,302);
    return json({error:'An active membership is required.'},403);
   }
   const asset=await env.ASSETS.fetch(req);
   const response=new Response(asset.body,asset);
   response.headers.set('Cache-Control','private, no-store');
   response.headers.set('Vary','Cookie, Authorization');
   response.headers.set('X-Content-Type-Options','nosniff');
   if(response.headers.get('Content-Type')?.includes('text/html')) {
    return new HTMLRewriter().on('head',{element(el){el.append('<script src="/membership-client.js" defer></script>',{html:true});}}).on('.header-actions',{element(el){el.prepend('<a href="/live" style="color:inherit;margin-right:12px">Math Help Live</a><a href="/account" style="color:inherit;margin-right:12px">My account</a>',{html:true});}}).transform(response);
   }
   return response;
  } catch(error) {
   console.error('Membership request failed',error.name);
   if(error instanceof SyntaxError)return json({error:'Invalid request body.'},400);
   return json({error:'We could not complete that request. Please try again shortly.'},503);
  }
 }
};
