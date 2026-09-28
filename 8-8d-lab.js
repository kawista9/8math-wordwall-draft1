(() => {
  const TASKS = [
    {type:"exterior",title:"Find the exterior angle", a:48,b:67,e:115,ask:"e"},
    {type:"exterior",title:"Find a remote interior angle",a:42,b:77,e:119,ask:"b"},
    {type:"exterior",title:"Find the other remote angle",a:74,b:53,e:127,ask:"a"},
    {type:"expressions",title:"Exterior angle expressions",a:"2x + 15",b:"x + 20",e:"4x + 5",x:30,values:[75,50,125]},
    {type:"expressions",title:"Another exterior angle",a:"3x + 8",b:"2x + 12",e:"6x − 5",x:25,values:[83,62,145]},
    {type:"expressions",title:"Solve every marked angle",a:"4x − 6",b:"x + 18",e:"6x − 8",x:20,values:[74,38,112]},
    {type:"similar",title:"Compare two triangles",first:[45,65,70],second:[65,70,45],similar:true},
    {type:"similar",title:"Check the third angles",first:[38,72,70],second:[38,68,74],similar:false},
    {type:"similar",title:"Are the triangles similar?",first:[52,48,80],second:[48,80,52],similar:true},
    {type:"matching",title:"Match the angle pairs",rows:[
      {pair:[3,5],name:"Same-side interior",rule:"Supplementary"},
      {pair:[2,8],name:"Same-side exterior",rule:"Supplementary"},
      {pair:[3,6],name:"Alternate interior",rule:"Congruent"},
      {pair:[1,8],name:"Alternate exterior",rule:"Congruent"}
    ]},
    {type:"corresponding",title:"Find corresponding pairs"},
    {type:"vocabulary",title:"Name the angle relationships"},
    {type:"transversal",title:"Same-side interior angles",given:[[4,"3x + 10"],[6,"5x + 10"]],x:20,base:70,relation:"supplementary"},
    {type:"transversal",title:"Alternate interior angles",given:[[3,"2x + 15"],[6,"3x − 5"]],x:20,base:125,relation:"congruent"},
    {type:"transversal",title:"Corresponding angles",given:[[1,"4x + 6"],[5,"6x − 24"]],x:15,base:66,relation:"congruent"},
    {type:"transversal",title:"Alternate exterior angles",given:[[2,"7x − 10"],[7,"3x + 30"]],x:10,base:120,relation:"congruent"},
    {type:"transversal",title:"Same-side interior again",given:[[3,"5x + 15"],[5,"3x + 5"]],x:20,base:65,relation:"supplementary"}
  ];
  const NAMES=["Same-side interior","Same-side exterior","Alternate interior","Alternate exterior"];
  const VOCAB=[
    {text:"∠1 and ∠4 are opposite at one intersection.",answer:"Vertical angles"},
    {text:"∠1 and ∠2 form one straight angle.",answer:"Straight angle"},
    {text:"∠3 and ∠5 have measures that add to 180°.",answer:"Supplementary"},
    {text:"∠2 and ∠6 have equal measures.",answer:"Congruent"}
  ];
  const escapeHTML=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const initial=index=>({index,selected:[],phase:0,inputs:{},attempted:false,solved:false});
  window.ANGLES_88D_TOTAL=TASKS.length;
  window.reset88DQuestion=(data,index)=>Object.assign(data,initial(index));
  const num=v=>Number(String(v??"").trim().replace(/°/g,""));
  const input=(key,label,unit)=>'<label class="d88-input"><span>'+escapeHTML(label)+'</span><div><input type="text" inputmode="decimal" data-d88-input="'+key+'" aria-label="'+escapeHTML(label)+'" autocomplete="off"><span>'+escapeHTML(unit||"")+'</span></div></label>';
  const triangle=(t,clickable)=>{
    const labels=[t.a,t.b,t.e].map((v,i)=>i===({a:0,b:1,e:2}[t.ask])?"?":v);
    const keys=["a","b","e"],titles=["Remote angle A","Remote angle B","Exterior angle E"];
    return '<div class="d88-triangle" role="group" aria-label="Triangle ABC with exterior angle E"><svg viewBox="0 0 360 260" role="img" aria-label="Triangle with the base extended at C"><path d="M 140 25 L 55 210 L 245 210 L 140 25 M 245 210 L 330 210"/></svg>'+
      keys.map((key,i)=>'<button type="button" class="d88-angle d88-angle-'+key+'" data-d88-angle="'+key+'" '+(clickable?'':'disabled')+' aria-pressed="false"><small>'+titles[i]+'</small><strong>'+escapeHTML(labels[i])+'°</strong></button>').join("")+'</div>';
  };
  const twoTriangles=t=>'<div class="d88-similar-figures">'+[t.first,t.second].map((angles,g)=>
    '<div class="d88-sim-triangle"><strong>Triangle '+(g+1)+'</strong><svg viewBox="0 0 220 160" aria-hidden="true"><path d="M 110 10 L 20 145 L 200 145 Z"/></svg><span class="top">'+angles[0]+'°</span><span class="left">'+angles[1]+'°</span><span class="right">'+"?"+'</span></div>').join("")+'</div>';
  const transversal=(highlight=[])=>{
    const places=[[105,48],[185,48],[105,113],[185,113],[175,155],[255,155],[175,207],[255,207]];
    return '<div class="d88-lines" role="img" aria-label="Two parallel lines cut by a transversal, with angles 1 through 8"><svg viewBox="0 0 330 225" aria-hidden="true"><path d="M 25 85 L 305 85 M 25 190 L 305 190 M 105 10 L 235 220"/><path class="d88-parallel-mark" d="M 48 77 L 57 85 L 48 93 M 48 182 L 57 190 L 48 198"/></svg>'+places.map((p,i)=>'<span class="d88-number'+(highlight.includes(i+1)?' active':'')+'" style="left:'+(p[0]/330*100)+'%;top:'+(p[1]/225*100)+'%">'+(i+1)+'</span>').join("")+'</div>';
  };
  const choose=(key,options)=>'<select data-d88-input="'+key+'" aria-label="'+escapeHTML(key)+'"><option value="">Choose</option>'+options.map(o=>'<option>'+escapeHTML(o)+'</option>').join("")+'</select>';
  const renderTask=(t,d)=>{
    if(t.type==="exterior")return '<div class="d88-grid"><section class="d88-card"><h5>Choose the remote interior angles</h5><p>Click the two angles inside the triangle that are not next to the exterior angle.</p>'+triangle(t,true)+'</section><section class="d88-card"><h5>Work with the exterior angle</h5><p class="d88-rule">The exterior angle equals the sum of the two remote interior angles.</p><p>Selected: <strong data-d88-selected>none</strong></p>'+(!d.phase?'<button type="button" class="lab-action" data-d88-check-remote>Check angles</button>':'<div class="d88-fields">'+input("answer",t.ask==="e"?"Exterior angle E":"Remote interior angle "+t.ask.toUpperCase(),"°")+'</div><button type="button" class="lab-action" data-d88-check>Check answer</button>')+'</section></div>';
    if(t.type==="expressions")return '<div class="d88-grid"><section class="d88-card"><h5>Read the diagram</h5><p>The exterior angle equals the sum of its two remote interior angles.</p>'+triangle(t,false)+'</section><section class="d88-card"><h5>Solve for x and each angle</h5><p>Angle A: '+escapeHTML(t.a)+' · Angle B: '+escapeHTML(t.b)+' · Exterior E: '+escapeHTML(t.e)+'</p><div class="d88-fields">'+input("x","x","")+input("a","Angle A","°")+input("b","Angle B","°")+input("e","Exterior angle E","°")+'</div><button type="button" class="lab-action" data-d88-check>Check values</button></section></div>';
    if(t.type==="similar")return '<div class="d88-grid"><section class="d88-card"><h5>Compare the triangles</h5><p>Use the angle sum of a triangle to find the missing angle in Triangle 1.</p>'+twoTriangles(t)+'</section><section class="d88-card"><h5>Find and compare</h5><div class="d88-fields">'+input("third","Triangle 1: third angle","°")+'</div><fieldset class="d88-yesno"><legend>Are these triangles similar?</legend><label><input type="radio" name="d88-similar" value="yes"> Yes</label><label><input type="radio" name="d88-similar" value="no"> No</label></fieldset><button type="button" class="lab-action" data-d88-check>Check answer</button></section></div>';
    if(t.type==="matching")return '<div class="d88-card"><h5>Match each highlighted pair</h5><p>For each diagram, choose the pair name and whether the angles are congruent or supplementary.</p><div class="d88-match-grid">'+t.rows.map((r,i)=>'<div class="d88-match-row">'+transversal(r.pair)+'<div><strong>∠'+r.pair[0]+' and ∠'+r.pair[1]+'</strong>'+choose("name"+i,NAMES)+'<div class="d88-choice-buttons" data-d88-rule="'+i+'"><button type="button" data-value="Congruent">Congruent</button><button type="button" data-value="Supplementary">Supplementary</button></div></div></div>').join("")+'</div><button type="button" class="lab-action" data-d88-check>Check matches</button></div>';
    if(t.type==="corresponding")return '<div class="d88-grid"><section class="d88-card"><h5>Corresponding angles</h5><p>Angles in the same relative position at the two intersections are corresponding.</p>'+transversal()+'</section><section class="d88-card"><h5>Select all four pairs</h5><div class="d88-pair-options">'+[[1,5],[1,6],[2,6],[2,7],[3,7],[3,6],[4,8],[4,5]].map(p=>'<button type="button" data-d88-pair="'+p.join("-")+'" aria-pressed="false">∠'+p[0]+' and ∠'+p[1]+'</button>').join("")+'</div><button type="button" class="lab-action" data-d88-check>Check pairs</button></section></div>';
    if(t.type==="vocabulary")return '<div class="d88-grid"><section class="d88-card"><h5>Use the numbered diagram</h5>'+transversal()+'</section><section class="d88-card"><h5>Match each description</h5>'+VOCAB.map((v,i)=>'<label class="d88-vocab"><span>'+escapeHTML(v.text)+'</span>'+choose("v"+i,["Vertical angles","Straight angle","Supplementary","Congruent"])+'</label>').join("")+'<button type="button" class="lab-action" data-d88-check>Check relationships</button></section></div>';
    const values=[t.base,180-t.base,180-t.base,t.base,t.base,180-t.base,180-t.base,t.base];
    return '<div class="d88-grid"><section class="d88-card"><h5>Parallel lines and transversal</h5>'+transversal(t.given.map(g=>g[0]))+'<p class="d88-givens">'+t.given.map(g=>'m∠'+g[0]+' = '+escapeHTML(g[1])).join(' &nbsp; · &nbsp; ')+'</p><p>These angles are '+t.relation+'.</p></section><section class="d88-card"><h5>Solve for x</h5>'+input("x","x","")+(!d.phase?'<button type="button" class="lab-action" data-d88-check-x>Check x</button>':'<div><h5>Find all eight angle measures</h5><div class="d88-eight">'+values.map((v,i)=>input("angle"+(i+1),"∠"+(i+1),"°")).join("")+'</div><button type="button" class="lab-action" data-d88-check>Check all angles</button></div>')+'</section></div>';
  };
  window.render88DLab=function(ctx){
    const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
    if(!labRuntime.data)labRuntime.data=initial(0);
    const d=labRuntime.data,t=TASKS[d.index],body=$("#standardsLabBody");
    setLabProgress(d.index,TASKS.length,"Question "+(d.index+1)+" of "+TASKS.length+".");
    body.innerHTML='<div class="d88-lab"><header><span>8.8D · QUESTION '+(d.index+1)+' OF '+TASKS.length+'</span><h4>'+escapeHTML(t.title)+'</h4></header>'+renderTask(t,d)+(d.attempted?'<p class="d88-feedback" role="status">Check your selections and values, then try again.</p>':'')+(d.solved?'<div class="d88-success" role="status"><strong>Correct!</strong> '+(t.type==="transversal"?'All eight angles are accounted for.':'You used the angle relationship correctly.')+'</div><button type="button" class="lab-next" data-d88-next>'+(d.index===TASKS.length-1?"Finish lab":"Next question →")+'</button>':'')+'</div>';
    Object.entries(d.inputs).forEach(([key,value])=>{const field=body.querySelector('[data-d88-input="'+key+'"]');if(field)field.value=value;});
    if(d.inputs.similar)body.querySelector('input[name="d88-similar"][value="'+d.inputs.similar+'"]')?.click();
    body.querySelectorAll('[data-d88-pair]').forEach(button=>{const active=d.selected.includes(button.dataset.d88Pair);button.classList.toggle('active',active);button.setAttribute('aria-pressed',active);});
    body.querySelectorAll('[data-d88-rule]').forEach(row=>row.querySelectorAll('button').forEach(button=>button.classList.toggle('active',d.inputs['rule'+row.dataset.d88Rule]===button.dataset.value)));
    syncWhiteboardQuestion();
    const val=key=>body.querySelector('[data-d88-input="'+key+'"]')?.value;
    const attempt=(okay,message)=>{
      d.attempted=!okay;d.solved=okay;
      if(okay){window.render88DLab(ctx);setLabFeedback(message||"Correct!","correct");}
      else {body.querySelector(".d88-feedback")?.remove();body.querySelector(".d88-lab").insertAdjacentHTML("beforeend",'<p class="d88-feedback" role="status">'+escapeHTML(message||"Check your work and try again.")+'</p>');setLabFeedback(message||"Check your work and try again.","incorrect");}
    };
    body.querySelectorAll("[data-d88-angle]").forEach(button=>button.addEventListener("click",()=>{
      const key=button.dataset.d88Angle;
      d.selected=d.selected.includes(key)?d.selected.filter(x=>x!==key):[...d.selected,key];
      button.classList.toggle("active",d.selected.includes(key));button.setAttribute("aria-pressed",d.selected.includes(key));
      body.querySelector("[data-d88-selected]").textContent=d.selected.map(x=>"∠"+x.toUpperCase()).join(" and ")||"none";
    }));
    body.querySelector("[data-d88-check-remote]")?.addEventListener("click",()=>{
      if(d.selected.length!==2||!d.selected.includes("a")||!d.selected.includes("b"))return attempt(false,"Choose the two interior angles away from the exterior angle.");
      d.phase=1;d.attempted=false;window.render88DLab(ctx);setLabFeedback("Correct remote interior angles. Now find the missing measure.","correct");
    });
    body.querySelectorAll("[data-d88-rule]").forEach(row=>row.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{
      row.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===button));
      d.inputs["rule"+row.dataset.d88Rule]=button.dataset.value;
    })));
    body.querySelectorAll("[data-d88-pair]").forEach(button=>button.addEventListener("click",()=>{
      const key=button.dataset.d88Pair;d.selected=d.selected.includes(key)?d.selected.filter(x=>x!==key):[...d.selected,key];
      button.classList.toggle("active",d.selected.includes(key));button.setAttribute("aria-pressed",d.selected.includes(key));
    }));
    body.querySelectorAll('input[name="d88-similar"]').forEach(field=>field.addEventListener("change",()=>{d.inputs.similar=field.value;}));
    body.querySelectorAll("[data-d88-input]").forEach(field=>field.addEventListener("input",()=>{d.inputs[field.dataset.d88Input]=field.value;}));
    body.querySelector("[data-d88-check-x]")?.addEventListener("click",()=>{
      if(num(val("x"))!==t.x)return attempt(false,"Use the marked angle relationship to solve for x.");
      d.phase=1;d.inputs.x=String(t.x);d.attempted=false;window.render88DLab(ctx);body.querySelector('[data-d88-input="x"]').value=t.x;setLabFeedback("Correct x. Now find all eight angles.","correct");
    });
    body.querySelector("[data-d88-check]")?.addEventListener("click",()=>{
      let okay=false,message="";
      if(t.type==="exterior"){okay=num(val("answer"))===t[t.ask];message="The exterior angle equals the sum of the two remote interior angles.";}
      if(t.type==="expressions"){okay=num(val("x"))===t.x&&["a","b","e"].every((k,i)=>num(val(k))===t.values[i]);message="Check x, then substitute it into all three angle expressions.";}
      if(t.type==="similar"){okay=num(val("third"))===t.first[2]&&body.querySelector('input[name="d88-similar"]:checked')?.value===(t.similar?"yes":"no");message="The first triangle has 180° total. Similar triangles have the same three angle measures.";}
      if(t.type==="matching"){okay=t.rows.every((r,i)=>val("name"+i)===r.name&&d.inputs["rule"+i]===r.rule);message="Same-side pairs are supplementary; alternate pairs are congruent.";}
      if(t.type==="corresponding"){okay=d.selected.length===4&&["1-5","2-6","3-7","4-8"].every(x=>d.selected.includes(x));message="Corresponding angles occupy matching positions at each intersection.";}
      if(t.type==="vocabulary"){okay=VOCAB.every((r,i)=>val("v"+i)===r.answer);message="Look for opposite rays, angle sums, and equal measures.";}
      if(t.type==="transversal"){const values=[t.base,180-t.base,180-t.base,t.base,t.base,180-t.base,180-t.base,t.base];okay=num(val("x"))===t.x&&values.every((v,i)=>num(val("angle"+(i+1)))===v);message="Use vertical and corresponding angles for equal measures, then subtract from 180° for adjacent angles.";}
      attempt(okay,okay?"Correct!":message);
    });
    body.querySelector("[data-d88-next]")?.addEventListener("click",()=>{
      if(d.index===TASKS.length-1){setLabProgress(TASKS.length,TASKS.length,"All 17 questions complete.");showLabCompletion("8.8D");body.querySelector(".d88-lab").hidden=true;return;}
      window.reset88DQuestion(d,d.index+1);window.render88DLab(ctx);setLabFeedback("Read the next diagram.");
    });
  };
})();
