(async()=>{
 const message=document.getElementById('message');
 const show=text=>{if(message)message.textContent=text;};
 let selectedRole=null,refreshRoleStatus=null;
 try{selectedRole=sessionStorage.getItem('word-wall-role');}catch{}
 if(!['teacher','parent','learner'].includes(selectedRole))selectedRole=null;
 if(new URLSearchParams(location.search).has('join'))selectedRole='learner';
 function applyRole(){
  document.getElementById('role-picker').hidden=!!selectedRole;
  document.getElementById('account-content').hidden=!selectedRole;
  document.getElementById('role-summary').hidden=!selectedRole;
  document.getElementById('role-summary').textContent=selectedRole?'You selected: '+selectedRole:'';
  document.getElementById('change-role').hidden=!selectedRole;
  document.getElementById('individual-details').hidden=!selectedRole || selectedRole==='teacher';
  document.getElementById('teacher-details').hidden=selectedRole!=='teacher';
  document.getElementById('individual').hidden=!selectedRole || selectedRole==='teacher';
  document.getElementById('teacher').hidden=selectedRole!=='teacher';
  document.getElementById('learner-help').hidden=selectedRole!=='learner';
 }
 for(const button of document.querySelectorAll('[data-role]'))button.onclick=()=>{selectedRole=button.dataset.role;try{sessionStorage.setItem('word-wall-role',selectedRole);}catch{}applyRole();if(refreshRoleStatus)refreshRoleStatus().catch(e=>show(e.message));};
 document.getElementById('change-role').onclick=()=>{selectedRole=null;try{sessionStorage.removeItem('word-wall-role');}catch{}location.reload();};
 applyRole();
 try {
  const config=await (await fetch('/api/config')).json();
  if(!config.configured){show('Membership setup is in progress. Registration will open once setup is complete.');return;}
  const domain=atob(config.publishableKey.split('_')[2]).replace(/\$$/,'');
  async function script(src,key){await new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.crossOrigin='anonymous';if(key)el.dataset.clerkPublishableKey=key;el.onload=resolve;el.onerror=reject;document.head.append(el);});}
  await script(`https://${domain}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await script(`https://${domain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,config.publishableKey);
  await window.Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});
  if(!document.getElementById('auth'))return;
  const clerk=window.Clerk;
  // Retain a class invitation through sign-in, without trusting it as an entitlement.
  const params=new URLSearchParams(location.search),joinCode=params.get('join');
  const returnTo=joinCode?`/account?join=${encodeURIComponent(joinCode)}`:'/account';
  if(!clerk.isSignedIn){clerk.mountSignIn(document.getElementById('auth'),{routing:'hash',forceRedirectUrl:returnTo,signUpForceRedirectUrl:returnTo});return;}
  clerk.mountUserButton(document.getElementById('user'),{afterSignOutUrl:'/account'});
  document.getElementById('auth').hidden=true;document.getElementById('member').hidden=false;
  document.getElementById('account-title').textContent='Your membership';
  async function api(path,data={}){const token=await clerk.session.getToken();const response=await fetch(path,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(data)});const body=await response.json();if(!response.ok)throw new Error(body.error || 'Please try again.');return body;}
  async function roster(){
   const data=await api('/api/roster');
   document.getElementById('seat-count').textContent=`${data.learners.length} of ${data.limit} learner seats used`;
   const list=document.getElementById('learners');list.replaceChildren();
   for(const learner of data.learners){const li=document.createElement('li');const name=document.createElement('span');name.textContent=learner.display_name;const button=document.createElement('button');button.textContent='Remove';button.setAttribute('aria-label',`Remove ${learner.display_name}`);button.onclick=async()=>{if(!confirm(`Remove ${learner.display_name} from your class?`))return;button.disabled=true;try{await api('/api/remove-learner',{learnerId:learner.learner_id});await roster();}catch(e){show(e.message);button.disabled=false;}};li.append(name,' ',button);list.append(li);}
  }
  async function status(){
   const data=await api('/api/status');
   document.getElementById('status').textContent=data.canceling?`Renewal canceled. Your access continues until ${new Date(data.accessUntil*1000).toLocaleString()}.`:data.active?'Your membership is active. You’re ready to learn.':'Choose a membership or join your teacher’s class.';
   document.getElementById('enter').hidden=!data.active;
   document.getElementById('learning-support').hidden=!data.active;
   if(data.teacher){selectedRole='teacher';applyRole();}
   document.getElementById('plans').hidden=!selectedRole || data.ownMembership || (data.active && !data.teacher);
   document.getElementById('billing').hidden=!data.hasCustomer;
   document.getElementById('cancel').hidden=!data.ownMembership || data.canceling;
   document.getElementById('roster').hidden=!data.teacher;
   document.getElementById('teacher').textContent=data.teacherOfferUsed?'Teacher — $49.99/month':'Teacher — start free';
   if(data.teacher)await roster();
   show('');
  }
  refreshRoleStatus=status;
  let checkout=null;
  async function closeCheckout(){if(checkout){checkout.destroy();checkout=null;}document.getElementById('checkout-panel').hidden=true;document.getElementById('checkout-container').replaceChildren();}
  document.getElementById('checkout-back').onclick=async()=>{await closeCheckout();await status().catch(e=>show(e.message));};
  for(const plan of ['individual','teacher'])document.getElementById(plan).onclick=async()=>{
   if(!selectedRole || (plan==='teacher')!==(selectedRole==='teacher'))return;
   if(!document.getElementById('consent').checked){show('Please agree to the payment schedule before continuing.');return;}
   const buttons=['individual','teacher'].map(id=>document.getElementById(id));buttons.forEach(b=>b.disabled=true);
   try{const data=await api('/api/checkout',{plan,accepted:true});if(!window.Stripe)await script('https://js.stripe.com/clover/stripe.js');await closeCheckout();document.getElementById('checkout-panel').hidden=false;document.getElementById('plans').hidden=true;const stripe=window.Stripe(config.stripePublishableKey);checkout=await stripe.createEmbeddedCheckoutPage({fetchClientSecret:async()=>data.clientSecret,onComplete:async()=>{await closeCheckout();await status().catch(e=>show(e.message));}});checkout.mount('#checkout-container');document.getElementById('checkout-panel').scrollIntoView({behavior:'smooth',block:'start'});buttons.forEach(b=>b.disabled=false);}catch(e){await closeCheckout();await status().catch(()=>{});show(e.message);buttons.forEach(b=>b.disabled=false);}
  };
  document.getElementById('billing').onclick=async()=>{try{const data=await api('/api/portal');location.assign(data.url);}catch(e){show(e.message);}};
  document.getElementById('cancel').onclick=async()=>{
   if(!confirm('Cancel your next charge? You and any enrolled learners keep access through your current free or paid period.'))return;
   const button=document.getElementById('cancel');button.disabled=true;
   try{await api('/api/cancel',{confirm:true});await status();}catch(e){show(e.message);}finally{button.disabled=false;}
  };
  document.getElementById('refresh').onclick=()=>status().catch(e=>show(e.message));
  document.getElementById('class-link').onclick=async()=>{try{const data=await api('/api/class-link');document.getElementById('join-link').value=data.url;document.getElementById('link-label').hidden=false;}catch(e){show(e.message);}};
  if(joinCode){document.getElementById('join').hidden=false;document.getElementById('learner-name').value=clerk.user.fullName || '';document.getElementById('join-button').onclick=async()=>{const button=document.getElementById('join-button');button.disabled=true;try{await api('/api/join',{code:joinCode,displayName:document.getElementById('learner-name').value});location.assign('/');}catch(e){show(e.message);button.disabled=false;}};}
  await status();
 }catch(e){show('We could not load your account. Please refresh and try again.');}
})();
