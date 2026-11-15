export const SEAT_LIMIT = 150;
export const TEACHER_OFFER = '14 days free, then $24.99 for the next 14 days, then $49.99/month. Renews automatically. Cancel before your next charge to avoid it.';
export function planForPrice(price,env) {
 if(price===env.STRIPE_INDIVIDUAL_PRICE_ID)return 'individual';
 if(price===env.STRIPE_TEACHER_PRICE_ID || price===env.STRIPE_TEACHER_INTRO_PRICE_ID)return 'teacher';
 return null;
}
export function subscriptionRecord(sub,env) {
 const items=sub.items.data.filter(item=>planForPrice(item.price.id,env));
 if(!items.length)return null;
 const plan=items.some(item=>planForPrice(item.price.id,env)==='teacher')?'teacher':'individual';
 const period=Math.max(...items.map(item=>item.current_period_end || sub.current_period_end || 0));
 const until=sub.status==='trialing'?sub.trial_end:period;
 return {id:sub.id,plan,status:sub.pause_collection?'paused':sub.status,until:Math.min(until,sub.cancel_at || Infinity),canceling:!!(sub.cancel_at_period_end || sub.cancel_at),schedule:typeof sub.schedule==='string'?sub.schedule:sub.schedule?.id || null};
}
export function teacherPhases(env,user) {
 const metadata={word_wall_user_id:user,plan:'teacher'};
 return [
  {items:[{price:env.STRIPE_TEACHER_INTRO_PRICE_ID,quantity:1}],duration:{interval:'week',interval_count:2},trial:true,proration_behavior:'none',metadata},
  {items:[{price:env.STRIPE_TEACHER_INTRO_PRICE_ID,quantity:1}],duration:{interval:'week',interval_count:2},billing_cycle_anchor:'phase_start',proration_behavior:'none',metadata},
  {items:[{price:env.STRIPE_TEACHER_PRICE_ID,quantity:1}],duration:{interval:'month',interval_count:1},billing_cycle_anchor:'phase_start',proration_behavior:'none',metadata}
 ];
}
export async function validatePrices(stripe,env) {
 const specs=[[env.STRIPE_INDIVIDUAL_PRICE_ID,1200,'month',1],[env.STRIPE_TEACHER_PRICE_ID,4999,'month',1],[env.STRIPE_TEACHER_INTRO_PRICE_ID,2499,'week',2]];
 for(const [id,amount,interval,count] of specs){
  const p=await stripe.prices.retrieve(id);
  if(!p.active || p.currency!=='usd' || p.unit_amount!==amount || p.recurring?.interval!==interval || p.recurring?.interval_count!==count || p.recurring?.usage_type!=='licensed')throw new Error('Configured Stripe price does not match the published offer');
 }
}
export async function completeTeacherSetup(session,user,env,stripe) {
 if(session.mode!=='setup' || session.status!=='complete' || session.metadata?.plan!=='teacher_offer' || session.metadata?.word_wall_user_id!==user)throw new Error('Invalid teacher setup');
 const offer=await env.DB.prepare('SELECT * FROM teacher_offers WHERE user_id=?').bind(user).first();
 if(!offer || offer.checkout_id!==session.id)return; // Obsolete or unrelated checkout cannot start billing.
 if(offer.used)return;
 const intent=await stripe.setupIntents.retrieve(typeof session.setup_intent==='string'?session.setup_intent:session.setup_intent.id);
 const customer=typeof session.customer==='string'?session.customer:session.customer?.id;
 const mapping=await env.DB.prepare('SELECT customer_id FROM customers WHERE user_id=?').bind(user).first();
 if(intent.status!=='succeeded' || intent.customer!==customer || mapping?.customer_id!==customer || !intent.payment_method)throw new Error('Payment method setup incomplete');
 await validatePrices(stripe,env);
 let schedule;
 for await(const item of stripe.subscriptionSchedules.list({customer,limit:100})){
  if(item.metadata?.checkout_id===session.id){schedule=item;break;}
 }
 if(!schedule){
  // Inherit the customer's default card so portal updates also apply to later phases.
  await stripe.customers.update(customer,{invoice_settings:{default_payment_method:typeof intent.payment_method==='string'?intent.payment_method:intent.payment_method.id}},{idempotencyKey:`teacher-card-${session.id}`});
  schedule=await stripe.subscriptionSchedules.create({customer,start_date:'now',end_behavior:'release',default_settings:{collection_method:'charge_automatically'},metadata:{checkout_id:session.id,word_wall_user_id:user,offer:'teacher_launch_v1'},phases:teacherPhases(env,user)},{idempotencyKey:`teacher-offer-${session.id}`});
 }
 await env.DB.prepare('UPDATE teacher_offers SET used=1,schedule_id=? WHERE user_id=? AND checkout_id=?').bind(schedule.id,user,session.id).run();
}
export async function cancelSubscription(sub,stripe) {
 if(sub.schedule){const id=typeof sub.schedule==='string'?sub.schedule:sub.schedule.id;await stripe.subscriptionSchedules.release(id,{preserve_cancel_date:true},{idempotencyKey:`cancel-release-${id}`});}
 return stripe.subscriptions.update(sub.id,{cancel_at_period_end:true},{idempotencyKey:`cancel-${sub.id}`});
}
