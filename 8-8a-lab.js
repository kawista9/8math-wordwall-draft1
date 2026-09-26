(() => {
  const term = (id, side, kind, value, label) => ({ id, side, kind, value, label });
  const word = (title, left, right, context, cue, relation, terms, tail = "when their amounts are compared") =>
    ({ title, kind: "word", left, right, context, cue, relation, terms, tail });
  const group = (name, multiplier, terms, factor) => ({ name, multiplier, terms, factor });
  const shape = (title, left, right, cue, relation, leftGroups, rightGroups, note) =>
    ({ title, kind: "geometry", left, right, cue, relation, leftGroups, rightGroups, note,
      terms: [...leftGroups, ...rightGroups].flatMap(g => [...g.terms, ...(g.factor ? [g.factor] : [])]) });

  const singleShape = (title,left,right,statement,question,cue,relation,figureType,figureSide,leftGroups,rightGroups,note) =>
    ({ title,kind:"geometry",left,right,statement,question,cue,relation,figureType,figureSide,leftGroups,rightGroups,note,
      terms:[...leftGroups,...rightGroups].flatMap(g=>g.terms) });

  // Seven guided tasks come first, followed by twelve independent tasks.
  const TASKS = [
    word("Music studio memberships", "Studio A", "Studio B",
      "Studio A charges {ac} to join and {av} for each lesson. Studio B charges {bc} to join and {bv} for each lesson, with no other fees.",
      "the same as", "=", [term("ac","L","constant",24,"$24"),term("av","L","variable",6,"$6 per lesson"),term("bc","R","constant",40,"$40"),term("bv","R","variable",4,"$4 per lesson")], "after x lessons"),
    word("Two delivery services", "Courier A", "Courier B",
      "Courier A charges {ac} plus {av}. Courier B charges {bc} plus {bv}.",
      "at most", "≤", [term("ac","L","constant",15,"$15 to start"),term("av","L","variable",2.5,"$2.50 per mile"),term("bc","R","constant",28,"$28 to start"),term("bv","R","variable",2,"$2 per mile")], "for x miles"),
    word("Arcade points", "Mira's balance", "Leo's balance",
      "Mira begins with {ac} points and uses {av} in each round. Leo begins with {bc} points and earns {bv} in each round.",
      "greater than", ">", [term("ac","L","constant",60,"60"),term("av","L","variable",-2,"2 points per round"),term("bc","R","constant",18,"18"),term("bv","R","variable",3,"3 points per round")], "after x rounds"),
    word("Seedling collections", "Garden A", "Garden B",
      "Garden A starts with {ac} seedlings, adds {av} each week. Garden B starts with {bc} and adds {bv} each week.",
      "at least", "≥", [term("ac","L","constant",12,"12"),term("av","L","variable",5,"5 seedlings"),term("bc","R","constant",7,"7"),term("bv","R","variable",6,"6 seedlings")], "after x weeks"),
    singleShape("Triangle perimeter", "given perimeter", "sum of side lengths",
      "The perimeter of the triangle shown is {p} units. The side lengths are shown in units.",
      "Which equation shows that the perimeter is {cue} the sum of the three side lengths?",
      "equal to","=","triangle","R",
      [group("given perimeter",1,[term("p","L","variable",19,"19x")])],
      [group("left side",1,[term("s1","R","constant",13,"13")]),
       group("right side",1,[term("s2","R","constant",13,"13")]),
       group("base",1,[term("s3","R","variable",7,"7x")])],
      "Use the three labeled sides to represent the perimeter."),
    singleShape("Rectangle side lengths", "length AB", "width AD",
      "Rectangle ABCD is shown with its dimensions in units.",
      "The length of AB is {cue} the length of AD. Which inequality represents this comparison?",
      "greater than",">","rectangle","both",
      [group("top side AB",1,[term("lv","L","variable",5,"5x"),term("lc","L","constant",9,"+ 9")])],
      [group("left side AD",1,[term("wv","R","variable",2,"2x"),term("wc","R","constant",21,"+ 21")])],
      "Compare the labeled length and width."),
    singleShape("Quadrilateral perimeter", "given perimeter", "sum of side lengths",
      "The perimeter of the quadrilateral shown is {pv} {pc} units. Its four side lengths are labeled.",
      "Which equation shows that the perimeter is {cue} the sum of the four side lengths?",
      "equal to","=","quadrilateral","R",
      [group("given perimeter",1,[term("pv","L","variable",21,"21x"),term("pc","L","constant",10,"+ 10")])],
      [group("top",1,[term("t1v","R","variable",3,"3x"),term("t1c","R","constant",4,"+ 4")]),
       group("right",1,[term("t2v","R","variable",5,"5x"),term("t2c","R","constant",7,"+ 7")]),
       group("bottom",1,[term("t3v","R","variable",6,"6x"),term("t3c","R","constant",-2,"− 2")]),
       group("left",1,[term("t4v","R","variable",2,"2x"),term("t4c","R","constant",5,"+ 5")])],
      "Add each of the four labeled side lengths."),
    word("Bicycle rental plans", "Plan A", "Plan B",
      "Plan A has {ac} and costs {av}. Plan B has {bc}, costs {bv}.",
      "no more than", "≤", [term("ac","L","constant",18,"an $18 fee"),term("av","L","variable",7,"$7 per hour"),term("bc","R","constant",30,"a $30 fee"),term("bv","R","variable",5,"$5 per hour")], "for x hours"),
    word("Reading challenge", "Tariq's pages", "Nia's pages",
      "Tariq has read {ac} pages and reads {av} each day. Nia has read {bc} pages and reads {bv} each day.",
      "the same as", "=", [term("ac","L","constant",35,"35"),term("av","L","variable",12,"12 pages"),term("bc","R","constant",58,"58"),term("bv","R","variable",9,"9 pages")], "after x days"),
    word("Two water tanks", "Tank A", "Tank B",
      "Tank A contains {ac} liters and drains {av} per minute. Tank B contains {bc} liters and drains {bv} per minute.",
      "less than", "<", [term("ac","L","constant",90,"90"),term("av","L","variable",-3.5,"3.5 liters"),term("bc","R","constant",72,"72"),term("bv","R","variable",-2,"2 liters")], "after x minutes"),
    singleShape("Rectangular frame perimeter", "given perimeter", "sum of four sides",
      "The perimeter of rectangle ABCD is {pv} {pc} units. The length and width are labeled in units.",
      "Which equation shows that the perimeter is {cue} the sum of all four side lengths?",
      "equal to","=","rectangle","R",
      [group("given perimeter",1,[term("pv","L","variable",24,"24x"),term("pc","L","constant",8,"+ 8")])],
      [group("top side AB (2 copies)",2,[term("lv","R","variable",4,"4x"),term("lc","R","constant",3,"+ 3")]),
       group("left side AD (2 copies)",2,[term("wv","R","variable",3,"3x"),term("wc","R","constant",5,"+ 5")])],
      "Opposite sides of a rectangle have equal lengths. Include two lengths and two widths."),
    word("Apple orders", "Orchard A cost", "Orchard B cost",
      "Orchard A charges {av} for apples and {as} for delivery. Orchard B charges {bv} for apples and {bs} to deliver each pound.",
      "less than", "<", [term("av","L","variable",2,"$2 per pound"),term("as","L","variable",0.5,"$0.50 per pound"),term("bv","R","variable",2.25,"$2.25 per pound"),term("bs","R","variable",0.75,"$0.75 per pound")], "for x pounds of apples"),
    word("Fundraising jars", "Jar A", "Jar B",
      "Jar A has {ac} and gains {av} each day. Jar B has {bc} and gains {bv} each day.",
      "equal", "=", [term("ac","L","constant",44,"$44"),term("av","L","variable",3.25,"$3.25"),term("bc","R","constant",26,"$26"),term("bv","R","variable",5.25,"$5.25")], "after x days"),
    singleShape("Triangle and ribbon", "triangle perimeter", "ribbon length",
      "A ribbon is {rv} {rc} centimeters long. The side lengths of the triangle are shown in centimeters.",
      "The triangle's perimeter must be {cue} the ribbon length. Which inequality represents this situation?",
      "no greater than","≤","triangle","L",
      [group("left side",1,[term("s1v","L","variable",4,"4x"),term("s1c","L","constant",2,"+ 2")]),
       group("right side",1,[term("s2v","L","variable",5,"5x"),term("s2c","L","constant",3,"+ 3")]),
       group("base",1,[term("s3v","L","variable",3,"3x"),term("s3c","L","constant",6,"+ 6")])],
      [group("ribbon length",1,[term("rv","R","variable",18,"18x"),term("rc","R","constant",15,"+ 15")])],
      "Add the three side lengths, then compare the perimeter with the ribbon."),
    word("Two school buses", "Bus A riders", "Bus B riders",
      "Bus A starts with {ac} riders, picks up {av} at each stop. Bus B starts with {bc} and picks up {bv} at each stop.",
      "more than", ">", [term("ac","L","constant",22,"22"),term("av","L","variable",4,"4 riders"),term("bc","R","constant",10,"10"),term("bv","R","variable",5,"5 riders")], "after x stops"),
    word("Digital storage", "Account A", "Account B",
      "Account A has {ac} gigabytes available and uses {av} each week. Account B has {bc} gigabytes available and uses {bv} each week.",
      "at least", "≥", [term("ac","L","constant",48,"48"),term("av","L","variable",-1.5,"1.5 gigabytes"),term("bc","R","constant",30,"30"),term("bv","R","variable",-0.75,"0.75 gigabytes")], "after x weeks"),
    singleShape("Quadrilateral wire frame", "frame perimeter", "wire length",
      "A piece of wire is {wv} {wc} centimeters long. The side lengths of the frame are shown in centimeters.",
      "The frame's perimeter must be {cue} the wire length. Which inequality represents this situation?",
      "less than","<","quadrilateral","L",
      [group("top",1,[term("t1v","L","variable",3,"3x"),term("t1c","L","constant",1,"+ 1")]),
       group("right",1,[term("t2v","L","variable",4,"4x"),term("t2c","L","constant",2,"+ 2")]),
       group("bottom",1,[term("t3v","L","variable",5,"5x"),term("t3c","L","constant",3,"+ 3")]),
       group("left",1,[term("t4v","L","variable",2,"2x"),term("t4c","L","constant",4,"+ 4")])],
      [group("wire length",1,[term("wv","R","variable",19,"19x"),term("wc","R","constant",8,"+ 8")])],
      "Add the four sides, then compare the perimeter with the wire."),
    word("Community pool passes", "Pass A cost", "Pass B cost", "Pass A costs {ac} to start plus {av} per visit. Pass B costs {bc} to start plus {bv} per visit.", "at most", "≤", [term("ac","L","constant",16,"$16"),term("av","L","variable",4,"$4 per visit"),term("bc","R","constant",28,"$28"),term("bv","R","variable",3,"$3 per visit")], "after x visits"),
    word("Game points", "Team A points", "Team B points", "Team A begins with {ac} points and loses {av} points in every round. Team B begins with {bc} points and gains {bv} in every round.", "less than", "<", [term("ac","L","constant",52,"52"),term("av","L","variable",-3,"3 points per round"),term("bc","R","constant",20,"20"),term("bv","R","variable",2,"2 points per round")], "after x rounds")
  ];

  // Sign evidence is part of the displayed story, not a separate answer bank.
  const SIGN_STORIES = {
    "Music studio memberships": "Studio A {s:ac:charges} {ac} to join and {s:av:adds} {av} for each lesson. Studio B {s:bc:charges} {bc} to join and {s:bv:adds} {bv} for each lesson, with no other fees.",
    "Two delivery services": "Courier A {s:ac:charges} {ac} and {s:av:adds} {av}. Courier B {s:bc:charges} {bc} and {s:bv:adds} {bv}.",
    "Arcade points": "Mira {s:ac:begins with} {ac} points and {s:av:uses} {av} in each round. Leo {s:bc:begins with} {bc} points and {s:bv:earns} {bv} in each round.",
    "Seedling collections": "Garden A {s:ac:starts with} {ac} seedlings, {s:av:adds} {av} each week. Garden B {s:bc:starts with} {bc} and {s:bv:adds} {bv} each week.",
    "Bicycle rental plans": "Plan A {s:ac:charges} {ac} and {s:av:adds} {av}. Plan B {s:bc:charges} {bc} and {s:bv:adds} {bv}.",
    "Reading challenge": "Tariq {s:ac:has read} {ac} pages and {s:av:reads} {av} more each day. Nia {s:bc:has read} {bc} pages and {s:bv:reads} {bv} more each day.",
    "Two water tanks": "Tank A {s:ac:contains} {ac} liters and {s:av:drains} {av} per minute. Tank B {s:bc:contains} {bc} liters and {s:bv:drains} {bv} per minute.",
    "Apple orders": "Orchard A {s:av:charges} {av} for apples and {s:as:adds} {as} for delivery. Orchard B {s:bv:charges} {bv} for apples and {s:bs:adds} {bs} for delivery.",
    "Fundraising jars": "Jar A {s:ac:has} {ac} and {s:av:gains} {av} each day. Jar B {s:bc:has} {bc} and {s:bv:gains} {bv} each day.",
    "Two school buses": "Bus A {s:ac:starts with} {ac} riders, {s:av:picks up} {av} at each stop. Bus B {s:bc:starts with} {bc} and {s:bv:picks up} {bv} at each stop.",
    "Digital storage": "Account A {s:ac:has} {ac} gigabytes available and {s:av:uses} {av} each week. Account B {s:bc:has} {bc} gigabytes available and {s:bv:uses} {bv} each week.",
    "Community pool passes": "Pass A {s:ac:charges} {ac} to start and {s:av:adds} {av} per visit. Pass B {s:bc:charges} {bc} to start and {s:bv:adds} {bv} per visit.",
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
  const fresh = index => ({ index, phase:index<7?0:4, read:false, question:false, cue:false, picked:new Set(), left:"", right:"", symbol:"", classifications:{}, signPicked:new Set(), signs:{}, inputs:{}, complete:false });
  window.reset88AQuestion = (data,index) => { for(const key of Object.keys(data)) delete data[key]; Object.assign(data,fresh(index)); };

  function tokenButton(t, data) {
    return `<button type="button" class="a88-token ${data.index<7?`a88-${t.kind}`:"a88-unclassified"}${data.classifications[t.id]?` a88-${data.classifications[t.id]}`:""}${data.picked.has(t.id)?" is-picked":""}" data-token="${esc(t.id)}" aria-pressed="${data.picked.has(t.id)}" title="Select this ${t.kind === "variable" ? "variable term" : "constant"}">${esc(t.label)}</button>`;
  }
  function geometryFigure(task,data) {
    const groups=task.figureSide==="both"?[...task.leftGroups,...task.rightGroups]:task.figureSide==="L"?task.leftGroups:task.rightGroups;
    const positions=task.figureType==="triangle"?["edge-left","edge-right","edge-bottom"]:task.figureType==="rectangle"?["edge-top","edge-left"]:["edge-top","edge-right","edge-bottom","edge-left"];
    const outline=task.figureType==="triangle"?"<polygon points='50,8 8,83 92,83'/>":task.figureType==="rectangle"?"<rect x='15' y='16' width='70' height='65'/>":"<polygon points='22,14 78,14 90,78 10,78'/>";
    const vertices=task.figureType==="rectangle"?"<text x='11' y='13'>A</text><text x='86' y='13'>B</text><text x='86' y='92'>C</text><text x='7' y='92'>D</text>":"";
    return `<figure class="a88-single-figure a88-${task.figureType}"><svg viewBox="0 0 100 100" role="img" aria-label="Labeled ${task.figureType}"><g class="a88-outline">${outline}</g><g class="a88-vertices">${vertices}</g></svg>${groups.map((g,i)=>`<div class="a88-figure-label ${positions[i]}">${g.terms.map(t=>tokenButton(t,data)).join("")}</div>`).join("")}</figure>`;
  }
  function scene(task,data) {
    const byId=Object.fromEntries(task.terms.map(t=>[t.id,t]));
    if (task.kind==="geometry") return `<p class="a88-story a88-geometry-statement">${esc(task.statement).replace(/\{([a-z0-9]+)\}/g,(_,id)=>byId[id]?tokenButton(byId[id],data):"")}</p>${geometryFigure(task,data)}<p class="a88-scene-note">${esc(task.note)} ${question(task,data)}</p>`;
    return `<p class="a88-story">${esc(task.context).replace(/\{s:([a-z0-9]+):([^}]+)\}|\{([a-z0-9]+)\}/g,(_,signId,phrase,termId)=>signId?`<button type="button" class="a88-sign-cue a88-${byId[signId]?.kind||"constant"}${data.signPicked.has(signId)?" is-picked":""}" data-sign-cue="${signId}" aria-pressed="${data.signPicked.has(signId)}">${esc(phrase)}</button>`:byId[termId]?tokenButton(byId[termId],data):"")} ${question(task,data)}</p>`;
  }
  function select(name, current, choices, label, placeholder="Choose…") {
    return `<label class="a88-select"><span>${esc(label)}</span><select data-select="${name}"><option value="">${esc(placeholder)}</option>${choices.map(([v,text])=>`<option value="${esc(v)}"${current===v?" selected":""}>${esc(text)}</option>`).join("")}</select></label>`;
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
    const cue=`<button type="button" class="a88-cue${data.cue?" is-picked":""}" data-action="cue" aria-pressed="${data.cue}">${esc(task.cue)}</button>`;
    const body=task.kind==="geometry"?esc(task.question).replace("{cue}",cue):`When will ${esc(task.left)} be ${cue} ${esc(task.right)} ${esc(task.tail||"for a value of x")}? Write ${task.relation==="="?"an equation":"an inequality"} to represent the comparison.`;
    return `<span class="a88-question${data.question?" is-picked":""}" data-action="question" role="button" tabindex="0" aria-label="Select the question in the problem" aria-pressed="${data.question}">${body}</span>`;
  }
  const flipped = symbol => ({ "<":">", ">":"<", "≤":"≥", "≥":"≤", "=":"=" })[symbol];
  const symbolFor = (task,firstSide) => firstSide==="R"?flipped(task.relation):task.relation;
  function finalForm(task,data,n,firstSide) {
    const secondSide=firstSide==="R"?"L":"R";
    const sideName=side=>side==="L"?task.left:task.right;
    const side=(code,position)=>{
      const prefix="f"+n+"-"+position;
      const way=n===1?"First way":"Reversed way";
      return `<div class="a88-final-side"><strong>${esc(sideName(code))}</strong><div class="a88-inline-terms">${totals(task,code).constant!==0?`<label class="a88-final-part a88-constant"><span>Constant</span><input type="text" inputmode="decimal" data-input="${prefix}-constant" value="${esc(data.inputs[prefix+"-constant"]||"")}" aria-label="${way} ${esc(sideName(code))} signed constant"></label>`:""}<label class="a88-final-part a88-variable"><span>Variable term</span><span class="a88-inline-variable"><input type="text" inputmode="decimal" data-input="${prefix}-variable" value="${esc(data.inputs[prefix+"-variable"]||"")}" aria-label="${way} ${esc(sideName(code))} signed variable coefficient"><b>x</b></span></label></div></div>`;
    };
    return `<div class="a88-form"><h6>${n===1?"First way":"Same comparison, sides reversed"}</h6><div class="a88-form-line">${side(firstSide,"left")}${select("f"+n+"-symbol",data["f"+n+"-symbol"]||"",[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]],"Symbol","?")}${side(secondSide,"right")}</div></div>`;
  }
  const expression = sum => {
    const c=sum.constant, v=sum.variable;
    const constant=c?fmt(c):"";
    const variable=v?`${c&&v>0?"+ ":v<0?(c?"− ":"−"):""}${fmt(Math.abs(v))}x`:"";
    return [constant,variable].filter(Boolean).join(c?" ":"")||"0";
  };
  const comparison = (task,first) => {
    const other=first==="L"?"R":"L";
    return `${expression(totals(task,first))} ${symbolFor(task,first)} ${expression(totals(task,other))}`;
  };
  function present(task,data) {
    const guided=data.index<7, relationReady=!guided||data.phase>=1, variableReady=!guided||data.phase>=2, constantReady=!guided||data.phase>=3, buildReady=!guided||data.phase>=4;
    const choices=`<div class="a88-choices">${select("left",data.left,[["L",task.left],["R",task.right]],"First situation")}${select("symbol",data.symbol,[["=","="],["<","<"],[">",">"],["≤","≤"],["≥","≥"]],"Purple: relationship")}${select("right",data.right,[["L",task.left],["R",task.right]],"Second situation")}</div>`;
    const signRow=t=>task.kind!=="word"?"":`<div class="a88-sign-row">${guided?select("sign-"+t.id,data.signs[t.id]||"",[["positive","Positive (+)"],["negative","Negative (−)"]],`Is ${t.label} positive or negative?`):""}<label class="a88-sign-evidence"><span>${guided?"Click the word or phrase on the left that tells you the sign":"Click the sign phrase on the left, then type it here"}</span><input type="text" data-input="phrase-${t.id}" aria-label="Sign phrase for ${esc(t.label)}" value="${esc(data.inputs["phrase-"+t.id]||"")}" placeholder="Word or phrase from the problem"></label></div>`;
    const category=(kind)=>`<div class="a88-category a88-${kind}"><strong>${kind==="variable"?"Blue · variable terms":"Green · constants"}</strong><p>${kind==="constant"&&!task.terms.some(t=>t.kind==="constant")?"There is no starting value or fixed amount in this problem. Use only variable terms in the final comparison.":`Click every ${kind==="variable"?"rate or x term":"starting value or fixed amount"} in the problem or figure${task.kind==="word"?", then click the word or phrase that shows whether each one is added or taken away":""}.`}</p><div class="a88-category-fields">${task.terms.filter(t=>t.kind===kind).map(t=>`<div class="a88-part">${field("part-"+t.id,`${t.side==="L"?task.left:task.right}: ${t.label}`,kind,data,t.kind==="variable"?"x":"")}${signRow(t)}</div>`).join("")}</div>${task.terms.some(t=>t.kind===kind)?`<p class="a88-selected">Selected ${task.terms.filter(t=>t.kind===kind&&data.picked.has(t.id)).length} of ${task.terms.filter(t=>t.kind===kind).length} ${kind} parts</p>`:""}</div>`;
    return `<div class="a88-lab"><div class="a88-task-head"><span>${guided?"Guided pathway":"Independent practice"} · ${data.index+1} of ${TASKS.length}</span><h4>${esc(task.title)}</h4></div><div class="a88-columns"><section class="a88-panel a88-problem"><h5>Read the complete problem</h5>${scene(task,data)}<button type="button" class="a88-read${data.read?" is-done":""}" data-action="read">${data.read?"✓ Entire problem read":"I read the entire problem and question"}</button></section><section class="a88-panel a88-process"><h5>Build the comparison</h5>${relationReady?`<div class="a88-stage a88-comparison"><strong>${guided?"1 · Find the question and click its purple relationship phrase":"Question and relationship"}</strong><p>Click the question on the left, then click the word or phrase that gives the relationship. Either situation may go on the left. If you reverse their order, reverse the inequality symbol too.</p>${choices}${guided&&data.phase===1?`<button type="button" class="lab-action a88-check" data-action="relation">Check relationship → variable terms</button>`:""}</div>`:"<p>Read the question on the left before choosing the symbol.</p>"}${variableReady?`<div class="a88-stage">${category("variable")}${guided&&data.phase===2?`<button type="button" class="lab-action a88-check" data-action="variables">Check variable terms → constants</button>`:""}</div>`:""}${constantReady?`<div class="a88-stage">${category("constant")}${guided&&data.phase===3?`<button type="button" class="lab-action a88-check" data-action="constants">Check constants → write comparison</button>`:""}</div>`:""}${buildReady?`<div class="a88-stage"><h5>Combine and write the comparison</h5><p class="a88-build-instruction">Combine the green constants and blue variable terms for each situation. Type each signed value into the green and blue boxes. When a situation has no fixed amount, its final expression has only a variable term. Start a negative term with −. Do not put + before the first positive term; put + before a positive variable term that follows a constant. Choose the relationship symbol from the dropdown.</p>${finalForm(task,data,1,data.left||"L")}${task.relation!=="="?`<p class="a88-flip-note">Now put the other situation first. The relationship stays true when the inequality symbol points the other way.</p>${finalForm(task,data,2,data.left==="R"?"L":"R")}`:""}<button type="button" class="lab-action a88-check" data-action="check">Check my answer</button></div>`:""}${data.complete?`<section class="a88-success"><strong>Correct comparison! Here is the complete ${task.relation==="="?"equation":"inequality"}:</strong><p class="a88-completed-equation">${esc(comparison(task,data.left||"L"))}</p>${task.relation!=="="?`<p class="a88-completed-reverse">Sides reversed: <strong>${esc(comparison(task,data.left==="L"?"R":"L"))}</strong></p>`:""}<button type="button" class="lab-next" data-action="next">${data.index===TASKS.length-1?"Finish lab":"Next question →"}</button></section>`:""}</section></div></div>`;
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
    body.querySelectorAll("[data-action]").forEach(button=>button.addEventListener("click",(event)=>{
      const action=button.dataset.action;
      if(action==="read"){data.read=true;if(guided&&data.phase===0)data.phase=1;window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Now read the question. Click its relationship phrase.");return;}
      if(action==="no-like"){data.noLike=button.checked;return;}
      if(action==="question"){if(!data.read)return setLabFeedback("Read the entire problem and question first.","incorrect");data.question=true;button.classList.add("is-picked");button.setAttribute("aria-pressed","true");setLabFeedback("Now click the relationship phrase within that question.");return;}
      if(action==="cue"){event.stopPropagation();if(!data.question){data.question=true;window.render88ALab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Question identified. Now click its purple relationship phrase.");return;}if(guided&&!data.read)return setLabFeedback("Read the entire problem first.","incorrect");data.cue=true;button.classList.add("is-picked");button.setAttribute("aria-pressed","true");setLabFeedback("You found the phrase. Match it to the comparison symbol.");return;}
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
              const raw=data.inputs[`f${n}-${position}-${kind}`];
               const entered=kind==="constant"&&expected===0&&String(raw??"").trim()===""?0:signedValue(raw,kind==="variable"&&sum.constant!==0);
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
    body.querySelectorAll('.a88-question[data-action="question"]').forEach(el=>el.addEventListener("keydown",event=>{if(event.target===el&&(event.key==="Enter"||event.key===" ")){event.preventDefault();el.click();}}));
  };
})();
