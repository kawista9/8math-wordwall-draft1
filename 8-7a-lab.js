(function volume87ALabModule() {
  const PI = Math.PI;

  const FORMULAS = [
    { id: "cylinder", label: "V = Bh" },
    { id: "cone", label: "V = ⅓Bh" },
    { id: "sphere", label: "V = ⁴⁄₃πr³" }
  ];

  const BASE_CHOICES = [
    { id: "circle", label: "B = πr²" },
    { id: "circumference", label: "B = 2πr" },
    { id: "diameter-square", label: "B = πd²" }
  ];

  const DIRECT_TASKS = [
    { kind: "direct", shape: "cylinder", unit: "cm", radius: 4, height: 9, given: "radius", shown: 4, title: "Cylinder with a radius shown" },
    { kind: "direct", shape: "cone", unit: "m", radius: 5, height: 12, given: "diameter", shown: 10, title: "Cone with a full-width measure" },
    { kind: "direct", shape: "sphere", unit: "in", radius: 6, given: "radius", shown: 6, title: "Sphere with a radius shown" },
    { kind: "direct", shape: "cylinder", unit: "ft", radius: 7, height: 5, given: "diameter", shown: 14, title: "Cylinder with a full-width measure" },
    { kind: "direct", shape: "cone", unit: "yd", radius: 3, height: 11, given: "radius", shown: 3, title: "Cone with a radius shown" },
    { kind: "direct", shape: "sphere", unit: "cm", radius: 8, given: "diameter", shown: 16, title: "Sphere with a full-width measure" },
    { kind: "direct", shape: "cylinder", unit: "m", radius: 2.5, height: 7, given: "radius", shown: 2.5, title: "Cylinder with a decimal radius" }
  ];

  const WORD_TASKS = [
    {
      kind: "word", shape: "cylinder", unit: "in", radius: 3, height: 8,
      title: "Candle holder",
      prompt: "A cylindrical glass candle holder has a radius of 3 inches and a height of 8 inches. What is its volume?"
    },
    {
      kind: "word", shape: "cone", unit: "cm", radius: 6, height: 15,
      title: "Party hat",
      prompt: "A cone-shaped party hat has a diameter of 12 centimeters and a vertical height of 15 centimeters. What is the volume of the cone?"
    },
    {
      kind: "word", shape: "sphere", unit: "cm", radius: 4.5,
      title: "Glass ornament",
      prompt: "A spherical glass ornament has a diameter of 9 centimeters. What is its volume?"
    },
    {
      kind: "word", shape: "cylinder", unit: "ft", radius: 3, height: 10,
      title: "Water tank",
      prompt: "A cylindrical water tank is 6 feet across and 10 feet tall. What is the volume of the tank?"
    },
    {
      kind: "word", shape: "cone", unit: "m", radius: 5, height: 4,
      title: "Sand pile",
      prompt: "A pile of sand is modeled by a cone with a radius of 5 meters and a height of 4 meters. What is its volume?"
    },
    {
      kind: "word", shape: "sphere", unit: "in", radius: 15,
      title: "Exercise ball",
      prompt: "A spherical exercise ball measures 30 inches from one side straight through its center to the other side. What is its volume?"
    },
    {
      kind: "word", shape: "cylinder", unit: "cm", radius: 4, height: 13,
      title: "Soup can",
      prompt: "A cylindrical soup can has a radius of 4 centimeters and a height of 13 centimeters. What is the volume of the can?"
    }
  ];

  const COMPOSITE_TASKS = [
    {
      kind: "composite", diagram: "capsule", unit: "cm", title: "Rounded capsule",
      radius: 3, height: 8,
      answer: () => cylinderVolume(3, 8) + sphereVolume(3),
      seminar: [
        {
          q: "The two rounded ends are hemispheres. Together, what solid do they make?",
          choices: ["one sphere", "one cone", "one cylinder"], correct: 0
        },
        {
          q: "The capsule is made from a cylinder plus those two hemispheres. What should you do with the volumes?",
          choices: ["add them", "subtract the sphere from the cylinder", "multiply them"], correct: 0
        },
        {
          q: "Which expression matches the composite figure?",
          choices: ["V = Vcylinder + Vsphere", "V = Vcylinder − Vsphere", "V = 2Vcylinder + Vsphere"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "cone-cylinder", unit: "m", title: "Cone on a cylinder",
      radius: 4, height: 6, topHeight: 5,
      answer: () => cylinderVolume(4, 6) + coneVolume(4, 5),
      seminar: [
        {
          q: "Which two solids make this entire figure?",
          choices: ["a cylinder and a cone", "a sphere and a cone", "two cylinders"], correct: 0
        },
        {
          q: "Nothing is cut out. How should the two volumes be combined?",
          choices: ["add", "subtract", "divide"], correct: 0
        },
        {
          q: "Which expression should you evaluate?",
          choices: ["V = Vcylinder + Vcone", "V = Vcylinder − Vcone", "V = Vcone − Vcylinder"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "cone-hole", unit: "ft", title: "Cylinder with a conical opening",
      radius: 5, height: 12,
      answer: () => cylinderVolume(5, 12) - coneVolume(5, 12),
      seminar: [
        {
          q: "The outer solid is a cylinder, and the cone-shaped region is removed. Which two volumes do you need?",
          choices: ["cylinder and cone", "sphere and cone", "two cones"], correct: 0
        },
        {
          q: "Because the cone is an empty cutout, what operation models the remaining solid?",
          choices: ["subtract", "add", "multiply"], correct: 0
        },
        {
          q: "Which expression represents the volume that remains?",
          choices: ["V = Vcylinder − Vcone", "V = Vcylinder + Vcone", "V = Vcone − Vcylinder"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "silo", unit: "yd", title: "Silo with a rounded roof",
      radius: 4, height: 10,
      answer: () => cylinderVolume(4, 10) + 0.5 * sphereVolume(4),
      seminar: [
        {
          q: "The roof is half of which solid?",
          choices: ["a sphere", "a cone", "a cylinder"], correct: 0
        },
        {
          q: "The roof sits on top of the cylinder. How should their volumes be combined?",
          choices: ["add", "subtract", "divide"], correct: 0
        },
        {
          q: "Which expression matches the entire silo?",
          choices: ["V = Vcylinder + ½Vsphere", "V = Vcylinder − ½Vsphere", "V = ½Vcylinder + Vsphere"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "tennis-can", unit: "cm", title: "Three tennis balls in a can",
      radius: 3.3, height: 19.8,
      answer: () => cylinderVolume(3.3, 19.8) - 3 * sphereVolume(3.3),
      seminar: [
        {
          q: "To find the empty space, which volumes must you calculate first?",
          choices: ["the cylinder and one tennis ball", "only the cylinder", "only one tennis ball"], correct: 0
        },
        {
          q: "There are three identical balls. What is the total volume occupied by the balls?",
          choices: ["3 × Vsphere", "Vsphere ÷ 3", "Vcylinder + Vsphere"], correct: 0
        },
        {
          q: "Which expression gives the space inside the can that is NOT occupied by tennis balls?",
          choices: ["V = Vcylinder − 3Vsphere", "V = Vcylinder + 3Vsphere", "V = 3Vcylinder − Vsphere"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "icecream", unit: "in", title: "Cone with a hemispherical scoop",
      radius: 4, height: 9,
      answer: () => coneVolume(4, 9) + 0.5 * sphereVolume(4),
      seminar: [
        {
          q: "The rounded scoop shown is exactly half of which solid?",
          choices: ["a sphere", "a cylinder", "a cone"], correct: 0
        },
        {
          q: "The scoop and cone are both part of the total figure. What operation should you use?",
          choices: ["add", "subtract", "divide"], correct: 0
        },
        {
          q: "Which expression models the total volume?",
          choices: ["V = Vcone + ½Vsphere", "V = Vcone − ½Vsphere", "V = ½Vcone + Vsphere"], correct: 0
        }
      ]
    }
  ];

  const TASKS = [...DIRECT_TASKS, ...WORD_TASKS, ...COMPOSITE_TASKS];

  function cylinderVolume(r, h) { return PI * r * r * h; }
  function coneVolume(r, h) { return PI * r * r * h / 3; }
  function sphereVolume(r) { return 4 * PI * r * r * r / 3; }

  function taskVolume(task) {
    if (task.kind === "composite") return task.answer();
    if (task.shape === "cylinder") return cylinderVolume(task.radius, task.height);
    if (task.shape === "cone") return coneVolume(task.radius, task.height);
    return sphereVolume(task.radius);
  }

  function rounded(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }
  function formatNumber(value) {
    const n = rounded(Number(value));
    return Number.isInteger(n) ? String(n) : String(n);
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function freshQuestion(index = 0) {
    return {
      index,
      solved: false,
      selectedFormula: null,
      formula: null,
      selectedBase: null,
      base: null,
      selectedFigure: null,
      figure: null,
      inputs: {},
      seminarAnswers: [],
      seminarStep: 0
    };
  }

  window.VOLUME_87A_TOTAL = TASKS.length;
  window.resetVolume87AQuestion = function resetVolume87AQuestion(data, index) {
    Object.assign(data, freshQuestion(index));
  };

  function shapeName(shape) {
    return shape === "cylinder" ? "Cylinder" : shape === "cone" ? "Cone" : "Sphere";
  }

  function shapeSvg(task, compact = false) {
    const unit = task.unit;
    const w = compact ? 220 : 460;
    const h = compact ? 190 : 330;
    const sizeClass = compact ? " is-compact" : "";
    if (task.shape === "sphere") {
      const full = task.given === "diameter";
      const x1 = full ? 80 : 150;
      const x2 = 300;
      return `<svg class="v87-shape-svg${sizeClass}" viewBox="0 0 380 300" role="img" aria-label="Sphere with a measurement shown">
        <defs><radialGradient id="v87sphere" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#eaf9ff"/><stop offset=".42" stop-color="#70c7f4"/><stop offset="1" stop-color="#4830a9"/></radialGradient></defs>
        <circle cx="190" cy="150" r="112" fill="url(#v87sphere)" stroke="#33206e" stroke-width="5"/>
        <ellipse cx="190" cy="150" rx="112" ry="34" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 9" opacity=".85"/>
        <circle cx="190" cy="150" r="5" fill="#ff3eb5"/>
        <line x1="${x1}" y1="150" x2="${x2}" y2="150" stroke="#ff3eb5" stroke-width="5" stroke-linecap="round"/>
        ${full ? '<line x1="80" y1="137" x2="80" y2="163" stroke="#ff3eb5" stroke-width="4"/><line x1="300" y1="137" x2="300" y2="163" stroke="#ff3eb5" stroke-width="4"/>' : ''}
        <text x="190" y="132" text-anchor="middle" class="v87-svg-label">${escapeHTML(task.shown)} ${escapeHTML(unit)}</text>
      </svg>`;
    }
    if (task.shape === "cone") {
      const full = task.given === "diameter";
      return `<svg class="v87-shape-svg${sizeClass}" viewBox="0 0 420 320" role="img" aria-label="Cone with measurements shown">
        <defs><linearGradient id="v87cone" x1="0" x2="1"><stop offset="0" stop-color="#e9faff"/><stop offset=".45" stop-color="#6dc8f5"/><stop offset="1" stop-color="#5a2eb5"/></linearGradient></defs>
        <path d="M210 35 L70 250 Q210 305 350 250 Z" fill="url(#v87cone)" stroke="#33206e" stroke-width="5"/>
        <ellipse cx="210" cy="250" rx="140" ry="39" fill="none" stroke="#33206e" stroke-width="5"/>
        <line x1="210" y1="35" x2="210" y2="250" stroke="#fff" stroke-width="4" stroke-dasharray="9 8"/>
        <circle cx="210" cy="250" r="5" fill="#ff3eb5"/>
        <line x1="${full ? 70 : 210}" y1="250" x2="350" y2="250" stroke="#ff3eb5" stroke-width="5"/>
        ${full ? '<line x1="70" y1="238" x2="70" y2="262" stroke="#ff3eb5" stroke-width="4"/><line x1="350" y1="238" x2="350" y2="262" stroke="#ff3eb5" stroke-width="4"/>' : ''}
        <line x1="365" y1="35" x2="365" y2="250" stroke="#20b9df" stroke-width="4"/>
        <line x1="354" y1="35" x2="376" y2="35" stroke="#20b9df" stroke-width="4"/><line x1="354" y1="250" x2="376" y2="250" stroke="#20b9df" stroke-width="4"/>
        <text x="280" y="232" text-anchor="middle" class="v87-svg-label">${escapeHTML(task.shown)} ${escapeHTML(unit)}</text>
        <text x="382" y="147" class="v87-svg-label">${escapeHTML(task.height)} ${escapeHTML(unit)}</text>
      </svg>`;
    }
    const full = task.given === "diameter";
    return `<svg class="v87-shape-svg${sizeClass}" viewBox="0 0 420 320" role="img" aria-label="Cylinder with measurements shown">
      <defs><linearGradient id="v87cyl" x1="0" x2="1"><stop offset="0" stop-color="#e9faff"/><stop offset=".38" stop-color="#6dc8f5"/><stop offset="1" stop-color="#5530b5"/></linearGradient></defs>
      <path d="M80 72 Q210 26 340 72 L340 245 Q210 291 80 245 Z" fill="url(#v87cyl)" stroke="#33206e" stroke-width="5"/>
      <ellipse cx="210" cy="72" rx="130" ry="42" fill="#a9e8ff" stroke="#33206e" stroke-width="5"/>
      <ellipse cx="210" cy="245" rx="130" ry="42" fill="none" stroke="#33206e" stroke-width="5"/>
      <circle cx="210" cy="245" r="5" fill="#ff3eb5"/>
      <line x1="${full ? 80 : 210}" y1="245" x2="340" y2="245" stroke="#ff3eb5" stroke-width="5"/>
      ${full ? '<line x1="80" y1="233" x2="80" y2="257" stroke="#ff3eb5" stroke-width="4"/><line x1="340" y1="233" x2="340" y2="257" stroke="#ff3eb5" stroke-width="4"/>' : ''}
      <line x1="362" y1="72" x2="362" y2="245" stroke="#20b9df" stroke-width="4"/>
      <line x1="351" y1="72" x2="373" y2="72" stroke="#20b9df" stroke-width="4"/><line x1="351" y1="245" x2="373" y2="245" stroke="#20b9df" stroke-width="4"/>
      <text x="280" y="227" text-anchor="middle" class="v87-svg-label">${escapeHTML(task.shown)} ${escapeHTML(unit)}</text>
      <text x="379" y="165" class="v87-svg-label">${escapeHTML(task.height)} ${escapeHTML(unit)}</text>
    </svg>`;
  }

  function blankShapeSvg(shape) {
    if (shape === "sphere") {
      return `<svg class="v87-shape-svg" viewBox="0 0 380 300" aria-hidden="true">
        <circle cx="190" cy="150" r="112" class="v87-fill-shape"/>
        <ellipse cx="190" cy="150" rx="112" ry="34" class="v87-dash"/>
        <circle cx="190" cy="150" r="5" class="v87-center-dot"/>
        <line x1="190" y1="150" x2="300" y2="150" class="v87-measure-line"/>
      </svg>`;
    }
    if (shape === "cone") {
      return `<svg class="v87-shape-svg" viewBox="0 0 420 320" aria-hidden="true">
        <path d="M210 35 L70 250 Q210 305 350 250 Z" class="v87-fill-shape"/>
        <ellipse cx="210" cy="250" rx="140" ry="39" class="v87-outline"/>
        <line x1="210" y1="35" x2="210" y2="250" class="v87-dash"/>
        <line x1="210" y1="250" x2="350" y2="250" class="v87-measure-line"/>
      </svg>`;
    }
    return `<svg class="v87-shape-svg" viewBox="0 0 420 320" aria-hidden="true">
      <path d="M80 72 Q210 26 340 72 L340 245 Q210 291 80 245 Z" class="v87-fill-shape"/>
      <ellipse cx="210" cy="72" rx="130" ry="42" class="v87-top-fill"/>
      <ellipse cx="210" cy="245" rx="130" ry="42" class="v87-outline"/>
      <line x1="210" y1="245" x2="340" y2="245" class="v87-measure-line"/>
      <line x1="362" y1="72" x2="362" y2="245" class="v87-height-line"/>
    </svg>`;
  }

  function wordModelMarkup(task, data) {
    if (!data.figure) {
      return `<div class="v87-model-empty"><strong>Drop one figure here.</strong><span>Choose the solid described in the word problem.</span></div>`;
    }
    const shape = data.figure;
    const valueR = escapeHTML(data.inputs.radius || "");
    const valueH = escapeHTML(data.inputs.height || "");
    return `<div class="v87-word-model ${shape}">
      ${blankShapeSvg(shape)}
      <label class="v87-on-shape v87-radius-input"><span>r =</span><input inputmode="decimal" data-v87-input="radius" value="${valueR}" aria-label="Radius"></label>
      ${shape !== "sphere" ? `<label class="v87-on-shape v87-height-input"><span>h =</span><input inputmode="decimal" data-v87-input="height" value="${valueH}" aria-label="Height"></label>` : ""}
    </div>`;
  }

  function miniFigureButton(shape) {
    const icon = shape === "sphere"
      ? '<svg viewBox="0 0 80 70"><circle cx="40" cy="35" r="26"/><ellipse cx="40" cy="35" rx="26" ry="8"/></svg>'
      : shape === "cone"
        ? '<svg viewBox="0 0 80 70"><path d="M40 7 L14 57 Q40 68 66 57 Z"/><ellipse cx="40" cy="57" rx="26" ry="8"/></svg>'
        : '<svg viewBox="0 0 80 70"><path d="M16 17 Q40 8 64 17 V54 Q40 63 16 54 Z"/><ellipse cx="40" cy="17" rx="24" ry="8"/><ellipse cx="40" cy="54" rx="24" ry="8"/></svg>';
    return `${icon}<span>${shapeName(shape)}</span>`;
  }

  function formulaBankMarkup(data) {
    return FORMULAS.map(item => `<button type="button" draggable="true" class="v87-token${data.selectedFormula === item.id ? " is-selected" : ""}${data.formula === item.id ? " is-used" : ""}" data-v87-formula="${item.id}">${item.label}</button>`).join("");
  }

  function baseBankMarkup(data) {
    return BASE_CHOICES.map(item => `<button type="button" draggable="true" class="v87-token small${data.selectedBase === item.id ? " is-selected" : ""}${data.base === item.id ? " is-used" : ""}" data-v87-base="${item.id}">${item.label}</button>`).join("");
  }

  function directOrWordMarkup(task, data, qNumber) {
    const isWord = task.kind === "word";
    const needsBase = task.shape !== "sphere";
    const expectedAnswer = `${formatNumber(rounded(taskVolume(task)))} ${task.unit}³`;
    return `<section class="v87-shell">
      <header class="v87-question-header">
        <div><p class="lab-mini-title">Question ${qNumber} of ${TASKS.length}</p><h4>${escapeHTML(isWord ? task.title : task.title)}</h4><p>${isWord ? escapeHTML(task.prompt) : "Read the measurements from the figure. A full line through the center means you must determine the radius yourself."}</p></div>
        <span class="v87-chip">${qNumber <= 7 ? "Figure practice" : "Word problem"}</span>
      </header>

      <div class="v87-main-grid">
        <section class="v87-visual-card">
          <h5>${isWord ? "1. Build a model" : "1. Read the figure"}</h5>
          ${isWord ? `<div class="v87-figure-bank" aria-label="Figure bank">
              ${["cylinder", "cone", "sphere"].map(shape => `<button type="button" draggable="true" class="v87-figure-token${data.selectedFigure === shape ? " is-selected" : ""}" data-v87-figure="${shape}">${miniFigureButton(shape)}</button>`).join("")}
            </div>
            <div class="v87-model-drop" data-v87-figure-drop>${wordModelMarkup(task, data)}</div>` : shapeSvg(task)}
        </section>

        <section class="v87-work-card">
          <div class="v87-step-block">
            <h5>${isWord ? "2" : "2"}. Choose the volume formula</h5>
            <div class="v87-formula-bank">${formulaBankMarkup(data)}</div>
            <button type="button" class="v87-drop-zone formula${data.formula ? " is-filled" : ""}" data-v87-formula-drop>${data.formula ? FORMULAS.find(x => x.id === data.formula).label : "Drop the correct formula here"}</button>
          </div>

          ${needsBase ? `<div class="v87-step-block">
            <h5>${isWord ? "3" : "3"}. Replace B with the circular base formula</h5>
            <div class="v87-formula-bank compact">${baseBankMarkup(data)}</div>
            <button type="button" class="v87-drop-zone base${data.base ? " is-filled" : ""}" data-v87-base-drop>${data.base ? BASE_CHOICES.find(x => x.id === data.base).label : "B = ?"}</button>
          </div>` : `<div class="v87-step-block is-note"><strong>3. No B substitution is needed for a sphere.</strong><span>The sphere formula already uses r.</span></div>`}

          <div class="v87-step-block">
            <h5>4. Type the dimensions you will use</h5>
            ${isWord ? `<p class="v87-small-note">Type these in the open spaces on the model above.</p>` : `<div class="v87-dimension-row">
                <label><span>radius, r</span><input inputmode="decimal" data-v87-input="radius" value="${escapeHTML(data.inputs.radius || "")}" placeholder="r"></label>
                ${task.shape !== "sphere" ? `<label><span>height, h</span><input inputmode="decimal" data-v87-input="height" value="${escapeHTML(data.inputs.height || "")}" placeholder="h"></label>` : ""}
              </div>`}
          </div>

          <div class="v87-step-block final-answer">
            <h5>5. Calculate the volume</h5>
            <label class="v87-volume-entry"><span>Round to the nearest hundredth and include cubic units.</span><input data-v87-input="volume" value="${escapeHTML(data.inputs.volume || "")}" placeholder="Example: 452.39 cm³" aria-label="Final volume with units"></label>
            ${data.solved ? `<div class="v87-solution-banner">✓ ${expectedAnswer}</div>` : ""}
          </div>
        </section>
      </div>

      <div class="v87-actions">
        <button type="button" class="lab-action" id="checkV87">${data.solved ? "Checked" : "Check my work"}</button>
        <button type="button" class="lab-action v87-next" id="nextV87"${data.solved ? "" : " hidden"}>${qNumber === TASKS.length ? "Finish lab" : "Next question"}</button>
      </div>
    </section>`;
  }

  function compositeSvg(task) {
    const u = escapeHTML(task.unit);
    if (task.diagram === "capsule") {
      return `<svg class="v87-composite-svg" viewBox="0 0 520 330" role="img" aria-label="Capsule made from a cylinder and two hemispheres">
        <path d="M150 70 H370 A90 90 0 0 1 370 250 H150 A90 90 0 0 1 150 70 Z" class="v87-composite-fill"/>
        <line x1="150" y1="60" x2="370" y2="60" class="v87-dim"/><line x1="150" y1="52" x2="150" y2="68" class="v87-dim"/><line x1="370" y1="52" x2="370" y2="68" class="v87-dim"/>
        <text x="260" y="45" class="v87-comp-label">8 ${u}</text>
        <line x1="60" y1="160" x2="150" y2="160" class="v87-dim"/><line x1="60" y1="148" x2="60" y2="172" class="v87-dim"/>
        <text x="98" y="145" class="v87-comp-label">6 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "cone-cylinder") {
      return `<svg class="v87-composite-svg" viewBox="0 0 520 390" role="img" aria-label="Cone on top of a cylinder">
        <path d="M260 28 L120 168 Q260 208 400 168 Z" class="v87-composite-fill"/>
        <ellipse cx="260" cy="168" rx="140" ry="35" class="v87-outline"/>
        <path d="M120 168 V310 Q260 350 400 310 V168" class="v87-composite-fill"/>
        <ellipse cx="260" cy="310" rx="140" ry="35" class="v87-outline"/>
        <line x1="120" y1="310" x2="400" y2="310" class="v87-dim"/><text x="245" y="294" class="v87-comp-label">8 ${u}</text>
        <line x1="420" y1="168" x2="420" y2="310" class="v87-dim"/><text x="436" y="244" class="v87-comp-label">6 ${u}</text>
        <line x1="98" y1="28" x2="98" y2="168" class="v87-dim"/><text x="48" y="103" class="v87-comp-label">5 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "cone-hole") {
      return `<svg class="v87-composite-svg" viewBox="0 0 520 360" role="img" aria-label="Cylinder with a cone-shaped opening removed">
        <path d="M100 72 Q260 24 420 72 V286 Q260 334 100 286 Z" class="v87-composite-fill"/>
        <ellipse cx="260" cy="72" rx="160" ry="46" class="v87-outline"/>
        <ellipse cx="260" cy="286" rx="160" ry="46" class="v87-outline"/>
        <path d="M130 72 L260 275 L390 72" class="v87-hole"/><ellipse cx="260" cy="72" rx="130" ry="34" class="v87-hole"/>
        <line x1="100" y1="72" x2="420" y2="72" class="v87-dim"/><text x="245" y="57" class="v87-comp-label">10 ${u}</text>
        <line x1="448" y1="72" x2="448" y2="286" class="v87-dim"/><text x="463" y="185" class="v87-comp-label">12 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "silo") {
      return `<svg class="v87-composite-svg" viewBox="0 0 520 390" role="img" aria-label="Cylinder with a hemispherical roof">
        <path d="M120 160 A140 140 0 0 1 400 160" class="v87-composite-fill"/>
        <path d="M120 160 V320 Q260 360 400 320 V160" class="v87-composite-fill"/>
        <ellipse cx="260" cy="320" rx="140" ry="35" class="v87-outline"/>
        <line x1="260" y1="160" x2="400" y2="160" class="v87-dim"/><text x="327" y="145" class="v87-comp-label">4 ${u}</text>
        <line x1="425" y1="160" x2="425" y2="320" class="v87-dim"/><text x="441" y="245" class="v87-comp-label">10 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "tennis-can") {
      return `<svg class="v87-composite-svg" viewBox="0 0 420 560" role="img" aria-label="Three tennis balls stacked inside a cylinder">
        <path d="M85 55 Q210 18 335 55 V500 Q210 537 85 500 Z" class="v87-can-fill"/>
        <ellipse cx="210" cy="55" rx="125" ry="35" class="v87-outline"/>
        <ellipse cx="210" cy="500" rx="125" ry="35" class="v87-outline"/>
        <circle cx="210" cy="135" r="92" class="v87-ball"/><circle cx="210" cy="315" r="92" class="v87-ball"/><circle cx="210" cy="495" r="92" class="v87-ball"/>
        <line x1="85" y1="55" x2="335" y2="55" class="v87-dim"/><text x="190" y="41" class="v87-comp-label">6.6 ${u}</text>
        <line x1="360" y1="55" x2="360" y2="500" class="v87-dim"/><text x="375" y="282" class="v87-comp-label">19.8 ${u}</text>
      </svg>`;
    }
    return `<svg class="v87-composite-svg" viewBox="0 0 480 430" role="img" aria-label="Cone with a hemispherical scoop">
      <path d="M105 155 A135 135 0 0 1 375 155" class="v87-composite-fill"/>
      <path d="M105 155 L240 390 L375 155 Z" class="v87-composite-fill"/>
      <line x1="105" y1="155" x2="375" y2="155" class="v87-dim"/><text x="220" y="140" class="v87-comp-label">8 ${u}</text>
      <line x1="395" y1="155" x2="395" y2="390" class="v87-dim"/><text x="410" y="278" class="v87-comp-label">9 ${u}</text>
    </svg>`;
  }

  function compositeMarkup(task, data, qNumber) {
    const step = data.seminarStep || 0;
    const answer = `${formatNumber(rounded(taskVolume(task)))} ${task.unit}³`;
    const completed = data.seminarAnswers || [];
    return `<section class="v87-shell composite-shell">
      <header class="v87-question-header">
        <div><p class="lab-mini-title">Question ${qNumber} of ${TASKS.length}</p><h4>${escapeHTML(task.title)}</h4><p>Read only the measurements shown on the figure. Decide what each measure represents before you calculate.</p></div>
        <span class="v87-chip">Composite volume</span>
      </header>

      <div class="v87-composite-grid">
        <section class="v87-visual-card composite-visual"><h5>Study the figure</h5>${compositeSvg(task)}</section>
        <section class="v87-seminar-card">
          <div class="v87-seminar-heading"><span>Socratic progression</span><strong>Reason first. Calculate second.</strong></div>
          ${task.seminar.map((item, idx) => {
            const done = idx < step;
            const active = idx === step && step < task.seminar.length;
            if (!done && !active) return `<div class="v87-seminar-locked"><span>${idx + 1}</span>Next question unlocks after the previous idea is correct.</div>`;
            return `<div class="v87-seminar-question${done ? " is-done" : ""}">
              <p><span>${idx + 1}</span>${escapeHTML(item.q)}</p>
              ${done ? `<div class="v87-seminar-answer">✓ ${escapeHTML(item.choices[item.correct])}</div>` : `<div class="v87-choice-grid">${item.choices.map((choice, choiceIndex) => `<button type="button" data-v87-seminar="${idx}" data-v87-choice="${choiceIndex}">${escapeHTML(choice)}</button>`).join("")}</div>`}
            </div>`;
          }).join("")}
          ${step >= task.seminar.length ? `<div class="v87-final-composite">
            <h5>Now calculate the final volume.</h5>
            <label class="v87-volume-entry"><span>Round to the nearest hundredth and include cubic units.</span><input data-v87-input="volume" value="${escapeHTML(data.inputs.volume || "")}" placeholder="Number + cubic unit"></label>
            ${data.solved ? `<div class="v87-solution-banner">✓ ${answer}</div>` : ""}
          </div>` : ""}
        </section>
      </div>

      <div class="v87-actions">
        <button type="button" class="lab-action" id="checkV87"${step < task.seminar.length ? " disabled" : ""}>${data.solved ? "Checked" : "Check final volume"}</button>
        <button type="button" class="lab-action v87-next" id="nextV87"${data.solved ? "" : " hidden"}>${qNumber === TASKS.length ? "Finish lab" : "Next question"}</button>
      </div>
    </section>`;
  }

  function normalizeUnitText(text) {
    return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function volumeAnswerCorrect(text, task) {
    const raw = String(text || "").trim();
    const numberMatch = raw.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    if (!numberMatch) return false;
    const numeric = Number(numberMatch[0]);
    const expected = rounded(taskVolume(task));
    if (Math.abs(numeric - expected) > 0.011) return false;

    const t = normalizeUnitText(raw).replace(/\s/g, "");
    const unit = task.unit.toLowerCase();
    const aliases = {
      cm: ["cm³", "cm^3", "cm3", "cubiccm", "cubiccentimeter", "cubiccentimeters"],
      m: ["m³", "m^3", "m3", "cubicm", "cubicmeter", "cubicmeters"],
      in: ["in³", "in^3", "in3", "cubicin", "cubicinch", "cubicinches"],
      ft: ["ft³", "ft^3", "ft3", "cubicft", "cubicfoot", "cubicfeet"],
      yd: ["yd³", "yd^3", "yd3", "cubicyd", "cubicyard", "cubicyards"]
    };
    return (aliases[unit] || []).some(alias => t.includes(alias));
  }

  function numericInputCorrect(value, expected) {
    const n = Number(String(value || "").trim());
    return Number.isFinite(n) && Math.abs(n - Number(expected)) < 0.001;
  }

  window.renderVolume87ALab = function renderVolume87ALab(ctx) {
    const { labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion } = ctx;
    if (!labRuntime.data) labRuntime.data = freshQuestion(0);
    const data = labRuntime.data;
    if (data.index >= TASKS.length) return showLabCompletion("8.7A");
    const task = TASKS[data.index];
    const qNumber = data.index + 1;
    const phaseName = qNumber <= 7 ? "formula + dimensions" : qNumber <= 14 ? "word problem modeling" : "composite reasoning";
    setLabProgress(data.index + (data.solved ? 1 : 0), TASKS.length, `Question ${qNumber} of ${TASKS.length}: ${phaseName}.`);

    const body = $("#standardsLabBody");
    body.innerHTML = task.kind === "composite" ? compositeMarkup(task, data, qNumber) : directOrWordMarkup(task, data, qNumber);

    const rerender = message => {
      window.renderVolume87ALab(ctx);
      if (message) setLabFeedback(message);
      syncWhiteboardQuestion();
    };

    body.querySelectorAll("[data-v87-input]").forEach(input => {
      input.addEventListener("input", () => { data.inputs[input.dataset.v87Input] = input.value; });
    });

    if (task.kind !== "composite") {
      const selectFormula = id => {
        data.selectedFormula = id;
        rerender("Formula selected. Now place it in the formula target.");
      };
      const placeFormula = id => {
        if (!id) return setLabFeedback("Choose a formula first.", "incorrect");
        data.formula = id;
        data.selectedFormula = null;
        rerender("Formula placed. Continue through the setup.");
      };
      body.querySelectorAll("[data-v87-formula]").forEach(button => {
        button.addEventListener("click", () => selectFormula(button.dataset.v87Formula));
        button.addEventListener("dragstart", event => {
          event.dataTransfer.setData("text/v87-formula", button.dataset.v87Formula);
          event.dataTransfer.effectAllowed = "copy";
        });
      });
      const formulaDrop = body.querySelector("[data-v87-formula-drop]");
      formulaDrop?.addEventListener("click", () => placeFormula(data.selectedFormula));
      formulaDrop?.addEventListener("dragover", event => event.preventDefault());
      formulaDrop?.addEventListener("drop", event => {
        event.preventDefault();
        placeFormula(event.dataTransfer.getData("text/v87-formula") || event.dataTransfer.getData("text/plain"));
      });

      if (task.shape !== "sphere") {
        const selectBase = id => {
          data.selectedBase = id;
          rerender("Base formula selected. Place it beside B.");
        };
        const placeBase = id => {
          if (!id) return setLabFeedback("Choose a formula for B first.", "incorrect");
          data.base = id;
          data.selectedBase = null;
          rerender("B substitution placed. Now use the dimensions.");
        };
        body.querySelectorAll("[data-v87-base]").forEach(button => {
          button.addEventListener("click", () => selectBase(button.dataset.v87Base));
          button.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/v87-base", button.dataset.v87Base);
            event.dataTransfer.effectAllowed = "copy";
          });
        });
        const baseDrop = body.querySelector("[data-v87-base-drop]");
        baseDrop?.addEventListener("click", () => placeBase(data.selectedBase));
        baseDrop?.addEventListener("dragover", event => event.preventDefault());
        baseDrop?.addEventListener("drop", event => {
          event.preventDefault();
          placeBase(event.dataTransfer.getData("text/v87-base") || event.dataTransfer.getData("text/plain"));
        });
      }

      if (task.kind === "word") {
        const selectFigure = shape => {
          data.selectedFigure = shape;
          rerender("Figure selected. Drop it into the model area.");
        };
        const placeFigure = shape => {
          if (!shape) return setLabFeedback("Choose a figure from the bank first.", "incorrect");
          data.figure = shape;
          data.selectedFigure = null;
          data.inputs.radius = "";
          data.inputs.height = "";
          rerender("Model placed. Type the dimensions from the situation onto the figure.");
        };
        body.querySelectorAll("[data-v87-figure]").forEach(button => {
          button.addEventListener("click", () => selectFigure(button.dataset.v87Figure));
          button.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/v87-figure", button.dataset.v87Figure);
            event.dataTransfer.effectAllowed = "copy";
          });
        });
        const figureDrop = body.querySelector("[data-v87-figure-drop]");
        figureDrop?.addEventListener("click", () => placeFigure(data.selectedFigure));
        figureDrop?.addEventListener("dragover", event => event.preventDefault());
        figureDrop?.addEventListener("drop", event => {
          event.preventDefault();
          placeFigure(event.dataTransfer.getData("text/v87-figure") || event.dataTransfer.getData("text/plain"));
        });
      }
    }

    body.querySelectorAll("[data-v87-seminar]").forEach(button => {
      button.addEventListener("click", () => {
        const promptIndex = Number(button.dataset.v87Seminar);
        const choiceIndex = Number(button.dataset.v87Choice);
        const prompt = task.seminar[promptIndex];
        if (choiceIndex !== prompt.correct) {
          return setLabFeedback("Not yet. Use the picture and ask what is being added, removed, or repeated.", "incorrect");
        }
        data.seminarAnswers[promptIndex] = choiceIndex;
        data.seminarStep = promptIndex + 1;
        rerender("Yes. That reasoning is correct. Move to the next question.");
      });
    });

    const check = $("#checkV87");
    check?.addEventListener("click", () => {
      if (data.solved) return setLabFeedback("This question is complete. Choose Next question.", "correct");
      if (task.kind === "composite") {
        if ((data.seminarStep || 0) < task.seminar.length) return setLabFeedback("Complete the reasoning questions first.", "incorrect");
        if (!volumeAnswerCorrect(data.inputs.volume, task)) {
          return setLabFeedback(`Check the arithmetic, rounding, and cubic unit. Your answer should be rounded to the nearest hundredth.`, "incorrect");
        }
      } else {
        if (task.kind === "word" && data.figure !== task.shape) {
          return setLabFeedback(`The situation describes a ${shapeName(task.shape).toLowerCase()}. Choose that model first.`, "incorrect");
        }
        if (data.formula !== task.shape) {
          return setLabFeedback(`Recheck the volume formula for a ${shapeName(task.shape).toLowerCase()}.`, "incorrect");
        }
        if (task.shape !== "sphere" && data.base !== "circle") {
          return setLabFeedback("B is the area of the circular base. Recheck the formula you placed for B.", "incorrect");
        }
        if (!numericInputCorrect(data.inputs.radius, task.radius)) {
          const diameterNudge = task.given === "diameter" || (task.kind === "word" && /diameter|across|through its center/i.test(task.prompt));
          return setLabFeedback(diameterNudge ? "The measure given goes all the way across the circle. Determine the radius before calculating volume." : "Recheck the radius you entered.", "incorrect");
        }
        if (task.shape !== "sphere" && !numericInputCorrect(data.inputs.height, task.height)) {
          return setLabFeedback("Recheck the height you entered.", "incorrect");
        }
        if (!volumeAnswerCorrect(data.inputs.volume, task)) {
          return setLabFeedback("Recheck your substitution, calculation, rounding to the nearest hundredth, and cubic unit label.", "incorrect");
        }
      }

      data.solved = true;
      rerender(`Correct. The volume is ${formatNumber(rounded(taskVolume(task)))} ${task.unit}³.`, "correct");
      setLabFeedback(`Correct. The volume is ${formatNumber(rounded(taskVolume(task)))} ${task.unit}³.`, "correct");
    });

    const next = $("#nextV87");
    next?.addEventListener("click", () => {
      if (!data.solved) return;
      if (data.index >= TASKS.length - 1) return showLabCompletion("8.7A");
      const nextIndex = data.index + 1;
      Object.assign(data, freshQuestion(nextIndex));
      window.renderVolume87ALab(ctx);
      setLabFeedback("Next question ready.");
      syncWhiteboardQuestion();
    });
  };
})();
