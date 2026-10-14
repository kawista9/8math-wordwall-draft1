(()=>{
 if(document.getElementById('live-now-badge'))return;
 const badge=document.createElement('a');badge.id='live-now-badge';badge.href='/live';badge.hidden=true;
 badge.setAttribute('aria-label','Myelinated Melanin is live right now. Watch the tutorial.');
 const logo=document.createElement('img');logo.src='/live-indicator.gif';logo.alt='';logo.width=48;logo.height=48;
 const text=document.createElement('span');text.textContent='LIVE RIGHT NOW';const logoFrame=document.createElement('span');logoFrame.className='live-logo-frame';logoFrame.append(logo);badge.append(logoFrame,text);
 const style=document.createElement('style');style.textContent=`@keyframes live-badge-blink{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);box-shadow:0 0 16px #ff657b66}50%{opacity:.72;transform:translate(-50%,-50%) scale(1.08);box-shadow:0 0 32px #ff657bcc}}#live-now-badge{position:fixed;top:50px;left:50%;transform:translate(-50%,-50%);z-index:2147483000;display:inline-flex;align-items:center;justify-content:center;gap:12px;background:#27101a;border:2px solid #ff657b;color:#fff;padding:8px 14px;border-radius:14px;text-decoration:none;font:700 14px/1.3 system-ui;max-width:min(310px,calc(100vw - 24px));box-shadow:0 0 22px #ff657b66;animation:live-badge-blink 1.1s ease-in-out infinite}#live-now-badge[hidden]{display:none!important}#live-now-badge .live-logo-frame{width:56px;height:56px;overflow:hidden;position:relative;flex-shrink:0;border-radius:50%;background:#000}#live-now-badge img{max-width:none;width:180px;height:auto;position:absolute;left:50%;top:50%;transform:translate(-52%,-47%)}#live-now-badge:focus-visible{outline:3px solid #f7c76a;outline-offset:4px}@media(max-width:640px){#live-now-badge{top:70px}}@media(prefers-reduced-motion:reduce){#live-now-badge{animation:none}}`;
 document.head.append(style);
 const host=document.getElementById('learning-support') || document.querySelector('.header-actions') || document.querySelector('.dash-top') || document.querySelector('header') || document.body;
 host.append(badge);
 let expiry=null,busy=false,previewUntil=0;
 function hide(){badge.hidden=true;clearTimeout(expiry);}
 async function refresh(){
  if(busy || document.hidden || previewUntil>Date.now())return;busy=true;
  try{
   const response=await fetch('/api/live/public',{cache:'no-store',signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw Error();const data=await response.json();
   if(previewUntil>Date.now())return;
   const expiresAt=(Number(data.settings?.checked_at)+90)*1000;
   if(data.settings?.is_live===1 && expiresAt>Date.now()){
    badge.hidden=false;clearTimeout(expiry);expiry=setTimeout(hide,Math.max(0,expiresAt-Date.now()));
   }else hide();
  }catch{if(previewUntil<=Date.now())hide();}finally{busy=false;}
 }
 window.addEventListener('wordwall:preview-live',()=>{
  previewUntil=Date.now()+30000;clearTimeout(expiry);badge.hidden=false;
  text.textContent='PREVIEW · LIVE RIGHT NOW';badge.setAttribute('aria-label','Preview of the live indicator. Open the tutorial page.');
  badge.scrollIntoView({block:'center',behavior:'auto'});
  expiry=setTimeout(()=>{previewUntil=0;text.textContent='LIVE RIGHT NOW';badge.setAttribute('aria-label','Myelinated Melanin is live right now. Watch the tutorial.');hide();refresh();},30000);
 });
 if(new URLSearchParams(location.search).has('preview-live'))window.dispatchEvent(new Event('wordwall:preview-live'));
 refresh();setInterval(refresh,30000);
 document.addEventListener('visibilitychange',()=>{if(document.hidden && previewUntil<=Date.now())hide();else refresh();});
})();
