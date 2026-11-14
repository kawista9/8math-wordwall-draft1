// PiDoku: region-placement puzzle, inspired by the mechanics of colored-grid logic games.
(() => {
 const root=document.getElementById('pidoku-game');if(!root||root.dataset.initialized)return;root.dataset.initialized='true';
 const $=id=>root.querySelector('#'+id);
 const palette=['#f4aa72','#f3a4ca','#a6d1e9','#79cfc8','#b69ae9','#f1ce65','#e99092','#a8d78c','#d4a98e'];
 let size=10,regions=[],answer=[],marks=[],mode='pi',hints=0,mistakes=0,started=0,seconds=0,timer=null,finished=false,random=Math.random,locked=new Set();
 const board=$('pd-board'),day=$('pd-day'),newBtn=$('pd-new');
 function seeded(n){let x=n|0;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
 const rnd=n=>Math.floor(random()*n);
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
 const row=i=>Math.floor(i/size),col=i=>i%size;
 function neighbors(i){let r=row(i),c=col(i),out=[];for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){let y=r+dr,x=c+dc;if(y>=0&&x>=0&&y<size&&x<size)out.push(y*size+x)}return out}
 function generateQueens(){
  for(let attempt=0;attempt<5000;attempt++){
   const rows=shuffle(Array.from({length:size},(_,i)=>i)).slice(0,9).sort((a,b)=>a-b);
   const cols=shuffle(Array.from({length:size},(_,i)=>i)).slice(0,9);
   if(rows.every((r,i)=>i===0||r-rows[i-1]>1||Math.abs(cols[i]-cols[i-1])>1))return rows.map((r,i)=>r*size+cols[i]);
  }
  throw Error('Unable to create a placement puzzle');
 }
 function generateRegions(queens){
  // Purposeful connected color regions. An occasional one-cell region is a built-in clue.
  const owner=Array(size*size).fill(-1),frontiers=queens.map((q,k)=>{owner[q]=k;return [q]});
  const singleton=rnd(3)===0?rnd(9):-1;
  const order=shuffle(Array.from({length:9},(_,i)=>i));
  let remaining=size*size-9;
  while(remaining){
   const choices=shuffle(order.slice()).filter(k=>k!==singleton&&frontiers[k].some(i=>neighbors(i).some(n=>owner[n]<0)));
   if(!choices.length)break;
   for(const k of choices){
    const options=[];
    for(const i of frontiers[k])for(const n of neighbors(i))if(owner[n]<0)options.push(n);
    if(!options.length)continue;
    // Favor thin, uneven bands and bends rather than uniformly growing blobs.
    const chosen=options[rnd(options.length)];owner[chosen]=k;frontiers[k].push(chosen);remaining--;
    if(!remaining)break;
   }
  }
  return owner;
 }
 function hasUniqueSolution(areas,givens){
  const candidates=Array.from({length:9},()=>[]);
  for(let i=0;i<areas.length;i++)candidates[areas[i]].push(i);
  for(const i of givens)candidates[areas[i]]=[i];

  let solutions=0,nodes=0;
  const nodeLimit=250000;
  const chosen=[];
  function search(usedRegions,usedRows,usedCols){
   if(++nodes>nodeLimit||solutions>=2)return;
   if(usedRegions===511){solutions++;return}
   let pick=-1,options=null;
   for(let k=0;k<9;k++)if(!(usedRegions&(1<<k))){
    const opts=candidates[k].filter(i=>{
     if((usedRows&(1<<row(i)))||(usedCols&(1<<col(i))))return false;
     return !chosen.some(j=>Math.abs(row(i)-row(j))<=1&&Math.abs(col(i)-col(j))<=1);
    });
    if(!opts.length)return;
    if(!options||opts.length<options.length){options=opts;pick=k;if(opts.length===1)break}
   }
   for(const i of options){
    chosen.push(i);
    search(usedRegions|(1<<pick),usedRows|(1<<row(i)),usedCols|(1<<col(i)));
    chosen.pop();
    if(solutions>=2||nodes>nodeLimit)return;
   }
  }
  search(0,0,0);
  return nodes<=nodeLimit&&solutions===1;
 }
 function createLogicalPuzzle(){
  const desiredGivens=1+rnd(3);
  let best=null;
  for(let attempt=0;attempt<14;attempt++){
   const queens=generateQueens(),areas=generateRegions(queens);
   // The planted answer has one π per region. Remove a clue only after
   // verifying that the remaining visible clues still force that answer.
   let givens=queens.slice();
   for(const clue of shuffle(queens.slice())){
    if(givens.length<=desiredGivens)break;
    const remaining=givens.filter(i=>i!==clue);
    if(hasUniqueSolution(areas,remaining))givens=remaining;
   }
   if(!best||givens.length<best.givens.length)best={queens,areas,givens};
   if(givens.length<=desiredGivens)break;
  }
  return best;
 }
 function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
 function msg(s){$('pd-message').textContent=s}
 function tick(){if(!finished){seconds=Math.floor((Date.now()-started)/1000);$('pd-time').textContent=formatTime(seconds)}}
 function build(){
  clearInterval(timer);finished=false;
  size=[9,10,10,11,12][Math.floor(Math.random()*5)];
  const seed=Math.floor(Math.random()*0xFFFFFFFF)+1;
  random=seeded(seed);
  day.textContent='Unlimited random puzzle · '+size+'×'+size;
  newBtn.textContent='↻ Different puzzle';
  const generated=createLogicalPuzzle();
  answer=generated.queens;
  regions=generated.areas;
  marks=Array(size*size).fill(0);
  locked=new Set(generated.givens);
  for(const i of locked)marks[i]=1;
  hints=0;mistakes=0;seconds=0;started=Date.now();
  board.replaceChildren();board.style.setProperty('--pd-size',size);
  for(let i=0;i<marks.length;i++){
   const b=document.createElement('button');b.type='button';b.className='pd-cell';b.addEventListener('click',()=>act(i));board.appendChild(b);
  }
  clearInterval(timer);timer=setInterval(tick,1000);msg('Start with the colored regions. Place π symbols and mark Xs only as you solve.');render();
 }
 function conflicts(i){
  if(marks[i]!==1)return false;
  for(let j=0;j<marks.length;j++)if(j!==i&&marks[j]===1){
   if(row(i)===row(j)||col(i)===col(j)||regions[i]===regions[j]||Math.abs(row(i)-row(j))<=1&&Math.abs(col(i)-col(j))<=1)return true;
  }
  return false;
 }
 function act(i){
  if(finished||locked.has(i))return;
  if(mode==='erase')marks[i]=0;
  else if(mode==='x')marks[i]=marks[i]===-1?0:-1;
  else marks[i]=marks[i]===1?0:1;
  if(marks[i]===1&&conflicts(i)){mistakes++;msg('Those π symbols conflict! Check the row, column, color, or touching corners.')}
  else msg('Keep going — find exactly one π in each colored region.');
  render();checkWin();
 }
 function checkWin(){
  const placed=marks.map((v,i)=>v===1?i:-1).filter(i=>i>=0);
  if(placed.length!==9||placed.some(i=>conflicts(i)))return;
  finished=true;clearInterval(timer);
  msg('You solved it! Nine colors, nine π symbols, no conflicts. Time: '+formatTime(seconds)+' · Hints: '+hints+'.');
  $('pd-day').textContent='Puzzle solved ✓';
 }
 function hint(){
  if(finished)return;
  const placed=marks.map((v,i)=>v===1?i:-1).filter(i=>i>=0);
  const candidates=answer.filter(i=>marks[i]!==1&&!placed.some(j=>row(i)===row(j)||col(i)===col(j)||regions[i]===regions[j]||Math.abs(row(i)-row(j))<=1&&Math.abs(col(i)-col(j))<=1));
  if(!candidates.length){msg('No safe hint fits your current placements. Clear conflicting π symbols first.');return}
  const i=candidates[rnd(candidates.length)];marks[i]=1;locked.add(i);hints++;msg('Hint: a π symbol was placed in the '+(row(i)+1)+'th row.');render();checkWin();
 }
 function render(){
  const cells=board.children;let placed=0,errors=0;
  for(let i=0;i<marks.length;i++){
   const b=cells[i],v=marks[i],region=regions[i],bad=conflicts(i);
   if(v===1)placed++;if(bad)errors++;
   b.className='pd-cell pd-region-'+region+(v===1?' pd-pi':'')+(v===-1?' pd-x':'')+(bad?' pd-conflict':'')+(locked.has(i)?' pd-hint':'');
   b.style.setProperty('background-color',palette[region],'important');b.style.setProperty('color',region===4?'#221934':'#132039','important');
   b.textContent=v===1?'π':v===-1?'×':'';
   b.setAttribute('aria-label','Row '+(row(i)+1)+', column '+(col(i)+1)+', '+['orange','pink','blue','teal','lavender','yellow','coral','green','tan'][region]+' region, '+(v===1?'pi symbol':v===-1?'marked empty':'empty'));
   b.setAttribute('aria-pressed',String(v!==0));b.disabled=locked.has(i);
  }
  $('pd-placed').textContent=placed+' / 9';$('pd-mistakes').textContent=mistakes;$('pd-hints-used').textContent=hints;$('pd-time').textContent=formatTime(seconds);
  root.querySelectorAll('[data-pd-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pdMode===mode)));
  const emptyLines=size>9?' Rows and columns can be empty on this board.':'';
  $('pd-rules').textContent=errors?'Some π symbols break a rule — red outlines show conflicts.':'Rules: one π per color, at most one per row and column, and π symbols cannot touch, even diagonally.'+emptyLines;
 }
 root.querySelectorAll('[data-pd-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.pdMode;render()}));
 $('pd-hint').addEventListener('click',hint);
 $('pd-new').addEventListener('click',build);
 build();
})();
