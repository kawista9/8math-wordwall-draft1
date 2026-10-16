(async()=>{
 const message=document.getElementById('message');
 const show=text=>{if(message)message.textContent=text;};
 let selectedRole=null,refreshRoleStatus=null;
 try{selectedRole=sessionStorage.getItem('word-wall-role');}catch{}
 if(!['teacher','learner','class','login'].includes(selectedRole))selectedRole=null;
 if(new URLSearchParams(location.search).get('mode')==='login')selectedRole='login';
 if(new URLSearchParams(location.search).has('join') || new URLSearchParams(location.search).get('mode')==='class')selectedRole='class';
 function applyRole(){
  document.getElementById('role-picker').hidden=!!selectedRole;
  document.getElementById('account-content').hidden=!selectedRole;
  document.getElementById('role-summary').hidden=!selectedRole;
  document.getElementById('role-summary').textContent=selectedRole==='login'?'Log in with your student email or existing account.':selectedRole?'You selected: '+({teacher:'Teacher',learner:'Individual Learner',class:'Join your teacher’s class'}[selectedRole]):'';
  document.getElementById('change-role').hidden=!selectedRole;
  document.getElementById('individual-details').hidden=selectedRole!=='learner';
  document.getElementById('teacher-details').hidden=selectedRole!=='teacher';
  document.getElementById('individual').hidden=selectedRole!=='learner';
  document.getElementById('teacher').hidden=selectedRole!=='teacher';
  document.getElementById('learner-help').hidden=!['class','login'].includes(selectedRole);
 }
 for(const button of document.querySelectorAll('[data-role]'))button.onclick=()=>{selectedRole=button.dataset.role;try{sessionStorage.setItem('word-wall-role',selectedRole);}catch{}applyRole();if(refreshRoleStatus)refreshRoleStatus().catch(e=>show(e.message));else location.assign(selectedRole==='class'?'/account?mode=class':'/account');};
 document.getElementById('change-role').onclick=()=>{selectedRole=null;try{sessionStorage.removeItem('word-wall-role');}catch{}location.assign('/account');};
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
  const returnTo=joinCode?`/account?join=${encodeURIComponent(joinCode)}`:selectedRole==='class'?'/account?mode=class':selectedRole==='login'?'/account?mode=login':'/account';
  if(selectedRole==='class')document.getElementById('account-title').textContent='Sign in to join your teacher’s class';
  if(selectedRole==='login')document.getElementById('account-title').textContent='Log in';
  if(!clerk.isSignedIn){clerk.mountSignIn(document.getElementById('auth'),{routing:'hash',withSignUp:true,forceRedirectUrl:returnTo,signUpForceRedirectUrl:returnTo});return;}
  if(!selectedRole){selectedRole='login';applyRole();}
  clerk.mountUserButton(document.getElementById('user'),{afterSignOutUrl:'/account'});
  document.getElementById('auth').hidden=true;document.getElementById('member').hidden=false;
  document.getElementById('account-title').textContent=selectedRole==='class'?'Join your teacher’s class':'Your membership';
  async function api(path,data={}){const token=await clerk.session.getToken();const response=await fetch(path,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(data)});const body=await response.json();if(!response.ok)throw new Error(body.error || 'Please try again.');return body;}
  let teacherCode='',pendingRoster=[];
  const formatCode=code=>code.match(/.{1,4}/g)?.join('-') || '';
  function renderRows(id,rows){const tbody=document.getElementById(id);tbody.replaceChildren();for(const row of rows){const tr=document.createElement('tr');const values=[row.firstName ?? row.first_name,row.lastName ?? row.last_name,row.email];if(id==='uploaded-rows')values.push(row.enrollment_status);for(const value of values){const td=document.createElement('td');td.textContent=value;tr.append(td);}tbody.append(tr);}}
  async function roster(){
   const data=await api('/api/roster');
   teacherCode=data.code;document.getElementById('teacher-class-code').value=formatCode(teacherCode);
   renderRows('uploaded-rows',data.uploaded);document.getElementById('uploaded-count').textContent=data.uploaded.length?`${data.uploaded.length} learners in your uploaded list.`:'No roster uploaded yet.';
   document.getElementById('roster-setup-message').hidden=data.autoEnrollmentConfigured;
   document.getElementById('seat-count').textContent=`${data.learners.length} of ${data.limit} learner seats used`;
   const list=document.getElementById('learners');list.replaceChildren();
   for(const learner of data.learners){const li=document.createElement('li');const name=document.createElement('span');name.textContent=learner.display_name;const button=document.createElement('button');button.textContent='Remove';button.setAttribute('aria-label',`Remove ${learner.display_name}`);button.onclick=async()=>{if(!confirm(`Remove ${learner.display_name} from your class? Automatic roster access will stop. You can give them your class code if they should rejoin.`))return;button.disabled=true;try{await api('/api/remove-learner',{learnerId:learner.learner_id});await roster();}catch(e){show(e.message);button.disabled=false;}};li.append(name,' ',button);list.append(li);}
  }
  async function status(){
   const data=await api('/api/status');
   if(data.owner && !joinCode){location.replace('/dashboard');return;}
   document.getElementById('status').textContent=data.canceling?`Renewal canceled. Your access continues until ${new Date(data.accessUntil*1000).toLocaleString()}.`:data.active?'Your membership is active. You’re ready to learn.':'Choose a membership or join your teacher’s class.';
   if(selectedRole==='class' && !data.active)document.getElementById('status').textContent='Enter your teacher’s class code below to activate your class access.';
   if(selectedRole==='login' && !data.active)document.getElementById('status').textContent='We haven’t activated class access for this account. Use the exact student email your teacher uploaded, or enter your teacher’s class code below. For an individual or teacher membership, choose Change selection.';
   if(!data.active && ['class','login'].includes(selectedRole)){
    if(['error','unavailable'].includes(data.enrollment?.state))document.getElementById('status').textContent='Automatic roster access could not be checked. Please try Refresh membership, or ask your teacher for a class code.';
    if(data.enrollment?.state==='unverified')document.getElementById('status').textContent='Verify your student email in your account profile, then refresh membership to activate your roster access.';
    if(data.enrollment?.full)document.getElementById('status').textContent='Your teacher added you to the roster, but the class has reached its 150 active learner limit. Ask your teacher to free a seat, then refresh membership.';
   }
   document.getElementById('enter').hidden=!data.active;
   document.getElementById('learning-support').hidden=!data.active;
   if(data.teacher){selectedRole='teacher';applyRole();}
   document.getElementById('join').hidden=data.teacher || data.active || (!['class','login'].includes(selectedRole) && !joinCode);
   if(!data.teacher && (['class','login'].includes(selectedRole) || joinCode))document.getElementById('member').insertBefore(document.getElementById('join'),document.getElementById('plans'));
   if(!data.teacher && data.active && !data.ownMembership)document.getElementById('status').textContent='Your class access is active. Open the word wall to begin.';
   if(!data.teacher && data.active && !data.ownMembership)document.getElementById('account-title').textContent='Your class access';
   document.getElementById('plans').hidden=!selectedRole || ['class','login'].includes(selectedRole) || data.ownMembership || (data.active && !data.teacher);
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
   if(!selectedRole || ['class','login'].includes(selectedRole) || (plan==='teacher')!==(selectedRole==='teacher'))return;
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
  async function copyText(text){
   try{await navigator.clipboard.writeText(text);document.getElementById('copy-status').textContent='Copied! Ready to paste.';}
   catch{document.getElementById('teacher-class-code').focus();document.getElementById('teacher-class-code').select();document.getElementById('copy-status').textContent='Copy was unavailable. Select the code above and press Ctrl+C (or Command+C).';}
  }
  document.getElementById('copy-code').onclick=()=>copyText(formatCode(teacherCode));
  document.getElementById('copy-instructions').onclick=()=>copyText(`Open our Digital Learning Wall class:\n1. Go to ${location.origin}/account?mode=login and log in with the student email I added to our roster. On your first visit, complete the account setup and email verification shown.\n2. Your class access activates automatically. Click Open the word wall. No payment or class code is needed for rostered learners.\n3. If I have not added you yet, choose Join your teacher’s class and enter ${formatCode(teacherCode)} and your name.`);
  document.getElementById('new-code').onclick=async()=>{
   if(!confirm('Replace your class code? The old code and invitation link will stop working for new joins. Enrolled learners keep access.'))return;
   const button=document.getElementById('new-code');button.disabled=true;
   try{const data=await api('/api/class-code',{rotate:true});teacherCode=data.code;document.getElementById('teacher-class-code').value=formatCode(teacherCode);document.getElementById('copy-status').textContent='New code ready to share.';}catch(e){show(e.message);}finally{button.disabled=false;}
  };
  document.getElementById('roster-file').onchange=async event=>{
   pendingRoster=[];document.getElementById('roster-preview').hidden=true;document.getElementById('upload-message').textContent='';
   const file=event.target.files[0];if(!file)return;
   try{if(file.size>100000)throw new Error('Choose a CSV smaller than 100 KB.');const {parseRosterCSV}=await import('/roster-csv.mjs');pendingRoster=parseRosterCSV(await file.text());renderRows('preview-rows',pendingRoster);document.getElementById('preview-count').textContent=`Review ${pendingRoster.length} learners before saving.`;document.getElementById('roster-preview').hidden=false;}catch(e){document.getElementById('upload-message').textContent=e.message;}
  };
  document.getElementById('save-roster').onclick=async()=>{
   const button=document.getElementById('save-roster');button.disabled=true;
   try{const data=await api('/api/roster-upload',{rows:pendingRoster});document.getElementById('upload-message').textContent=`Saved ${data.saved} learners for automatic enrollment. They can log in with their verified student email; no class code is needed. Up to 150 learners can activate class access.`;pendingRoster=[];document.getElementById('roster-preview').hidden=true;document.getElementById('roster-file').value='';await roster();}catch(e){document.getElementById('upload-message').textContent=e.message;}finally{button.disabled=false;}
  };
  document.getElementById('class-code-input').value=joinCode || '';
  document.getElementById('learner-name').value=clerk.user.fullName || '';
  document.getElementById('join-button').onclick=async()=>{
   const button=document.getElementById('join-button');button.disabled=true;
   try{await api('/api/join',{code:document.getElementById('class-code-input').value,displayName:document.getElementById('learner-name').value});location.assign('/');}catch(e){show(e.message);button.disabled=false;}
  };
  await status();
 }catch(e){show('We could not load your account. Please refresh and try again.');}
})();

