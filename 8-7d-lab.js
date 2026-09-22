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

  function graphMarkup(task){
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

    return `<svg class="d87-plane" viewBox="0 0 ${W} ${H}" role="img" aria-label="Coordinate plane with points A and B and horizontal and vertical legs forming a right triangle. The x-axis and y-axis use different numerical scales.">
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

      <!-- diagonal distance and the two legs students count -->
      <line x1="${Ax}" y1="${Ay}" x2="${Bx}" y2="${By}" class="d87-distance-segment"/>
      <line x1="${Ax}" y1="${Ay}" x2="${cornerX}" y2="${cornerY}" class="d87-leg d87-horizontal-leg"/>
      <line x1="${cornerX}" y1="${cornerY}" x2="${Bx}" y2="${By}" class="d87-leg d87-vertical-leg"/>
      <path d="M${cornerX-16} ${cornerY} V${cornerY-16} H${cornerX}" class="d87-right"/>

      <circle cx="${Ax}" cy="${Ay}" r="10" class="d87-point point-a"/>
      <circle cx="${Bx}" cy="${By}" r="10" class="d87-point point-b"/>
      <text x="${Ax-18}" y="${Ay-16}" class="d87-point-label">A</text>
      <text x="${Bx+14}" y="${By-16}" class="d87-point-label">B</text>

      <g class="d87-scale-note">
        <rect x="454" y="560" width="210" height="54" rx="14"/>
        <text x="559" y="582" text-anchor="middle">Count each leg using</text>
        <text x="559" y="601" text-anchor="middle">that axis's numbered scale.</text>
      </g>
    </svg>`;
  }


  function markup(task,data,q){
    let stages=`<section class="d87-card">
      <h5>Step 1 · Count the two legs on the coordinate grid</h5>
      <p>The pink horizontal and vertical segments are the two legs of a right triangle. Use the numbered scale on each axis to determine each leg's actual length. <strong>Do not use a distance formula.</strong></p>
      <div class="d87-change-grid">
        <label><span>Horizontal leg length</span><input data-d87-input="dx" value="${esc(data.inputs.dx||"")}" placeholder="count using x-axis scale"></label>
        <label><span>Vertical leg length</span><input data-d87-input="dy" value="${esc(data.inputs.dy||"")}" placeholder="count using y-axis scale"></label>
      </div>
      <button type="button" class="lab-action" id="checkLegs87D">Check leg lengths</button>
    </section>`;

    if(data.step>=1){
      stages+=`<section class="d87-card">
        <h5>Step 2 · Use the Pythagorean Theorem</h5>
        <p>The distance between A and B is the hypotenuse, <strong>c</strong>. Put the two leg lengths into <strong>a² + b² = c²</strong>. The order of a and b may be switched.</p>
        <div class="d87-formula">a² + b² = c²</div>
        <div class="d87-pythagorean-substitution">
          <span>(</span><input data-d87-input="legA" value="${esc(data.inputs.legA||"")}" placeholder="a"><span>)² + (</span>
          <input data-d87-input="legB" value="${esc(data.inputs.legB||"")}" placeholder="b"><span>)² = x²</span>
        </div>
        <button type="button" class="lab-action" id="checkPythagorean87D">Check substitution</button>
      </section>`;
    }

    if(data.step>=2){
      stages+=`<section class="d87-card d87-final-card">
        <h5>Step 3 · Solve for the hypotenuse</h5>
        <p>Square the two leg lengths, add them, then take the square root to find the distance between A and B.</p>
        <label class="d87-answer"><span>x =</span><input data-d87-input="answer" value="${esc(data.inputs.answer||"")}" placeholder="final distance"><strong>units</strong></label>
        <p>If the answer is not a whole number, round to the <strong>nearest hundredth</strong>. Whole-number answers do not need .00.</p>
        <button type="button" class="lab-action" id="checkAnswer87D">Check distance</button>
      </section>`;
    }

    return `<section class="d87-shell">
      <header class="d87-head">
        <div>
          <p class="lab-mini-title">Question ${q} of ${TASKS.length} · Distance on the Coordinate Plane</p>
          <h4>${esc(task.title)}</h4>
          <p>Count the horizontal and vertical leg lengths from the coordinate grid, then use the Pythagorean Theorem to find the distance between A and B. The x- and y-axes intentionally use different scales.</p>
        </div>
        <div class="d87-formula-chip">a² + b² = c²</div>
      </header>
      <section class="d87-graph-card">${graphMarkup(task)}</section>
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


  window.renderDistance87DLab=function(ctx){
    const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
    if(!labRuntime.data) labRuntime.data=freshState(0);
    const data=labRuntime.data,task=TASKS[data.index];
    if(!task) return showLabCompletion("8.7D");

    setLabProgress(
      data.index+(data.solved?1:0),
      TASKS.length,
      `Question ${data.index+1} of 7: count the horizontal and vertical legs using the axis scales, then use the Pythagorean Theorem.`
    );

    const body=$("#standardsLabBody");
    body.innerHTML=markup(task,data,data.index+1);
    bindInputs(body,data);

    body.querySelector("#checkLegs87D")?.addEventListener("click",()=>{
      const enteredX=parseNum(data.inputs.dx);
      const enteredY=parseNum(data.inputs.dy);

      if(!Number.isFinite(enteredX)) return setLabFeedback("Enter the horizontal leg length.","incorrect");
      if(!Number.isFinite(enteredY)) return setLabFeedback("Enter the vertical leg length.","incorrect");

      if(!near(data.inputs.dx,task.dx)){
        const gridSpaces=Math.abs(task.B.gx-task.A.gx);
        if(Math.abs(enteredX-gridSpaces)<.001 && Math.abs(task.dx-gridSpaces)>.001){
          return setLabFeedback(`You counted ${gridSpaces} horizontal grid spaces, but each x-axis interval is worth ${fmt(task.unitX)}. Count the leg using the x-axis values, not just the number of squares.`,"incorrect");
        }
        return setLabFeedback("Recount the horizontal leg. Follow the horizontal pink segment and use the numbered x-axis scale to measure its length.","incorrect");
      }

      if(!near(data.inputs.dy,task.dy)){
        const gridSpaces=Math.abs(task.B.gy-task.A.gy);
        if(Math.abs(enteredY-gridSpaces)<.001 && Math.abs(task.dy-gridSpaces)>.001){
          return setLabFeedback(`You counted ${gridSpaces} vertical grid spaces, but each y-axis interval is worth ${fmt(task.unitY)}. Count the leg using the y-axis values, not just the number of squares.`,"incorrect");
        }
        return setLabFeedback("Recount the vertical leg. Follow the vertical pink segment and use the numbered y-axis scale to measure its length.","incorrect");
      }

      data.step=1;
      setLabFeedback(`Correct. The right triangle has leg lengths ${fmt(task.dx)} and ${fmt(task.dy)}. Now use those as a and b in the Pythagorean Theorem.`,"correct");
      window.renderDistance87DLab(ctx);
    });

    body.querySelector("#checkPythagorean87D")?.addEventListener("click",()=>{
      const a=parseNum(data.inputs.legA);
      const b=parseNum(data.inputs.legB);
      const correct=(Math.abs(a-task.dx)<.001&&Math.abs(b-task.dy)<.001)||(Math.abs(a-task.dy)<.001&&Math.abs(b-task.dx)<.001);

      if(!Number.isFinite(a)||!Number.isFinite(b)){
        return setLabFeedback("Enter both leg lengths in the Pythagorean Theorem.","incorrect");
      }
      if(!correct){
        return setLabFeedback(`Use the two leg lengths you already counted: ${fmt(task.dx)} and ${fmt(task.dy)}. They belong in a and b; the unknown distance is c.`,"incorrect");
      }

      data.step=2;
      setLabFeedback("Correct substitution. Square both legs, add them, then take the square root to solve for the hypotenuse.","correct");
      window.renderDistance87DLab(ctx);
    });

    body.querySelector("#checkAnswer87D")?.addEventListener("click",()=>{
      const status=answerStatus(data.inputs.answer,task.answer);
      if(status.type==="missing") return setLabFeedback("Enter the final distance between A and B.","incorrect");
      if(status.type==="place") return setLabFeedback(`Your value is correct, but this non-whole answer must be written to the nearest hundredth: ${status.target.toFixed(2)}.`,"incorrect");
      if(status.type==="math") return setLabFeedback(`Your leg lengths are correct. Calculate √(${fmt(task.dx)}² + ${fmt(task.dy)}²), then round only the final result.`,"incorrect");
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