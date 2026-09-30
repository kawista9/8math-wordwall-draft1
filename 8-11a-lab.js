(() => {
"use strict";
const patterns = {
 positive:[[1,2],[1.5,1.5],[2,3],[3,2.6],[3.5,4.5],[4,3.7],[5,5.4],[6,5],[6.5,6.8],[7,6],[8,8],[9,7.6]],
 negative:[[1,8],[1.5,9],[2,7.2],[3,7.8],[3.5,6],[4,6.8],[5,5],[6,5.6],[6.5,3.7],[7,4.5],[8,2],[9,2.6]],
 none:[[1,2],[1,8],[2.5,5],[3,9],[3.5,1],[4.5,6],[5.5,3],[6,8],[7,1.5],[7.5,6],[9,3],[9,8]],
 curve:[[1,1],[2,1.2],[3,1.5],[4,2],[5,2.8],[6,4],[7,5.2],[8,6.8],[9,8.6]]
};
const categories=["Negative Linear","Positive Linear","No association"];
const items=[
 {id:"a",kind:"Graph A",points:patterns.positive,category:1},
 {id:"b",kind:"Mathematical statement",text:"As x increases, y tends to decrease at an approximately constant rate.",category:0},
 {id:"c",kind:"Situation",text:"A teacher compares students’ shoe sizes and quiz scores. Students with larger shoe sizes are just as likely to earn high or low scores as students with smaller shoe sizes.",category:2},
 {id:"d",kind:"Graph B",points:patterns.none,category:2},
 {id:"e",kind:"Situation",text:"A library records weekly visitors and books checked out. For every 10 additional visitors, the number of books checked out tends to increase by about 15.",category:1},
 {id:"f",kind:"Mathematical statement",text:"Knowing the value of x does not help predict the value of y. Larger x-values are not consistently paired with larger or smaller y-values.",category:2},
 {id:"g",kind:"Situation",text:"A mechanic compares the ages and resale values of similar cars. For each additional year of age, resale value tends to decrease by about $1,200.",category:0},
 {id:"h",kind:"Graph C",points:patterns.negative,category:0},
 {id:"i",kind:"Mathematical statement",text:"As x increases, y tends to increase at an approximately constant rate.",category:1}
];
const tablePoints=[[1,7],[2,8],[3,5],[4,6],[5,3],[6,4]];
const questions=[
 {title:"Read a trend in context",prompt:"A recreation center records the number of classes offered and the number of registrations each month. Which conclusion is best supported by the scatterplot?",points:patterns.positive,x:"Classes offered",y:"Registrations (tens)",choices:["Registrations generally decrease as more classes are offered.","Registrations are identical for every number of classes.","Registrations generally increase as more classes are offered.","There is no association between classes offered and registrations."],correct:2,reason:"The cluster rises from left to right and follows a roughly straight trend. More classes are associated with more registrations; every point does not have to lie on one line."},
 {title:"Match a situation to a scatterplot",prompt:"A music teacher records students’ weekly practice hours and the number of mistakes during a performance. As practice hours increase, the number of mistakes generally decreases in a roughly straight-line pattern. Which scatterplot best represents these observations?",plots:[patterns.none,patterns.negative,patterns.positive,patterns.curve],x:"Practice hours",y:"Number of mistakes",correct:1,reason:"Graph B has a falling straight-line cluster: larger practice-hour values generally pair with fewer mistakes. A rising trend reverses the observation; a curve or random cloud does not match it."},
 {title:"Describe the observed data",prompt:"The scatterplot shows the shoe sizes and number of library books borrowed by a group of students. Which description best matches the observed data?",points:patterns.none,x:"Shoe size",y:"Books borrowed",choices:["Positive linear association","Negative linear association","Nonlinear association following a clear curve","No association"],correct:3,reason:"Across the shoe sizes, the number of books varies without a consistent direction or curved pattern. Individual points going up or down do not establish an overall association."},
 {title:"Match a data table to its scatterplot",prompt:"A coach records practice time, x, in hours and the number of errors, y. Which scatterplot correctly represents every ordered pair in the table?",table:tablePoints,plots:[tablePoints.map(([x,y])=>[y,x]),tablePoints.map(([x,y])=>[x,10-y]),tablePoints,[[1,7],[2,8],[3,5],[4,6],[5,4],[6,3]]],x:"Practice time (hours)",y:"Number of errors",correct:2,reason:"Graph C places each practice time on the horizontal axis and its paired error count on the vertical axis. For example, (2, 8) and (5, 3) are both included. Reversing coordinates or switching paired values changes the data."},
 {title:"Recognize a nonlinear association",prompt:"Which scatterplot best represents a nonlinear association?",plots:[patterns.negative,patterns.curve,patterns.none,patterns.positive],x:"x",y:"y",correct:1,reason:"Graph B follows a clear curve. That is a nonlinear association. Falling or rising straight-line clusters are linear; a cloud with no clear pattern shows no association."}
];
function graph(points,x="x",y="y"){
 const sx=n=>55+26*n, sy=n=>300-26*n;
 let grid="";
 for(let n=0;n<=10;n+=2) grid+= '<path d="M'+sx(n)+' 40V300 M55 '+sy(n)+'H315" stroke="#d9dde3"/><text x="'+sx(n)+'" y="320" text-anchor="middle">'+n+'</text><text x="45" y="'+(sy(n)+4)+'" text-anchor="end">'+n+'</text>';
 return '<svg viewBox="0 0 360 365" role="img" aria-label="Scatterplot: horizontal axis '+x+', vertical axis '+y+'. Points: '+points.map(p=>p.join(", ")).join("; ")+'"><rect x="55" y="40" width="260" height="260" fill="white"/>'+grid+'<path d="M55 40V300H315" fill="none" stroke="#263246" stroke-width="2"/>'+points.map(([a,b])=>'<circle cx="'+sx(a)+'" cy="'+sy(b)+'" r="5" fill="#245ac5"/>').join("")+'<text x="185" y="349" text-anchor="middle">'+x+'</text><text transform="translate(16 170) rotate(-90)" text-anchor="middle">'+y+'</text></svg>';
}
function reset(data,index){Object.assign(data,{index,selected:null,placements:{},answered:false});}
window.ASSOCIATION_811A_TOTAL=6;
window.reset811AQuestion=reset;
window.render811ALab=function(ctx){
 const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
 const data=labRuntime.data||(labRuntime.data={index:0,selected:null,placements:{},answered:false});
 const body=$("#standardsLabBody");
 const rerender=()=>window.render811ALab(ctx);
 const isSort=data.index===0, task=questions[data.index-1];
 setLabProgress(data.index+(data.answered?1:0),6,isSort?"Sort all nine items: three per category.":"Choose one answer, then check it.");
 const card=item=>'<button type="button" class="a811-item'+(data.selected===item.id?' selected':'')+'" draggable="'+!data.answered+'" data-item="'+item.id+'" '+(data.answered?'disabled':'')+'><strong>'+item.kind+'</strong>'+(item.points?graph(item.points):'<span>'+item.text+'</span>')+'</button>';
 const sort='<p>Place one graph, one mathematical statement, and one situation in each category. Drag a card, or select it and then select a category. Select “Item bank” to return a card.</p><button type="button" class="a811-target" data-zone="bank">Item bank ('+items.filter(i=>data.placements[i.id]===undefined).length+')</button><div class="a811-bank" data-drop="bank">'+items.filter(i=>data.placements[i.id]===undefined).map(card).join("")+'</div><div class="a811-categories">'+categories.map((label,c)=>'<section data-drop="'+c+'"><button type="button" class="a811-target" data-zone="'+c+'">'+label+' ('+items.filter(i=>data.placements[i.id]===c).length+'/3)</button><div>'+items.filter(i=>data.placements[i.id]===c).map(card).join("")+'</div></section>').join("")+'</div>';
 const table=task&&task.table?'<div class="a811-table-wrap"><table><caption>Practice observations</caption><thead><tr><th>x: Practice time (hours)</th><th>y: Number of errors</th></tr></thead><tbody>'+task.table.map(([x,y])=>'<tr><td>'+x+'</td><td>'+y+'</td></tr>').join("")+'</tbody></table></div>':"";
 const mc=task?'<p>'+task.prompt+'</p>'+table+(task.points?'<div class="a811-main-graph">'+graph(task.points,task.x,task.y)+'</div>':"")+'<div class="a811-options'+(task.plots?' graph-options':'')+'">'+(task.plots||task.choices).map((choice,i)=>'<button type="button" class="a811-option'+(data.selected===i?' selected':'')+'" data-option="'+i+'" '+(data.answered?'disabled':'')+'><strong>'+String.fromCharCode(65+i)+'</strong>'+(task.plots?graph(choice,task.x,task.y):'<span>'+choice+'</span>')+'</button>').join("")+'</div>':"";
 body.innerHTML='<section class="a811-lab"><header><p>8.11A · QUESTION '+(data.index+1)+' OF 6</p><h4>'+(isSort?'Sort the evidence':task.title)+'</h4></header>'+(isSort?sort:mc)+(data.answered?'<p class="a811-reason">'+(isSort?'A falling straight-line cluster has a negative linear association; a rising one has a positive linear association. No association means there is no consistent linear or curved pattern.':task.reason)+'</p>':"")+'<div class="a811-actions"><button type="button" class="lab-action" id="a811Check" '+(data.answered?'disabled':'')+'>Check answer</button><button type="button" class="lab-next" id="a811Next" '+(data.answered?'':'hidden')+'>'+(data.index===5?'Finish lab':'Next question →')+'</button></div></section>';
 function place(id,zone){
  if(data.answered||!items.some(i=>i.id===id))return;
  if(zone==="bank")delete data.placements[id];
  else {const c=Number(zone);if(!Number.isInteger(c)||c<0||c>2)return;if(data.placements[id]!==c&&Object.values(data.placements).filter(v=>v===c).length>=3)return setLabFeedback("This category already has three cards. Return a card to the bank or move it first.","incorrect");data.placements[id]=c;}
  data.selected=null;setLabFeedback("");rerender();
 }
 body.querySelectorAll("[data-item]").forEach(el=>{
  el.addEventListener("click",()=>{if(data.answered)return;data.selected=data.selected===el.dataset.item?null:el.dataset.item;rerender();});
  el.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",el.dataset.item);e.dataTransfer.effectAllowed="move";});
 });
 body.querySelectorAll("[data-zone]").forEach(el=>el.addEventListener("click",()=>place(data.selected,el.dataset.zone)));
 body.querySelectorAll("[data-drop], [data-zone]").forEach(el=>{
  el.addEventListener("dragover",e=>{if(!data.answered){e.preventDefault();e.dataTransfer.dropEffect="move";}});
  el.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();place(e.dataTransfer.getData("text/plain"),el.dataset.drop||el.dataset.zone);});
 });
 body.querySelectorAll("[data-option]").forEach(el=>el.addEventListener("click",()=>{data.selected=Number(el.dataset.option);setLabFeedback("");rerender();}));
 $("#a811Check").addEventListener("click",()=>{
  if(data.answered)return;
  if(isSort){
   if(Object.keys(data.placements).length!==9)return setLabFeedback("Place all nine cards before checking.","incorrect");
   const wrong=items.filter(i=>data.placements[i.id]!==i.category).length;
   if(wrong)return setLabFeedback(wrong+" cards need another look. Compare direction and shape: rising straight trend, falling straight trend, or no consistent pattern.","incorrect");
  }else{
   if(data.selected===null)return setLabFeedback("Select an answer first.","incorrect");
   if(data.selected!==task.correct)return setLabFeedback(task.table?"Recheck each ordered pair. Keep the x-value horizontal and the y-value vertical.":"Read the full point cluster. Does it rise, fall, follow a curve, or have no clear pattern?","incorrect");
  }
  data.answered=true;rerender();setLabFeedback(isSort?"Correct. Each category has its matching graph, mathematical statement, and situation.":"Correct. "+task.reason,"correct");
 });
 $("#a811Next").addEventListener("click",()=>{
  if(!data.answered)return;if(data.index===5)return showLabCompletion("8.11A");
  reset(data,data.index+1);setLabFeedback("");rerender();syncWhiteboardQuestion();
 });
};
})();