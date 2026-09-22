(function distance87DLabModule() {
  const TASKS = [
    { title:"Coordinate distance 1", unitX:1, unitY:2, A:{gx:-4,gy:-2}, B:{gx:2,gy:2} },
    { title:"Coordinate distance 2", unitX:2, unitY:1, A:{gx:-3,gy:3}, B:{gx:1,gy:-3} },
    { title:"Coordinate distance 3", unitX:0.5, unitY:2, A:{gx:-4,gy:-2}, B:{gx:2,gy:2} },
    { title:"Coordinate distance 4", unitX:5, unitY:2, A:{gx:-2,gy:3}, B:{gx:2,gy:-2} },
    { title:"Coordinate distance 5", unitX:2, unitY:5, A:{gx:-4,gy:1}, B:{gx:2,gy:-1} },
    { title:"Coordinate distance 6", unitX:10, unitY:5, A:{gx:-2,gy:-2}, B:{gx:2,gy:2} },
    { title:"Coordinate distance 7", unitX:0.5, unitY:1.5, A:{gx:-4,gy:2}, B:{gx:4,gy:-2} }
  ].map(task => {
    const A = { x: task.A.gx * task.unitX, y: task.A.gy * task.unitY };
    const B = { x: task.B.gx * task.unitX, y: task.B.gy * task.unitY };
    const dx = Math.abs(B.x - A.x);
    const dy = Math.abs(B.y - A.y);
    return { ...task, A:{...task.A,...A}, B:{...task.B,...B}, dx, dy, answer:Math.sqrt(dx*dx+dy*dy) };
  });

  window.DISTANCE_87D_TOTAL = TASKS.length;

  function freshState(index=0){ return { index, step:0, solved:false, inputs:{} }; }
  window.resetDistance87DQuestion = function(data,index){ Object.assign(data,freshState(index)); };

  function esc(v){ return String(v??"").replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch])); }
  function round2(v){ return Math.round((Number(v)+Number.EPSILON)*100)/100; }
  function fmt(v){ const n=Math.round((Number(v)+Number.EPSILON)*1000)/1000; return Number.isInteger(n)?String(n):String(n); }
  function cleanZero(v){ return Math.abs(v)<1e-9?0:v; }
  function parseNum(v){ const m=String(v??"").replace(/,/g,"").match(/-?\d+(?:\.\d+)?/); return m?Number(m[0]):NaN; }
  function near(v,expected,tol=.001){ const n=parseNum(v); return Number.isFinite(n)&&Math.abs(n-expected)<=tol; }

  function answerStatus(v,expected){
    const raw=String(v??"").trim();
    if(!raw) return {ok:false,type:"missing"};
    const m=raw.replace(/,/g,"").match(/-?\d+(?:\.(\d+))?/);
    if(!m) return {ok:false,type:"missing"};
    const n=Number(m[0]), target=round2(expected), decimals=m[1]||"";
    if(Math.abs(n-target)>.005) return {ok:false,type:"math",target};
    if(!Number.isInteger(target)&&decimals.length!==2) return {ok:false,type:"place",target};
    if(Number.isInteger(target)&&decimals.length>2) return {ok:false,type:"place",target};
    return {ok:true,target};
  }

  function graphMarkup(task,revealTriangle){
    const W=700,H=640,ox=350,oy=315,step=50,min=-5,max=5;
    const grid=[],labels=[];
    for(let i=min;i<=max;i++){
      const x=ox+i*step,y=oy-i*step;
      grid.push(`<line x1="${x}" y1="${oy+min*step}" x2="${x}" y2="${oy-max*step}" class="d87-grid"/>`);
      grid.push(`<line x1="${ox+min*step}" y1="${y}" x2="${ox+max*step}" y2="${y}" class="d87-grid"/>`);
      if(i!==0){
        labels.push(`<text x="${x}" y="${oy+25}" text-anchor="middle" class="d87-tick">${fmt(cleanZero(i*task.unitX))}</text>`);
        labels.push(`<text x="${ox-16}" y="${y+5}" text-anchor="end" class="d87-tick">${fmt(cleanZero(i*task.unitY))}</text>`);
      }
    }
    const Ax=ox+task.A.gx*step, Ay=oy-task.A.gy*step;
    const Bx=ox+task.B.gx*step, By=oy-task.B.gy*step;
    const cornerX=Bx, cornerY=Ay;
    const triangle=revealTriangle?`
      <line x1="${Ax}" y1="${Ay}" x2="${cornerX}" y2="${cornerY}" class="d87-change"/>
      <line x1="${cornerX}" y1="${cornerY}" x2="${Bx}" y2="${By}" class="d87-change"/>
      <path d="M${cornerX-16} ${cornerY} V${cornerY-16} H${cornerX}" class="d87-right"/>
    `:"";

    return `<svg class="d87-plane" viewBox="0 0 ${W} ${H}" role="img" aria-label="Coordinate plane with point A and point B. The x-axis and y-axis use different numerical scales.">
      <rect x="0" y="0" width="${W}" height="${H}" rx="22" class="d87-plane-bg"/>
      ${grid.join("")}
      <line x1="${ox+min*step-14}" y1="${oy}" x2="${ox+max*step+18}" y2="${oy}" class="d87-axis"/>
      <line x1="${ox}" y1="${oy-min*step+14}" x2="${ox}" y2="${oy-max*step-18}" class="d87-axis"/>
      <path d="M${ox+max*step+18} ${oy} l-12 -7 v14 z" class="d87-arrow"/>
      <path d="M${ox} ${oy-max*step-18} l-7 12 h14 z" class="d87-arrow"/>
      <text x="${ox+max*step+32}" y="${oy+6}" class="d87-axis-name">x</text>
      <text x="${ox+10}" y="${oy-max*step-28}" class="d87-axis-name">y</text>
      <text x="${ox-12}" y="${oy+22}" class="d87-tick">0</text>
      ${labels.join("")}
      <line x1="${Ax}" y1="${Ay}" x2="${Bx}" y2="${By}" class="d87-distance-segment"/>
      ${triangle}
      <circle cx="${Ax}" cy="${Ay}" r="10" class="d87-point point-a"/>
      <circle cx="${Bx}" cy="${By}" r="10" class="d87-point point-b"/>
      <text x="${Ax-18}" y="${Ay-16}" class="d87-point-label">A</text>
      <text x="${Bx+14}" y="${By-16}" class="d87-point-label">B</text>
      <g class="d87-scale-note">
        <rect x="466" y="566" width="195" height="48" rx="14"/>
        <text x="563" y="587" text-anchor="middle">Read each axis carefully.</text>
        <text x="563" y="605" text-anchor="middle">The scales are different.</text>
      </g>
    </svg>`;
  }

  function markup(task,data,q){
    let stages=`<section class="d87-card">
      <h5>Step 1 · Read both ordered pairs from the graph</h5>
      <p>Do not count grid spaces as values. Read the number labels on the <strong>x-axis</strong> and <strong>y-axis</strong> because the axes do not count by the same amount.</p>
      <div class="d87-coordinate-row">
        <label><span>A = (</span><input data-d87-input="ax" value="${esc(data.inputs.ax||"")}" placeholder="x"><span>,</span><input data-d87-input="ay" value="${esc(data.inputs.ay||"")}" placeholder="y"><span>)</span></label>
        <label><span>B = (</span><input data-d87-input="bx" value="${esc(data.inputs.bx||"")}" placeholder="x"><span>,</span><input data-d87-input="by" value="${esc(data.inputs.by||"")}" placeholder="y"><span>)</span></label>
      </div>
      <button type="button" class="lab-action" id="checkCoords87D">Check coordinates</button>
    </section>`;

    if(data.step>=1){
      stages+=`<section class="d87-card">
        <h5>Step 2 · Find the horizontal and vertical distances</h5>
        <p>The dashed right triangle shows why distance on the coordinate plane connects to the Pythagorean Theorem.</p>
        <div class="d87-change-grid">
          <label><span>|x₂ − x₁| =</span><input data-d87-input="dx" value="${esc(data.inputs.dx||"")}" placeholder="horizontal distance"></label>
          <label><span>|y₂ − y₁| =</span><input data-d87-input="dy" value="${esc(data.inputs.dy||"")}" placeholder="vertical distance"></label>
        </div>
        <button type="button" class="lab-action" id="checkChanges87D">Check changes</button>
      </section>`;
    }

    if(data.step>=2){
      stages+=`<section class="d87-card d87-final-card">
        <h5>Step 3 · Substitute and calculate the distance</h5>
        <div class="d87-formula">d = √[(x₂ − x₁)² + (y₂ − y₁)²]</div>
        <div class="d87-substitution">
          <span>d = √[(</span><input data-d87-input="subDx" value="${esc(data.inputs.subDx||"")}" placeholder="Δx"><span>)² + (</span><input data-d87-input="subDy" value="${esc(data.inputs.subDy||"")}" placeholder="Δy"><span>)²]</span>
        </div>
        <label class="d87-answer"><span>Distance =</span><input data-d87-input="answer" value="${esc(data.inputs.answer||"")}" placeholder="final answer"><strong>units</strong></label>
        <p>If the distance is not a whole number, round to the <strong>nearest hundredth</strong>. Whole-number answers do not need .00.</p>
        <button type="button" class="lab-action" id="checkAnswer87D">Check distance</button>
      </section>`;
    }

    return `<section class="d87-shell">
      <header class="d87-head">
        <div>
          <p class="lab-mini-title">Question ${q} of ${TASKS.length} · Distance on the Coordinate Plane</p>
          <h4>${esc(task.title)}</h4>
          <p>Find the distance between points A and B. The x- and y-axes intentionally use different scales.</p>
        </div>
        <div class="d87-formula-chip">d = √[(x₂−x₁)²+(y₂−y₁)²]</div>
      </header>
      <section class="d87-graph-card">${graphMarkup(task,data.step>=1)}</section>
      ${stages}
      <div class="d87-actions"><button type="button" class="lab-action" id="next87D"${data.solved?"":" hidden"}>${q===TASKS.length?"Finish lab":"Next question"}</button></div>
    </section>`;
  }

  function bindInputs(body,data){
    body.querySelectorAll("[data-d87-input]").forEach(input=>{
      input.addEventListener("input",()=>{ data.inputs[input.dataset.d87Input]=input.value; });
    });
  }

  function finish(data,ctx,task){
    data.solved=true;
    const final=round2(task.answer);
    ctx.setLabFeedback(`Correct. The distance between A and B is ${Number.isInteger(final)?final:final.toFixed(2)} units.`,"correct");
    ctx.setLabProgress(data.index+1,TASKS.length,`Question ${data.index+1} complete.`);
    const next=document.querySelector("#next87D");
    if(next) next.hidden=false;
  }

  function coordinateFeedback(task,data){
    const fields=[
      ["ax",task.A.x,task.A.gx,"A's x-coordinate","x"],
      ["ay",task.A.y,task.A.gy,"A's y-coordinate","y"],
      ["bx",task.B.x,task.B.gx,"B's x-coordinate","x"],
      ["by",task.B.y,task.B.gy,"B's y-coordinate","y"]
    ];
    for(const [key,expected,gridValue,label,axis] of fields){
      const entered=parseNum(data.inputs[key]);
      if(!Number.isFinite(entered)) return `Enter ${label}.`;
      if(Math.abs(entered-expected)>.001){
        if(Math.abs(entered-gridValue)<.001 && Math.abs(expected-gridValue)>.001){
          const rate=axis==="x"?task.unitX:task.unitY;
          return `${label} looks like you counted grid spaces instead of reading the axis labels. On this graph, each ${axis}-axis interval changes by ${fmt(rate)}.`;
        }
        return `Recheck ${label}. Trace the point straight to the ${axis}-axis and read that axis's scale.`;
      }
    }
    return "";
  }

  window.renderDistance87DLab=function(ctx){
    const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
    if(!labRuntime.data) labRuntime.data=freshState(0);
    const data=labRuntime.data,task=TASKS[data.index];
    if(!task) return showLabCompletion("8.7D");

    setLabProgress(data.index+(data.solved?1:0),TASKS.length,`Question ${data.index+1} of 7: read the unequal axis scales, identify both points, then calculate their distance.`);
    const body=$("#standardsLabBody");
    body.innerHTML=markup(task,data,data.index+1);
    bindInputs(body,data);

    body.querySelector("#checkCoords87D")?.addEventListener("click",()=>{
      const error=coordinateFeedback(task,data);
      if(error) return setLabFeedback(error,"incorrect");
      data.step=1;
      setLabFeedback(`Correct. A = (${fmt(task.A.x)}, ${fmt(task.A.y)}) and B = (${fmt(task.B.x)}, ${fmt(task.B.y)}). Now find the horizontal and vertical distances.`,"correct");
      window.renderDistance87DLab(ctx);
    });

    body.querySelector("#checkChanges87D")?.addEventListener("click",()=>{
      if(!near(data.inputs.dx,task.dx)) return setLabFeedback(`The horizontal distance is not correct. Use the actual x-values from the graph: |${fmt(task.B.x)} − (${fmt(task.A.x)})|.`,"incorrect");
      if(!near(data.inputs.dy,task.dy)) return setLabFeedback(`The vertical distance is not correct. Use the actual y-values from the graph: |${fmt(task.B.y)} − (${fmt(task.A.y)})|.`,"incorrect");
      data.step=2;
      setLabFeedback("Correct. Those horizontal and vertical distances are the two legs of a right triangle. Substitute them into the distance formula.","correct");
      window.renderDistance87DLab(ctx);
    });

    body.querySelector("#checkAnswer87D")?.addEventListener("click",()=>{
      const subDx=parseNum(data.inputs.subDx),subDy=parseNum(data.inputs.subDy);
      const substitutionOK=(Math.abs(subDx-task.dx)<.001&&Math.abs(subDy-task.dy)<.001)||(Math.abs(subDx-task.dy)<.001&&Math.abs(subDy-task.dx)<.001);
      if(!substitutionOK) return setLabFeedback(`The substitution is not correct. Use the horizontal and vertical distances you already found: ${fmt(task.dx)} and ${fmt(task.dy)}.`,"incorrect");
      const status=answerStatus(data.inputs.answer,task.answer);
      if(status.type==="missing") return setLabFeedback("Enter the final distance.","incorrect");
      if(status.type==="place") return setLabFeedback(`Your value is correct, but this non-whole answer must be written to the nearest hundredth: ${status.target.toFixed(2)}.`,"incorrect");
      if(status.type==="math") return setLabFeedback(`Your substitution is correct, but the final calculation is not. Evaluate √(${fmt(task.dx)}² + ${fmt(task.dy)}²), then round only the final result.`,"incorrect");
      finish(data,ctx,task);
    });

    body.querySelector("#next87D")?.addEventListener("click",()=>{
      if(!data.solved) return;
      if(data.index>=TASKS.length-1) return showLabCompletion("8.7D");
      Object.assign(data,freshState(data.index+1));
      window.renderDistance87DLab(ctx);
      setLabFeedback("Next coordinate-plane question ready.");
      syncWhiteboardQuestion();
    });
  };
})();