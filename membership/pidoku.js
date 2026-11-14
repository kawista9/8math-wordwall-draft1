// PiDoku: standalone free Sudoku game. No account or remote data.
(() => {
 const root=document.getElementById('pidoku-game');if(!root||root.dataset.initialized)return;root.dataset.initialized='true';
 const $=id=>root.querySelector('#'+id), symbols=['π','π²','π³','π⁴','π⁵','π⁶','π⁷','π⁸','π⁹'];
 let solution=[],puzzle=[],values=[],fixed=[],selected=-1,difficulty='easy',mistakes=0,hints=0,seconds=0,started=0,elapsed=0,clock=null,gameId=0,complete=false,noteMode=false,notes=Array.from({length:81},()=>new Set()),generating=false;
 const board=$('pd-board'),keys=$('pd-keys');
 const rand=n=>Math.floor(Math.random()*n);
 function shuffle(a){for(let i=a.length-1;i>0;i--){let j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];}return a}
 function indices(r,c){return r*9+c}
 function makeSolved(){
  const groups=()=>shuffle([0,1,2]).flatMap(g=>shuffle([0,1,2]).map(n=>g*3+n));
  const rows=groups(),cols=groups(),nums=shuffle([1,2,3,4,5,6,7,8,9]);
  return Array.from({length:81},(_,i)=>nums[(rows[Math.floor(i/9)]*3+Math.floor(rows[Math.floor(i/9)]/3)+cols[i%9])%9]);
 }
 function peers(i){let r=Math.floor(i/9),c=i%9,out=new Set();for(let j=0;j<9;j++){out.add(r*9+j);out.add(j*9+c)}let rr=Math.floor(r/3)*3,cc=Math.floor(c/3)*3;for(let y=rr;y<rr+3;y++)for(let x=cc;x<cc+3;x++)out.add(y*9+x);out.delete(i);return [...out]}
 const peerList=Array.from({length:81},(_,i)=>peers(i));
 function countSolutions(grid,limit=2){
  let found=0;
  function solve(){
   if(found>=limit)return;
   let pick=-1,opts=null;
   for(let i=0;i<81;i++)if(!grid[i]){
    const used=new Set(peerList[i].map(p=>grid[p])),options=[];
    for(let n=1;n<=9;n++)if(!used.has(n))options.push(n);
    if(!options.length)return;
    if(!opts||options.length<opts.length){pick=i;opts=options;if(opts.length===1)break}
   }
   if(pick<0){found++;return}
   for(const n of opts){grid[pick]=n;solve();grid[pick]=0;if(found>=limit)return}
  }
  solve();return found;
 }
 function makePuzzle(solved,level){
  const targets={easy:38,medium:46,hard:52},grid=solved.slice(),order=shuffle(Array.from({length:81},(_,i)=>i));
  let removed=0;
  for(const i of order){if(removed>=targets[level])break;let old=grid[i];grid[i]=0;if(countSolutions(grid.slice())===1)removed++;else grid[i]=old}
  return grid;
 }
 function formatTime(s){return Math.floor(s/60).toString().padStart(2,'0')+':'+(s%60).toString().padStart(2,'0')}
 function message(s){$('pd-message').textContent=s}
 function render(){
  $('pd-time').textContent=formatTime(seconds);$('pd-mistakes').textContent=mistakes;$('pd-hints-used').textContent=hints;
  $('pd-notes').setAttribute('aria-pressed',String(noteMode));$('pd-notes').textContent=noteMode?'Notes: ON':'Notes: OFF';
  $('pd-level').value=difficulty;
  const selVal=selected>=0?values[selected]:0;
  board.querySelectorAll('button').forEach((b,i)=>{
   const n=values[i],same=selVal&&n===selVal,related=selected>=0&&(peerList[selected].includes(i));
   b.className='pd-cell'+(fixed[i]?' pd-given':'')+(i===selected?' pd-selected':'')+(related?' pd-related':'')+(same?' pd-same':'')+(n&&!fixed[i]&&n!==solution[i]?' pd-error':'');
   b.setAttribute('aria-label','Row '+(Math.floor(i/9)+1)+', column '+(i%9+1)+', '+(n?symbols[n-1]:'empty')+(fixed[i]?', given':''));
   b.setAttribute('aria-pressed',String(i===selected));
   if(n){b.textContent=symbols[n-1]}else if(notes[i].size){b.innerHTML='<span class="pd-pencil">'+Array.from({length:9},(_,j)=>'<small>'+ (notes[i].has(j+1)?symbols[j]:'')+'</small>').join('')+'</span>'}else b.textContent='';
  });
 }
 function tick(){if(!complete&&!generating){seconds=Math.floor((Date.now()-started+elapsed)/1000);$('pd-time').textContent=formatTime(seconds)}}
 async function newGame(){
  const id=++gameId;generating=true;clearInterval(clock);$('pd-new').disabled=true;message('Creating a new '+difficulty+' puzzle…');
  await new Promise(resolve=>setTimeout(resolve,25));if(id!==gameId)return;
  const solved=makeSolved(),grid=makePuzzle(solved,difficulty);if(id!==gameId)return;
  solution=solved;puzzle=grid;values=grid.slice();fixed=grid.map(Boolean);notes=Array.from({length:81},()=>new Set());selected=-1;mistakes=0;hints=0;seconds=0;elapsed=0;complete=false;noteMode=false;generating=false;started=Date.now();$('pd-new').disabled=false;
  clearInterval(clock);clock=setInterval(tick,1000);message('Choose an empty square, then tap a π symbol.');render();
 }
 function winCheck(){if(values.every((n,i)=>n===solution[i])){complete=true;clearInterval(clock);message('Brilliant! You solved PiDoku in '+formatTime(seconds)+' with '+mistakes+' mistakes. Play again!')}}
 function put(n){
  if(complete||generating||selected<0||fixed[selected])return;
  if(noteMode&&n){if(notes[selected].has(n))notes[selected].delete(n);else notes[selected].add(n);render();return}
  if(n===0){values[selected]=0;notes[selected].clear();message('Square cleared.');render();return}
  if(values[selected]===n)return;
  values[selected]=n;notes[selected].clear();
  if(n!==solution[selected]){mistakes++;message('Not quite — that symbol does not fit here. Try another.')}
  else{message('Correct placement! Keep going.');peerList[selected].forEach(p=>notes[p].delete(n))}
  render();winCheck();
 }
 function hint(){if(complete||generating)return;let available=values.map((v,i)=>v!==solution[i]&&!fixed[i]?i:-1).filter(i=>i>=0);if(!available.length)return;let i=selected>=0&&available.includes(selected)?selected:available[rand(available.length)];values[i]=solution[i];notes[i].clear();selected=i;hints++;message('Hint revealed a correct π symbol.');render();winCheck()}
 for(let i=0;i<81;i++){let b=document.createElement('button');b.type='button';b.className='pd-cell';b.addEventListener('click',()=>{selected=i;render()});board.appendChild(b)}
 symbols.forEach((s,i)=>{let b=document.createElement('button');b.type='button';b.className='pd-key';b.textContent=s;b.setAttribute('aria-label','Place '+s);b.addEventListener('click',()=>put(i+1));keys.appendChild(b)});
 $('pd-clear').addEventListener('click',()=>put(0));$('pd-hint').addEventListener('click',hint);
 $('pd-notes').addEventListener('click',()=>{noteMode=!noteMode;render()});
 $('pd-new').addEventListener('click',newGame);
 $('pd-level').addEventListener('change',e=>{difficulty=e.target.value;newGame()});
 document.addEventListener('keydown',e=>{if(!root.isConnected||!root.contains(document.activeElement))return;if(e.key>='1'&&e.key<='9')put(Number(e.key));if(e.key==='Backspace'||e.key==='Delete')put(0)});
 newGame();
})();
