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
      "the same as", "=", [term("ac","L","constant",24,"$24"),term("av","L","variable",6,"$6 per lesson"),term("bc","R","constant",40,"$40"),term("bv","R","variable",4,"$4 per lesson"),term("bd","R","constant",-8,"$8")], "after x lessons"),
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
      "Plan A has {ac} and costs {av}. Plan B has {bc}, costs {bv}, and applies {bd} to reduce its bill.",
      "no more than", "≤", [term("ac","L","constant",18,"an $18 fee"),term("av","L","variable",7,"$7 per hour"),term("bc","R","constant",30,"a $30 fee"),term("bv","R","variable",5,"$5 per hour"),term("bd","R","constant",4,"$4")].map(t=>t.id==="bd"?{...t,value:-4}:t), "for x hours"),
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
    ,word("Community pool passes", "Pass A cost", "Pass B cost", "Pass A costs {ac} to start plus {av} per visit. Pass B costs {bc} to start plus {bv} per visit, with {bd} taken off the total.", "at most", "≤", [term("ac","L","constant",16,"$16"),term("av","L","variable",4,"$4 per visit"),term("bc","R","constant",28,"$28"),term("bv","R","variable",3,"$3 per visit"),term("bd","R","constant",-2,"$2 discount")], "after x visits"),
    word("Game points", "Team A points", "Team B points", "Team A begins with {ac} points and loses {av} points in every round. Team B begins with {bc} points and gains {bv} in every round.", "less than", "<", [term("ac","L","constant",52,"52"),term("av","L","variable",-3,"3 points per round"),term("bc","R","constant",20,"20"),term("bv","R","variable",2,"2 points per round")], "after x rounds")
  ];

  // Sign evidence is part of the displayed story, not a separate answer bank.
  const SIGN_STORIES = {
    "Music studio memberships": "Studio A {s:ac:charges} {ac} to join and {s:av:adds} {av} for each lesson. Studio B {s:bc:charges} {bc} to join and {s:bv:adds} {bv} for each lesson, then {s:bd:uses a coupon to take off} {bd} from the total.",
    "Two delivery services": "Courier A {s:ac:charges} {ac} and {s:av:adds} {av}. Courier B {s:bc:charges} {bc} and {s:bv:adds} {bv}, then {s:bd:takes off} {bd} from the final bill.",
    "Arcade points": "Mira {s:ac:begins with} {ac} points and {s:av:uses} {av} in each round. Leo {s:bc:begins with} {bc} points and {s:bv:earns} {bv} in each round.",
    "Seedling collections": "Garden A {s:ac:starts with} {ac} seedlings, {s:av:adds} {av} each week, and {s:ad:donates} {ad} seedlings once. Garden B {s:bc:starts with} {bc} and {s:bv:adds} {bv} each week.",
    "Bicycle rental plans": "Plan A {s:ac:charges} {ac} and {s:av:adds} {av}. Plan B {s:bc:charges} {bc} and {s:bv:adds} {bv}, then {s:bd:takes off} {bd} from the bill.",
    "Reading challenge": "Tariq {s:ac:has read} {ac} pages and {s:av:reads} {av} more each day. Nia {s:bc:has read} {bc} pages and {s:bv:reads} {bv} more each day, but {s:bd:removes} {bd} pages after finding duplicates.",
    "Two water tanks": "Tank A {s:ac:contains} {ac} liters and {s:av:drains} {av} per minute. Tank B {s:bc:contains} {bc} liters and {s:bv:drains} {bv} per minute.",
    "Online craft orders": "Shop A {s:ac:collects} {ac} as a service fee and {s:av:adds} {av} for each item, then {s:ad:refunds} {ad} from the service fee. Shop B {s:bc:collects} {bc} and {s:bv:adds} {bv} for each item.",
    "Fundraising jars": "Jar A {s:ac:has} {ac} and {s:av:gains} {av} each day. Jar B {s:bc:has} {bc} and {s:bv:gains} {bv} each day, but {s:bd:spends} {bd} once on supplies.",
    "Two school buses": "Bus A {s:ac:starts with} {ac} riders, {s:av:picks up} {av} at each stop, and {s:ad:lets off} {ad} riders once. Bus B {s:bc:starts with} {bc} and {s:bv:picks up} {bv} at each stop.",
    "Digital storage": "Account A {s:ac:has} {ac} gigabytes available and {s:av:uses} {av} each week. Account B {s:bc:has} {bc} gigabytes available and {s:bv:uses} {bv} each week.",
    "Community pool passes": "Pass A {s:ac:charges} {ac} to start and {s:av:adds} {av} per visit. Pass B {s:bc:charges} {bc} to start and {s:bv:adds} {bv} per visit, then {s:bd:takes off} {bd} from the total.",
    "Game points": "Team A {s:ac:begins with} {ac} points and {s:av:loses} {av} points in every round. Team B {s:bc:begins with} {bc} points and {s:bv:gains} {bv} in every round."
  };
  for (const task of TASKS) if (task.kind === "word") {
    task.context = SIGN_STORIES[task.title];
    task.signPhrases = Object.fromEntries([...task.context.matchAll(/\{s:([a-z0-9]+):([^}]+)\}/g)].map(([,id,phrase])=>[id,phrase]));
  }

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
  const fresh = index => ({ index, phase:index<7?0:4, read:false, question:false, cue:false, picked:new Set(), left:"", right:"", symbol:"", subtraction:"", classifications:{}, signPicked:new Set(), signs:{}, inputs:{}, complete:false });
  window.reset88AQuestion = (data,index) => { for(const key of Object.keys(data)) delete data[key]; Object.assign(data,fresh(index)); };

  function tokenButton(t, data) {
    return `<button type="button" class="a88-token ${data.index<7?`a88-${t.kind}`:"a88-unclassified"}${data.classifications[t.id]?` a88-${data.classifications[t.id]}`:""}${data.picked.has(t.id)?" is-picked":""}" data-token="${esc(t.id)}" aria-pressed="${data.picked.has(t.id)}" title="Select this ${t.kind === "variable" ? "variable term" : "constant"}">${esc(t.label)}</button>`;
  }
  function geometryFigure(task, side, data) {
    const groups = side === "L" ? task.leftGroups : task.rightGroups;
    const isArea = groups.some(g=>g.factor);
    return `<article class="a88-figure"><strong>${esc(side==="L"?task.left:task.right)}</strong><div class="a88-shape ${isArea?"is-area":groups.length===3?"is-triangle":"is-rectangle"}" aria-label="Labeled ${isArea?"area":"perimeter"} figure"><div class="a88-dimensions">${groups.map(g=>`<div class="a88-dimension"><small>${esc(g.name)}${g.multiplier>1&&!g.factor?` · ${g.multiplier} sides`:""}</small><div>${g.factor?`${tokenButton(g.factor,data)} · (`:""}${g.terms.map(t=>tokenButton(t,data)).join(" ")}${g.factor?")":""}</div></div>`).join("")}</div></div></article>`;
  }
  function scene(task,data) {
    if (task.kind==="geometry") return `<p class="a88-scene-note">${esc(task.note)}</p><div class="a88-figures">${geometryFigure(task,"L",data)}${geometryFigure(task,"R",data)}</div>`;
    const byId=Object.fromEntries(task.terms.map(t=>[t.id,t]));
    return `<p class="a88-story">${esc(task.context).replace(/\{s:([a-z0-9]+):([^}]+)\}|\{([a-z0-9]+)\}/g,(_,signId,phrase,termId)=>signId?`<button type="button" class="a88-sign-cue a88-${byId[signId]?.kind||"constant"}${data.signPicked.has(signId)?" is-picked":""}" data-sign-cue="${signId}" aria-pressed="${data.signPicked.has(signId)}">${esc(phrase)}</button>`:byId[termId]?tokenButton(byId[termId],data):"")}</p>`;
  }
  function select(name, current, choices, label) {
    return `<label class="a88-select"><span>${esc(label)}</span><select data-select="${name}"><option value="">Choose…</option>${choices.map(([v,text])=>`<option value="${esc(v)}"${current===v?" selected":""}>${esc(text)}</option>`).join("")}</select></label>`;
  }
  function field(key, label, kind, data, suffix="") {
    return `<label class="a88-field a88-${kind}"><span>${esc(label)}</span><span class="a88-entry"><input inputmode="decimal" type="number" step="any" data-input="${esc(key)}" value="${esc(data.inputs[key]??"")}" aria-label="${esc(label)}"><b>${suffix}</b></span></label>`;
  }
  function rawWorkspace(task,data) {
    if(task.kind!=="geometry") return "";
    return `<section class="a88-raw"><h5>Expand each side first</h5><p>Type the contribution of every labeled part. For two equal sides, multiply each part by 2. For area, distribute the height through the width. Include the minus sign when a part is subtracted.</p><div class="a88-raw-grid">${[...task.leftGroups,...task.rightGroups].map(g=>`<div class="a88-raw-group"><strong>${esc(g.name)} ${g.multiplier!==1?`· ${g.multiplier}`:""}</strong>${g.factor?field(`raw-${g.factor.id}`,`Multiplier: ${g.factor.label}`,"constant",data):""}${g.terms.map(t=>field(`raw-${t.id}`,`${t.label} contribution`,t.kind,data,t.kind==="variable"?"x":"")).join("")}</div>`).join("")}</div></section>`;
  }
  function setup(task,data) {
    const signOptions=[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]];
    return `<section class="a88-setup"><div class="a88-template"><span>Structure</span><strong>starting value + rate · x &nbsp; ${esc(data.symbol||"?")} &nbsp; starting value + rate · x</strong><small>A signed value can be negative: adding −2x means subtracting 2x.</small></div>${rawWorkspace(task,data)}<h5>Build the simplified comparison</h5><div class="a88-equation">${field("lc",`${task.left}: starting value`,"constant",data)}<span>+</span>${field("lv",`${task.left}: x coefficient`,"variable",data,"x")}<span class="a88-relation">${esc(data.symbol||"?")}</span>${field("rc",`${task.right}: starting value`,"constant",data)}<span>+</span>${field("rv",`${task.right}: x coefficient`,"variable",data,"x")}</div></section>`;
  }
  function question(task,data) {
    return `<div class="a88-question-wrap"><button type="button" class="a88-question-mark${data.question?" is-picked":""}" data-action="question">Click to identify the question ↓</button><p class="a88-question">When will ${esc(task.left)} be <button type="button" class="a88-cue${data.cue?" is-picked":""}" data-action="cue" aria-pressed="${data.cue}">${esc(task.cue)}</button> ${esc(task.right)} ${esc(task.tail||"for a value of x")}? Write ${task.relation==="="?"an equation":"an inequality"} to represent the comparison.</p></div>`;
  }
  const flipped = symbol => ({ "<":">", ">":"<", "≤":"≥", "≥":"≤", "=":"=" })[symbol];
  const symbolFor = (task,firstSide) => firstSide==="R"?flipped(task.relation):task.relation;
  function finalForm(task,data,n,firstSide) {
    const secondSide=firstSide==="R"?"L":"R";
    const sideName=side=>side==="L"?task.left:task.right;
    const side=(code,position)=>{
      const prefix="f"+n+"-"+position;
      const way=n===1?"First way":"Reversed way";
      return `<div class="a88-final-side"><strong>${esc(sideName(code))}</strong><div class="a88-inline-terms"><label class="a88-final-part a88-constant"><span>Constant</span><input type="text" inputmode="decimal" data-input="${prefix}-constant" value="${esc(data.inputs[prefix+"-constant"]||"")}" placeholder="24" aria-label="${way} ${esc(sideName(code))} signed constant"></label><label class="a88-final-part a88-variable"><span>Variable term</span><span class="a88-inline-variable"><input type="text" inputmode="decimal" data-input="${prefix}-variable" value="${esc(data.inputs[prefix+"-variable"]||"")}" placeholder="+6" aria-label="${way} ${esc(sideName(code))} signed variable coefficient"><b>x</b></span></label></div></div>`;
    };
    return `<div class="a88-form"><h6>${n===1?"First way":"Same comparison, sides reversed"}</h6><div class="a88-form-line">${side(firstSide,"left")}${select("f"+n+"-symbol",data["f"+n+"-symbol"]||"",[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]],`${n===1?"First way":"Reversed way"} symbol`)}${side(secondSide,"right")}</div></div>`;
  }
  function present(task,data) {
    const guided=data.index<7, relationReady=!guided||data.phase>=1, variableReady=!guided||data.phase>=2, constantReady=!guided||data.phase>=3, buildReady=!guided||data.phase>=4;
    const choices=`<div class="a88-choices">${select("left",data.left,[["L",task.left],["R",task.right]],"First situation")}${select("symbol",data.symbol,[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]],"Purple: relationship")}${select("right",data.right,[["L",task.left],["R",task.right]],"Second situation")}</div>`;
    const signRow=t=>task.kind!=="word"?"":`<div class="a88-sign-row">${guided?select("sign-"+t.id,data.signs[t.id]||"",[["positive","Positive (+)"],["negative","Negative (−)"]],`Is ${t.label} positive or negative?`):""}<label class="a88-sign-evidence"><span>${guided?"Click the word or phrase on the left that tells you the sign":"Click the sign phrase on the left, then type it here"}</span><input type="text" data-input="phrase-${t.id}" aria-label="Sign phrase for ${esc(t.label)}" value="${esc(data.inputs["phrase-"+t.id]||"")}" placeholder="Word or phrase from the problem"></label></div>`;
    const category=(kind)=>`<div class="a88-category a88-${kind}"><strong>${kind==="variable"?"Blue · variable terms":"Green · constants"}</strong><p>Click every ${kind==="variable"?"rate or x term":"starting value or fixed amount"} in the problem or figure${task.kind==="word"?", then click the word or phrase that shows whether each one is added or taken away":""}.</p><div class="a88-category-fields">${task.terms.filter(t=>t.kind===kind).map(t=>`<div class="a88-part">${field("part-"+t.id,`${t.side==="L"?task.left:task.right}: ${t.label}`,kind,data,t.kind==="variable"?"x":"")}${signRow(t)}</div>`).join("")}</div><p class="a88-selected">Selected ${task.terms.filter(t=>t.kind===kind&&data.picked.has(t.id)).length} of ${task.terms.filter(t=>t.kind===kind).length} ${kind} parts</p></div>`;
    const subtraction=select("subtraction",data.subtraction,[["none","Neither side subtracts"],["constant","A constant"],["variable","A variable term"],["both","Both types"]],"What is subtracted?");
    return `<div class="a88-lab"><div class="a88-task-head"><span>${guided?"Guided pathway":"Independent practice"} · ${data.index+1} of ${TASKS.length}</span><h4>${esc(task.title)}</h4></div><div class="a88-columns"><section class="a88-panel a88-problem"><h5>Read the complete problem</h5>${scene(task,data)}${question(task,data)}<button type="button" class="a88-read${data.read?" is-done":""}" data-action="read">${data.read?"✓ Entire problem read":"I read the entire problem and question"}</button></section><section class="a88-panel a88-process"><h5>Build the comparison</h5>${relationReady?`<div class="a88-stage a88-comparison"><strong>${guided?"1 · Find the question and click its purple relationship phrase":"Question and relationship"}</strong><p>Click the question on the left, then click the word or phrase that gives the relationship. Either situation may go on the left. If you reverse their order, reverse the inequality symbol too.</p>${choices}${guided&&data.phase===1?`<button type="button" class="lab-action a88-check" data-action="relation">Check relationship → variable terms</button>`:""}</div>`:"<p>Read the question on the left before choosing the symbol.</p>"}${variableReady?`<div class="a88-stage">${category("variable")}${guided&&data.phase===2?`<button type="button" class="lab-action a88-check" data-action="variables">Check variable terms → constants</button>`:""}</div>`:""}${constantReady?`<div class="a88-stage">${category("constant")}${subtraction}${guided&&data.phase===3?`<button type="button" class="lab-action a88-check" data-action="constants">Check constants → write comparison</button>`:""}</div>`:""}${buildReady?`<div class="a88-stage"><h5>Combine and write the comparison</h5>${rawWorkspace(task,data)}<p class="a88-build-instruction">Combine the green constants and blue variable terms for each situation. Type each signed value into the green and blue boxes. Start a negative term with −. Do not put + before the first positive term; put + before a positive variable term that follows the constant. Choose the relationship symbol from the dropdown.</p>${finalForm(task,data,1,data.left||"L")}${task.relation!=="="?`<p class="a88-flip-note">Now put the other situation first. The relationship stays true when the inequality symbol points the other way.</p>${finalForm(task,data,2,data.left==="R"?"L":"R")}`:""}<button type="button" class="lab-action a88-check" data-action="check">Check my answer</button></div>`:""}${data.complete?`<section class="a88-success"><strong>Correct comparison!</strong><button type="button" class="lab-next" data-action="next">${data.index===TASKS.length-1?"Finish lab":"Next question →"}</button></section>`:""}</section></div></div>`;
  }

  function parseSide(raw) {
    const compact=raw.replace(/\s+/g,"").replace(/[×·]/g,"*").replace(/−/g,"-");
    if(!/^[+\-]?\d*(?:\.\d+)?(?:\*?x)?(?:[+\-]\d*(?:\.\d+)?(?:\*?x)?)*$/i.test(compact)||!compact)return null;
    const parts=compact.match(/[+\-]?[^+\-]+/g)||[];
    let constant=0,variable=0;
    for(const part of parts) {
      if(part.toLowerCase().includes("x")) {
        const coefficient=part.toLowerCase().replace(/\*?x/,"");
        variable+=coefficient===""||coefficient==="+"?1:coefficient==="-"?-1:Number(coefficient);
      } else constant+=Number(part);
    }
    return {constant,variable};
  }
  function validEquation(raw,task) {
    const match=raw.match(/^(.+?)(≤|≥|=|<|>)(.+)$/);
    if(!match||match[2]!==task.relation)return false;
    const left=parseSide(match[1]),right=parseSide(match[3]),L=totals(task,"L"),R=totals(task,"R");
    return !!left&&!!right&&Math.abs(left.constant-L.constant)<.0001&&Math.abs(left.variable-L.variable)<.0001&&Math.abs(right.constant-R.constant)<.0001&&Math.abs(right.variable-R.variable)<.0001;
  }
  function subtractionKind(task) {
    const types=[...new Set(task.terms.filter(t=>!t.factor&&t.value<0).map(t=>t.kind))];
    return types.length===2?"both":types[0]||"none";
  }

  window.render88ALab = function({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}) {
    if (!labRuntime.data) labRuntime.data=fresh(0);
    const data=labRuntime.data, task=TASKS[data.index], guided=data.index<7; 
    data.signPicked ||= new Set(); data.signs ||= {};
    setLabProgress(data.index,TASKS.length,guided?`Guided ${data.index+1} of 7: read → compare → collect terms → build.`:`Independent ${data.index-6} of 12: complete the steps in any order.`);
    $("#standardsLabBody").innerHTML=present(task,data);
    syncWhiteboardQuestion();
    const body=$("#standardsLabBody");
    body.querySelectorAll("[data-token]").forEach(button=>button.addEventListener("click",()=>{
      const id=button.dataset.token, t=task.terms.find(part=>part.id===id);
      if(guided) {
        const expected=data.phase===2?"variable":data.phase===3?"constant":null;
        if(t.kind!==expected)return setLabFeedback("Finish the current color step first.","incorrect");
        data.picked.has(id)?data.picked.delete(id):data.picked.add(id);
      } else {
        const next=data.classifications[id]==="variable"?"constant":data.classifications[id]==="constant"?"": "variable";
        if(next){data.classifications[id]=next;data.picked.add(id);}else{delete data.classifications[id];data.picked.delete(id);}
      }
      window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});
      setLabFeedback(guided?"Selected part. Keep its sign when typing it on the right.":"Click again to change blue to green; click a third time to clear.");
    }));
    body.querySelectorAll("[data-sign-cue]").forEach(button=>button.addEventListener("click",()=>{
      const id=button.dataset.signCue;
      data.signPicked.has(id)?data.signPicked.delete(id):data.signPicked.add(id);
      button.classList.toggle("is-picked",data.signPicked.has(id));
      button.setAttribute("aria-pressed",String(data.signPicked.has(id)));
      setLabFeedback("Use this phrase as evidence for whether the amount is added or taken away.");
    }));
    body.querySelectorAll("[data-select]").forEach(el=>el.addEventListener("change",()=>{if(el.dataset.select.startsWith("sign-"))data.signs[el.dataset.select.slice(5)]=el.value;else data[el.dataset.select]=el.value; if(!guided&&el.dataset.select==="left")window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}); }));
    body.querySelectorAll("[data-input]").forEach(el=>el.addEventListener("input",()=>{data.inputs[el.dataset.input]=el.value;}));
    body.querySelectorAll("[data-action]").forEach(button=>button.addEventListener("click",()=>{
      const action=button.dataset.action;
      if(action==="read"){data.read=true;if(guided&&data.phase===0)data.phase=1;window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Now read the question. Click its relationship phrase.");return;}
      if(action==="no-like"){data.noLike=button.checked;return;}
      if(action==="question"){if(!data.read)return setLabFeedback("Read the entire problem and question first.","incorrect");data.question=true;button.classList.add("is-picked");setLabFeedback("Now click the relationship phrase within that question.");return;}
      if(action==="cue"){if(!data.question)return setLabFeedback("First click to identify the full question.","incorrect");if(guided&&!data.read)return setLabFeedback("Read the entire problem first.","incorrect");data.cue=true;button.classList.add("is-picked");button.setAttribute("aria-pressed","true");setLabFeedback("You found the phrase. Match it to the comparison symbol.");return;}
      const relationship=()=>data.cue&&["L","R"].includes(data.left)&&data.right===(data.left==="L"?"R":"L")&&data.symbol===symbolFor(task,data.left);
      if(action==="relation"){
        if(!data.read)return setLabFeedback("Read the whole situation before building the comparison.","incorrect");
        if(!data.question||!data.cue)return setLabFeedback("Click the purple relationship phrase in the question first.","incorrect");
        if(!relationship())return setLabFeedback("Check which situation is on each side and which way the symbol points.","incorrect");
        data.phase=2;window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("The template is ready. Select each term in the story or figure, then fill the boxes.","correct");return;
      }
      if(action==="variables"||action==="constants"){
        const kind=action==="variables"?"variable":"constant";
        const parts=task.terms.filter(t=>t.kind===kind);
        if(parts.some(t=>!data.picked.has(t.id)))return setLabFeedback(`Click every ${kind} part on the left first.`,"incorrect");
        if(task.kind==="word"&&parts.some(t=>!data.signPicked.has(t.id)||String(data.inputs["phrase-"+t.id]||"").trim().toLowerCase()!==task.signPhrases[t.id].toLowerCase()||data.signs[t.id]!== (t.value<0?"negative":"positive")))return setLabFeedback("For each part, click its sign phrase in the problem, choose positive or negative, and type that phrase exactly.","incorrect");
        if(parts.some(t=>!close(data.inputs["part-"+t.id]??"",t.value)))return setLabFeedback(`Type the signed value of each ${kind} part on the right, including a minus when the story subtracts it.`,"incorrect");
        if(kind==="constant"&&data.subtraction!==subtractionKind(task))return setLabFeedback("Identify which kind of part the problem subtracts.","incorrect");
        data.phase=kind==="variable"?3:4;
        window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});
        setLabFeedback(kind==="variable"?"Now identify the green constants.":"Now combine like terms and write the complete comparison.","correct");return;
      }
      if(action==="check"){
        if(!data.read)return setLabFeedback("First read the entire problem and question.","incorrect");
        if(!data.question||!relationship())return setLabFeedback("Click the question's purple phrase and choose the correct order and symbol.","incorrect");
        if(!guided&&task.terms.some(t=>!close(data.inputs["part-"+t.id]??"",t.value)))return setLabFeedback("Enter every signed blue or green part in its matching box before checking the final comparison.","incorrect");
        if(task.kind==="word"&&task.terms.some(t=>!data.signPicked.has(t.id)||String(data.inputs["phrase-"+t.id]||"").trim().toLowerCase()!==task.signPhrases[t.id].toLowerCase()||guided&&data.signs[t.id]!== (t.value<0?"negative":"positive")))return setLabFeedback("Click each sign phrase and type the matching words beside its term. Guided questions also need a positive or negative choice.","incorrect");
        const missing=task.terms.filter(t=>!data.picked.has(t.id));
        if(!guided&&task.terms.some(t=>data.classifications[t.id]!==t.kind))return setLabFeedback("Classify each clicked part as blue for variable or green for constant. Click a part again to change its color.","incorrect");
        if(missing.length)return setLabFeedback(`Select all blue and green parts in the ${task.kind==="geometry"?"figures":"story"}. ${missing.length} ${missing.length===1?"part remains":"parts remain"}.`,"incorrect");
        const negativeKinds=[...new Set(task.terms.filter(t=>!t.factor&&t.value<0).map(t=>t.kind))];
        if(!negativeKinds.includes(data.subtraction))return setLabFeedback("Look for the minus, discount, drain, or amount taken away. Is a constant or a variable term being subtracted?","incorrect");
        if(task.kind==="geometry"){
          for(const g of [...task.leftGroups,...task.rightGroups]){
            if(g.factor&&!close(data.inputs[`raw-${g.factor.id}`]??"",g.multiplier))return setLabFeedback(`Enter the multiplier for ${g.name} before distributing.`,"incorrect");
            for(const t of g.terms){if(!close(data.inputs[`raw-${t.id}`]??"",t.value*g.multiplier))return setLabFeedback(`Revisit ${g.name}: multiply ${t.label} by ${g.multiplier}, keeping its sign.`,"incorrect");}
          }
        }
        const signedValue=(raw,afterFirst)=>{
          const input=String(raw??"").trim().replace(/−/g,"-");
          const valid=afterFirst?/^[+-](?:\d+(?:\.\d+)?|\.\d+)$/:/^-?(?:\d+(?:\.\d+)?|\.\d+)$/;
          return valid.test(input)?Number(input):NaN;
        };
        const checkForm=(n,firstSide)=>{
          const other=firstSide==="L"?"R":"L";
          if(data["f"+n+"-symbol"]!==symbolFor(task,firstSide))return false;
          for(const [position,side] of [["left",firstSide],["right",other]]){
            const sum=totals(task,side);
            for(const [kind,expected] of [["constant",sum.constant],["variable",sum.variable]]){
              const entered=signedValue(data.inputs[`f${n}-${position}-${kind}`],kind==="variable");
              if(!Number.isFinite(entered)||Math.abs(entered-expected)>0.0001)return false;
            }
          }
          return true;
        };
        if(!checkForm(1,data.left))return setLabFeedback("Check the signs, term amounts, and symbol for the first comparison. The symbol must match the situations in the order shown.","incorrect");
        if(task.relation!=="="&&!checkForm(2,data.left==="L"?"R":"L"))return setLabFeedback("Reverse the situations for the second comparison. Keep each expression with its situation and reverse the inequality symbol.","incorrect");
        data.complete=true;button.disabled=true;body.querySelector(".a88-success")?.remove();window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Correct! Both complete expressions and the comparison symbol fit the question.","correct");return;
      }
      if(action==="next"){
        if(data.index===TASKS.length-1){setLabProgress(TASKS.length,TASKS.length,"All comparisons complete.");showLabCompletion("8.8A");body.querySelector(".a88-lab").hidden=true;return;}
        window.reset88AQuestion(data,data.index+1);window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Read the next situation before deciding which relationship it describes.");
      }
    }));
  };
})();
