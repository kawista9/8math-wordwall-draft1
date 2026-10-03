(async()=>{
 const message=document.getElementById('message');
 const show=text=>{if(message)message.textContent=text;};
 try {
  const config=await (await fetch('/api/config')).json();
  if(!config.configured){show('Membership setup is in progress. Registration will open once setup is complete.');return;}
  const domain=atob(config.publishableKey.split('_')[2]).replace(/\$$/,'');
  async function script(src,key){await new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.crossOrigin='anonymous';if(key)el.dataset.clerkPublishableKey=key;el.onload=resolve;el.onerror=reject;document.head.append(el);});}
  await script(`https://${domain}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await script(`https://${domain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,config.publishableKey);
  await window.Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});
  if(!document.getElementById('auth'))return; // Keeps Clerk sessions refreshed while studying.
  const clerk=window.Clerk;
  if(!clerk.isSignedIn){clerk.mountSignIn(document.getElementById('auth'),{routing:'hash',forceRedirectUrl:'/account',signUpForceRedirectUrl:'/account'});return;}
  clerk.mountUserButton(document.getElementById('user'),{afterSignOutUrl:'/account'});
  document.getElementById('auth').hidden=true;document.getElementById('member').hidden=false;
  document.getElementById('account-title').textContent='Your membership';
  async function api(path){const token=await clerk.session.getToken();const response=await fetch(path,{method:'POST',headers:{Authorization:`Bearer ${token}`}});const body=await response.json();if(!response.ok)throw new Error(body.error || 'Please try again.');return body;}
  async function status(){const data=await api('/api/status');document.getElementById('status').textContent=data.active?'Your membership is active. You’re ready to learn.':'Subscribe to open the complete word wall.';document.getElementById('enter').hidden=!data.active;document.getElementById('subscribe').hidden=data.active;document.getElementById('billing').hidden=!data.hasCustomer;show('');}
  for(const [id,path] of [['subscribe','/api/checkout'],['billing','/api/portal']])document.getElementById(id).onclick=async()=>{const btn=document.getElementById(id);btn.disabled=true;try{const data=await api(path);location.assign(data.url);}catch(e){show(e.message);btn.disabled=false;}};
  document.getElementById('refresh').onclick=()=>status().catch(e=>show(e.message));
  await status();
 }catch(e){show('We could not load your account. Please refresh and try again.');}
})();
