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
      kind: "composite", diagram: "tennis-can", unit: "cm", title: "Three 6.6 cm tennis balls in a can",
      canRadius: 3.3, sphereRadius: 3.3, height: 19.8,
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

  const ROUNDING_LEVELS = [
    { key: "volumeTenths", places: 1, label: "Nearest tenth" },
    { key: "volumeHundredths", places: 2, label: "Nearest hundredth" },
    { key: "volumeThousandths", places: 3, label: "Nearest thousandth" }
  ];

  function roundTo(value, places) {
    const factor = 10 ** places;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  }
  function rounded(value) { return roundTo(value, 2); }
  function formatRounded(value, places) { return roundTo(value, places).toFixed(places); }
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
    const unit = escapeHTML(task.unit);
    const sizeClass = compact ? " is-compact" : "";

    if (task.shape === "sphere") {
      const full = task.given === "diameter";
      const centerX = 190;
      const leftEdge = 78;
      const rightEdge = 302;
      const x1 = full ? leftEdge : centerX;
      const x2 = rightEdge;
      const labelX = full ? centerX : 246;
      return `<svg class="v87-shape-svg${sizeClass}" viewBox="0 0 420 300" role="img" aria-label="Sphere with a measurement shown">
        <defs><radialGradient id="v87sphere" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#eaf9ff"/><stop offset=".42" stop-color="#70c7f4"/><stop offset="1" stop-color="#4830a9"/></radialGradient></defs>
        <circle cx="${centerX}" cy="150" r="112" fill="url(#v87sphere)" stroke="#33206e" stroke-width="5"/>
        <ellipse cx="${centerX}" cy="150" rx="112" ry="34" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 9" opacity=".85"/>
        <circle cx="${centerX}" cy="150" r="5" fill="#ff3eb5"/>
        <line x1="${x1}" y1="150" x2="${x2}" y2="150" stroke="#ff3eb5" stroke-width="5" stroke-linecap="round"/>
        ${full ? `<line x1="${leftEdge}" y1="137" x2="${leftEdge}" y2="163" stroke="#ff3eb5" stroke-width="4"/><line x1="${rightEdge}" y1="137" x2="${rightEdge}" y2="163" stroke="#ff3eb5" stroke-width="4"/>` : ""}
        <text x="${labelX}" y="132" text-anchor="middle" class="v87-svg-label">${escapeHTML(task.shown)} ${unit}</text>
      </svg>`;
    }

    if (task.shape === "cone") {
      const full = task.given === "diameter";
      const left = 70, center = 210, right = 350, baseY = 250;
      return `<svg class="v87-shape-svg${sizeClass}" viewBox="0 0 500 320" role="img" aria-label="Cone with measurements shown">
        <defs><linearGradient id="v87cone" x1="0" x2="1"><stop offset="0" stop-color="#e9faff"/><stop offset=".45" stop-color="#6dc8f5"/><stop offset="1" stop-color="#5a2eb5"/></linearGradient></defs>
        <path d="M${center} 35 L${left} ${baseY} Q${center} 289 ${right} ${baseY} Z" fill="url(#v87cone)" stroke="none"/>
        <line x1="${center}" y1="35" x2="${left}" y2="${baseY}" stroke="#33206e" stroke-width="5" stroke-linecap="round"/>
        <line x1="${center}" y1="35" x2="${right}" y2="${baseY}" stroke="#33206e" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="${center}" cy="${baseY}" rx="140" ry="39" fill="#8bd6f4" fill-opacity=".72" stroke="#33206e" stroke-width="5"/>
        <line x1="${center}" y1="35" x2="${center}" y2="${baseY}" stroke="#fff" stroke-width="4" stroke-dasharray="9 8"/>
        <circle cx="${center}" cy="${baseY}" r="5" fill="#ff3eb5"/>
        <line x1="${full ? left : center}" y1="${baseY}" x2="${right}" y2="${baseY}" stroke="#ff3eb5" stroke-width="5" stroke-linecap="round"/>
        ${full ? `<line x1="${left}" y1="238" x2="${left}" y2="262" stroke="#ff3eb5" stroke-width="4"/><line x1="${right}" y1="238" x2="${right}" y2="262" stroke="#ff3eb5" stroke-width="4"/>` : ""}
        <line x1="385" y1="35" x2="385" y2="${baseY}" stroke="#20b9df" stroke-width="4"/>
        <line x1="374" y1="35" x2="396" y2="35" stroke="#20b9df" stroke-width="4"/><line x1="374" y1="${baseY}" x2="396" y2="${baseY}" stroke="#20b9df" stroke-width="4"/>
        <text x="${full ? center : 280}" y="232" text-anchor="middle" class="v87-svg-label">${escapeHTML(task.shown)} ${unit}</text>
        <text x="410" y="147" text-anchor="start" class="v87-svg-label">${escapeHTML(task.height)} ${unit}</text>
      </svg>`;
    }

    const full = task.given === "diameter";
    const left = 80, center = 210, right = 340;
    return `<svg class="v87-shape-svg${sizeClass}" viewBox="0 0 500 320" role="img" aria-label="Cylinder with measurements shown">
      <defs><linearGradient id="v87cyl" x1="0" x2="1"><stop offset="0" stop-color="#e9faff"/><stop offset=".38" stop-color="#6dc8f5"/><stop offset="1" stop-color="#5530b5"/></linearGradient></defs>
      <path d="M${left} 72 L${left} 245 Q${center} 287 ${right} 245 L${right} 72 Z" fill="url(#v87cyl)" stroke="none"/>
      <line x1="${left}" y1="72" x2="${left}" y2="245" stroke="#33206e" stroke-width="5"/>
      <line x1="${right}" y1="72" x2="${right}" y2="245" stroke="#33206e" stroke-width="5"/>
      <ellipse cx="${center}" cy="72" rx="130" ry="42" fill="#a9e8ff" stroke="#33206e" stroke-width="5"/>
      <ellipse cx="${center}" cy="245" rx="130" ry="42" fill="#8bd6f4" fill-opacity=".72" stroke="#33206e" stroke-width="5"/>
      <circle cx="${center}" cy="245" r="5" fill="#ff3eb5"/>
      <line x1="${full ? left : center}" y1="245" x2="${right}" y2="245" stroke="#ff3eb5" stroke-width="5" stroke-linecap="round"/>
      ${full ? `<line x1="${left}" y1="233" x2="${left}" y2="257" stroke="#ff3eb5" stroke-width="4"/><line x1="${right}" y1="233" x2="${right}" y2="257" stroke="#ff3eb5" stroke-width="4"/>` : ""}
      <line x1="382" y1="72" x2="382" y2="245" stroke="#20b9df" stroke-width="4"/>
      <line x1="371" y1="72" x2="393" y2="72" stroke="#20b9df" stroke-width="4"/><line x1="371" y1="245" x2="393" y2="245" stroke="#20b9df" stroke-width="4"/>
      <text x="${full ? center : 280}" y="227" text-anchor="middle" class="v87-svg-label">${escapeHTML(task.shown)} ${unit}</text>
      <text x="408" y="165" text-anchor="start" class="v87-svg-label">${escapeHTML(task.height)} ${unit}</text>
    </svg>`;
  }

  function blankShapeSvg(shape) {
    if (shape === "sphere") {
      return `<svg class="v87-shape-svg" viewBox="0 0 420 300" aria-hidden="true">
        <circle cx="190" cy="150" r="112" class="v87-fill-shape"/>
        <ellipse cx="190" cy="150" rx="112" ry="34" class="v87-dash"/>
        <circle cx="190" cy="150" r="5" class="v87-center-dot"/>
        <line x1="190" y1="150" x2="302" y2="150" class="v87-measure-line"/>
      </svg>`;
    }
    if (shape === "cone") {
      return `<svg class="v87-shape-svg" viewBox="0 0 500 320" aria-hidden="true">
        <path d="M210 35 L70 250 Q210 289 350 250 Z" fill="#b9eafa" stroke="none"/>
        <line x1="210" y1="35" x2="70" y2="250" class="v87-outline-line"/>
        <line x1="210" y1="35" x2="350" y2="250" class="v87-outline-line"/>
        <ellipse cx="210" cy="250" rx="140" ry="39" class="v87-base-fill"/>
        <line x1="210" y1="35" x2="210" y2="250" class="v87-dash"/>
        <line x1="210" y1="250" x2="350" y2="250" class="v87-measure-line"/>
      </svg>`;
    }
    return `<svg class="v87-shape-svg" viewBox="0 0 500 320" aria-hidden="true">
      <path d="M80 72 L80 245 Q210 287 340 245 L340 72 Z" fill="#b9eafa" stroke="none"/>
      <line x1="80" y1="72" x2="80" y2="245" class="v87-outline-line"/>
      <line x1="340" y1="72" x2="340" y2="245" class="v87-outline-line"/>
      <ellipse cx="210" cy="72" rx="130" ry="42" class="v87-top-fill"/>
      <ellipse cx="210" cy="245" rx="130" ry="42" class="v87-base-fill"/>
      <line x1="210" y1="245" x2="340" y2="245" class="v87-measure-line"/>
      <line x1="382" y1="72" x2="382" y2="245" class="v87-height-line"/>
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
      ? '<svg viewBox="0 0 80 70"><circle cx="40" cy="35" r="26"/><path d="M14 35 Q40 48 66 35" fill="none"/></svg>'
      : shape === "cone"
        ? '<svg viewBox="0 0 80 70"><path d="M40 7 L14 57 Q40 65 66 57 Z" fill="#c9eff8" stroke="none"/><line x1="40" y1="7" x2="14" y2="57"/><line x1="40" y1="7" x2="66" y2="57"/><ellipse cx="40" cy="57" rx="26" ry="8" fill="#c9eff8"/></svg>'
        : '<svg viewBox="0 0 80 70"><path d="M16 17 V54 Q40 62 64 54 V17 Z" fill="#c9eff8" stroke="none"/><line x1="16" y1="17" x2="16" y2="54"/><line x1="64" y1="17" x2="64" y2="54"/><ellipse cx="40" cy="17" rx="24" ry="8"/><ellipse cx="40" cy="54" rx="24" ry="8" fill="#c9eff8"/></svg>';
    return `${icon}<span>${shapeName(shape)}</span>`;
  }

  function formulaBankMarkup(data) {
    return FORMULAS.map(item => `<button type="button" draggable="true" class="v87-token${data.selectedFormula === item.id ? " is-selected" : ""}${data.formula === item.id ? " is-used" : ""}" data-v87-formula="${item.id}">${item.label}</button>`).join("");
  }

  function baseBankMarkup(data) {
    return BASE_CHOICES.map(item => `<button type="button" draggable="true" class="v87-token small${data.selectedBase === item.id ? " is-selected" : ""}${data.base === item.id ? " is-used" : ""}" data-v87-base="${item.id}">${item.label}</button>`).join("");
  }

  function roundingInputsMarkup(task, data) {
    return `<div class="v87-rounding-grid">
      ${ROUNDING_LEVELS.map(level => `<label class="v87-rounding-row">
        <span><strong>${level.label}</strong><small>Include ${escapeHTML(task.unit)}³.</small></span>
        <input data-v87-input="${level.key}" value="${escapeHTML(data.inputs[level.key] || "")}" placeholder="${level.places === 1 ? "452.4" : level.places === 2 ? "452.39" : "452.389"} ${escapeHTML(task.unit)}³" aria-label="Volume rounded to the ${level.label.toLowerCase()} with cubic units">
      </label>`).join("")}
    </div>`;
  }

  function roundingSolutionMarkup(task) {
    const value = taskVolume(task);
    return `<div class="v87-solution-banner v87-solution-stack">
      <span>✓ Tenth: <strong>${formatRounded(value, 1)} ${escapeHTML(task.unit)}³</strong></span>
      <span>✓ Hundredth: <strong>${formatRounded(value, 2)} ${escapeHTML(task.unit)}³</strong></span>
      <span>✓ Thousandth: <strong>${formatRounded(value, 3)} ${escapeHTML(task.unit)}³</strong></span>
    </div>`;
  }

  function directOrWordMarkup(task, data, qNumber) {
    const isWord = task.kind === "word";
    const needsBase = task.shape !== "sphere";
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
            <h5>5. Calculate and round the volume three ways</h5>
            <p class="v87-small-note">Use the same calculated volume. Report it to the nearest tenth, hundredth, and thousandth. Include cubic units in every answer.</p>
            ${roundingInputsMarkup(task, data)}
            ${data.solved ? roundingSolutionMarkup(task) : ""}
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
      return `<svg class="v87-composite-svg" viewBox="0 0 560 330" role="img" aria-label="Capsule made from a cylinder and two hemispheres">
        <path d="M170 70 H390 A90 90 0 0 1 390 250 H170 A90 90 0 0 1 170 70 Z" class="v87-composite-fill"/>
        <line x1="170" y1="60" x2="390" y2="60" class="v87-dim"/><line x1="170" y1="52" x2="170" y2="68" class="v87-dim"/><line x1="390" y1="52" x2="390" y2="68" class="v87-dim"/>
        <text x="280" y="45" text-anchor="middle" class="v87-comp-label">8 ${u}</text>
        <line x1="80" y1="160" x2="170" y2="160" class="v87-dim"/><line x1="80" y1="148" x2="80" y2="172" class="v87-dim"/>
        <text x="118" y="145" text-anchor="middle" class="v87-comp-label">6 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "cone-cylinder") {
      return `<svg class="v87-composite-svg" viewBox="0 0 560 390" role="img" aria-label="Cone on top of a cylinder">
        <path d="M280 28 L140 168 Q280 203 420 168 Z" class="v87-composite-fill" stroke="none"/>
        <line x1="280" y1="28" x2="140" y2="168" class="v87-outline-line"/><line x1="280" y1="28" x2="420" y2="168" class="v87-outline-line"/>
        <ellipse cx="280" cy="168" rx="140" ry="35" class="v87-composite-base-fill"/>
        <path d="M140 168 V310 Q280 345 420 310 V168 Z" class="v87-composite-fill" stroke="none"/>
        <line x1="140" y1="168" x2="140" y2="310" class="v87-outline-line"/><line x1="420" y1="168" x2="420" y2="310" class="v87-outline-line"/>
        <ellipse cx="280" cy="310" rx="140" ry="35" class="v87-composite-base-fill"/>
        <line x1="140" y1="310" x2="420" y2="310" class="v87-dim"/><text x="280" y="294" text-anchor="middle" class="v87-comp-label">8 ${u}</text>
        <line x1="448" y1="168" x2="448" y2="310" class="v87-dim"/><text x="466" y="244" class="v87-comp-label">6 ${u}</text>
        <line x1="112" y1="28" x2="112" y2="168" class="v87-dim"/><text x="96" y="103" text-anchor="end" class="v87-comp-label">5 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "cone-hole") {
      return `<svg class="v87-composite-svg" viewBox="0 0 580 360" role="img" aria-label="Cylinder with a cone-shaped opening removed">
        <path d="M110 72 V286 Q270 332 430 286 V72 Z" class="v87-composite-fill" stroke="none"/>
        <line x1="110" y1="72" x2="110" y2="286" class="v87-outline-line"/><line x1="430" y1="72" x2="430" y2="286" class="v87-outline-line"/>
        <ellipse cx="270" cy="72" rx="160" ry="46" class="v87-outline"/>
        <ellipse cx="270" cy="286" rx="160" ry="46" class="v87-composite-base-fill"/>
        <path d="M110 72 L270 275 L430 72" class="v87-cone-cut-sides"/><ellipse cx="270" cy="72" rx="160" ry="46" class="v87-cone-cut-base"/>
        <line x1="110" y1="72" x2="430" y2="72" class="v87-dim"/><text x="270" y="57" text-anchor="middle" class="v87-comp-label">10 ${u}</text>
        <line x1="470" y1="72" x2="470" y2="286" class="v87-dim"/><text x="490" y="185" class="v87-comp-label">12 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "silo") {
      return `<svg class="v87-composite-svg" viewBox="0 0 570 390" role="img" aria-label="Cylinder with a hemispherical roof">
        <path d="M135 160 A140 140 0 0 1 415 160" class="v87-composite-fill"/>
        <path d="M135 160 V320 Q275 355 415 320 V160 Z" class="v87-composite-fill" stroke="none"/>
        <line x1="135" y1="160" x2="135" y2="320" class="v87-outline-line"/><line x1="415" y1="160" x2="415" y2="320" class="v87-outline-line"/>
        <ellipse cx="275" cy="320" rx="140" ry="35" class="v87-composite-base-fill"/>
        <line x1="275" y1="160" x2="415" y2="160" class="v87-dim"/><text x="345" y="145" text-anchor="middle" class="v87-comp-label">4 ${u}</text>
        <line x1="448" y1="160" x2="448" y2="320" class="v87-dim"/><text x="468" y="245" class="v87-comp-label">10 ${u}</text>
      </svg>`;
    }
    if (task.diagram === "tennis-can") {
      return `<img class="v87-tennis-site-figure" src="assets/8-7a/q17-tennis-can.svg?v=20260919-3" alt="Cylinder 6.6 centimeters in diameter and 19.8 centimeters high containing three tennis balls, each 6.6 centimeters in diameter">`;
    }
    return `<svg class="v87-composite-svg" viewBox="0 0 540 430" role="img" aria-label="Cone with a hemispherical scoop">
      <path d="M120 155 A135 135 0 0 1 390 155" class="v87-composite-fill"/>
      <path d="M120 155 L255 390 L390 155 Z" class="v87-composite-fill" stroke="none"/>
      <line x1="120" y1="155" x2="255" y2="390" class="v87-outline-line"/><line x1="390" y1="155" x2="255" y2="390" class="v87-outline-line"/>
      <line x1="120" y1="155" x2="390" y2="155" class="v87-dim"/><text x="255" y="140" text-anchor="middle" class="v87-comp-label">8 ${u}</text>
      <line x1="420" y1="155" x2="420" y2="390" class="v87-dim"/><text x="442" y="278" class="v87-comp-label">9 ${u}</text>
    </svg>`;
  }

  function compositeMarkup(task, data, qNumber) {
    const step = data.seminarStep || 0;
    const completed = data.seminarAnswers || [];
    return `<section class="v87-shell composite-shell">
      <header class="v87-question-header">
        <div><p class="lab-mini-title">Question ${qNumber} of ${TASKS.length}</p><h4>${escapeHTML(task.title)}</h4><p>Read only the measurements shown on the figure. Decide what each measure represents before you calculate.</p></div>
        <span class="v87-chip">Composite volume</span>
      </header>

      <div class="v87-composite-grid">
        <section class="v87-visual-card composite-visual${task.diagram === "tennis-can" ? " v87-tennis-visual" : ""}">${task.diagram === "tennis-can" ? "" : "<h5>Study the figure</h5>"}${compositeSvg(task)}</section>
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
            <h5>Now calculate and round the final volume three ways.</h5>
            <p class="v87-small-note">Report the same final volume to the nearest tenth, hundredth, and thousandth. Include cubic units every time.</p>
            ${roundingInputsMarkup(task, data)}
            ${data.solved ? roundingSolutionMarkup(task) : ""}
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

  function hasCubicUnit(raw, task) {
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

  function parseVolumeEntry(text) {
    const raw = String(text || "").trim();
    const numberMatch = raw.replace(/,/g, "").match(/-?\d+(?:\.(\d+))?/);
    if (!numberMatch) return { raw, numeric: NaN, decimalDigits: "", hasNumber: false };
    return {
      raw,
      numeric: Number(numberMatch[0]),
      decimalDigits: numberMatch[1] || "",
      hasNumber: true
    };
  }

  function volumeAnswerCorrect(text, task, places) {
    const entry = parseVolumeEntry(text);
    if (!entry.hasNumber) return false;
    if (entry.decimalDigits.length !== places) return false;
    const expected = roundTo(taskVolume(task), places);
    if (Math.abs(entry.numeric - expected) > 10 ** (-(places + 4))) return false;
    return hasCubicUnit(entry.raw, task);
  }

  function looksLikeRoundingIssue(numeric, exact, requestedPlaces) {
    if (!Number.isFinite(numeric)) return false;
    for (let places = 0; places <= 6; places += 1) {
      const candidate = roundTo(exact, places);
      const tolerance = 10 ** (-(Math.max(places, requestedPlaces) + 3));
      if (Math.abs(numeric - candidate) <= tolerance) return true;
    }
    const requestedStep = 10 ** (-requestedPlaces);
    return Math.abs(numeric - exact) < requestedStep;
  }

  function mathErrorHint(task) {
    if (task.kind === "composite") {
      return "Your reasoning steps are complete, but the numerical volume is not correct yet. Recheck the volume of each solid and then the add/subtract operation.";
    }
    const dimensionText = task.shape === "sphere"
      ? "the radius you entered"
      : "the radius and height you entered";
    return `Your formula and dimensions are set up, but the numerical volume is not correct yet. Recheck the substitution and arithmetic using ${dimensionText}.`;
  }

  function roundingAnswerError(data, task) {
    const exact = taskVolume(task);

    for (const level of ROUNDING_LEVELS) {
      const value = data.inputs[level.key];
      const entry = parseVolumeEntry(value);

      if (!entry.raw) {
        return `${level.label}: this answer is missing. Enter the volume and include ${task.unit}³.`;
      }
      if (!entry.hasNumber) {
        return `${level.label}: I could not find a numerical volume. Enter the number first, then add ${task.unit}³.`;
      }

      const expected = roundTo(exact, level.places);
      const numericCorrect = Math.abs(entry.numeric - expected) <= 10 ** (-(level.places + 4));

      if (!numericCorrect) {
        if (looksLikeRoundingIssue(entry.numeric, exact, level.places)) {
          return `${level.label}: your calculation appears consistent, but the rounding/place value is off. Round the same volume to exactly ${level.places} decimal place${level.places === 1 ? "" : "s"}.`;
        }
        return `${level.label}: ${mathErrorHint(task)} This is a math/calculation issue, not a place-value issue.`;
      }

      if (entry.decimalDigits.length !== level.places) {
        return `${level.label}: your numerical value is correct. This is only a place-value/formatting issue—show exactly ${level.places} decimal place${level.places === 1 ? "" : "s"}.`;
      }

      if (!hasCubicUnit(entry.raw, task)) {
        return `${level.label}: your number and place value are correct. Add the cubic unit ${task.unit}³.`;
      }
    }
    return "";
  }

  function numericInputCorrect(value, expected) {
    const n = Number(String(value || "").trim());
    return Number.isFinite(n) && Math.abs(n - Number(expected)) < 0.001;
  }

  function dimensionError(data, task) {
    const radiusRaw = String(data.inputs.radius || "").trim();
    const needsHeight = task.shape !== "sphere";
    const heightRaw = String(data.inputs.height || "").trim();

    const missing = [];
    if (!radiusRaw) missing.push("radius");
    if (needsHeight && !heightRaw) missing.push("height");
    if (missing.length) {
      return `Dimension setup is incomplete: enter the ${missing.join(" and ")} before checking the volume. The software has not checked your rounding yet.`;
    }

    const radiusCorrect = numericInputCorrect(radiusRaw, task.radius);
    const heightCorrect = !needsHeight || numericInputCorrect(heightRaw, task.height);

    if (!radiusCorrect && !heightCorrect) {
      return "Dimension error: both the radius and height need to be rechecked before you calculate the volume.";
    }

    if (!radiusCorrect) {
      const diameterNudge = task.given === "diameter" || (task.kind === "word" && /diameter|across|through its center/i.test(task.prompt || ""));
      return diameterNudge
        ? "Dimension error: the given measure goes all the way across the circle. Convert the diameter to a radius before calculating. The software has not checked your arithmetic or rounding yet."
        : "Dimension error: recheck the radius you entered. The software has not checked your arithmetic or rounding yet.";
    }

    if (!heightCorrect) {
      return "Dimension error: recheck the height you entered. The software has not checked your arithmetic or rounding yet.";
    }

    return "";
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
        const roundingError = roundingAnswerError(data, task);
        if (roundingError) {
          return setLabFeedback(roundingError, "incorrect");
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
        const dimensionProblem = dimensionError(data, task);
        if (dimensionProblem) {
          return setLabFeedback(dimensionProblem, "incorrect");
        }
        const roundingError = roundingAnswerError(data, task);
        if (roundingError) {
          return setLabFeedback(roundingError, "incorrect");
        }
      }

      data.solved = true;
      const value = taskVolume(task);
      const successMessage = `Correct. Tenth: ${formatRounded(value, 1)} ${task.unit}³; hundredth: ${formatRounded(value, 2)} ${task.unit}³; thousandth: ${formatRounded(value, 3)} ${task.unit}³.`;
      rerender(successMessage);
      setLabFeedback(successMessage, "correct");
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
