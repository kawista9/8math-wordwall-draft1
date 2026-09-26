(() => {
  const term = (id, side, kind, value, label) => ({ id, side, kind, value, label });
  const word = (title, left, right, context, cue, relation, terms, tail = "when their amounts are compared") =>
    ({ title, kind: "word", left, right, context, cue, relation, terms, tail });
  const group = (name, multiplier, terms, factor) => ({ name, multiplier, terms, factor });
  const shape = (title, left, right, cue, relation, leftGroups, rightGroups, note) =>
    ({ title, kind: "geometry", left, right, cue, relation, leftGroups, rightGroups, note,
      terms: [...leftGroups, ...rightGroups].flatMap(g => [...g.terms, ...(g.factor ? [g.factor] : [])]) });

  // Every problem has a variable on each side and one visible subtraction cue.
  // The seven guided tasks come first. The remaining ten allow work in any order.
  const TASKS = [
    word("Music studio memberships", "Studio A", "Studio B",
      "Studio A charges {ac} to join and {av} for each lesson. Studio B charges {bc} to join and {bv} for each lesson, then applies {bd} to the total.",
      "the same as", "=", [term("ac","L","constant",24,"$24"),term("av","L","variable",6,"$6 per lesson"),term("bc","R","constant",40,"$40"),term("bv","R","variable",4,"$4 per lesson"),term("bd","R","constant",-8,"an $8 coupon")], "after x lessons"),
    word("Two delivery services", "Courier A", "Courier B",
      "Courier A charges {ac} plus {av}. Courier B charges {bc} plus {bv} and takes off {bd} from the final bill.",
      "at most", "≤", [term("ac","L","constant",15,"$15 to start"),term("av","L","variable",2.5,"$2.50 per mile"),term("bc","R","constant",28,"$28 to start"),term("bv","R","variable",2,"$2 per mile"),term("bd","R","constant",-3,"$3")], "for x miles"),
    word("Arcade points", "Mira's balance", "Leo's balance",
      "Mira begins with {ac} points and uses {av} in each round. Leo begins with {bc} points and earns {bv} in each round.",
      "greater than", ">", [term("ac","L","constant",60,"60"),term("av","L","variable",-2,"2 points per round"),term("bc","R","constant",18,"18"),term("bv","R","variable",3,"3 points per round")], "after x rounds"),
    word("Seedling collections", "Garden A", "Garden B",
      "Garden A starts with {ac} seedlings, adds {av} each week, and donates {ad} seedlings once. Garden B starts with {bc} and adds {bv} each week.",
      "at least", "≥", [term("ac","L","constant",12,"12"),term("av","L","variable",5,"5 seedlings"),term("ad","L","constant",-4,"4"),term("bc","R","constant",7,"7"),term("bv","R","variable",6,"6 seedlings")], "after x weeks"),
    shape("Rectangle and triangle fences", "Rectangle perimeter", "Triangle perimeter", "equal to", "=", [
      group("length (two sides)",2,[term("alv","L","variable",2,"2x"),term("alc","L","constant",4,"+ 4")]),
      group("width (two sides)",2,[term("awv","L","variable",-1,"− x"),term("awc","L","constant",12,"+ 12")])
    ], [
      group("side 1",1,[term("b1v","R","variable",1,"x"),term("b1c","R","constant",5,"+ 5")]),
      group("side 2",1,[term("b2v","R","variable",1,"x"),term("b2c","R","constant",6,"+ 6")]),
      group("side 3",1,[term("b3v","R","variable",-1,"− x"),term("b3c","R","constant",14,"+ 14")])
    ], "The rectangle has opposite sides of equal length. Add all side lengths of each figure; do not use area."),
    shape("Two garden areas", "Garden A area", "Garden B area", "less than", "<", [
      group("width",3,[term("av","L","variable",2,"2x"),term("ac","L","constant",5,"+ 5")],term("ah","L","constant",3,"height 3"))
    ], [
      group("width",2,[term("bv","R","variable",-1,"− x"),term("bc","R","constant",12,"+ 12")],term("bh","R","constant",2,"height 2"))
    ], "Each garden is a rectangle. Multiply height by width before comparing their areas."),
    shape("Two triangular frames", "Frame A perimeter", "Frame B perimeter", "at least", "≥", [
      group("side 1",1,[term("a1v","L","variable",3,"3x"),term("a1c","L","constant",2,"+ 2")]),
      group("side 2",1,[term("a2v","L","variable",-1,"− x"),term("a2c","L","constant",8,"+ 8")]),
      group("side 3",1,[term("a3v","L","variable",1,"x"),term("a3c","L","constant",4,"+ 4")])
    ], [
      group("side 1",1,[term("b1v","R","variable",2,"2x"),term("b1c","R","constant",5,"+ 5")]),
      group("side 2",1,[term("b2v","R","variable",1,"x"),term("b2c","R","constant",3,"+ 3")]),
      group("side 3",1,[term("b3v","R","variable",-1,"− x"),term("b3c","R","constant",9,"+ 9")])
    ], "Add the three labeled sides of each triangular frame."),
    word("Bicycle rental plans", "Plan A", "Plan B",
      "Plan A has {ac} and costs {av}. Plan B has {bc}, costs {bv}, and subtracts {bd} from its bill.",
      "no more than", "≤", [term("ac","L","constant",18,"an $18 fee"),term("av","L","variable",7,"$7 per hour"),term("bc","R","constant",30,"a $30 fee"),term("bv","R","variable",5,"$5 per hour"),term("bd","R","constant",4,"a $4 discount")].map(t=>t.id==="bd"?{...t,value:-4}:t), "for x hours"),
    word("Reading challenge", "Tariq's pages", "Nia's pages",
      "Tariq has read {ac} pages and reads {av} each day. Nia has read {bc} pages and reads {bv} each day, but removes {bd} pages from her count after finding duplicates.",
      "the same as", "=", [term("ac","L","constant",35,"35"),term("av","L","variable",12,"12 pages"),term("bc","R","constant",58,"58"),term("bv","R","variable",9,"9 pages"),term("bd","R","constant",-5,"5")], "after x days"),
    word("Two water tanks", "Tank A", "Tank B",
      "Tank A contains {ac} liters and drains {av} per minute. Tank B contains {bc} liters and drains {bv} per minute.",
      "less than", "<", [term("ac","L","constant",90,"90"),term("av","L","variable",-3.5,"3.5 liters"),term("bc","R","constant",72,"72"),term("bv","R","variable",-2,"2 liters")], "after x minutes"),
    shape("Two rectangular paths", "Path A perimeter", "Path B perimeter", "greater than", ">", [
      group("length (two sides)",2,[term("alv","L","variable",3,"3x"),term("alc","L","constant",-2,"− 2")]),
      group("width (two sides)",2,[term("awv","L","variable",1,"x"),term("awc","L","constant",7,"+ 7")])
    ], [
      group("length (two sides)",2,[term("blv","R","variable",2,"2x"),term("blc","R","constant",4,"+ 4")]),
      group("width (two sides)",2,[term("bwv","R","variable",1,"x"),term("bwc","R","constant",5,"+ 5")])
    ], "Add two lengths and two widths for each rectangular path."),
    word("Online craft orders", "Shop A", "Shop B",
      "Shop A collects {ac} as a service fee and {av} for each item, then refunds {ad} from the service fee. Shop B collects {bc} plus {bv} for each item.",
      "at least", "≥", [term("ac","L","constant",21,"$21"),term("av","L","variable",8,"$8"),term("ad","L","constant",-6,"$6"),term("bc","R","constant",12,"$12"),term("bv","R","variable",9.5,"$9.50")], "for x items"),
    word("Fundraising jars", "Jar A", "Jar B",
      "Jar A has {ac} and gains {av} each day. Jar B has {bc} and gains {bv} each day, but spends {bd} once on supplies.",
      "equal", "=", [term("ac","L","constant",44,"$44"),term("av","L","variable",3.25,"$3.25"),term("bc","R","constant",26,"$26"),term("bv","R","variable",5.25,"$5.25"),term("bd","R","constant",-7,"$7")], "after x days"),
    shape("Two painted panels", "Panel A area", "Panel B area", "no greater than", "≤", [
      group("width",4,[term("av","L","variable",1,"x"),term("ac","L","constant",2,"+ 2")],term("ah","L","constant",4,"height 4"))
    ], [
      group("width",3,[term("bv","R","variable",2,"2x"),term("bc","R","constant",-1,"− 1")],term("bh","R","constant",3,"height 3"))
    ], "Both panels are rectangles. Distribute the height across both terms in each width."),
    word("Two school buses", "Bus A riders", "Bus B riders",
      "Bus A starts with {ac} riders, picks up {av} at each stop, and lets {ad} riders off once. Bus B starts with {bc} and picks up {bv} at each stop.",
      "more than", ">", [term("ac","L","constant",22,"22"),term("av","L","variable",4,"4 riders"),term("ad","L","constant",-5,"5"),term("bc","R","constant",10,"10"),term("bv","R","variable",5,"5 riders")], "after x stops"),
    word("Digital storage", "Account A", "Account B",
      "Account A has {ac} gigabytes available and uses {av} each week. Account B has {bc} gigabytes available and uses {bv} each week.",
      "at least", "≥", [term("ac","L","constant",48,"48"),term("av","L","variable",-1.5,"1.5 gigabytes"),term("bc","R","constant",30,"30"),term("bv","R","variable",-0.75,"0.75 gigabytes")], "after x weeks"),
    shape("Triangle and rectangle trim", "Triangle perimeter", "Rectangle perimeter", "the same as", "=", [
      group("side 1",1,[term("a1v","L","variable",2,"2x"),term("a1c","L","constant",3,"+ 3")]),
      group("side 2",1,[term("a2v","L","variable",-1,"− x"),term("a2c","L","constant",10,"+ 10")]),
      group("side 3",1,[term("a3v","L","variable",2,"2x"),term("a3c","L","constant",1,"+ 1")])
    ], [
      group("length (two sides)",2,[term("blv","R","variable",1,"x"),term("blc","R","constant",5,"+ 5")]),
      group("width (two sides)",2,[term("bwv","R","variable",1,"x"),term("bwc","R","constant",4,"+ 4")])
    ], "Find both perimeters by adding every side, including both copies of each rectangle dimension.")
  ];

  window.EQUATION_88A_TOTAL = TASKS.length;
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const fmt = n => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)));
  const value = raw => raw.trim() === "" ? NaN : Number(raw.trim());
  const close = (raw, expected) => Number.isFinite(value(raw)) && Math.abs(value(raw) - expected) < 0.0001;
  const totals = (task, side) => {
    const groups = task.kind === "word" ? [{ multiplier:1, terms:task.terms.filter(t => t.side === side) }] : side === "L" ? task.leftGroups : task.rightGroups;
    return {
      constant:groups.reduce((sum,g) => sum + g.multiplier * g.terms.filter(t => t.kind === "constant").reduce((a,t)=>a+t.value,0),0),
      variable:groups.reduce((sum,g) => sum + g.multiplier * g.terms.filter(t => t.kind === "variable").reduce((a,t)=>a+t.value,0),0)
    };
  };
  const fresh = index => ({ index, phase:index<7?0:2, read:false, cue:false, picked:new Set(), left:"", right:"", symbol:"", subtraction:"", inputs:{}, complete:false });
  window.reset88AQuestion = (data,index) => Object.assign(data,fresh(index));

  function tokenButton(t, data) {
    return `<button type="button" class="a88-token a88-${t.kind}${data.picked.has(t.id)?" is-picked":""}" data-token="${esc(t.id)}" aria-pressed="${data.picked.has(t.id)}" title="Select this ${t.kind === "variable" ? "variable term" : "constant"}">${esc(t.label)}</button>`;
  }
  function geometryFigure(task, side, data) {
    const groups = side === "L" ? task.leftGroups : task.rightGroups;
    const isArea = groups.some(g=>g.factor);
    return `<article class="a88-figure"><strong>${esc(side==="L"?task.left:task.right)}</strong><div class="a88-shape ${isArea?"is-area":groups.length===3?"is-triangle":"is-rectangle"}" aria-label="Labeled ${isArea?"area":"perimeter"} figure"><div class="a88-dimensions">${groups.map(g=>`<div class="a88-dimension"><small>${esc(g.name)}${g.multiplier>1&&!g.factor?` × ${g.multiplier} sides`:""}</small><div>${g.factor?`${tokenButton(g.factor,data)} × (`:""}${g.terms.map(t=>tokenButton(t,data)).join(" ")}${g.factor?")":""}</div></div>`).join("")}</div></div></article>`;
  }
  function scene(task,data) {
    if (task.kind==="geometry") return `<p class="a88-scene-note">${esc(task.note)}</p><div class="a88-figures">${geometryFigure(task,"L",data)}${geometryFigure(task,"R",data)}</div>`;
    const byId=Object.fromEntries(task.terms.map(t=>[t.id,t]));
    return `<p class="a88-story">${esc(task.context).replace(/\{([a-z0-9]+)\}/g,(_,id)=>byId[id]?tokenButton(byId[id],data):"")}</p>`;
  }
  function select(name, current, choices, label) {
    return `<label class="a88-select"><span>${esc(label)}</span><select data-select="${name}"><option value="">Choose…</option>${choices.map(([v,text])=>`<option value="${esc(v)}"${current===v?" selected":""}>${esc(text)}</option>`).join("")}</select></label>`;
  }
  function field(key, label, kind, data, suffix="") {
    return `<label class="a88-field a88-${kind}"><span>${esc(label)}</span><span class="a88-entry"><input inputmode="decimal" type="number" step="any" data-input="${esc(key)}" value="${esc(data.inputs[key]??"")}" aria-label="${esc(label)}"><b>${suffix}</b></span></label>`;
  }
  function rawWorkspace(task,data) {
    if(task.kind!=="geometry") return "";
    return `<section class="a88-raw"><h5>Expand each side first</h5><p>Type the contribution of every labeled part. For two equal sides, multiply each part by 2. For area, distribute the height through the width. Include the minus sign when a part is subtracted.</p><div class="a88-raw-grid">${[...task.leftGroups,...task.rightGroups].map(g=>`<div class="a88-raw-group"><strong>${esc(g.name)} ${g.multiplier!==1?`× ${g.multiplier}`:""}</strong>${g.factor?field(`raw-${g.factor.id}`,`Multiplier: ${g.factor.label}`,"constant",data):""}${g.terms.map(t=>field(`raw-${t.id}`,`${t.label} contribution`,t.kind,data,t.kind==="variable"?"x":"")).join("")}</div>`).join("")}</div></section>`;
  }
  function setup(task,data) {
    const signOptions=[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]];
    return `<section class="a88-setup"><div class="a88-template"><span>Structure</span><strong>starting value + rate × x &nbsp; ${esc(data.symbol||"?")} &nbsp; starting value + rate × x</strong><small>A signed value can be negative: adding −2x means subtracting 2x.</small></div>${rawWorkspace(task,data)}<h5>Build the simplified comparison</h5><div class="a88-equation">${field("lc",`${task.left}: starting value`,"constant",data)}<span>+</span>${field("lv",`${task.left}: x coefficient`,"variable",data,"x")}<span class="a88-relation">${esc(data.symbol||"?")}</span>${field("rc",`${task.right}: starting value`,"constant",data)}<span>+</span>${field("rv",`${task.right}: x coefficient`,"variable",data,"x")}</div></section>`;
  }
  function present(task,data) {
    const guided=data.index<7, showRelation=!guided||data.phase>=1, showTerms=!guided||data.phase>=2;
    return `<div class="a88-lab"><div class="a88-task-head"><span>${guided?"Guided pathway":"Independent practice"} · ${data.index+1} of ${TASKS.length}</span><h4>${esc(task.title)}</h4></div><section class="a88-panel"><h5>1 · Read the whole situation or figure</h5>${scene(task,data)}<button type="button" class="a88-read${data.read?" is-done":""}" data-action="read">${data.read?"✓ Situation read":"I read the whole situation"}</button></section>${showRelation?`<section class="a88-panel"><h5>2 · Read the question and mark its relationship word</h5><p class="a88-question">When will ${esc(task.left)} be <button type="button" class="a88-cue${data.cue?" is-picked":""}" data-action="cue" aria-pressed="${data.cue}">${esc(task.cue)}</button> ${esc(task.right)} ${esc(task.tail||"for a value of x")}? Write ${task.relation==="="?"an equation":"an inequality"} to represent the comparison.</p><p class="a88-hint">Click the purple phrase in the question. Keep the named order as you choose each side.</p><div class="a88-choices">${select("left",data.left,[["L",task.left],["R",task.right]],"Left expression")}${select("symbol",data.symbol,[["","Select symbol"],...[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]]],"Comparison symbol")}${select("right",data.right,[["L",task.left],["R",task.right]],"Right expression")}</div>${guided&&data.phase===1?`<button type="button" class="lab-action a88-check" data-action="relation">Check comparison & reveal template</button>`:""}</section>`:""}${showTerms?`<section class="a88-panel"><h5>3 · Select and enter the terms</h5><div class="a88-key"><span class="a88-variable">Blue: variable terms</span><span class="a88-constant">Green: constants</span><span class="a88-comparison">Purple: relationship</span></div><p>Click every number or rate in the situation or figure above. Then type the signed values below. A rate for each x becomes a coefficient of x.</p><p class="a88-selected">Selected ${data.picked.size} of ${task.terms.length} parts</p>${select("subtraction",data.subtraction,[["constant","A constant"],["variable","A variable term"]],"What does the situation subtract?")}${setup(task,data)}<button type="button" class="lab-action a88-check" data-action="check">Check my equation or inequality</button></section>`:""}${data.complete?`<section class="a88-success"><strong>Correct relationship!</strong><p>You collected and combined each side. Explain why the purple symbol fits the question.</p><button type="button" class="lab-next" data-action="next">${data.index===TASKS.length-1?"Finish lab":"Next question →"}</button></section>`:""}</div>`;
  }

  window.render88ALab = function({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}) {
    if (!labRuntime.data) labRuntime.data=fresh(0);
    const data=labRuntime.data, task=TASKS[data.index], guided=data.index<7;
    setLabProgress(data.index,TASKS.length,guided?`Guided ${data.index+1} of 7: read → compare → collect terms → build.`:`Independent ${data.index-6} of 10: complete the steps in any order.`);
    $("#standardsLabBody").innerHTML=present(task,data);
    syncWhiteboardQuestion();
    const body=$("#standardsLabBody");
    body.querySelectorAll("[data-token]").forEach(button=>button.addEventListener("click",()=>{
      const id=button.dataset.token;
      data.picked.has(id)?data.picked.delete(id):data.picked.add(id);
      body.querySelectorAll(`[data-token="${id}"]`).forEach(b=>{b.classList.toggle("is-picked",data.picked.has(id));b.setAttribute("aria-pressed",String(data.picked.has(id)));});
      const counter=body.querySelector(".a88-selected"); if(counter)counter.textContent=`Selected ${data.picked.size} of ${task.terms.length} parts`;
      setLabFeedback(data.picked.has(id)?"Part selected. Choose its color category, then enter its signed value.":"Part deselected.");
    }));
    body.querySelectorAll("[data-select]").forEach(el=>el.addEventListener("change",()=>{data[el.dataset.select]=el.value; if(el.dataset.select==="symbol")body.querySelectorAll(".a88-relation,.a88-template strong").forEach(node=>{if(node.classList.contains("a88-relation"))node.textContent=data.symbol||"?";else node.textContent=`starting value + rate × x   ${data.symbol||"?"}   starting value + rate × x`;});}));
    body.querySelectorAll("[data-input]").forEach(el=>el.addEventListener("input",()=>{data.inputs[el.dataset.input]=el.value;}));
    body.querySelectorAll("[data-action]").forEach(button=>button.addEventListener("click",()=>{
      const action=button.dataset.action;
      if(action==="read"){data.read=true;if(guided&&data.phase===0)data.phase=1;window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Now read the question. Click its relationship phrase.");return;}
      if(action==="cue"){data.cue=true;button.classList.add("is-picked");button.setAttribute("aria-pressed","true");setLabFeedback("You found the phrase. Match it to the comparison symbol.");return;}
      const relationship=()=>data.cue&&data.left==="L"&&data.right==="R"&&data.symbol===task.relation;
      if(action==="relation"){
        if(!data.read)return setLabFeedback("Read the whole situation before building the comparison.","incorrect");
        if(!data.cue)return setLabFeedback("Click the purple relationship phrase in the question first.","incorrect");
        if(!relationship())return setLabFeedback("Keep the two named situations in order and check what the relationship phrase means.","incorrect");
        data.phase=2;window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("The template is ready. Select each term in the story or figure, then fill the boxes.","correct");return;
      }
      if(action==="check"){
        if(!data.read)return setLabFeedback("First read the entire situation and mark it as read.","incorrect");
        if(!relationship())return setLabFeedback("Click the question's purple phrase and choose the correct order and symbol.","incorrect");
        const missing=task.terms.filter(t=>!data.picked.has(t.id));
        if(missing.length)return setLabFeedback(`Select all blue and green parts in the ${task.kind==="geometry"?"figures":"story"}. ${missing.length} ${missing.length===1?"part remains":"parts remain"}.`,"incorrect");
        const negativeKinds=[...new Set(task.terms.filter(t=>!t.factor&&t.value<0).map(t=>t.kind))];
        if(!negativeKinds.includes(data.subtraction))return setLabFeedback("Look for the minus, discount, drain, or amount taken away. Is a constant or a variable term being subtracted?","incorrect");
        if(task.kind==="geometry"){
          for(const g of [...task.leftGroups,...task.rightGroups]){
            if(g.factor&&!close(data.inputs[`raw-${g.factor.id}`]??"",g.multiplier))return setLabFeedback(`Enter the multiplier for ${g.name} before distributing.`,"incorrect");
            for(const t of g.terms){if(!close(data.inputs[`raw-${t.id}`]??"",t.value*g.multiplier))return setLabFeedback(`Revisit ${g.name}: multiply ${t.label} by ${g.multiplier}, keeping its sign.`,"incorrect");}
          }
        }
        const L=totals(task,"L"),R=totals(task,"R");
        for(const [key,expected,label] of [["lc",L.constant,"left starting value"],["lv",L.variable,"left x coefficient"],["rc",R.constant,"right starting value"],["rv",R.variable,"right x coefficient"]]){
          if(!close(data.inputs[key]??"",expected))return setLabFeedback(`Check the ${label}. Add the signed parts from that side; keep a minus sign when needed.`,"incorrect");
        }
        data.complete=true;button.disabled=true;body.querySelector(".a88-success")?.remove();window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Correct! Both complete expressions and the comparison symbol fit the question.","correct");return;
      }
      if(action==="next"){
        if(data.index===TASKS.length-1){setLabProgress(TASKS.length,TASKS.length,"All comparisons complete.");showLabCompletion("8.8A");body.querySelector(".a88-lab").hidden=true;return;}
        window.reset88AQuestion(data,data.index+1);window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Read the next situation before deciding which relationship it describes.");
      }
    }));
  };
})();
