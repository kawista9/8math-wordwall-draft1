(function pythagorean87CLabModule() {
  const FIRST_TEN = [
    { kind:"solve", mode:"visual", diagram:"ladder", title:"Ladder against a wall", prompt:"A ladder leans against a wall. The bottom of the ladder is 14 ft from the wall, and the ladder reaches 9 ft up the wall. Find the length of the ladder.", unit:"ft", legs:[9,14], hyp:"x", answer:Math.sqrt(277) },
    { kind:"solve", mode:"word", title:"Guy wire", prompt:"A 17 ft guy wire runs from the top of a pole to the ground. The wire, the pole, and the ground form a right triangle. The pole is 8 ft tall. Find the horizontal distance from the bottom of the pole to the ground anchor.", unit:"ft", legs:[8,"x"], hyp:17, answer:15 },
    { kind:"solve", mode:"visual", diagram:"rectangle", title:"Diagonal support", prompt:"A rectangular display frame has a diagonal support. Use the embedded right triangle to find the missing side.", unit:"in", legs:[5,"x"], hyp:13, answer:12 },
    { kind:"solve", mode:"word", title:"Across the park", prompt:"A student walks 7 m east and then 24 m north. A straight path from the starting point to the ending point would form the third side of a right triangle. Find the length of the straight path.", unit:"m", legs:[7,24], hyp:"x", answer:25 },
    { kind:"solve", mode:"visual", diagram:"ramp", title:"Loading ramp", prompt:"A loading ramp, the ground, and the loading platform form a right triangle. Find the missing ramp length.", unit:"ft", legs:[11,60], hyp:"x", answer:61 },
    { kind:"solve", mode:"visual", diagram:"brace", title:"Wall brace", prompt:"A diagonal brace crosses a rectangular wall section. Use the right triangle inside the frame to find the missing horizontal measure.", unit:"cm", legs:[11,"x"], hyp:20, answer:Math.sqrt(279) },
    { kind:"solve", mode:"word", title:"Screen width", prompt:"A rectangular screen has a diagonal of 20 in and a height of 12 in. Find the width of the screen.", unit:"in", legs:[12,"x"], hyp:20, answer:16 },
    { kind:"solve", mode:"visual", diagram:"window", title:"Window diagonal", prompt:"A rectangular window is 8 cm tall and 15 cm wide. Find the diagonal distance across the window.", unit:"cm", legs:[8,15], hyp:"x", answer:17 },
    { kind:"solve", mode:"word", title:"Robot shortcut", prompt:"A robot moves 13 m east and then 18 m north. Find the straight-line distance from its starting point to its ending point.", unit:"m", legs:[13,18], hyp:"x", answer:Math.sqrt(493) },
    { kind:"solve", mode:"visual", diagram:"truss", title:"Roof truss", prompt:"A roof truss contains a right triangle. The slanted member is 26 ft and the vertical member is 10 ft. Find the missing horizontal member.", unit:"ft", legs:[10,"x"], hyp:26, answer:24 }
  ];

  const CONVERSE = [
    {
      kind:"converseWhich",
      title:"Which set could not represent a right triangle?",
      unit:"cm",
      sets:[
        { key:"A", sides:[6,8,10], right:true },
        { key:"B", sides:[12,35,37], right:true },
        { key:"C", sides:[4,6,10], right:false },
        { key:"D", sides:[10,24,26], right:true }
      ],
      answer:"C"
    },
    {
      kind:"converseTable",
      title:"Triangle classification table",
      unit:"cm",
      rows:[
        { sides:[6,8,9], right:false },
        { sides:[10,24,26], right:true },
        { sides:[24,45,51], right:true }
      ]
    },
    { kind:"converse", title:"Triangle side test", unit:"cm", sides:[8,15,17], right:true, visual:"plain" },
    { kind:"converse", title:"Triangular sign", unit:"in", sides:[9,12,16], right:false, visual:"sign" },
    { kind:"converse", title:"Survey triangle", unit:"m", sides:[20,21,29], right:true, visual:"survey" }
  ];

  const TASKS = [...FIRST_TEN, ...CONVERSE];
  window.PYTHAGOREAN_87C_TOTAL = TASKS.length;

  function freshState(index=0){ return { index, step:0, solved:false, inputs:{} }; }
  window.resetPythagorean87CQuestion = function(data,index){ Object.assign(data,freshState(index)); };

  function esc(v){ return String(v??"").replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch])); }
  function round2(v){ return Math.round((Number(v)+Number.EPSILON)*100)/100; }
  function display(v){ const n=round2(v); return Number.isInteger(n)?String(n):n.toFixed(2); }
  function canon(v){
    const raw=String(v??"").trim().toLowerCase().replace(/\s+/g,"");
    if(!raw) return "";
    if(raw==="x"||raw==="?") return "x";
    const n=Number(raw.replace(/,/g,""));
    return Number.isFinite(n)?n:raw;
  }
  function same(a,b){
    const ca=canon(a), cb=canon(b);
    if(ca==="x"||cb==="x") return ca===cb;
    return typeof ca==="number"&&typeof cb==="number"&&Math.abs(ca-cb)<.001;
  }
  function legsOK(a,b,legs){ return (same(a,legs[0])&&same(b,legs[1]))||(same(a,legs[1])&&same(b,legs[0])); }
  function num(v){ const m=String(v??"").replace(/,/g,"").match(/-?\d+(?:\.\d+)?/); return m?Number(m[0]):NaN; }

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

  function marker(x,y,s=18){ return `<path d="M${x} ${y-s} H${x+s} V${y}" class="py87c-right-marker"/>`; }

  function visual(task){
    const u=esc(task.unit);
    if(task.diagram==="ladder") return `<svg class="py87c-figure py87c-ladder-figure" viewBox="0 0 680 390" role="img" aria-label="A ladder resting on the ground and leaning against a vertical wall, forming a right triangle">
      <!-- real-world wall and ground -->
      <rect x="510" y="48" width="32" height="270" rx="5" class="py87c-wall"/>
      <rect x="70" y="300" width="520" height="24" rx="6" class="py87c-floor"/>

      <!-- measured right-triangle legs -->
      <line x1="160" y1="300" x2="510" y2="300" class="py87c-measure-leg"/>
      <line x1="510" y1="300" x2="510" y2="110" class="py87c-measure-leg"/>
      <path d="M486 300 V276 H510" class="py87c-right-marker"/>

      <!-- ladder: foot on the ground, top touching the wall -->
      <g class="py87c-real-ladder">
        <line x1="153" y1="292" x2="503" y2="102" class="py87c-ladder-rail"/>
        <line x1="166" y1="309" x2="516" y2="119" class="py87c-ladder-rail"/>
        <g class="py87c-ladder-rungs">
          <line x1="210" y1="270" x2="226" y2="286"/>
          <line x1="257" y1="244" x2="273" y2="260"/>
          <line x1="304" y1="219" x2="320" y2="235"/>
          <line x1="351" y1="193" x2="367" y2="209"/>
          <line x1="398" y1="168" x2="414" y2="184"/>
          <line x1="445" y1="142" x2="461" y2="158"/>
        </g>
      </g>

      <!-- dimension guides -->
      <line x1="160" y1="342" x2="510" y2="342" class="py87c-dimension-guide"/>
      <line x1="160" y1="334" x2="160" y2="350" class="py87c-dimension-cap"/>
      <line x1="510" y1="334" x2="510" y2="350" class="py87c-dimension-cap"/>

      <line x1="558" y1="110" x2="558" y2="300" class="py87c-dimension-guide"/>
      <line x1="550" y1="110" x2="566" y2="110" class="py87c-dimension-cap"/>
      <line x1="550" y1="300" x2="566" y2="300" class="py87c-dimension-cap"/>

      <text x="335" y="377" text-anchor="middle" class="py87c-label">14 ${u}</text>
      <text x="600" y="213" text-anchor="middle" class="py87c-label">9 ${u}</text>
      <text x="340" y="182" text-anchor="middle" class="py87c-label py87c-x">x</text>
    </svg>`;
    if(task.diagram==="rectangle") return `<svg class="py87c-figure" viewBox="0 0 640 360"><rect x="120" y="65" width="400" height="230" rx="10" class="py87c-context-fill"/><line x1="120" y1="295" x2="520" y2="65" class="py87c-triangle"/>${marker(120,295)}<text x="305" y="335" class="py87c-label">5 ${u}</text><text x="75" y="190" class="py87c-label py87c-x">x</text><text x="315" y="160" class="py87c-label">13 ${u}</text></svg>`;
    if(task.diagram==="ramp") return `<svg class="py87c-figure" viewBox="0 0 640 360"><path d="M100 285 H550 V135 H490 V285 Z" class="py87c-context-fill"/><line x1="100" y1="285" x2="490" y2="135" class="py87c-triangle py87c-missing"/><line x1="100" y1="285" x2="490" y2="285" class="py87c-triangle"/><line x1="490" y1="285" x2="490" y2="135" class="py87c-triangle"/>${marker(472,285)}<text x="300" y="325" class="py87c-label">60 ${u}</text><text x="515" y="215" class="py87c-label">11 ${u}</text><text x="295" y="190" class="py87c-label py87c-x">x</text></svg>`;
    if(task.diagram==="brace") return `<svg class="py87c-figure" viewBox="0 0 640 360"><rect x="125" y="60" width="390" height="240" rx="8" class="py87c-context-fill"/><line x1="125" y1="300" x2="515" y2="60" class="py87c-triangle"/>${marker(125,300)}<text x="80" y="190" class="py87c-label">11 ${u}</text><text x="315" y="338" class="py87c-label py87c-x">x</text><text x="325" y="155" class="py87c-label">20 ${u}</text></svg>`;
    if(task.diagram==="window") return `<svg class="py87c-figure" viewBox="0 0 640 360"><rect x="145" y="55" width="350" height="250" rx="18" class="py87c-window"/><line x1="145" y1="305" x2="495" y2="55" class="py87c-triangle py87c-missing"/><line x1="320" y1="55" x2="320" y2="305" class="py87c-window-pane"/><line x1="145" y1="180" x2="495" y2="180" class="py87c-window-pane"/>${marker(145,305)}<text x="320" y="340" class="py87c-label">15 ${u}</text><text x="105" y="185" class="py87c-label">8 ${u}</text><text x="335" y="170" class="py87c-label py87c-x">x</text></svg>`;
    return `<svg class="py87c-figure" viewBox="0 0 640 360"><path d="M80 290 H560 L360 75 Z" class="py87c-context"/><line x1="360" y1="75" x2="360" y2="290" class="py87c-triangle"/><line x1="360" y1="75" x2="560" y2="290" class="py87c-triangle"/><line x1="360" y1="290" x2="560" y2="290" class="py87c-triangle py87c-missing"/>${marker(360,290)}<text x="330" y="190" class="py87c-label">10 ${u}</text><text x="475" y="165" class="py87c-label">26 ${u}</text><text x="455" y="325" class="py87c-label py87c-x">x</text></svg>`;
  }

  function converseVisual(task){
    const [a,b,c]=task.sides,u=esc(task.unit);
    return `<svg class="py87c-converse-svg ${task.visual}" viewBox="0 0 620 330"><polygon points="125,270 510,270 235,65" class="py87c-converse-shape"/><text x="185" y="170" class="py87c-label">${a} ${u}</text><text x="405" y="168" class="py87c-label">${b} ${u}</text><text x="320" y="310" class="py87c-label">${c} ${u}</text></svg>`;
  }

  function solveMarkup(task,data,q){
    const stimulus=task.mode==="visual"
      ? `<section class="py87c-visual-card"><h5>Find the embedded right triangle</h5>${visual(task)}</section>`
      : `<section class="py87c-word-card"><span class="py87c-word-icon">▱</span><div><h5>Read carefully</h5><p>${esc(task.prompt)}</p><p class="py87c-note">No diagram is provided. Build the right triangle from the relationships in the situation.</p></div></section>`;

    let work=`<section class="py87c-work-card"><h5>Step 1 · Label the sides of the right triangle</h5><p>The <strong>legs</strong> meet at the right angle. The <strong>hypotenuse</strong> is opposite the right angle. Use <strong>x</strong> for the missing measure.</p><div class="py87c-side-grid"><label><span>Leg a</span><input data-py-input="legA" value="${esc(data.inputs.legA||"")}" placeholder="value or x"></label><label><span>Leg b</span><input data-py-input="legB" value="${esc(data.inputs.legB||"")}" placeholder="value or x"></label><label><span>Hypotenuse c</span><input data-py-input="hyp" value="${esc(data.inputs.hyp||"")}" placeholder="value or x"></label></div><button type="button" class="lab-action" id="checkSides87C">Check side labels</button></section>`;

    if(data.step>=1) work+=`<section class="py87c-work-card"><h5>Step 2 · Substitute into the Pythagorean Theorem</h5><p>Keep the two legs on the left side and the hypotenuse on the right.</p><div class="py87c-equation"><span>(</span><input data-py-input="eqA" value="${esc(data.inputs.eqA||"")}" placeholder="a"><span>)² + (</span><input data-py-input="eqB" value="${esc(data.inputs.eqB||"")}" placeholder="b"><span>)² = (</span><input data-py-input="eqC" value="${esc(data.inputs.eqC||"")}" placeholder="c"><span>)²</span></div><button type="button" class="lab-action" id="checkEquation87C">Check substitution</button></section>`;

    if(data.step>=2) work+=`<section class="py87c-work-card py87c-final-card"><h5>Step 3 · Solve for x</h5><p>If the answer is not a whole number, round to the <strong>nearest hundredth</strong>. Whole-number answers do not need .00.</p><label class="py87c-final-input"><span>x =</span><input data-py-input="final" value="${esc(data.inputs.final||"")}" placeholder="answer"><strong>${esc(task.unit)}</strong></label><button type="button" class="lab-action" id="checkFinal87C">Check solution</button></section>`;

    return `<section class="py87c-shell"><header class="py87c-head"><div><p class="lab-mini-title">Question ${q} of ${TASKS.length} · Pythagorean Theorem</p><h4>${esc(task.title)}</h4><p>${esc(task.prompt)}</p></div><div class="py87c-formula-chip">a² + b² = c²</div></header>${stimulus}${work}<div class="py87c-actions"><button type="button" class="lab-action" id="next87C"${data.solved?"":" hidden"}>Next question</button></div></section>`;
  }

  function converseWhichMarkup(task,data,q){
    const rows=task.sets.map((set,index)=>{
      const key=set.key;
      return `<tr>
        <td class="py87c-set-key">${key}</td>
        <td>${set.sides.join(", ")} ${esc(task.unit)}</td>
        <td><input data-py-input="whichLeft${index}" value="${esc(data.inputs["whichLeft"+index]||"")}" placeholder="a² + b²"></td>
        <td><input data-py-input="whichRight${index}" value="${esc(data.inputs["whichRight"+index]||"")}" placeholder="c²"></td>
      </tr>`;
    }).join("");

    let conclusion="";
    if(data.step>=1){
      conclusion=`<section class="py87c-work-card py87c-final-card">
        <h5>Step 2 · Identify the set that could not be a right triangle</h5>
        <p>Type the letter of the set whose two sides of the converse equation are <strong>not equal</strong>.</p>
        <label class="py87c-conclusion-input"><span>Set</span><input data-py-input="whichAnswer" value="${esc(data.inputs.whichAnswer||"")}" placeholder="A, B, C, or D"></label>
        <button type="button" class="lab-action" id="checkWhichConclusion87C">Check conclusion</button>
      </section>`;
    }

    return `<section class="py87c-shell">
      <header class="py87c-head">
        <div>
          <p class="lab-mini-title">Question ${q} of ${TASKS.length} · Converse of the Pythagorean Theorem</p>
          <h4>${esc(task.title)}</h4>
          <p>Test each set. Use the two shorter side lengths for a and b and the longest side for c. This is open response—do the converse calculations before naming the set.</p>
        </div>
        <div class="py87c-formula-chip">a² + b² ? c²</div>
      </header>
      <section class="py87c-work-card">
        <h5>Step 1 · Test each set</h5>
        <div class="py87c-table-wrap">
          <table class="py87c-converse-table">
            <thead><tr><th>Set</th><th>Side lengths</th><th>a² + b²</th><th>c²</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <button type="button" class="lab-action" id="checkWhichMath87C">Check calculations</button>
      </section>
      ${conclusion}
      <div class="py87c-actions"><button type="button" class="lab-action" id="next87C"${data.solved?"":" hidden"}>Next question</button></div>
    </section>`;
  }

  function converseTableMarkup(task,data,q){
    const rows=task.rows.map((row,index)=>{
      return `<tr>
        <td>${row.sides.join(", ")} ${esc(task.unit)}</td>
        <td><input data-py-input="tableLeft${index}" value="${esc(data.inputs["tableLeft"+index]||"")}" placeholder="a² + b²"></td>
        <td><input data-py-input="tableRight${index}" value="${esc(data.inputs["tableRight"+index]||"")}" placeholder="c²"></td>
        <td><input data-py-input="tableType${index}" value="${esc(data.inputs["tableType"+index]||"")}" placeholder="right / not right"></td>
      </tr>`;
    }).join("");

    return `<section class="py87c-shell">
      <header class="py87c-head">
        <div>
          <p class="lab-mini-title">Question ${q} of ${TASKS.length} · Converse of the Pythagorean Theorem</p>
          <h4>${esc(task.title)}</h4>
          <p>Determine whether the triangle with each set of side lengths is a right triangle or not a right triangle. Type every response—there are no answer choices to drag.</p>
        </div>
        <div class="py87c-formula-chip">a² + b² ? c²</div>
      </header>
      <section class="py87c-work-card">
        <div class="py87c-table-wrap">
          <table class="py87c-converse-table py87c-classification-table">
            <thead><tr><th>Lengths</th><th>a² + b²</th><th>c²</th><th>Type of triangle</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <button type="button" class="lab-action" id="checkConverseTable87C">Check table</button>
      </section>
      <div class="py87c-actions"><button type="button" class="lab-action" id="next87C"${data.solved?"":" hidden"}>Next question</button></div>
    </section>`;
  }

  function converseMarkup(task,data,q){
    const [s1,s2,s3]=task.sides;
    let work=`<section class="py87c-work-card"><h5>Step 1 · Set up the converse test</h5><p>Use the <strong>two shorter sides as a and b</strong> and the <strong>longest side as c</strong>.</p><div class="py87c-side-grid"><label><span>a</span><input data-py-input="a" value="${esc(data.inputs.a||"")}" placeholder="short side"></label><label><span>b</span><input data-py-input="b" value="${esc(data.inputs.b||"")}" placeholder="short side"></label><label><span>c</span><input data-py-input="c" value="${esc(data.inputs.c||"")}" placeholder="longest side"></label></div><button type="button" class="lab-action" id="checkConverseSides87C">Check setup</button></section>`;

    if(data.step>=1) work+=`<section class="py87c-work-card"><h5>Step 2 · Compare both sides</h5><div class="py87c-converse-equation"><label><span>a² + b² =</span><input data-py-input="leftSquare" value="${esc(data.inputs.leftSquare||"")}" placeholder="sum"></label><span class="py87c-vs">compare with</span><label><span>c² =</span><input data-py-input="rightSquare" value="${esc(data.inputs.rightSquare||"")}" placeholder="square"></label></div><button type="button" class="lab-action" id="checkConverseMath87C">Check calculations</button></section>`;

    if(data.step>=2) work+=`<section class="py87c-work-card py87c-final-card"><h5>Step 3 · State your conclusion</h5><p>Type <strong>right triangle</strong> or <strong>not a right triangle</strong>.</p><label class="py87c-conclusion-input"><span>Conclusion</span><input data-py-input="conclusion" value="${esc(data.inputs.conclusion||"")}" placeholder="type your conclusion"></label><button type="button" class="lab-action" id="checkConverseConclusion87C">Check conclusion</button></section>`;

    return `<section class="py87c-shell"><header class="py87c-head"><div><p class="lab-mini-title">Question ${q} of ${TASKS.length} · Converse of the Pythagorean Theorem</p><h4>${esc(task.title)}</h4><p>Determine whether side lengths ${s1} ${task.unit}, ${s2} ${task.unit}, and ${s3} ${task.unit} form a right triangle.</p></div><div class="py87c-formula-chip">a² + b² ? c²</div></header><section class="py87c-visual-card"><h5>Do not trust the drawing alone</h5><p class="py87c-note">The calculation decides whether the triangle is right.</p>${converseVisual(task)}</section>${work}<div class="py87c-actions"><button type="button" class="lab-action" id="next87C"${data.solved?"":" hidden"}>${q===TASKS.length?"Finish lab":"Next question"}</button></div></section>`;
  }

  function bindInputs(body,data){ body.querySelectorAll("[data-py-input]").forEach(input=>input.addEventListener("input",()=>{data.inputs[input.dataset.pyInput]=input.value;})); }
  function finish(data,ctx,message){
    data.solved=true;
    ctx.setLabFeedback(message,"correct");
    ctx.setLabProgress(data.index+1,TASKS.length,`Question ${data.index+1} complete.`);
    const next=document.querySelector("#next87C"); if(next) next.hidden=false;
  }

  function sideError(task,data){
    if(!same(data.inputs.hyp,task.hyp)){
      if(canon(data.inputs.hyp)==="x"&&task.hyp!=="x") return "The missing side is not the hypotenuse. The hypotenuse is opposite the right angle.";
      if(task.hyp==="x") return "The missing side is the hypotenuse. Put x in the c box because that side is opposite the right angle.";
      return `Recheck c. The hypotenuse is opposite the right angle, and its length is ${task.hyp} ${task.unit}.`;
    }
    if(!legsOK(data.inputs.legA,data.inputs.legB,task.legs)) return "Recheck the two legs. They are the sides that meet to make the right angle. Their a/b order may be switched.";
    return "";
  }

  function eqError(task,data){
    if(!same(data.inputs.eqC,task.hyp)) return "The c position is incorrect. c must represent the hypotenuse.";
    if(!legsOK(data.inputs.eqA,data.inputs.eqB,task.legs)) return "The two values on the left must be the legs. Their order may be switched.";
    return "";
  }

  function conclusion(v){ return String(v??"").trim().toLowerCase().replace(/[.!]/g,"").replace(/\s+/g," "); }

  window.renderPythagorean87CLab=function(ctx){
    const {labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}=ctx;
    if(!labRuntime.data) labRuntime.data=freshState(0);
    const data=labRuntime.data, task=TASKS[data.index];
    if(!task) return showLabCompletion("8.7C");

    setLabProgress(data.index+(data.solved?1:0),TASKS.length,data.index<10?`Question ${data.index+1} of 15: identify the right triangle, label a, b, and c, substitute, and solve.`:`Question ${data.index+1} of 15: use the converse to test the three side lengths.`);
    const body=$("#standardsLabBody");
    body.innerHTML=task.kind==="solve"
      ? solveMarkup(task,data,data.index+1)
      : task.kind==="converseWhich"
        ? converseWhichMarkup(task,data,data.index+1)
        : task.kind==="converseTable"
          ? converseTableMarkup(task,data,data.index+1)
          : converseMarkup(task,data,data.index+1);
    bindInputs(body,data);

    body.querySelector("#checkSides87C")?.addEventListener("click",()=>{
      const error=sideError(task,data); if(error) return setLabFeedback(error,"incorrect");
      data.step=1; setLabFeedback("Correct. You identified the two legs and the hypotenuse. Now substitute those roles into a² + b² = c².","correct"); window.renderPythagorean87CLab(ctx);
    });

    body.querySelector("#checkEquation87C")?.addEventListener("click",()=>{
      const error=eqError(task,data); if(error) return setLabFeedback(error,"incorrect");
      data.step=2;
      setLabFeedback(task.hyp==="x"?"Correct substitution. x is the hypotenuse, so add the leg squares and take the square root.":"Correct substitution. x is a leg, so subtract the known leg square from c² and take the square root.","correct");
      window.renderPythagorean87CLab(ctx);
    });

    body.querySelector("#checkFinal87C")?.addEventListener("click",()=>{
      const status=answerStatus(data.inputs.final,task.answer);
      if(status.type==="missing") return setLabFeedback("Enter a numerical value for x.","incorrect");
      if(status.type==="place") return setLabFeedback(`Your numerical value is correct. Because it is not a whole number, show the nearest hundredth as ${status.target.toFixed(2)}.`,"incorrect");
      if(status.type==="math") return setLabFeedback(task.hyp==="x"?"The setup is correct, but the calculation is not. Add the leg squares, then take the square root.":"The setup is correct, but the calculation is not. Subtract the known leg square from c², then take the square root.","incorrect");
      finish(data,ctx,`Correct. x = ${display(task.answer)} ${task.unit}.`);
    });

    body.querySelector("#checkWhichMath87C")?.addEventListener("click",()=>{
      for(let i=0;i<task.sets.length;i+=1){
        const set=task.sets[i];
        const sorted=[...set.sides].sort((a,b)=>a-b);
        const left=sorted[0]**2+sorted[1]**2;
        const right=sorted[2]**2;
        if(Math.abs(num(data.inputs["whichLeft"+i])-left)>.001){
          return setLabFeedback(`Set ${set.key}: recheck a² + b². Use the two shorter side lengths.`,"incorrect");
        }
        if(Math.abs(num(data.inputs["whichRight"+i])-right)>.001){
          return setLabFeedback(`Set ${set.key}: recheck c². c must be the longest side.`,"incorrect");
        }
      }
      data.step=1;
      setLabFeedback("All four converse calculations are correct. Now identify the set whose values are not equal.","correct");
      window.renderPythagorean87CLab(ctx);
    });

    body.querySelector("#checkWhichConclusion87C")?.addEventListener("click",()=>{
      const answer=String(data.inputs.whichAnswer||"").trim().toUpperCase();
      if(answer!==task.answer){
        return setLabFeedback("Recheck the rows. The set that could not form a right triangle is the one where a² + b² does not equal c².","incorrect");
      }
      const bad=task.sets.find(set=>set.key===task.answer);
      const sorted=[...bad.sides].sort((a,b)=>a-b);
      finish(data,ctx,`Correct. Set ${task.answer}: ${sorted[0]}² + ${sorted[1]}² = ${sorted[0]**2+sorted[1]**2}, while ${sorted[2]}² = ${sorted[2]**2}. The values are not equal.`);
    });

    body.querySelector("#checkConverseTable87C")?.addEventListener("click",()=>{
      for(let i=0;i<task.rows.length;i+=1){
        const row=task.rows[i];
        const sorted=[...row.sides].sort((a,b)=>a-b);
        const left=sorted[0]**2+sorted[1]**2;
        const right=sorted[2]**2;
        if(Math.abs(num(data.inputs["tableLeft"+i])-left)>.001){
          return setLabFeedback(`Row ${i+1}: recheck a² + b² using the two shorter side lengths.`,"incorrect");
        }
        if(Math.abs(num(data.inputs["tableRight"+i])-right)>.001){
          return setLabFeedback(`Row ${i+1}: recheck c² using the longest side.`,"incorrect");
        }

        const typed=conclusion(data.inputs["tableType"+i]);
        const saysNot=typed.includes("not")||typed==="no";
        const saysRight=typed.includes("right")||typed==="yes";
        const classificationOK=row.right?(saysRight&&!saysNot):saysNot;
        if(!classificationOK){
          return setLabFeedback(row.right
            ? `Row ${i+1}: the two calculated values are equal, so type "right triangle".`
            : `Row ${i+1}: the two calculated values are not equal, so type "not a right triangle".`,"incorrect");
        }
      }
      finish(data,ctx,"Correct. You used the converse to classify all three sets from their side lengths.");
    });

    body.querySelector("#checkConverseSides87C")?.addEventListener("click",()=>{
      const sorted=[...task.sides].sort((a,b)=>a-b);
      if(!same(data.inputs.c,sorted[2])) return setLabFeedback("For the converse, c must be the longest side.","incorrect");
      if(!legsOK(data.inputs.a,data.inputs.b,[sorted[0],sorted[1]])) return setLabFeedback("Put the two shorter sides in a and b. Their order may be switched.","incorrect");
      data.step=1; setLabFeedback("Correct setup. Now calculate a² + b² and c² separately.","correct"); window.renderPythagorean87CLab(ctx);
    });

    body.querySelector("#checkConverseMath87C")?.addEventListener("click",()=>{
      const sorted=[...task.sides].sort((a,b)=>a-b), left=sorted[0]**2+sorted[1]**2, right=sorted[2]**2;
      if(Math.abs(num(data.inputs.leftSquare)-left)>.001) return setLabFeedback("Recheck a² + b². Square each shorter side, then add.","incorrect");
      if(Math.abs(num(data.inputs.rightSquare)-right)>.001) return setLabFeedback("Recheck c². Square the longest side by itself.","incorrect");
      data.step=2; setLabFeedback(left===right?"The two sides are equal. State what the converse tells you.":"The two sides are not equal. State what the converse tells you.","correct"); window.renderPythagorean87CLab(ctx);
    });

    body.querySelector("#checkConverseConclusion87C")?.addEventListener("click",()=>{
      const text=conclusion(data.inputs.conclusion), saysNot=text.includes("not")||text==="no", saysRight=text.includes("right")||text==="yes";
      const correct=task.right?(saysRight&&!saysNot):saysNot;
      if(!correct) return setLabFeedback(task.right?"Because a² + b² equals c², the converse says these lengths form a right triangle.":"Because a² + b² does not equal c², the converse says these lengths do not form a right triangle.","incorrect");
      const sorted=[...task.sides].sort((a,b)=>a-b), left=sorted[0]**2+sorted[1]**2, right=sorted[2]**2;
      finish(data,ctx,task.right?`Correct. ${sorted[0]}² + ${sorted[1]}² = ${left} and ${sorted[2]}² = ${right}, so it is a right triangle.`:`Correct. ${sorted[0]}² + ${sorted[1]}² = ${left}, but ${sorted[2]}² = ${right}, so it is not a right triangle.`);
    });

    body.querySelector("#next87C")?.addEventListener("click",()=>{
      if(!data.solved) return;
      if(data.index>=TASKS.length-1) return showLabCompletion("8.7C");
      Object.assign(data,freshState(data.index+1));
      window.renderPythagorean87CLab(ctx); setLabFeedback("Next question ready."); syncWhiteboardQuestion();
    });
  };
})();