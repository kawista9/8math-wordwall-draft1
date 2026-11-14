// Match Lab: three free, replayable matching modes.
(() => {
 const root=document.getElementById('match-lab-game');if(!root||root.dataset.ready)return;root.dataset.ready='1';
 const $=id=>root.querySelector('#'+id);
 const board=$('ml-board'),types=$('ml-type');
 const objects=['🍎','🚀','🐢','🎸','🌻','🎈','🐬','🦋','🍓','🧩','🌙','🚲','⭐','🍉','🪁','🐝','🎨','🌈','🏀','🦉','🍋','🪐','🐙','🎲'];
 const symbolPairs=[['+','Addition'],['−','Subtraction'],['×','Multiplication'],['÷','Division'],['√','Square root'],['²','Squared'],['=','Equal to'],['≠','Not equal to'],['>','Greater than'],['<','Less than'],['≥','Greater than or equal to'],['≤','Less than or equal to'],['π','Pi'],['%','Percent'],['∞','Infinity'],['≈','Approximately equal']];
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 let cards=[],open=[],matched=new Set(),moves=0,score=0,seconds=0,start=0,timer=null,busy=false,token=0;
 function expressionPairs(){
  const out=[],seen=new Set();
  const generators=[
   ()=>{let a=3+Math.floor(Math.random()*17),b=2+Math.floor(Math.random()*12);return [a+b,a+' + '+b]},
   ()=>{let b=2+Math.floor(Math.random()*13),n=b+2+Math.floor(Math.random()*18);return [n-b,n+' − '+b]},
   ()=>{let a=2+Math.floor(Math.random()*10),b=2+Math.floor(Math.random()*10);return [a*b,a+' × '+b]},
   ()=>{let b=2+Math.floor(Math.random()*9),n=2+Math.floor(Math.random()*11);return [n,(n*b)+' ÷ '+b]},
   ()=>{let n=2+Math.floor(Math.random()*11);return [n*n,n+'²']},
   ()=>{let n=2+Math.floor(Math.random()*13);return [n,'√'+(n*n)]}
  ];
  for(let i=0;i<6;i++){let result;let tries=0;do{result=generators[i]();tries++}while(seen.has(result[0])&&tries<200);if(seen.has(result[0])){i--;continue}seen.add(result[0]);out.push([String(result[0]),result[1]])}
  return out;
 }
 function pairSet(){
  if(types.value==='objects')return shuffle(objects.slice()).slice(0,6).map(x=>[x,x]);
  if(types.value==='symbols')return shuffle(symbolPairs.slice()).slice(0,6);
  return expressionPairs();
 }
 function update(){ $('ml-moves').textContent=moves;$('ml-score').textContent=score;$('ml-matched').textContent=matched.size+'/6';$('ml-time').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}
 function status(t){$('ml-message').textContent=t}
 function show(){
  board.replaceChildren();
  for(let i=0;i<cards.length;i++){
   const c=cards[i],visible=open.includes(i)||matched.has(c.id);
   const b=document.createElement('button');b.type='button';b.className='ml-card'+(visible?' ml-open':'')+(matched.has(c.id)?' ml-found':'');
   b.textContent=visible?c.label:'?';b.setAttribute('aria-label',visible?c.label:'Face-down card '+(i+1));b.setAttribute('aria-pressed',String(visible));
   b.disabled=matched.has(c.id)||busy;b.addEventListener('click',()=>flip(i));board.appendChild(b);
  }
 }
 function newGame(){
  token++;clearInterval(timer);seconds=0;start=Date.now();moves=0;score=0;open=[];matched=new Set();busy=false;
  const pairs=pairSet();cards=shuffle(pairs.flatMap(([left,right],id)=>[{id,label:left},{id,label:right}]));
  status('Flip two cards to find a matching pair.');update();show();
  timer=setInterval(()=>{seconds=Math.floor((Date.now()-start)/1000);update()},1000);
 }
 function flip(i){
  if(busy||open.includes(i)||matched.has(cards[i].id))return;
  open.push(i);show();
  if(open.length!==2)return;
  moves++;
  const [a,b]=open;
  if(cards[a].id===cards[b].id){
   matched.add(cards[a].id);score+=100;open=[];status('Match found! +100 points');update();show();
   if(matched.size===6){clearInterval(timer);score+=Math.max(0,200-moves*5);status('All six pairs found! Final score: '+score+' · '+moves+' moves.');update()}
  }else{
   busy=true;score=Math.max(0,score-10);status('Not a match — remember their positions.');update();show();
   const current=token;setTimeout(()=>{if(current!==token)return;open=[];busy=false;show()},900);
  }
 }
 types.addEventListener('change',newGame);$('ml-new').addEventListener('click',newGame);newGame();
})();
