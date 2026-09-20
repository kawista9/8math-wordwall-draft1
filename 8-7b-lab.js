(function surface87BLabModule() {
  const PI = Math.PI;
  const FORMULAS = {
    lateral: "L = Ph",
    total: "S = Ph + 2B"
  };

  const EXPLORE_TASKS = [
    { kind: "explore", shape: "rect", title: "Rectangular prism · choose any base pair", unit: "cm", width: 8, height: 5, depth: 3 },
    { kind: "explore", shape: "rect", title: "Rectangular prism · a different size", unit: "m", width: 10, height: 4, depth: 6 },
    { kind: "explore", shape: "tri", title: "Triangular prism", unit: "cm", h: 9, base: { shape: "triangle", triBase: 6, triHeight: 4, sides: [5, 5, 6], B: 12, P: 16 } },
    { kind: "explore", shape: "cylinder", title: "Cylinder", unit: "in", h: 11, radius: 4 },
    { kind: "explore", shape: "tri", title: "Right triangular prism", unit: "ft", h: 7, base: { shape: "triangle", triBase: 8, triHeight: 6, sides: [6, 8, 10], B: 24, P: 24 } },
    { kind: "explore", shape: "cylinder", title: "Narrow cylinder", unit: "cm", h: 14, radius: 2.5 }
  ];

  const SCENARIO_TASKS = [
    {
      kind: "scenario", shape: "rect", title: "Paint the side panels", unit: "ft", need: "lateral",
      prompt: "A display pedestal is 12 ft by 8 ft on the top and bottom and 5 ft tall. Only the four side panels will be painted. The top and bottom will not be painted.",
      base: { shape: "rectangle", a: 12, b: 8, B: 96, P: 40 }, h: 5, netBases: ["top", "bottom"]
    },
    {
      kind: "scenario", shape: "rect", title: "Wrap the entire gift box", unit: "in", need: "total",
      prompt: "A rectangular gift box is 10 in by 6 in on its top and bottom and 4 in tall. Wrapping paper will cover every outside face.",
      base: { shape: "rectangle", a: 10, b: 6, B: 60, P: 32 }, h: 4, netBases: ["top", "bottom"]
    },
    {
      kind: "scenario", shape: "cylinder", title: "Design a can label", unit: "cm", need: "lateral",
      prompt: "A label wraps around the curved side of a cylindrical can with radius 3 cm and height 9 cm. The label does not cover either circular end.",
      radius: 3, h: 9, netBases: ["circleA", "circleB"]
    },
    {
      kind: "scenario", shape: "cylinder", title: "Coat the entire cylinder", unit: "m", need: "total",
      prompt: "A cylindrical tank with radius 4 m and height 10 m receives a protective coating on the curved side, the top, and the bottom.",
      radius: 4, h: 10, netBases: ["circleA", "circleB"]
    },
    {
      kind: "scenario", shape: "tri", title: "Cover only the long faces", unit: "ft", need: "lateral",
      prompt: "A triangular-prism tunnel has triangular ends with side lengths 5 ft, 5 ft, and 6 ft. The tunnel is 12 ft long. Fabric covers the three long rectangular faces, but not the triangular ends.",
      base: { shape: "triangle", triBase: 6, triHeight: 4, sides: [5, 5, 6], B: 12, P: 16 }, h: 12, netBases: ["triA", "triB"]
    },
    {
      kind: "scenario", shape: "tri", title: "Cover the complete triangular package", unit: "cm", need: "total",
      prompt: "A triangular-prism package has triangular ends with side lengths 5 cm, 5 cm, and 6 cm. The altitude of each triangular end is 4 cm, and the prism is 10 cm long. Material covers every face.",
      base: { shape: "triangle", triBase: 6, triHeight: 4, sides: [5, 5, 6], B: 12, P: 16 }, h: 10, netBases: ["triA", "triB"]
    }
  ];

  const MISSING_TASKS = [
    {
      kind: "missing", title: "Find the distance between the bases", unit: "cm", missing: "height",
      prompt: "A triangular prism has lateral surface area 168 cm². The perimeter of one triangular base is 24 cm. Find h, the distance between the two bases.",
      L: 168, P: 24, answer: 7
    },
    {
      kind: "missing", title: "Find the cylinder diameter", unit: "cm", missing: "diameter",
      prompt: "A cylinder has lateral surface area 301.59 cm² and height 8 cm. Find the diameter of its circular base.",
      L: 96 * PI, displayL: 301.59, h: 8, circumference: 12 * PI, answer: 12
    },
    {
      kind: "missing", title: "Find the circumference of the base", unit: "in", missing: "circumference",
      prompt: "A cylinder has lateral surface area 197.92 in² and height 7 in. Find the circumference of one circular base.",
      L: 63 * PI, displayL: 197.92, h: 7, answer: 9 * PI
    }
  ];

  const TASKS = [...EXPLORE_TASKS, ...SCENARIO_TASKS, ...MISSING_TASKS];

  function roundTo(value, places = 2) {
    const factor = 10 ** places;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  }

  function fmt(value, places = 2) {
    return roundTo(value, places).toFixed(places);
  }

  function clean(value) {
    const n = roundTo(value, 3);
    return Number.isInteger(n) ? String(n) : String(n);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
  }

  function numeric(value) {
    const match = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : NaN;
  }

  function near(value, expected, tolerance = 0.02) {
    const n = numeric(value);
    return Number.isFinite(n) && Math.abs(n - Number(expected)) <= tolerance;
  }

  function hundredthStatus(value, expected) {
    const raw = String(value ?? "").trim();
    const match = raw.replace(/,/g, "").match(/-?\d+(?:\.(\d+))?/);
    if (!match) return { ok: false, type: "missing" };
    const n = Number(match[0]);
    const target = roundTo(expected, 2);
    if (Math.abs(n - target) > 0.005) return { ok: false, type: "math", target };
    const decimals = match[1] || "";
    const targetIsWhole = Number.isInteger(target);

    // A whole-number result may be entered as 40, 40.0, or 40.00.
    // Non-whole results still show the hundredths place explicitly.
    if (targetIsWhole) {
      if (decimals.length > 2) return { ok: false, type: "place", target, targetIsWhole };
      return { ok: true, target, targetIsWhole };
    }

    if (decimals.length !== 2) return { ok: false, type: "place", target, targetIsWhole };
    return { ok: true, target, targetIsWhole };
  }

  function circleBase(radius) {
    return { shape: "circle", radius, B: PI * radius * radius, P: 2 * PI * radius };
  }

  function rectPair(task, pair) {
    if (pair === "frontBack") {
      return { shape: "rectangle", label: "front/back", a: task.width, b: task.height, B: task.width * task.height, P: 2 * (task.width + task.height), h: task.depth };
    }
    if (pair === "leftRight") {
      return { shape: "rectangle", label: "left/right", a: task.depth, b: task.height, B: task.depth * task.height, P: 2 * (task.depth + task.height), h: task.width };
    }
    return { shape: "rectangle", label: "top/bottom", a: task.width, b: task.depth, B: task.width * task.depth, P: 2 * (task.width + task.depth), h: task.height };
  }

  function baseSpec(task, pair) {
    if (task.shape === "rect") return task.kind === "explore" ? rectPair(task, pair || "topBottom") : { ...task.base, h: task.h, label: "selected pair" };
    if (task.shape === "cylinder") return { ...circleBase(task.radius), h: task.h, label: "circular bases" };
    return { ...task.base, h: task.h, label: "triangular bases" };
  }

  function surfaceValues(task, pair) {
    const base = baseSpec(task, pair);
    const lateral = base.P * base.h;
    const total = lateral + 2 * base.B;
    return { ...base, lateral, total };
  }

  function freshQuestion(index = 0) {
    return {
      index,
      step: 0,
      solved: false,
      turning: true,
      rx: -14,
      ry: 24,
      selectedFaces: [],
      pair: null,
      need: null,
      formula: null,
      inputs: {},
      seminar: []
    };
  }

  window.SURFACE_87B_TOTAL = TASKS.length;
  window.resetSurface87BQuestion = function resetSurface87BQuestion(data, index) {
    Object.assign(data, freshQuestion(index));
  };

  function phaseName(index) {
    if (index < 6) return "turn it + build the formulas";
    if (index < 12) return "real-world surface area";
    return "solve for a missing measure";
  }

  function rect3DMarkup(task, data) {
    const sel = new Set(data.selectedFaces || []);
    const u = escapeHTML(task.unit);
    const face = (id, pair, label, horizontal, vertical) =>
      `<button type="button" class="sa87b-cube-face ${id}${sel.has(id) ? " is-selected" : ""}" data-sa-face="${id}" data-sa-pair="${pair}" aria-label="${label} face, ${horizontal} by ${vertical} ${u}">
        <span class="sa87b-face-measure horizontal">${horizontal} ${u}</span>
        <span class="sa87b-face-measure vertical">${vertical} ${u}</span>
      </button>`;
    return `<div class="sa87b-object sa87b-cuboid">
      ${face("front", "frontBack", "front", clean(task.width), clean(task.height))}
      ${face("back", "frontBack", "back", clean(task.width), clean(task.height))}
      ${face("left", "leftRight", "left", clean(task.depth), clean(task.height))}
      ${face("right", "leftRight", "right", clean(task.depth), clean(task.height))}
      ${face("top", "topBottom", "top", clean(task.width), clean(task.depth))}
      ${face("bottom", "topBottom", "bottom", clean(task.width), clean(task.depth))}
    </div>`;
  }

  function triangular3DMarkup(task, data) {
    const selected = new Set(data.selectedFaces || []);
    const u = escapeHTML(task.unit);
    const s = task.base.sides;
    const baseLabel = clean(task.base.triBase);
    const altitudeLabel = clean(task.base.triHeight);
    const prismLength = clean(task.h);

    return `<svg class="sa87b-object sa87b-svg-solid sa87b-tri-prism" viewBox="0 0 560 350" role="img" aria-label="Triangular prism with two congruent triangular bases and labeled dimensions">
      <!-- three lateral faces, drawn behind the bases -->
      <polygon points="110,85 330,50 450,140 230,175" fill="#aee7f7" fill-opacity=".9" stroke="#32206f" stroke-width="5"/>
      <polygon points="110,265 330,230 450,140 230,175" fill="#c9eef8" fill-opacity=".92" stroke="#32206f" stroke-width="5"/>
      <polygon points="110,85 110,265 330,230 330,50" fill="#d9f4fb" fill-opacity=".88" stroke="#32206f" stroke-width="5"/>

      <!-- back base -->
      <polygon class="sa87b-svg-face${selected.has("triBack") ? " is-selected" : ""}" data-sa-face="triBack" data-sa-pair="triPair"
        points="330,50 330,230 450,140" fill="#dfc8ff" fill-opacity=".72" stroke="#6d2fd4" stroke-width="6"/>

      <!-- front base: 6-unit side with 4-unit perpendicular altitude gives 5-5-6 triangle -->
      <polygon class="sa87b-svg-face${selected.has("triFront") ? " is-selected" : ""}" data-sa-face="triFront" data-sa-pair="triPair"
        points="110,85 110,265 230,175" fill="#ead8ff" stroke="#6d2fd4" stroke-width="7"/>

      <!-- altitude on front base -->
      <line x1="110" y1="175" x2="230" y2="175" class="sa87b-model-dim" stroke-dasharray="9 7"/>
      <path d="M110 175 h14 v14" fill="none" stroke="#e6398f" stroke-width="4"/>

      <!-- dimension labels placed around, not over, the triangle -->
      <text x="78" y="178" text-anchor="middle" class="sa87b-model-label" transform="rotate(-90 78 178)">base = ${baseLabel} ${u}</text>
      <text x="166" y="159" text-anchor="middle" class="sa87b-model-label">height = ${altitudeLabel} ${u}</text>
      <text x="157" y="111" text-anchor="middle" class="sa87b-model-label">${clean(s[0])} ${u}</text>
      <text x="157" y="251" text-anchor="middle" class="sa87b-model-label">${clean(s[1])} ${u}</text>

      <!-- prism length labels the connector between matching vertices -->
      <line x1="110" y1="85" x2="330" y2="50" class="sa87b-length-guide"/>
      <text x="222" y="42" text-anchor="middle" class="sa87b-model-label sa87b-length-label">prism length = ${prismLength} ${u}</text>
    </svg>`;
  }

  function cylinder3DMarkup(task, data) {
    const selected = new Set(data.selectedFaces || []);
    const u = escapeHTML(task.unit);
    return `<svg class="sa87b-object sa87b-svg-solid" viewBox="0 0 470 370" role="img" aria-label="Cylinder with labeled radius and height that turn with the model">
      <path d="M105 80 V290 Q230 335 355 290 V80 Z" fill="#c6eff9" stroke="none"/>
      <line x1="105" y1="80" x2="105" y2="290" stroke="#32206f" stroke-width="6"/>
      <line x1="355" y1="80" x2="355" y2="290" stroke="#32206f" stroke-width="6"/>
      <ellipse class="sa87b-svg-face${selected.has("circleTop") ? " is-selected" : ""}" data-sa-face="circleTop" data-sa-pair="circlePair" cx="230" cy="80" rx="125" ry="40" fill="#e9d6ff" stroke="#6d2fd4" stroke-width="6"/>
      <ellipse class="sa87b-svg-face${selected.has("circleBottom") ? " is-selected" : ""}" data-sa-face="circleBottom" data-sa-pair="circlePair" cx="230" cy="290" rx="125" ry="40" fill="#d9c0ff" stroke="#6d2fd4" stroke-width="6"/>
      <circle cx="230" cy="80" r="4" fill="#e6398f"/>
      <line x1="230" y1="80" x2="355" y2="80" class="sa87b-model-dim"/>
      <text x="292" y="64" text-anchor="middle" class="sa87b-model-label">r = ${clean(task.radius)} ${u}</text>
      <line x1="390" y1="80" x2="390" y2="290" class="sa87b-model-dim"/>
      <text x="412" y="192" text-anchor="middle" class="sa87b-model-label" transform="rotate(90 412 192)">h = ${clean(task.h)} ${u}</text>
    </svg>`;
  }

  function turnableSolidMarkup(task, data) {
    const model = task.shape === "rect" ? rect3DMarkup(task, data) : task.shape === "tri" ? triangular3DMarkup(task, data) : cylinder3DMarkup(task, data);
    return `<section class="sa87b-turn-card">
      <div class="sa87b-turn-toolbar">
        <div><strong>Turn the solid</strong><span>Drag the model to inspect it. Lock it when you are ready to select the bases.</span></div>
        <button type="button" class="sa87b-turn-toggle" id="saTurnToggle">${data.turning ? "🔄 Turning ON" : "🔒 Turning OFF"}</button>
      </div>
      <div class="sa87b-scene">
        <div class="sa87b-turner${data.turning ? " can-turn" : ""}" style="--rx:${data.rx}deg;--ry:${data.ry}deg">${model}</div>
      </div>
      <p class="sa87b-face-instruction"><strong>Step 1:</strong> Turn the solid until you can see a base clearly. <strong>While Turning is ON, double-click a face to select it.</strong> If you switch Turning OFF, a single click will select. Choose two congruent, parallel opposite faces. For a rectangular prism, any one of the three opposite pairs can be the bases.</p>
    </section>`;
  }

  function basePicture(spec, unit) {
    const u = escapeHTML(unit);

    if (spec.shape === "circle") {
      return `<svg class="sa87b-base-svg" viewBox="0 0 460 310" role="img" aria-label="Circular base shown separately">
        <circle cx="205" cy="150" r="92" fill="#d7f3ff" stroke="#342173" stroke-width="6"/>
        <circle cx="205" cy="150" r="5" fill="#e6398f"/>
        <line x1="205" y1="150" x2="297" y2="150" class="sa87b-dim"/>
        <text x="315" y="138" class="sa87b-svg-label">r = ${clean(spec.radius)} ${u}</text>
        <text x="205" y="286" text-anchor="middle" class="sa87b-base-caption">Use this circle only to find B and P.</text>
      </svg>`;
    }

    if (spec.shape === "triangle") {
      // Draw 5-5-6 / right-triangle bases proportionally from the given base and altitude.
      const base = Number(spec.triBase);
      const altitude = Number(spec.triHeight);
      const scale = Math.min(250 / Math.max(base, 1), 180 / Math.max(altitude, 1));
      const basePx = base * scale;
      const altPx = altitude * scale;
      const centerX = 260;
      const bottomY = 255;
      const leftX = centerX - basePx / 2;
      const rightX = centerX + basePx / 2;
      const topY = bottomY - altPx;

      return `<svg class="sa87b-base-svg" viewBox="0 0 520 360" role="img" aria-label="Triangular base shown separately">
        <polygon points="${leftX},${bottomY} ${rightX},${bottomY} ${centerX},${topY}" fill="#e6d7ff" stroke="#342173" stroke-width="6"/>

        <!-- perpendicular altitude -->
        <line x1="${centerX}" y1="${topY}" x2="${centerX}" y2="${bottomY}" class="sa87b-dim" stroke-dasharray="9 7"/>
        <path d="M${centerX} ${bottomY - 18} h18 v-18" fill="none" stroke="#e6398f" stroke-width="4"/>

        <!-- base dimension below the triangle -->
        <line x1="${leftX}" y1="300" x2="${rightX}" y2="300" class="sa87b-dim"/>
        <text x="${centerX}" y="338" text-anchor="middle" class="sa87b-svg-label">${clean(spec.triBase)} ${u}</text>

        <!-- side lengths outside the slanted sides -->
        <text x="${leftX - 34}" y="${(bottomY + topY) / 2}" text-anchor="middle" class="sa87b-svg-label">${clean(spec.sides[0])} ${u}</text>
        <text x="${rightX + 34}" y="${(bottomY + topY) / 2}" text-anchor="middle" class="sa87b-svg-label">${clean(spec.sides[1])} ${u}</text>

        <!-- altitude label offset from dashed line -->
        <text x="${centerX + 24}" y="${(bottomY + topY) / 2}" class="sa87b-svg-label">h = ${clean(spec.triHeight)} ${u}</text>
      </svg>`;
    }

    // Rectangular bases are drawn to the actual side-length ratio.
    const a = Math.max(Number(spec.a) || 1, 0.1);
    const b = Math.max(Number(spec.b) || 1, 0.1);
    const maxW = 260;
    const maxH = 220;
    const scale = Math.min(maxW / a, maxH / b);
    const rectW = a * scale;
    const rectH = b * scale;
    const centerX = 275;
    const centerY = 165;
    const x = centerX - rectW / 2;
    const y = centerY - rectH / 2;
    const vDimX = x - 45;
    const hDimY = y + rectH + 42;

    return `<svg class="sa87b-base-svg" viewBox="0 0 550 390" role="img" aria-label="Rectangular base shown separately in proportion to its dimensions">
      <rect x="${x}" y="${y}" width="${rectW}" height="${rectH}" rx="12" fill="#d8f2ff" stroke="#342173" stroke-width="6"/>

      <line x1="${x}" y1="${hDimY}" x2="${x + rectW}" y2="${hDimY}" class="sa87b-dim"/>
      <text x="${centerX}" y="${hDimY + 38}" text-anchor="middle" class="sa87b-svg-label">${clean(spec.a)} ${u}</text>

      <line x1="${vDimX}" y1="${y}" x2="${vDimX}" y2="${y + rectH}" class="sa87b-dim"/>
      <text x="${vDimX - 18}" y="${centerY}" text-anchor="middle" class="sa87b-svg-label">${clean(spec.b)} ${u}</text>
    </svg>`;
  }

  function distancePicture(task, spec) {
    const u = escapeHTML(task.unit);
    const h = clean(spec.h);
    if (task.shape === "cylinder") {
      return `<svg class="sa87b-distance-svg" viewBox="0 0 500 310">
        <path d="M95 65 V235 Q235 278 375 235 V65 Z" fill="#cceff8"/>
        <ellipse cx="235" cy="65" rx="140" ry="38" fill="#eadbff" stroke="#52269f" stroke-width="6"/>
        <ellipse cx="235" cy="235" rx="140" ry="38" fill="#eadbff" stroke="#52269f" stroke-width="6"/>
        <line x1="410" y1="65" x2="410" y2="235" class="sa87b-dim"/>
        <text x="430" y="157" class="sa87b-svg-label">${h} ${u}</text>
      </svg>`;
    }
    if (task.shape === "tri") {
      return `<svg class="sa87b-distance-svg" viewBox="0 0 520 310">
        <polygon points="80,85 80,245 205,190" fill="#eadbff" stroke="#52269f" stroke-width="6"/>
        <polygon points="300,55 300,215 425,160" fill="#eadbff" stroke="#52269f" stroke-width="6"/>
        <line x1="80" y1="85" x2="300" y2="55" stroke="#342173" stroke-width="5"/><line x1="80" y1="245" x2="300" y2="215" stroke="#342173" stroke-width="5"/><line x1="205" y1="190" x2="425" y2="160" stroke="#342173" stroke-width="5"/>
        <line x1="92" y1="275" x2="312" y2="245" class="sa87b-dim"/>
        <text x="205" y="278" class="sa87b-svg-label">${h} ${u}</text>
      </svg>`;
    }
    return `<svg class="sa87b-distance-svg" viewBox="0 0 520 320">
      <polygon points="90,100 270,100 355,55 175,55" fill="#eadbff" stroke="#52269f" stroke-width="5"/>
      <polygon points="90,100 270,100 270,245 90,245" fill="#d6f2fb" stroke="#342173" stroke-width="5"/>
      <polygon points="270,100 355,55 355,200 270,245" fill="#c1e8f6" stroke="#342173" stroke-width="5"/>
      <line x1="390" y1="85" x2="390" y2="230" class="sa87b-dim"/>
      <text x="408" y="164" class="sa87b-svg-label">${h} ${u}</text>
      <text x="260" y="286" text-anchor="middle" class="sa87b-tiny">The highlighted opposite faces are your bases. h is the distance between them.</text>
    </svg>`;
  }

  function formulaInputs(values, data, includeTotal = true) {
    return `<div class="sa87b-formula-build">
      <div class="sa87b-formula-line"><strong>L =</strong><input data-sa-input="lP" value="${escapeHTML(data.inputs.lP || "")}" placeholder="P"><span>×</span><input data-sa-input="lh" value="${escapeHTML(data.inputs.lh || "")}" placeholder="h"><span>=</span><input class="answer" data-sa-input="lateral" value="${escapeHTML(data.inputs.lateral || "")}" placeholder="0.00"></div>
      ${includeTotal ? `<div class="sa87b-formula-line"><strong>S =</strong><input data-sa-input="tP" value="${escapeHTML(data.inputs.tP || "")}" placeholder="P"><span>×</span><input data-sa-input="th" value="${escapeHTML(data.inputs.th || "")}" placeholder="h"><span>+</span><span>2(</span><input data-sa-input="tB" value="${escapeHTML(data.inputs.tB || "")}" placeholder="B"><span>) =</span><input class="answer" data-sa-input="total" value="${escapeHTML(data.inputs.total || "")}" placeholder="0.00"></div>` : ""}
      <p>Round final surface-area answers to the nearest hundredth. If the rounded answer is a whole number, you may enter the whole number without .00.</p>
    </div>`;
  }

  function exploreMarkup(task, data, qNumber) {
    const spec = data.pair ? surfaceValues(task, data.pair) : null;
    let work = turnableSolidMarkup(task, data);

    if (data.step >= 1 && spec) {
      work += `<section class="sa87b-learn-card">
        <div class="sa87b-idea"><span>B</span><strong>Area of ONE base</strong><small>Look only at the separate base.</small></div>
        <div class="sa87b-idea"><span>P</span><strong>Perimeter of ONE base</strong><small>For a circle, P means its circumference.</small></div>
        ${basePicture(spec, task.unit)}
        <div class="sa87b-input-row">
          <label><span>B = area of the base</span><input data-sa-input="baseArea" value="${escapeHTML(data.inputs.baseArea || "")}" placeholder="B"></label>
          <label><span>P = perimeter of the base</span><input data-sa-input="basePerimeter" value="${escapeHTML(data.inputs.basePerimeter || "")}" placeholder="P"></label>
        </div>
        <button type="button" class="lab-action" id="checkBase87B">Check B and P</button>
      </section>`;
    }

    if (data.step >= 2 && spec) {
      work += `<section class="sa87b-learn-card">
        <h5>Step 3 · Return to the full solid</h5>
        <p><strong>Lowercase h is not taken from the base.</strong> It is the distance between the two bases you selected.</p>
        ${distancePicture(task, spec)}
        <label class="sa87b-single-input"><span>h = distance between the bases</span><input data-sa-input="distance" value="${escapeHTML(data.inputs.distance || "")}" placeholder="h"></label>
        <button type="button" class="lab-action" id="checkDistance87B">Check h</button>
      </section>`;
    }

    if (data.step >= 3 && spec) {
      work += `<section class="sa87b-learn-card">
        <h5>Step 4 · Build both surface-area equations</h5>
        <p>Type the values into the formula before calculating. This keeps B and P connected to the base and h connected to the distance between bases.</p>
        ${formulaInputs(spec, data, true)}
        <button type="button" class="lab-action" id="checkExploreFinal87B">Check both surface areas</button>
      </section>`;
    }

    return `<section class="sa87b-shell">
      <header class="sa87b-question-head">
        <div><p class="lab-mini-title">Question ${qNumber} of ${TASKS.length} · Base detective</p><h4>${escapeHTML(task.title)}</h4><p>Turn the solid, identify a pair of bases, then build B, P, h, lateral surface area, and total surface area.</p></div>
        <div class="sa87b-formula-key"><span>L = Ph</span><span>S = Ph + 2B</span></div>
      </header>
      ${work}
      <div class="sa87b-actions"><button type="button" class="lab-action sa87b-next" id="next87B"${data.solved ? "" : " hidden"}>Next question</button></div>
    </section>`;
  }

  function netMarkup(task, data) {
    const selected = new Set(data.selectedFaces || []);
    const active = id => selected.has(id) ? " is-selected" : "";
    if (task.shape === "cylinder") {
      return `<svg class="sa87b-net-svg" viewBox="0 0 600 350" role="img" aria-label="Net of a cylinder">
        <rect x="175" y="95" width="250" height="160" fill="#cceff8" stroke="#342173" stroke-width="5"/>
        <ellipse class="sa87b-net-face${active("circleA")}" data-sa-net-face="circleA" cx="110" cy="175" rx="62" ry="62" fill="#eadbff" stroke="#6d2fd4" stroke-width="5"/>
        <ellipse class="sa87b-net-face${active("circleB")}" data-sa-net-face="circleB" cx="490" cy="175" rx="62" ry="62" fill="#eadbff" stroke="#6d2fd4" stroke-width="5"/>
        <text x="300" y="290" text-anchor="middle" class="sa87b-svg-label">height = ${clean(task.h)} ${task.unit}</text>
        <text x="110" y="180" text-anchor="middle" class="sa87b-tiny">base?</text><text x="490" y="180" text-anchor="middle" class="sa87b-tiny">base?</text>
      </svg>`;
    }
    if (task.shape === "tri") {
      return `<svg class="sa87b-net-svg" viewBox="0 0 680 380" role="img" aria-label="Net of a triangular prism">
        <rect x="160" y="120" width="120" height="150" fill="#cceff8" stroke="#342173" stroke-width="4"/>
        <rect x="280" y="120" width="120" height="150" fill="#bde8f7" stroke="#342173" stroke-width="4"/>
        <rect x="400" y="120" width="120" height="150" fill="#cceff8" stroke="#342173" stroke-width="4"/>
        <polygon class="sa87b-net-face${active("triA")}" data-sa-net-face="triA" points="160,120 280,120 220,45" fill="#eadbff" stroke="#6d2fd4" stroke-width="5"/>
        <polygon class="sa87b-net-face${active("triB")}" data-sa-net-face="triB" points="400,270 520,270 460,345" fill="#eadbff" stroke="#6d2fd4" stroke-width="5"/>
        <text x="340" y="305" text-anchor="middle" class="sa87b-svg-label">prism length = ${clean(task.h)} ${task.unit}</text>
      </svg>`;
    }
    return `<svg class="sa87b-net-svg" viewBox="0 0 700 430" role="img" aria-label="Net of a rectangular prism">
      <rect x="250" y="120" width="170" height="100" fill="#cceff8" stroke="#342173" stroke-width="4"/>
      <rect x="250" y="20" width="170" height="100" class="sa87b-net-face${active("top")}" data-sa-net-face="top" fill="#eadbff" stroke="#6d2fd4" stroke-width="5"/>
      <rect x="250" y="220" width="170" height="100" class="sa87b-net-face${active("bottom")}" data-sa-net-face="bottom" fill="#eadbff" stroke="#6d2fd4" stroke-width="5"/>
      <rect x="80" y="120" width="170" height="100" fill="#bde8f7" stroke="#342173" stroke-width="4"/>
      <rect x="420" y="120" width="170" height="100" fill="#bde8f7" stroke="#342173" stroke-width="4"/>
      <rect x="590" y="120" width="95" height="100" fill="#cceff8" stroke="#342173" stroke-width="4"/>
      <text x="335" y="372" text-anchor="middle" class="sa87b-svg-label">distance between chosen bases = ${clean(task.h)} ${task.unit}</text>
    </svg>`;
  }

  function scenarioMarkup(task, data, qNumber) {
    const spec = surfaceValues(task, null);
    let content = `<section class="sa87b-scenario-card"><h5>Read the situation</h5><p class="sa87b-scenario">${escapeHTML(task.prompt)}</p></section>`;

    if (data.step === 0) {
      content += `<section class="sa87b-learn-card">
        <h5>Step 1 · What kind of surface area is the situation asking for?</h5>
        <div class="sa87b-choice-row">
          <button type="button" data-sa-need="lateral">Lateral surface area<br><small>the faces between the bases</small></button>
          <button type="button" data-sa-need="total">Total surface area<br><small>every outside face</small></button>
        </div>
      </section>`;
    }

    if (data.step >= 1) {
      content += `<section class="sa87b-learn-card">
        <h5>Step 2 · Choose the matching formula</h5>
        <div class="sa87b-choice-row">
          <button type="button" data-sa-formula="lateral">L = Ph</button>
          <button type="button" data-sa-formula="total">S = Ph + 2B</button>
        </div>
      </section>`;
    }

    if (data.step >= 2) {
      content += `<section class="sa87b-learn-card">
        <h5>Step 3 · Click the two bases on the net</h5>
        <p>The base pair tells you where B and P come from. The remaining distance between those bases is h.</p>
        ${netMarkup(task, data)}
      </section>`;
    }

    if (data.step >= 3) {
      content += `<section class="sa87b-learn-card">
        <h5>Step 4 · Pull B and P from one base only</h5>
        ${basePicture(spec, task.unit)}
        <div class="sa87b-input-row">
          <label><span>P = perimeter/circumference</span><input data-sa-input="basePerimeter" value="${escapeHTML(data.inputs.basePerimeter || "")}" placeholder="P"></label>
          ${task.need === "total" ? `<label><span>B = area of one base</span><input data-sa-input="baseArea" value="${escapeHTML(data.inputs.baseArea || "")}" placeholder="B"></label>` : ""}
        </div>
        <button type="button" class="lab-action" id="checkScenarioBase87B">Check base values</button>
      </section>`;
    }

    if (data.step >= 4) {
      const total = task.need === "total";
      content += `<section class="sa87b-learn-card">
        <h5>Step 5 · Set up the formula and calculate</h5>
        ${formulaInputs(spec, data, total)}
        <button type="button" class="lab-action" id="checkScenarioFinal87B">Check surface area</button>
      </section>`;
    }

    return `<section class="sa87b-shell">
      <header class="sa87b-question-head">
        <div><p class="lab-mini-title">Question ${qNumber} of ${TASKS.length} · Real-world decision</p><h4>${escapeHTML(task.title)}</h4><p>Decide what is being covered, choose the formula, use the net to locate the bases, then calculate.</p></div>
        <div class="sa87b-formula-key"><span>L = Ph</span><span>S = Ph + 2B</span></div>
      </header>
      ${content}
      <div class="sa87b-actions"><button type="button" class="lab-action sa87b-next" id="next87B"${data.solved ? "" : " hidden"}>Next question</button></div>
    </section>`;
  }

  function missingMarkup(task, data, qNumber) {
    let visual = "";
    if (task.missing === "height") {
      visual = `<div class="sa87b-given-grid"><div><span>L</span><strong>168 cm²</strong></div><div><span>P</span><strong>24 cm</strong></div><div><span>h</span><strong>?</strong></div></div>`;
    } else if (task.missing === "diameter") {
      visual = `<div class="sa87b-given-grid"><div><span>L</span><strong>301.59 cm²</strong></div><div><span>h</span><strong>8 cm</strong></div><div><span>d</span><strong>?</strong></div></div>`;
    } else {
      visual = `<div class="sa87b-given-grid"><div><span>L</span><strong>197.92 in²</strong></div><div><span>h</span><strong>7 in</strong></div><div><span>P = C</span><strong>?</strong></div></div>`;
    }

    let inputs = "";
    if (task.missing === "diameter") {
      inputs = `<label><span>First find the circumference P = L ÷ h</span><input data-sa-input="intermediate" value="${escapeHTML(data.inputs.intermediate || "")}" placeholder="circumference"></label>
        <label><span>Then find diameter d = P ÷ π</span><input data-sa-input="missingAnswer" value="${escapeHTML(data.inputs.missingAnswer || "")}" placeholder="0.00"></label>`;
    } else {
      const label = task.missing === "height" ? "h = L ÷ P" : "P = L ÷ h";
      inputs = `<label><span>${label}</span><input data-sa-input="missingAnswer" value="${escapeHTML(data.inputs.missingAnswer || "")}" placeholder="0.00"></label>`;
    }

    return `<section class="sa87b-shell">
      <header class="sa87b-question-head">
        <div><p class="lab-mini-title">Question ${qNumber} of ${TASKS.length} · Missing measure</p><h4>${escapeHTML(task.title)}</h4><p>${escapeHTML(task.prompt)}</p></div>
        <div class="sa87b-formula-key"><span>L = Ph</span></div>
      </header>
      <section class="sa87b-learn-card">
        ${visual}
        <h5>Choose the formula that connects the information you have.</h5>
        <div class="sa87b-choice-row"><button type="button" data-sa-formula="lateral">L = Ph</button><button type="button" data-sa-formula="total">S = Ph + 2B</button></div>
        <div class="sa87b-missing-inputs">${inputs}</div>
        <p class="sa87b-tiny">Round the requested missing measure to the nearest hundredth. If it is a whole number, you may enter it without .00.</p>
        <button type="button" class="lab-action" id="checkMissing87B">Check missing measure</button>
      </section>
      <div class="sa87b-actions"><button type="button" class="lab-action sa87b-next" id="next87B"${data.solved ? "" : " hidden"}>${qNumber === TASKS.length ? "Finish lab" : "Next question"}</button></div>
    </section>`;
  }

  function pairIsValid(task, first, second) {
    if (!first || !second || first === second) return false;
    const pairs = task.shape === "rect"
      ? [["front", "back"], ["left", "right"], ["top", "bottom"]]
      : task.shape === "tri"
        ? [["triFront", "triBack"]]
        : [["circleTop", "circleBottom"]];
    return pairs.some(pair => pair.includes(first) && pair.includes(second));
  }

  function pairKey(first) {
    if (["front", "back"].includes(first)) return "frontBack";
    if (["left", "right"].includes(first)) return "leftRight";
    if (["top", "bottom"].includes(first)) return "topBottom";
    return first.startsWith("tri") ? "triPair" : "circlePair";
  }

  function attachInputs(body, data) {
    body.querySelectorAll("[data-sa-input]").forEach(input => {
      input.addEventListener("input", () => { data.inputs[input.dataset.saInput] = input.value; });
    });
  }

  function feedbackHundredth(ctx, status, label) {
    if (status.type === "missing") return ctx.setLabFeedback(`${label}: enter a numerical answer rounded to the nearest hundredth.`, "incorrect");
    if (status.type === "place") return ctx.setLabFeedback(`${label}: your numerical value is correct. For a non-whole answer, show the hundredths place with two decimal digits. Whole-number answers do not need .00.`, "incorrect");
    return ctx.setLabFeedback(`${label}: the arithmetic is not correct yet. Recheck the formula substitution and calculation; this is not just a place-value issue.`, "incorrect");
  }

  function wireTurner(body, data) {
    const turner = body.querySelector(".sa87b-turner");
    const toggle = body.querySelector("#saTurnToggle");
    if (!turner || !toggle) return;

    const sync = () => {
      turner.classList.toggle("can-turn", data.turning);
      toggle.textContent = data.turning ? "🔄 Turning ON" : "🔒 Turning OFF";
      turner.style.setProperty("--rx", `${data.rx}deg`);
      turner.style.setProperty("--ry", `${data.ry}deg`);
    };

    toggle.addEventListener("click", () => {
      data.turning = !data.turning;
      sync();
    });

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;

    turner.addEventListener("pointerdown", event => {
      if (!data.turning) return;
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      turner.setPointerCapture(event.pointerId);
    });

    turner.addEventListener("pointermove", event => {
      if (!dragging || !data.turning) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      data.ry += dx * 0.55;
      data.rx = Math.max(-60, Math.min(60, data.rx - dy * 0.4));
      lastX = event.clientX;
      lastY = event.clientY;
      sync();
    });

    turner.addEventListener("pointerup", event => {
      dragging = false;
      turner.releasePointerCapture?.(event.pointerId);
      turner.dataset.moved = moved > 8 ? "yes" : "no";
      setTimeout(() => { if (turner) turner.dataset.moved = "no"; }, 80);
    });
  }

  function finishQuestion(data, ctx, message) {
    data.solved = true;
    ctx.setLabFeedback(message, "correct");
    ctx.setLabProgress(data.index + 1, TASKS.length, `Question ${data.index + 1} complete. Choose Next question.`);
    const next = document.querySelector("#next87B");
    if (next) next.hidden = false;
  }

  function checkExploreFinal(task, data, spec, ctx) {
    const componentChecks = [
      ["lP", spec.P, "L formula: P"],
      ["lh", spec.h, "L formula: h"],
      ["tP", spec.P, "S formula: P"],
      ["th", spec.h, "S formula: h"],
      ["tB", spec.B, "S formula: B"]
    ];
    for (const [key, expected, label] of componentChecks) {
      if (!near(data.inputs[key], expected)) {
        return ctx.setLabFeedback(`${label} is not correct. P and B must come from the separate base; h must be the distance between the bases.`, "incorrect");
      }
    }
    const lStatus = hundredthStatus(data.inputs.lateral, spec.lateral);
    if (!lStatus.ok) return feedbackHundredth(ctx, lStatus, "Lateral surface area");
    const tStatus = hundredthStatus(data.inputs.total, spec.total);
    if (!tStatus.ok) return feedbackHundredth(ctx, tStatus, "Total surface area");
    finishQuestion(data, ctx, `Correct. L = ${fmt(spec.lateral)} ${task.unit}² and S = ${fmt(spec.total)} ${task.unit}². Notice that the only difference is the two base areas, 2B.`);
  }

  window.renderSurface87BLab = function renderSurface87BLab(ctx) {
    const { labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion } = ctx;
    if (!labRuntime.data) labRuntime.data = freshQuestion(0);
    const data = labRuntime.data;
    if (data.index >= TASKS.length) return showLabCompletion("8.7B");
    const task = TASKS[data.index];
    const qNumber = data.index + 1;

    setLabProgress(data.index + (data.solved ? 1 : 0), TASKS.length, `Question ${qNumber} of ${TASKS.length}: ${phaseName(data.index)}.`);

    const body = $("#standardsLabBody");
    body.innerHTML = task.kind === "explore"
      ? exploreMarkup(task, data, qNumber)
      : task.kind === "scenario"
        ? scenarioMarkup(task, data, qNumber)
        : missingMarkup(task, data, qNumber);

    attachInputs(body, data);
    wireTurner(body, data);

    const selectBaseFace = face => {
      const id = face.dataset.saFace;
      if (!id) return;

      if (data.selectedFaces.includes(id)) {
        data.selectedFaces = data.selectedFaces.filter(item => item !== id);
        face.classList.remove("is-selected");
        return setLabFeedback("That face was unselected. Choose the two congruent, parallel faces you want to use as bases.");
      }

      data.selectedFaces.push(id);
      face.classList.add("is-selected");

      if (data.selectedFaces.length < 2) {
        return setLabFeedback("Base 1 selected. Keep turning the solid if needed, then double-click its congruent, parallel opposite face.");
      }

      const [first, second] = data.selectedFaces.slice(-2);
      if (!pairIsValid(task, first, second)) {
        data.selectedFaces = [];
        body.querySelectorAll("[data-sa-face]").forEach(node => node.classList.remove("is-selected"));
        return setLabFeedback("Those two faces are not an opposite congruent pair. Keep turning the solid and double-click a different pair.", "incorrect");
      }

      data.pair = pairKey(first);
      data.step = 1;
      data.turning = false;
      setLabFeedback("Yes. Those two faces can be the bases. Now ignore the full solid for a moment and study ONE base.", "correct");
      window.renderSurface87BLab(ctx);
      syncWhiteboardQuestion();
    };

    body.querySelectorAll("[data-sa-face]").forEach(face => {
      face.addEventListener("click", event => {
        const turner = body.querySelector(".sa87b-turner");
        if (turner?.dataset.moved === "yes") return;

        // When the model is still in turning mode, reserve a normal click for
        // rotating/positioning the solid. Double-click is the deliberate select action.
        if (data.turning) {
          return setLabFeedback("Turning is ON. Double-click the face to select it, or switch Turning OFF and single-click.");
        }

        event.preventDefault();
        selectBaseFace(face);
      });

      face.addEventListener("dblclick", event => {
        event.preventDefault();
        event.stopPropagation();
        selectBaseFace(face);
      });
    });

    body.querySelector("#checkBase87B")?.addEventListener("click", () => {
      const spec = surfaceValues(task, data.pair);
      if (!String(data.inputs.baseArea || "").trim() || !String(data.inputs.basePerimeter || "").trim()) {
        return setLabFeedback("Enter both B and P from the separate base before moving on.", "incorrect");
      }
      if (!near(data.inputs.baseArea, spec.B)) {
        return setLabFeedback("B is the AREA of one base. Recheck the two-dimensional base only; do not use the whole prism or cylinder.", "incorrect");
      }
      if (!near(data.inputs.basePerimeter, spec.P)) {
        return setLabFeedback(task.shape === "cylinder"
          ? "P is the circumference of the circular base. Recheck 2πr."
          : "P is the distance around one base. Add only the side lengths of the base.", "incorrect");
      }
      data.step = 2;
      setLabFeedback("Correct. B and P both came from the base. Now return to the full solid to identify h.", "correct");
      window.renderSurface87BLab(ctx);
    });

    body.querySelector("#checkDistance87B")?.addEventListener("click", () => {
      const spec = surfaceValues(task, data.pair);
      if (!near(data.inputs.distance, spec.h)) {
        return setLabFeedback("h is the distance from one selected base to the other selected base. Recheck the full solid—not the dimensions inside the base.", "incorrect");
      }
      data.step = 3;
      setLabFeedback("Correct. Now you have B, P, and h from the correct places. Build the formulas.", "correct");
      window.renderSurface87BLab(ctx);
    });

    body.querySelector("#checkExploreFinal87B")?.addEventListener("click", () => {
      checkExploreFinal(task, data, surfaceValues(task, data.pair), ctx);
    });

    body.querySelectorAll("[data-sa-need]").forEach(button => {
      button.addEventListener("click", () => {
        const choice = button.dataset.saNeed;
        if (choice !== task.need) {
          return setLabFeedback(task.need === "lateral"
            ? "The situation excludes the two bases, so it is asking for lateral surface area."
            : "The situation covers every outside face, including both bases, so it is asking for total surface area.", "incorrect");
        }
        data.need = choice;
        data.step = 1;
        setLabFeedback(choice === "lateral" ? "Correct: only the faces between the bases are included." : "Correct: every outside face is included.", "correct");
        window.renderSurface87BLab(ctx);
      });
    });

    body.querySelectorAll("[data-sa-formula]").forEach(button => {
      button.addEventListener("click", () => {
        const choice = button.dataset.saFormula;
        if (task.kind === "scenario") {
          if (choice !== task.need) {
            return setLabFeedback("That formula does not match what the situation is covering. Recheck whether the two bases are included.", "incorrect");
          }
          data.formula = choice;
          data.step = Math.max(data.step, 2);
          setLabFeedback(`Correct formula: ${FORMULAS[choice]}. Now use the net to locate the two bases.`, "correct");
          window.renderSurface87BLab(ctx);
        } else {
          if (choice !== "lateral") return setLabFeedback("The given information is lateral surface area, so start with L = Ph.", "incorrect");
          data.formula = "lateral";
          setLabFeedback("Correct. Use L = Ph and work backward for the missing measure.", "correct");
          window.renderSurface87BLab(ctx);
        }
      });
    });

    body.querySelectorAll("[data-sa-net-face]").forEach(face => {
      face.addEventListener("click", () => {
        const id = face.dataset.saNetFace;
        if (data.selectedFaces.includes(id)) {
          data.selectedFaces = data.selectedFaces.filter(item => item !== id);
          face.classList.remove("is-selected");
          return;
        }
        data.selectedFaces.push(id);
        face.classList.add("is-selected");
        if (data.selectedFaces.length < 2) return setLabFeedback("One base selected. Click the matching second base.");
        const selected = data.selectedFaces.slice(-2);
        const correct = task.netBases.every(id2 => selected.includes(id2));
        if (!correct) {
          data.selectedFaces = [];
          body.querySelectorAll("[data-sa-net-face]").forEach(node => node.classList.remove("is-selected"));
          return setLabFeedback("Those two pieces are not the base pair for this situation. Think about which faces are repeated and parallel.", "incorrect");
        }
        data.step = 3;
        setLabFeedback("Correct. Those are the two bases. Now pull P—and B when needed—from ONE of those bases.", "correct");
        window.renderSurface87BLab(ctx);
      });
    });

    body.querySelector("#checkScenarioBase87B")?.addEventListener("click", () => {
      const spec = surfaceValues(task, null);
      if (!near(data.inputs.basePerimeter, spec.P)) {
        return setLabFeedback(task.shape === "cylinder"
          ? "P is the circumference of one circular base. Recheck 2πr."
          : "P is the perimeter of one selected base. Add only the sides around that base.", "incorrect");
      }
      if (task.need === "total" && !near(data.inputs.baseArea, spec.B)) {
        return setLabFeedback("B is the area of ONE selected base. Recheck the separate base before using the total-surface-area formula.", "incorrect");
      }
      data.step = 4;
      setLabFeedback(task.need === "lateral"
        ? "Correct. Lateral surface area needs P and h; B is not used because the bases are excluded."
        : "Correct. Total surface area needs P, h, and B because both bases are included.", "correct");
      window.renderSurface87BLab(ctx);
    });

    body.querySelector("#checkScenarioFinal87B")?.addEventListener("click", () => {
      const spec = surfaceValues(task, null);
      if (!near(data.inputs.lP, spec.P) || !near(data.inputs.lh, spec.h)) {
        return setLabFeedback("Recheck the formula setup: P comes from one base, and h is the distance between the two bases.", "incorrect");
      }
      if (task.need === "total") {
        if (!near(data.inputs.tP, spec.P) || !near(data.inputs.th, spec.h) || !near(data.inputs.tB, spec.B)) {
          return setLabFeedback("Recheck S = Ph + 2B. P and B come from the base; h comes from the full solid.", "incorrect");
        }
        const status = hundredthStatus(data.inputs.total, spec.total);
        if (!status.ok) return feedbackHundredth(ctx, status, "Total surface area");
        return finishQuestion(data, ctx, `Correct. The situation needs total surface area: ${fmt(spec.total)} ${task.unit}².`);
      }
      const status = hundredthStatus(data.inputs.lateral, spec.lateral);
      if (!status.ok) return feedbackHundredth(ctx, status, "Lateral surface area");
      finishQuestion(data, ctx, `Correct. The situation needs lateral surface area: ${fmt(spec.lateral)} ${task.unit}².`);
    });

    body.querySelector("#checkMissing87B")?.addEventListener("click", () => {
      if (data.formula !== "lateral") return setLabFeedback("Choose L = Ph first. The problem gives lateral surface area.", "incorrect");

      if (task.missing === "diameter") {
        const expectedC = task.circumference;
        if (!near(data.inputs.intermediate, expectedC, 0.02)) {
          return setLabFeedback("First isolate P: P = L ÷ h. That result is the circumference of the circular base.", "incorrect");
        }
      }

      const status = hundredthStatus(data.inputs.missingAnswer, task.answer);
      if (!status.ok) return feedbackHundredth(ctx, status, task.missing === "height" ? "Height" : task.missing === "diameter" ? "Diameter" : "Circumference");

      finishQuestion(data, ctx, `Correct. The missing ${task.missing} is ${fmt(task.answer)} ${task.unit}.`);
    });

    body.querySelector("#next87B")?.addEventListener("click", () => {
      if (!data.solved) return;
      if (data.index >= TASKS.length - 1) return showLabCompletion("8.7B");
      Object.assign(data, freshQuestion(data.index + 1));
      window.renderSurface87BLab(ctx);
      setLabFeedback("Next question ready.");
      syncWhiteboardQuestion();
    });
  };
})();