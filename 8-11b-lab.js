(() => {
"use strict";
const QUESTIONS = [{"title":"Reading time","context":"Five students record the number of minutes they read before class.","unit":"minutes","values":[4,6,8,10,12]},{"title":"Points scored","context":"A team records its points scored in six games.","unit":"points","values":[12,8,14,10,6,10]},{"title":"Walking distances","context":"Eight walkers record their walking distances in kilometers.","unit":"kilometers","values":[2.5,4.5,3,5,4,5,3,5]},{"title":"Practice time","context":"Eight musicians record their practice times in minutes.","unit":"minutes","values":[18,12,20,10,15,15,25,5]},{"title":"Packages delivered","context":"A courier records the number of packages delivered on ten days.","unit":"packages","values":[4,8,12,16,10,14,6,18,10,12]},{"title":"Books borrowed","context":"The table shows the number of books borrowed by five families.","unit":"books","values":[3,5,7,9,11],"choices":[7,12,2.4,0],"correct":2},{"title":"Afternoon temperatures","context":"The table shows afternoon temperatures, in degrees Fahrenheit, on six days.","unit":"degrees Fahrenheit","values":[70,72,74,76,78,80],"choices":[0,3,10,75],"correct":1},{"title":"Bus waiting times","context":"The table shows five bus waiting times in minutes.","unit":"minutes","values":[2,4,4,6,9],"choices":[5,7,10,2],"correct":3},{"title":"Race times","context":"The table shows the times, in seconds, of five runners in a short race.","unit":"seconds","values":[12.2,12.8,13,13.4,13.6],"choices":[0.4,13,2,1.4],"correct":0},{"title":"Daily attendance","context":"The table shows the number of people attending ten fitness classes.","unit":"people","values":[6,9,12,15,18,6,9,12,15,18],"choices":[36,6,3.6,12],"correct":2}];
const STEPS=["Mean of the data","Differences from the mean","Absolute values of differences","Mean absolute deviation"];
const sum=values=>values.reduce((total,value)=>total+value,0);
const fmt=value=>String(Number(value.toFixed(8))).replace(/-/g,"−");
const esc=value=>String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
function statistics(values){
 const mean=sum(values)/values.length;
 const differences=values.map(value=>value-mean);
 const absolute=differences.map(Math.abs);
 return {mean,differences,absolute,total:sum(absolute),mad:sum(absolute)/values.length};
}
function parse(value){
 const s=String(value).trim().replace(/[−–]/g,"-");
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return Number(s);
 const m=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/);
 return m&&Number(m[2])!==0?Number(m[1])/Number(m[2]):NaN;
}
function reset(data,index){Object.assign(data,{index,step:0,inputs:[],selected:null,verified:false,answered:false});}
function field(index,data,label){
 return '<input type="text" '+(data.step===1?'':'inputmode="decimal" ')+'autocomplete="off" id="m811Input'+index+'" data-m811-input="'+index+'" aria-label="'+esc(label)+'" value="'+esc(data.inputs[index]||'')+'" '+(data.verified?'disabled':'')+'>';
}
function dataTable(task){
 return '<div class="m811-table-wrap"><table><caption>Data ('+task.unit+')</caption><tbody><tr>'+task.values.map((value,i)=>'<td><span>Observation '+(i+1)+'</span><strong>'+fmt(value)+'</strong></td>').join("")+'</tr></tbody></table></div>';
}
function workingTable(task,data,result){
 return '<div class="m811-table-wrap"><table class="m811-work"><caption>Your work · '+task.unit+'</caption><thead><tr><th scope="col">Data value</th><th scope="col">Data value − mean</th>'+(data.step>=2?'<th scope="col">Absolute value of the difference</th>':'')+'</tr></thead><tbody>'+task.values.map((value,i)=>'<tr><th scope="row">'+fmt(value)+'</th><td>'+fmt(value)+' − '+fmt(result.mean)+' = '+(data.step===1?field(i,data,'Difference for observation '+(i+1)+': '+fmt(value)+' minus '+fmt(result.mean)): '<strong>'+fmt(result.differences[i])+'</strong>')+'</td>'+(data.step>=2?'<td>|'+fmt(result.differences[i])+'| = '+(data.step===2?field(i,data,'Absolute value for observation '+(i+1)+': '+fmt(result.differences[i])):'<strong>'+fmt(result.absolute[i])+'</strong>')+'</td>':'')+'</tr>').join("")+'</tbody></table></div>';
}
function explanation(task,result){
 return '<div class="m811-explanation"><h5>Check the reasoning</h5><p>Mean of the data: ('+task.values.map(fmt).join(' + ')+') ÷ '+task.values.length+' = <strong>'+fmt(result.mean)+'</strong>.</p><p>Absolute differences: '+result.absolute.map(fmt).join(', ')+'. Their sum is <strong>'+fmt(result.total)+'</strong>.</p><p>Mean absolute deviation: '+fmt(result.total)+' ÷ '+task.values.length+' = <strong>'+fmt(result.mad)+' '+task.unit+'</strong>.</p><p>The data values are an average distance of '+fmt(result.mad)+' '+task.unit+' from the mean of '+fmt(result.mean)+' '+task.unit+'.</p></div>';
}
window.MAD_811B_TOTAL=QUESTIONS.length;
window.reset811BQuestion=reset;
window.render811BLab=function(ctx){
 const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
 const data=labRuntime.data||(labRuntime.data={index:0,step:0,inputs:[],selected:null,verified:false,answered:false});
 const task=QUESTIONS[data.index],result=statistics(task.values),guided=data.index<5;
 const body=$("#standardsLabBody"),rerender=()=>window.render811BLab(ctx);
 setLabProgress(data.index+(data.answered?1:0),QUESTIONS.length,guided?'Question '+(data.index+1)+': step '+(data.step+1)+' of 4.':'Find the mean absolute deviation, then choose one answer.');
 let content="";
 if(guided){
  const stepper='<ol class="m811-steps" aria-label="Four calculation steps">'+STEPS.map((step,i)=>'<li class="'+(i===data.step?'active':i<data.step?'done':'')+'" '+(i===data.step?'aria-current="step"':'')+'><b>'+(i<data.step?'✓':i+1)+'</b><span>'+step+'</span></li>').join("")+'</ol>';
  let instruction="",work="";
  if(data.step===0){instruction="Add all the data values, then divide by the number of values.";work='<div class="m811-rule">Mean of the data = sum of all data values ÷ number of data values</div><label class="m811-single" for="m811Input0">Mean of the data '+field(0,data,"Mean of the data")+'<span>'+task.unit+'</span></label>';}
  if(data.step===1){instruction="Subtract the verified mean from each data value. Keep the sign of every difference: data value − mean.";work='<p class="m811-verified">✓ Mean of the data: <strong>'+fmt(result.mean)+' '+task.unit+'</strong></p>'+workingTable(task,data,result);}
  if(data.step===2){instruction="Enter the absolute value of each difference. This gives its distance from the mean; distances are zero or positive.";work='<p class="m811-verified">✓ Mean of the data: <strong>'+fmt(result.mean)+' '+task.unit+'</strong> · Differences verified</p>'+workingTable(task,data,result);}
  if(data.step===3){instruction="Add the absolute values, then divide by the original number of data values.";work='<p class="m811-verified">✓ Mean, differences, and absolute values verified</p>'+workingTable(task,data,result)+'<div class="m811-rule">Mean absolute deviation = sum of absolute differences ÷ number of data values</div><label class="m811-single" for="m811Input0">Mean absolute deviation '+field(0,data,"Mean absolute deviation")+'<span>'+task.unit+'</span></label>';}
  content=stepper+'<form id="m811Form" novalidate><h5>Step '+(data.step+1)+': '+STEPS[data.step]+'</h5><p>'+instruction+'</p>'+work+'<div class="m811-actions"><button class="lab-action" type="submit" '+(data.verified?'disabled':'')+'>Check '+(data.step===1?'differences':data.step===2?'absolute values':'answer')+'</button>'+(data.verified&&!data.answered?'<button class="lab-next" type="button" id="m811Step">Next step →</button>':'')+'</div></form>';
 }else{
  content='<h5>What is the mean absolute deviation of these data?</h5><div class="m811-choices">'+task.choices.map((value,i)=>'<button type="button" data-m811-choice="'+i+'" class="m811-choice'+(data.selected===i?' selected':'')+'" '+(data.answered?'disabled':'')+'><b>'+String.fromCharCode(65+i)+'</b><span>'+fmt(value)+' '+task.unit+'</span></button>').join("")+'</div><button class="lab-action" type="button" id="m811Check" '+(data.answered?'disabled':'')+'>Check answer</button>';
 }
 body.innerHTML='<section class="m811-lab"><header><p>8.11B · QUESTION '+(data.index+1)+' OF 10 · '+(guided?'GUIDED PRACTICE':'INDEPENDENT PRACTICE')+'</p><h4>'+task.title+'</h4></header><p>'+task.context+'</p>'+dataTable(task)+content+(data.answered?explanation(task,result)+'<button type="button" class="lab-next" id="m811Next">'+(data.index===9?'Finish lab':'Next question →')+'</button>':'')+'</section>';
 if(guided){
  body.querySelectorAll("[data-m811-input]").forEach(input=>input.addEventListener("input",()=>{data.inputs[Number(input.dataset.m811Input)]=input.value;input.removeAttribute("aria-invalid");setLabFeedback("");}));
  $("#m811Form").addEventListener("submit",event=>{
   event.preventDefault();if(data.verified)return;
   const expected=data.step===0?[result.mean]:data.step===1?result.differences:data.step===2?result.absolute:[result.mad];
   const entries=expected.map((_,i)=>$("#m811Input"+i).value);
   data.inputs=entries;
   const invalid=expected.map((value,i)=>!Number.isFinite(parse(entries[i]))||Math.abs(parse(entries[i])-value)>1e-7);
   if(invalid.some(Boolean)){
    invalid.forEach((wrong,i)=>{if(wrong)$("#m811Input"+i).setAttribute("aria-invalid","true");});
    const blanks=entries.some(value=>String(value).trim()==="");
    const hint=data.step===0?"Add every value, including repeats, and divide by "+task.values.length+".":data.step===1?"Use data value − "+fmt(result.mean)+". Values below the mean have negative differences; values above it have positive differences.":data.step===2?"Absolute value is distance from zero. Keep the magnitude of each difference and make negative differences positive. Zero stays zero.":"Average all "+task.values.length+" absolute differences, including zeros. Divide their sum by "+task.values.length+", rather than finding their range.";
    setLabFeedback(blanks?"Fill in every answer before checking.":hint,"incorrect");
    $("#m811Input"+invalid.indexOf(true)).focus();return;
   }
   data.verified=true;
   if(data.step===3)data.answered=true;
   rerender();setLabFeedback(data.answered?"Correct. The values are an average distance of "+fmt(result.mad)+" "+task.unit+" from the mean.":"Correct. Your "+STEPS[data.step].toLowerCase()+" "+(expected.length===1?"is":"are")+" verified. Continue to the next step.","correct");
  });
  const nextStep=$("#m811Step");
  if(nextStep)nextStep.addEventListener("click",()=>{if(!data.verified||data.step>=3)return;data.step++;data.inputs=[];data.verified=false;setLabFeedback("");rerender();});
 }else{
  body.querySelectorAll("[data-m811-choice]").forEach(button=>button.addEventListener("click",()=>{if(data.answered)return;data.selected=Number(button.dataset.m811Choice);setLabFeedback("");rerender();}));
  $("#m811Check").addEventListener("click",()=>{
   if(data.answered)return;
   if(data.selected===null)return setLabFeedback("Choose one answer first.","incorrect");
   if(data.selected!==task.correct)return setLabFeedback("Recheck your calculation. Find each distance from the mean and average those distances, including any zeros.","incorrect");
   data.answered=true;rerender();setLabFeedback("Correct. The mean absolute deviation is "+fmt(result.mad)+" "+task.unit+".","correct");
  });
 }
 const next=$("#m811Next");
 if(next)next.addEventListener("click",()=>{if(!data.answered)return;if(data.index===9)return showLabCompletion("8.11B");reset(data,data.index+1);setLabFeedback("");rerender();syncWhiteboardQuestion();});
};
})();