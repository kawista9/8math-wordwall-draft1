import { verifyToken } from '@clerk/backend';
import Stripe from 'stripe';
import { hasAccess, sessionToken, sameOrigin, escapeHTML as esc } from './access.mjs';
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
async function allowed(user,env) {
 if (env.OWNER_USER_ID && user === env.OWNER_USER_ID) return true;
 const rows = await env.DB.prepare('SELECT status, access_until FROM subscriptions WHERE user_id = ?').bind(user).all();
 return hasAccess(rows.results);
}
async function syncCustomer(customer,user,env,stripe) {
 const list = await stripe.subscriptions.list({customer,status:'all',limit:100});
 if (list.has_more) throw new Error('Subscription reconciliation needs pagination');
 // Upstream read completes before the atomic replacement; failures never erase local state.
 const statements = [env.DB.prepare('DELETE FROM subscriptions WHERE user_id=?').bind(user)];
 for (const sub of list.data) {
  const items=sub.items.data.filter(item=>item.price.id===env.STRIPE_PRICE_ID);
  if (!items.length) continue;
  const until=Math.max(...items.map(item=>item.current_period_end || sub.current_period_end || 0));
  statements.push(env.DB.prepare('INSERT INTO subscriptions(subscription_id,user_id,status,access_until) VALUES (?,?,?,?)').bind(sub.id,user,sub.pause_collection?'paused':sub.status,until));
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
function page(env) {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Join • Myelinated Melanin Math</title><style>
*{box-sizing:border-box}body{margin:0;background:#070b15;color:#f3f6ff;font:17px/1.6 system-ui}main{max-width:1050px;margin:auto;padding:40px 24px}header{display:flex;justify-content:space-between;align-items:center}a{color:#66deff}h1{font-size:clamp(32px,5vw,54px);line-height:1.15}h2{font-size:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-top:42px}.panel{padding:28px;border:1px solid #2c415e;background:#101a2b;border-radius:20px}.price{font-size:32px;font-weight:700;color:#66deff}button,.button{background:#69dcff;color:#05101b;font:inherit;font-weight:700;padding:12px 20px;border:0;border-radius:10px;cursor:pointer;display:inline-block;text-decoration:none;margin:8px 8px 8px 0}button:disabled{opacity:.5;cursor:wait}[hidden]{display:none!important}#message{min-height:28px}small{color:#c4cee1}#auth{min-height:160px}@media(max-width:700px){.grid{grid-template-columns:1fr}main{padding:24px 16px}}</style></head><body><main><header><strong>Myelinated Melanin<br><small>8th Grade Math Digital Word Wall</small></strong><div id="user"></div></header><div class="grid"><section><h1>Find your standard.<br>Build your understanding.</h1><p>Visual anchor charts, video lessons, calculator support, and interactive labs—all together in one word wall.</p><p>Search by standard or the math you’re learning, then choose the support you need.</p><div class="panel"><h2>Individual learner membership</h2><p class="price">${esc(env.PLAN_LABEL)}</p><p>Access all included eighth grade standards.</p><small>Monthly subscription. Renews automatically. Cancel anytime from your account; access continues through the paid period.</small></div></section><section class="panel"><h2 id="account-title">Create your account or sign in</h2><div id="auth"></div><div id="member" hidden><p id="status">Checking your membership…</p><a class="button" id="enter" href="/" hidden>Open the word wall</a><button id="subscribe" hidden>Subscribe</button><button id="billing" hidden>Manage subscription</button><button id="refresh">Check payment status</button></div><p id="message" role="status" aria-live="polite"></p></section></div></main><script src="/membership-client.js" defer></script></body></html>`;
}
function configured(env) { return ['DB','SITE_URL','CLERK_PUBLISHABLE_KEY','CLERK_ISSUER','CLERK_JWT_KEY','STRIPE_SECRET_KEY','STRIPE_PRICE_ID','STRIPE_WEBHOOK_SECRET'].every(k=>!!env[k]); }
export default {
 async fetch(req,env) {
  const url=new URL(req.url), path=url.pathname;
  try {
   if (path==='/membership-client.js' && req.method==='GET') return env.ASSETS.fetch(req);
   if (path==='/api/config' && req.method==='GET') return json({publishableKey:env.CLERK_PUBLISHABLE_KEY || '',configured:configured(env)});
   if (path==='/account' && req.method==='GET') return new Response(page(env),{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}});
   if (!configured(env)) return json({error:'Membership setup is still in progress. Please check back soon.'},503);
   const stripe=stripeClient(env);
   if (path==='/api/stripe/webhook' && req.method==='POST') {
    let event;
    try { event=await stripe.webhooks.constructEventAsync(await req.text(),req.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET,undefined,Stripe.createSubtleCryptoProvider()); }
    catch { return json({error:'Invalid webhook signature'},400); }
    if (event.type.startsWith('customer.subscription.') || event.type==='checkout.session.completed' || event.type==='invoice.paid' || event.type==='invoice.payment_failed') {
     const obj=event.data.object, customer=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
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
    if(path==='/api/status') {
     const row=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
     if(row) await syncCustomer(row.customer_id,user,env,stripe);
     return json({active:await allowed(user,env),hasCustomer:!!row});
    }
    if(path==='/api/checkout') {
     const customer=await customerFor(user,env,stripe);
     await syncCustomer(customer,user,env,stripe);
     if(await allowed(user,env)) return json({error:'You already have access. Use Manage subscription.'},409);
     // Reuse an open Checkout session to avoid parallel purchases.
     const sessions=await stripe.checkout.sessions.list({customer,status:'open',limit:100});
     const existing=sessions.data.find(s=>s.mode==='subscription' && s.metadata?.word_wall_user_id===user && s.metadata?.price_id===env.STRIPE_PRICE_ID);
     if(existing) return json({url:existing.url});
     const checkout=await stripe.checkout.sessions.create({mode:'subscription',customer,line_items:[{price:env.STRIPE_PRICE_ID,quantity:1}],client_reference_id:user,metadata:{word_wall_user_id:user,price_id:env.STRIPE_PRICE_ID},subscription_data:{metadata:{word_wall_user_id:user}},success_url:`${env.SITE_URL}/account?payment=success`,cancel_url:`${env.SITE_URL}/account?payment=cancelled`},{idempotencyKey:`checkout-${user}-${Math.floor(Date.now()/300000)}`});
     return json({url:checkout.url});
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
    return new HTMLRewriter().on('head',{element(el){el.append('<script src="/membership-client.js" defer></script>',{html:true});}}).on('.header-actions',{element(el){el.prepend('<a href="/account" style="color:inherit;margin-right:12px">My account</a>',{html:true});}}).transform(response);
   }
   return response;
  } catch(error) {
   console.error('Membership request failed',error.name);
   return json({error:'We could not complete that request. Please try again shortly.'},503);
  }
 }
};
