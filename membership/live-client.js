(async()=>{
 const el=id=>document.getElementById(id),show=text=>el('message').textContent=text;
 let currentVideo='',api,owner=false,checkout=null,payBooking;
 const dashboard=location.pathname==='/dashboard';
 async function dashboardStatus(){if(!dashboard)return;const d=await api('/api/dashboard');const now=Math.floor(Date.now()/1000);el('metric-members').textContent=d.counts.members;el('metric-learners').textContent=d.counts.learners;const box=el('dashboard-records');box.replaceChildren();const wrap=document.createElement('div');wrap.className='table-wrap';const table=document.createElement('table');const head=document.createElement('tr');for(const label of ['Account','Plan','Status','Access until']){const th=document.createElement('th');th.textContent=label;head.append(th);}table.append(head);for(const r of d.subscriptions){const row=document.createElement('tr');for(const value of [r.user_id,r.plan,r.status,r.access_until?new Date(r.access_until*1000).toLocaleDateString():'—']){const td=document.createElement('td');td.textContent=value;row.append(td);}table.append(row);}if(d.subscriptions.length){wrap.append(table);box.append(wrap);}else item(box,'No membership records yet. New subscriptions will appear here.');for(const r of d.learners)item(box,(r.display_name||r.learner_id)+' · Teacher: '+r.teacher_id);if(!d.learners.length)item(box,'No class enrollments yet.');}
 async function script(src,key){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.crossOrigin='anonymous';if(key)s.dataset.clerkPublishableKey=key;s.onload=resolve;s.onerror=reject;document.head.append(s);});}
 function renderSettings(s){
  el('live-status').textContent=s?.is_live?'🔴 Live now':'Next Math Help Live';
  el('next-time').textContent=s?.starts_at?new Date(s.starts_at*1000).toLocaleString():'The next session time will be posted here.';
  if(currentVideo!==(s?.video_id||'')){currentVideo=s?.video_id||'';el('video').replaceChildren();if(currentVideo){const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(currentVideo);f.title='Math Help Live';f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;el('video').append(f);}}
  el('chat-send').disabled=!s?.is_live;
 }
 function item(container,text){const p=document.createElement('div');p.className='item';p.textContent=text;container.append(p);return p;}
 async function publicStatus(){const r=await fetch('/api/live/public');if(r.ok)renderSettings((await r.json()).settings);else el('live-status').textContent='Live lessons are being set up.';}
 async function liveStatus(){const d=await api('/api/live/status');owner=d.owner;if(dashboard){el('metric-questions').textContent=d.questions.length;}renderSettings(d.settings);el('members').hidden=false;el('instructor').hidden=!owner;el('questions-title').textContent=owner?'Learner question queue':'Your submitted questions';el('questions').replaceChildren();for(const q of d.questions){const p=item(el('questions'),(q.kind==='chat'?'Live question':'Advance question')+' · '+new Date(q.created_at*1000).toLocaleString()+'\n'+q.body);if(owner){const b=document.createElement('button');b.textContent='Mark handled / remove';b.onclick=async()=>{try{await api('/api/live/remove',{id:q.id});await liveStatus();}catch(e){show(e.message);}};p.append(b);}}if(!d.questions.length)item(el('questions'),'No questions awaiting review.');if(owner&&!el('live-settings').contains(document.activeElement)){el('video-id').value=d.settings?.video_id||'';el('is-live').checked=!!d.settings?.is_live;const date=d.settings?.starts_at?new Date(d.settings.starts_at*1000):null;el('live-time').value=date?new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16):'';}}
 async function tutoringStatus(){
  const d=await api('/api/tutoring/status');
  if(dashboard)el('metric-requests').textContent=d.requests.filter(r=>r.state==='requested').length;

  el('tutoring-price').textContent='$'+(d.amount/100).toFixed(2)+' / one hour';
  el('requests-title').textContent=d.owner?'Tutoring request queue':'Your tutoring requests';el('requests').replaceChildren();
  for(const r of d.requests){const p=item(el('requests'),new Date(r.starts_at*1000).toLocaleString()+' · '+r.state+'\n'+r.topic+(r.alternatives?'\nOther options: '+r.alternatives:'')+(d.owner?'\nContact: '+r.contact_email:''));
   if(d.owner&&r.state==='requested'){
    const input=document.createElement('input');input.type='datetime-local';input.setAttribute('aria-label','Approved appointment time');const date=new Date(r.starts_at*1000);input.value=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
    const approve=document.createElement('button');approve.textContent='Approve this hour';approve.onclick=async()=>{approve.disabled=true;try{await api('/api/tutoring/approve',{id:r.id,startsAt:Math.floor(new Date(input.value).getTime()/1000)});await tutoringStatus();show('Approved. The learner can now pay for this hour.');}catch(e){show(e.message);approve.disabled=false;}};
    const decline=document.createElement('button');decline.textContent='Decline';decline.onclick=async()=>{if(!confirm('Decline this tutoring request?'))return;try{await api('/api/tutoring/decline',{id:r.id});await tutoringStatus();}catch(e){show(e.message);}};p.append(input,approve,decline);
   }
  }
  if(!d.requests.length)item(el('requests'),'No tutoring requests yet.');
  el('bookings-title').textContent=d.owner?'Approved tutoring appointments':'Your approved appointments';el('bookings').replaceChildren();
  for(const b of d.bookings){const label=b.state==='paid'?'Confirmed — payment received':['approved','pending'].includes(b.state)?'Approved — awaiting payment':b.state;const p=item(el('bookings'),new Date(b.starts_at*1000).toLocaleString()+' · '+label+' · $'+(b.amount/100).toFixed(2)+'\n'+b.topic+(d.owner?'\nContact: '+(b.contact_email||'Awaiting payment'):''));
   if(!d.owner&&['approved','pending'].includes(b.state)){const pay=document.createElement('button');pay.textContent='Accept this time and pay $'+(b.amount/100).toFixed(2);pay.onclick=()=>payBooking(b.id,pay);p.append(pay);}
   if(b.lesson_url){const link=document.createElement('a');link.href=b.lesson_url;link.textContent='Open private lesson';link.className='button';link.target='_blank';link.rel='noopener noreferrer';p.append(link);}
   if(d.owner&&b.state==='paid'){const button=document.createElement('button');button.textContent='Set private lesson link';button.onclick=async()=>{const url=prompt('HTTPS link for this private lesson',b.lesson_url||'');if(!url)return;try{await api('/api/tutoring/details',{id:b.id,url});await tutoringStatus();}catch(e){show(e.message);}};p.append(button);}
  }
  if(!d.bookings.length)item(el('bookings'),'No approved appointments yet.');
 }

 async function complimentaryStatus(){
  const d=await api('/api/complimentary/list');el('complimentary-list').replaceChildren();if(!d.grants.length)item(el('complimentary-list'),'No complimentary access grants yet.');
  for(const g of d.grants){const expired=g.expires_at!==null&&g.expires_at<=Math.floor(Date.now()/1000);const p=item(el('complimentary-list'),(g.label||g.user_id)+' · '+(g.revoked?'Revoked':expired?'Expired':g.expires_at?'Free until '+new Date(g.expires_at*1000).toLocaleString():'Ongoing free access')+'\n'+g.user_id);
   if(!g.revoked){const b=document.createElement('button');b.textContent='Revoke free access';b.onclick=async()=>{if(!confirm('Revoke complimentary access for this learner? Existing paid or class access will continue.'))return;b.disabled=true;try{await api('/api/complimentary/revoke',{userId:g.user_id});await complimentaryStatus();show('Complimentary access revoked.');}catch(e){show(e.message);b.disabled=false;}};p.append(b);}
  }
 }

 try{
  await publicStatus();
  const config=await(await fetch('/api/config')).json();
  if(!config.configured){show('Registration is being set up.');return;}
  const domain=atob(config.publishableKey.split('_')[2]).replace(/\$$/,'');
  await script(`https://${domain}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await script(`https://${domain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,config.publishableKey);
  await window.Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});
  const clerk=window.Clerk;
  if(!clerk.isSignedIn){show('Sign in with an active membership or teacher class account to submit questions and book tutoring.');clerk.mountSignIn(el('auth'),{routing:'hash',forceRedirectUrl:'/live',signUpForceRedirectUrl:'/live'});setInterval(()=>publicStatus().catch(()=>{}),30000);return;}
  api=async(path,data={})=>{const token=await clerk.session.getToken();const r=await fetch(path,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(data)});const b=await r.json();if(!r.ok)throw Error(b.error||'Please try again.');return b;};
  await liveStatus();
  if(dashboard){if(!owner){location.replace('/account');return;}clerk.mountUserButton(el('dashboard-user'));await dashboardStatus();}
  if(owner){
   el('complimentary-ongoing').onchange=()=>{el('complimentary-until').disabled=el('complimentary-ongoing').checked;el('complimentary-until').required=!el('complimentary-ongoing').checked;};
   el('complimentary-form').onsubmit=async e=>{e.preventDefault();el('complimentary-save').disabled=true;try{await api('/api/complimentary/grant',{userId:el('complimentary-user').value,label:el('complimentary-label').value,expiresAt:el('complimentary-ongoing').checked?null:Math.floor(new Date(el('complimentary-until').value).getTime()/1000)});await complimentaryStatus();show('Free individual access granted. The learner can refresh their account page.');}catch(error){show(error.message);}finally{el('complimentary-save').disabled=false;}};
   await complimentaryStatus().catch(e=>show(e.message));
  }
  await tutoringStatus();
  for(const kind of ['advance','chat'])el(kind+'-form').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;try{await api('/api/live/question',{kind,body:el(kind+'-body').value});el(kind+'-body').value='';await liveStatus();show('Question submitted. I’ll review it for the lesson.');}catch(error){show(error.message);}finally{b.disabled=false;if(kind==='chat')await publicStatus();}};
  el('live-settings').onsubmit=async e=>{e.preventDefault();try{await api('/api/live/settings',{videoId:el('video-id').value.trim(),isLive:el('is-live').checked,startsAt:el('live-time').value?Math.floor(new Date(el('live-time').value).getTime()/1000):null});await liveStatus();show('Live lesson updated.');}catch(error){show(error.message);}};
  async function close(){if(checkout){checkout.destroy();checkout=null;}el('tutoring-checkout').hidden=true;el('booking-form').hidden=false;el('checkout-container').replaceChildren();}
  el('checkout-back').onclick=async()=>{await close();await tutoringStatus().catch(e=>show(e.message));};
  el('tutoring-email').value=clerk.user.primaryEmailAddress?.emailAddress||'';
  el('booking-form').onsubmit=async e=>{e.preventDefault();el('book').disabled=true;try{await api('/api/tutoring/request',{startsAt:Math.floor(new Date(el('requested-time').value).getTime()/1000),alternatives:el('alternatives').value,email:el('tutoring-email').value,topic:el('tutoring-topic').value});el('tutoring-topic').value='';await tutoringStatus();show('Request sent. Check this page for approval before paying.');}catch(error){show(error.message);}finally{el('book').disabled=false;}};
  payBooking=async(id,button)=>{button.disabled=true;try{const d=await api('/api/tutoring/checkout',{bookingId:id});if(!window.Stripe)await script('https://js.stripe.com/clover/stripe.js');await close();el('tutoring-checkout').hidden=false;el('booking-form').hidden=true;checkout=await window.Stripe(config.stripePublishableKey).createEmbeddedCheckoutPage({fetchClientSecret:async()=>d.clientSecret,onComplete:async()=>{await close();await tutoringStatus();show('Payment checked. Look above for your confirmed appointment.');}});checkout.mount('#checkout-container');el('tutoring-checkout').scrollIntoView({behavior:'smooth'});}catch(error){await close();show(error.message);}finally{button.disabled=false;}};
  setInterval(()=>{liveStatus().catch(e=>show(e.message));if(!checkout)tutoringStatus().catch(e=>show(e.message));},15000);
 }catch(e){show(e.message||'We could not load the lesson. Please refresh.');}
})();

