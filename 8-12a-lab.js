(() => {
"use strict";
const QUESTIONS=[{"title":"A laptop loan","borrower":"Maya","purpose":"buy a laptop","principal":2400,"loans":[{"name":"Bank A","rate":5,"time":3,"unit":"years"},{"name":"Bank B","rate":7,"time":3,"unit":"years"}]},{"title":"Same rate, different loan lengths","borrower":"Andre","purpose":"buy equipment for a small business","principal":5000,"loans":[{"name":"Credit Union A","rate":4.5,"time":5,"unit":"years"},{"name":"Credit Union B","rate":4.5,"time":3,"unit":"years"}]},{"title":"Look beyond the lower rate","borrower":"Leah","purpose":"buy a used car","principal":6000,"loans":[{"name":"Lender A","rate":3.5,"time":5,"unit":"years"},{"name":"Lender B","rate":5,"time":3,"unit":"years"}]},{"title":"Compare to the nearest cent","borrower":"Noah","purpose":"buy new furniture","principal":7250,"loans":[{"name":"Bank A","rate":3.75,"time":5,"unit":"years"},{"name":"Bank B","rate":4.5,"time":3,"unit":"years"}]},{"title":"Loan lengths in months","borrower":"Elena","purpose":"buy tools","principal":3200,"loans":[{"name":"Lender A","rate":4.75,"time":18,"unit":"months"},{"name":"Lender B","rate":4,"time":30,"unit":"months"}]},{"title":"Compare two car loans","borrower":"Jordan","purpose":"buy a car","principal":12000,"loans":[{"name":"Bank A","rate":5.5,"time":4,"unit":"years"},{"name":"Bank B","rate":4.5,"time":5,"unit":"years"}]},{"title":"Borrowing for repairs","borrower":"Nia","purpose":"pay for home repairs","principal":4500,"loans":[{"name":"Lender A","rate":6.25,"time":2,"unit":"years"},{"name":"Lender B","rate":5,"time":3,"unit":"years"}]},{"title":"Compare a shorter loan","borrower":"Mateo","purpose":"buy business equipment","principal":8000,"loans":[{"name":"Credit Union A","rate":4.25,"time":36,"unit":"months"},{"name":"Credit Union B","rate":5,"time":24,"unit":"months"}]},{"title":"Different rates and lengths","borrower":"Aaliyah","purpose":"buy furniture","principal":6850,"loans":[{"name":"Bank A","rate":3.25,"time":5,"unit":"years"},{"name":"Bank B","rate":4.75,"time":3,"unit":"years"}]},{"title":"Shorter does not always cost less","borrower":"Owen","purpose":"buy appliances","principal":3750,"loans":[{"name":"Lender A","rate":6.4,"time":2,"unit":"years"},{"name":"Lender B","rate":3.8,"time":3,"unit":"years"}]}];
const STEPS=["Place the values","Convert each percent","Calculate interest","Compare the interest"];
const money=n=>"$"+(n/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const number=n=>String(Number(n.toFixed(8)));
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
function results(q){
 const interest=q.loans.map(l=>Math.round((q.principal*(l.rate/100)*(l.unit==="months"?l.time/12:l.time)+1e-9)*100));
 return {interest,difference:Math.abs(interest[0]-interest[1])};
}
function numeric(s){
 const value=String(s).trim().replace(/[$,]/g,"").replace(/−/g,"-");
 return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)?Number(value):NaN;
}
function reset(data,index){Object.assign(data,{index,step:0,placements:{},selected:null,inputs:{},statement:{first:"",relation:"",second:""},verified:false,answered:false});}
function chip(value,label,guided){
 return guided?'<button type="button" draggable="true" class="c812-chip" data-value="'+value+'" aria-label="Select '+esc(label)+'">'+esc(label)+'</button>':'<strong>'+esc(label)+'</strong>';
}
function story(q,guided){
 return '<article class="c812-story"><h5>Read the word problem</h5><p>'+q.borrower+' needs to borrow '+chip(q.principal,money(q.principal*100),guided)+' to '+q.purpose+'. The lenders offer these loans:</p><ul>'+q.loans.map(l=>'<li><strong>'+l.name+'</strong> offers a '+chip(l.time,number(l.time)+" "+l.unit,guided)+' loan at '+chip(l.rate,number(l.rate)+"%",guided)+' annual simple interest.</li>').join("")+'</ul><p>Compare the total interest over the life of each loan. Assume no extra fees.</p>'+(guided?'<p class="c812-tip">Drag a highlighted value into a formula box, or select the value and then select its box. Values can be used in both formulas. Double-click a box to clear it.</p>':'')+'</article>';
}
function input(key,label,data,kind="money"){
 return '<label class="c812-field"><span>'+label+'</span><span class="c812-input-wrap">'+(kind==="money"?'<b aria-hidden="true">$</b>':'')+'<input type="text" inputmode="decimal" autocomplete="off" data-input="'+key+'" aria-label="'+esc(label)+'" value="'+esc(data.inputs[key]||"")+'" '+(data.verified?'disabled':'')+'></span></label>';
}
function slot(data,key,label,unit){
 const value=data.placements[key];
 return '<button type="button" class="c812-slot'+(value!==undefined?' filled':'')+'" data-slot="'+key+'" '+(data.verified?'disabled':'')+' aria-label="'+esc(label)+(value!==undefined?": "+value:"")+'"><small>'+label+'</small><strong>'+(value!==undefined?number(value):"Drop value")+'</strong><small>'+unit+'</small></button>';
}
function formula(q,l,i,data){
 return '<article class="c812-formula-card"><h5>'+l.name+'</h5><div class="c812-formula"><strong>Interest =</strong>'+slot(data,i+"-p","Amount borrowed","dollars")+'<span>×</span><div class="c812-factor">'+slot(data,i+"-r","Annual rate","percent")+'<span>÷ 100</span></div><span>×</span><div class="c812-factor">'+slot(data,i+"-t","Loan length",l.unit)+(l.unit==="months"?'<span>÷ 12</span>':'')+'</div></div></article>';
}
function lenderSelect(q,key,data){
 return '<select data-statement="'+key+'" aria-label="'+(key==="first"?"First lender":"Comparison lender")+'" '+(data.verified?'disabled':'')+'><option value="">Choose lender</option>'+q.loans.map((l,i)=>'<option value="'+i+'" '+(data.statement[key]===String(i)?'selected':'')+'>'+l.name+'</option>').join("")+'</select>';
}
function comparison(q,data){
 return '<div class="c812-compare">'+input("difference","Difference between the interest amounts",data)+'<div class="c812-statement"><h5>Complete the comparison statement</h5><div>'+lenderSelect(q,"first",data)+'<span>charges</span><strong>'+(Number.isFinite(numeric(data.inputs.difference))?money(Math.round(numeric(data.inputs.difference)*100)):"the difference above")+'</strong><select data-statement="relation" aria-label="More or less interest" '+(data.verified?'disabled':'')+'><option value="">Choose</option><option value="less" '+(data.statement.relation==="less"?'selected':'')+'>less</option><option value="more" '+(data.statement.relation==="more"?'selected':'')+'>more</option></select><span>interest than</span>'+lenderSelect(q,"second",data)+'<span>over the life of the loan.</span></div></div></div>';
}
function worked(q,r){
 return '<article class="c812-explanation"><h5>Compare the borrowing costs</h5>'+q.loans.map((l,i)=>'<p><strong>'+l.name+':</strong> '+money(q.principal*100)+' × '+number(l.rate/100)+' × '+number(l.unit==="months"?l.time/12:l.time)+' years = <strong>'+money(r.interest[i])+' interest</strong>.</p>').join("")+'<p>The difference is <strong>'+money(r.difference)+'</strong>. '+q.loans[r.interest[0]<r.interest[1]?0:1].name+' charges less interest over the life of the loan.</p><p>Compare the total interest from both the rate and the loan length. A lower annual rate or a shorter loan by itself does not always identify the less expensive loan.</p></article>';
}
window.CREDIT_812A_TOTAL=QUESTIONS.length;
window.reset812AQuestion=reset;
window.render812ALab=function(ctx){
 const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
 const data=labRuntime.data||(labRuntime.data={index:0,step:0,placements:{},selected:null,inputs:{},statement:{first:"",relation:"",second:""},verified:false,answered:false});
 const q=QUESTIONS[data.index],r=results(q),guided=data.index<5,body=$("#standardsLabBody");
 const render=()=>window.render812ALab(ctx);
 const videoList=$("#standardsLabVideoList");
 if(videoList)videoList.closest(".standards-lab-videos").hidden=!guided;
 setLabProgress(data.index+(data.answered?1:0),QUESTIONS.length,guided?"Question "+(data.index+1)+": step "+(data.step+1)+" of 4.":"Compare the interest costs independently.");
 let activity="",instruction="";
 if(guided){
  if(data.step===0){
   instruction="Place the amount borrowed, annual interest rate, and loan length into each formula.";
   activity='<div class="c812-rule">Simple interest = amount borrowed × annual interest rate (decimal) × loan length (years)</div><div class="c812-two">'+q.loans.map((l,i)=>formula(q,l,i,data)).join("")+'</div>';
  }else if(data.step===1){
   instruction="Convert each percent to a decimal by dividing the percent by 100.";
   activity='<div class="c812-rule">Percent ÷ 100 = decimal form of the interest rate</div><div class="c812-two">'+q.loans.map((l,i)=>'<article class="c812-card"><h5>'+l.name+'</h5><p>'+number(l.rate)+' ÷ 100 =</p>'+input("rate"+i,"Interest rate as a decimal",data,"decimal")+'</article>').join("")+'</div>';
  }else if(data.step===2){
   instruction="Multiply to find the total interest for each loan. Round each interest amount to the nearest cent.";
   activity='<div class="c812-two">'+q.loans.map((l,i)=>'<article class="c812-card"><h5>'+l.name+'</h5>'+(l.unit==="months"?'<p class="c812-tip">Use years with an annual rate: '+l.time+' months ÷ 12 = '+number(l.time/12)+' years.</p>':'')+'<p class="c812-calculation">'+money(q.principal*100)+' × '+number(l.rate/100)+' × '+number(l.unit==="months"?l.time/12:l.time)+' =</p>'+input("interest"+i,"Total interest for "+l.name,data)+'</article>').join("")+'</div>';
  }else{
   instruction="Subtract the smaller interest amount from the larger one. Then complete a statement that correctly compares the lenders.";
   activity='<div class="c812-totals">'+q.loans.map((l,i)=>'<span><strong>'+l.name+'</strong> '+money(r.interest[i])+' interest</span>').join("")+'</div>'+comparison(q,data);
  }
 }else{
  instruction="Find the difference in total interest and complete the comparison statement. Round interest amounts and the difference to the nearest cent.";
  activity=comparison(q,data);
 }
 const steps=guided?'<ol class="c812-steps">'+STEPS.map((label,i)=>'<li class="'+(i===data.step?"active":i<data.step?"done":"")+'" '+(i===data.step?'aria-current="step"':'')+'><b>'+(i<data.step?"✓":i+1)+'</b>'+label+'</li>').join("")+'</ol>':"";
 body.innerHTML='<section class="c812-lab"><header><p>8.12A · QUESTION '+(data.index+1)+' OF 10 · '+(guided?"GUIDED PRACTICE":"INDEPENDENT PRACTICE")+'</p><h4>'+q.title+'</h4></header>'+story(q,guided&&data.step===0)+steps+'<form id="c812Form" novalidate><h5>'+(guided?"Step "+(data.step+1)+": "+STEPS[data.step]:"Compare the loans")+'</h5><p>'+instruction+'</p>'+activity+'<div class="c812-actions"><button type="submit" class="lab-action" '+(data.verified?"disabled":"")+'>Check '+(guided&&data.step===0?"formulas":"answer")+'</button>'+(data.verified&&!data.answered?'<button type="button" class="lab-next" id="c812Step">Next step →</button>':'')+'</div></form>'+(data.answered?worked(q,r)+'<button type="button" class="lab-next" id="c812Next">'+(data.index===9?"Finish lab":"Next question →")+'</button>':'')+'</section>';
 function place(key,value){
  if(data.verified||!Number.isFinite(value)||!q.loans.some(l=>value===l.rate||value===l.time||value===q.principal))return;
  data.placements[key]=value;data.selected=null;setLabFeedback("");render();
 }
 body.querySelectorAll("[data-value]").forEach(button=>{
  if(data.selected===Number(button.dataset.value))button.classList.add("selected");
  button.addEventListener("click",()=>{if(data.verified)return;data.selected=data.selected===Number(button.dataset.value)?null:Number(button.dataset.value);render();});
  button.addEventListener("dragstart",event=>{event.dataTransfer.setData("text/plain",button.dataset.value);event.dataTransfer.effectAllowed="copy";});
 });
 body.querySelectorAll("[data-slot]").forEach(button=>{
  button.addEventListener("click",()=>{if(data.selected!==null)place(button.dataset.slot,data.selected);});
  button.addEventListener("dblclick",()=>{if(data.verified)return;delete data.placements[button.dataset.slot];render();});
  button.addEventListener("dragover",event=>{if(!data.verified){event.preventDefault();event.dataTransfer.dropEffect="copy";}});
  button.addEventListener("drop",event=>{event.preventDefault();const raw=event.dataTransfer.getData("text/plain");if(raw.trim())place(button.dataset.slot,Number(raw));});
 });
 body.querySelectorAll("[data-input]").forEach(input=>input.addEventListener("input",()=>{data.inputs[input.dataset.input]=input.value;if(input.dataset.input==="difference"){const value=numeric(input.value),label=$("#c812DifferenceText");if(label)label.textContent=Number.isFinite(value)?money(Math.round(value*100)):"the difference above";}input.removeAttribute("aria-invalid");setLabFeedback("");}));
 body.querySelectorAll("[data-statement]").forEach(select=>select.addEventListener("change",()=>{data.statement[select.dataset.statement]=select.value;setLabFeedback("");}));
 $("#c812Form").addEventListener("submit",event=>{
  event.preventDefault();if(data.verified)return;
  body.querySelectorAll("[data-input]").forEach(input=>{data.inputs[input.dataset.input]=input.value;});
  body.querySelectorAll("[data-statement]").forEach(select=>{data.statement[select.dataset.statement]=select.value;});
  let error="";
  if(guided&&data.step===0){
   if(Object.keys(data.placements).length!==6)error="Fill all six formula boxes. You can reuse the borrowed amount for both loans.";
   else if(q.loans.some((l,i)=>data.placements[i+"-p"]!==q.principal||data.placements[i+"-r"]!==l.rate||data.placements[i+"-t"]!==l.time))error="Check each box against the word problem. Match the borrowed amount, annual rate, and loan length to the correct lender.";
  }else if(guided&&data.step===1){
   if(q.loans.some((l,i)=>!Number.isFinite(numeric(data.inputs["rate"+i]))||Math.abs(numeric(data.inputs["rate"+i])-l.rate/100)>1e-9))error="Divide each percent by 100. For example, 6% becomes 0.06. Enter the decimal without a percent sign.";
  }else if(guided&&data.step===2){
   if(q.loans.some((_,i)=>!Number.isFinite(numeric(data.inputs["interest"+i]))||Math.abs(numeric(data.inputs["interest"+i])-r.interest[i]/100)>1e-7))error="Multiply the borrowed amount by the decimal rate and the time in years. Enter each interest amount rounded to the nearest cent.";
  }else{
   const difference=numeric(data.inputs.difference),a=data.statement.first,b=data.statement.second;
   if(!Number.isFinite(difference)||!a||!b||!data.statement.relation)error="Enter the difference and complete all three dropdown choices.";
   else if(Math.abs(difference-r.difference/100)>1e-7)error=guided?"Subtract the smaller interest amount from the larger one, using the amounts rounded to cents.":"Not yet. Recheck the difference between the two total interest costs.";
   else if(a===b||(data.statement.relation==="less"?r.interest[Number(a)]>=r.interest[Number(b)]:r.interest[Number(a)]<=r.interest[Number(b)]))error=guided?"Your statement must compare the two different lenders. Check which charges more interest and which charges less.":"Not yet. Recheck the lenders and the direction of your comparison.";
  }
  if(error)return setLabFeedback(error,"incorrect");
  data.verified=true;
  if(!guided||data.step===3)data.answered=true;
  render();setLabFeedback(data.answered?"Correct. The interest costs differ by "+money(r.difference)+", and your comparison statement matches.":"Correct. Continue to the next step.","correct");
 });
 const step=$("#c812Step");if(step)step.addEventListener("click",()=>{if(!data.verified||data.step>=3)return;data.step++;data.verified=false;data.selected=null;setLabFeedback("");render();});
 const next=$("#c812Next");if(next)next.addEventListener("click",()=>{if(!data.answered)return;if(data.index===9)return showLabCompletion("8.12A");reset(data,data.index+1);setLabFeedback("");render();syncWhiteboardQuestion();});
};
})();