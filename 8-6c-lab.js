(function labModule() {
  const TASKS = [
    {
      t: [
        { o: "br", g: ["a", "9 cm²"], c: { b: 0, h: 1 } },
        { o: "bl", g: ["h", "13 cm"], c: { a: 2, b: 3 } },
        { o: "tr", g: ["a", "8 cm"], c: { b: 4, h: 5 } }
      ],
      b: ["16 cm²", "25 cm²", "5 cm", "12 cm", "15 cm", "289 cm²"]
    },
    {
      t: [
        { o: "tl", g: ["h", "625 ft²"], c: { a: 0, b: 1 } },
        { o: "br", g: ["a", "20 ft"], c: { b: 2, h: 3 } },
        { o: "bl", g: ["a", "36 ft²"], c: { b: 4, h: 5 } }
      ],
      b: ["7 ft", "576 ft²", "21 ft", "29 ft", "8 ft", "100 ft²"]
    },
    {
      t: [
        { o: "tr", g: ["h", "41 m"], c: { a: 0, b: 1 } },
        { o: "tl", g: ["a", "121 m²"], c: { b: 2, h: 3 } },
        { o: "br", g: ["a", "12 m"], c: { b: 4, h: 5 } }
      ],
      b: ["81 m²", "40 m", "60 m", "61 m", "35 m", "1369 m²"]
    },
    {
      t: [
        { o: "bl", g: ["b", "84 in"], c: { a: 0, h: 1 } },
        { o: "tr", g: ["h", "65 in"], c: { a: 2, b: 3 } },
        { o: "tl", g: ["b", "2025 in²"], c: { a: 4, h: 5 } }
      ],
      b: ["13 in", "7225 in²", "256 in²", "63 in", "28 in", "53 in"]
    },
    {
      t: [
        { o: "br", g: ["h", "4225 yd²"], c: { a: 0, b: 1 } },
        { o: "tl", g: ["a", "36 yd"], c: { b: 2, h: 3 } },
        { o: "tr", g: ["b", "55 yd"], c: { a: 4, h: 5 } }
      ],
      b: ["33 yd", "3136 yd²", "5929 yd²", "85 yd", "2304 yd²", "73 yd"]
    },
    {
      t: [
        { o: "tl", g: ["a", "65 cm"], c: { b: 0, h: 1 } },
        { o: "bl", g: ["h", "101 cm"], c: { a: 2, b: 3 } },
        { o: "br", g: ["h", "109 cm"], c: { a: 4, b: 5 } }
      ],
      b: ["5184 cm²", "97 cm", "400 cm²", "99 cm", "60 cm", "8281 cm²"]
    },
    {
      t: [
        { o: "tr", g: ["a", "39 m"], c: { b: 0, h: 1 } },
        { o: "br", g: ["b", "117 m"], c: { a: 2, h: 3 } },
        { o: "bl", g: ["h", "145 m"], c: { a: 4, b: 5 } }
      ],
      b: ["6400 m²", "89 m", "1936 m²", "125 m", "576 m²", "143 m"]
    }
  ];

  const SLOT_NAMES = ["a", "b", "h"];

  const ORIENTATIONS = {
    br: {
      points: { a: [96, 180], r: [224, 180], b: [224, 64] },
      marker: "M204 180 V160 H224",
      slots: {
        a: [128, 192],
        b: [238, 90],
        h: [108, 58]
      }
    },
    bl: {
      points: { a: [224, 180], r: [96, 180], b: [96, 64] },
      marker: "M116 180 V160 H96",
      slots: {
        a: [128, 192],
        b: [18, 90],
        h: [148, 58]
      }
    },
    tr: {
      points: { a: [96, 64], r: [224, 64], b: [224, 180] },
      marker: "M204 64 V84 H224",
      slots: {
        a: [128, 6],
        b: [238, 106],
        h: [108, 138]
      }
    },
    tl: {
      points: { a: [224, 64], r: [96, 64], b: [96, 180] },
      marker: "M116 64 V84 H96",
      slots: {
        a: [128, 6],
        b: [18, 106],
        h: [148, 138]
      }
    }
  };

  window.PYTHAGOREAN_86C_TOTAL = TASKS.length;

  window.renderPythagorean86CLab = function renderPythagorean86CLab(ctx) {
    const { labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion } = ctx;

    if (!labRuntime.data) {
      labRuntime.data = {
        index: 0,
        answers: {},
        selected: null,
        solved: false,
        correctTriangles: {}
      };
    }
    const data = labRuntime.data;
    if (!data.correctTriangles) data.correctTriangles = {};
    const task = TASKS[data.index];
    if (!task) return showLabCompletion("8.6C");

    const total = TASKS.length;
    setLabProgress(
      data.index + (data.solved ? 1 : 0),
      total,
      `Question ${data.index + 1} of ${total}: use the labels and the Pythagorean relationship, not the picture size.`
    );

    const keyFor = (triIndex, slot) => `${triIndex}-${slot}`;
    const missingKeys = () => task.t.flatMap((tri, triIndex) =>
      SLOT_NAMES.filter(slot => tri.g[0] !== slot).map(slot => keyFor(triIndex, slot))
    );

    const isTriangleLocked = triIndex => Boolean(data.correctTriangles[triIndex]);

    const expectedLabel = (tri, slot) => {
      if (tri.g[0] === slot) return tri.g[1];
      const bankIndex = tri.c[slot];
      return bankIndex === undefined ? "" : task.b[Number(bankIndex)];
    };

    const parseMeasurement = label => {
      const text = String(label || "").trim();
      const match = text.match(/([\d.]+)\s*([a-zA-Z]+)(²)?/);
      if (!match) {
        return {
          value: Number.parseFloat(text) || 0,
          unit: "units",
          squared: text.includes("²")
        };
      }
      return {
        value: Number(match[1]),
        unit: match[2],
        squared: Boolean(match[3])
      };
    };

    const prettyNumber = value => {
      const rounded = Math.round((Number(value) + Number.EPSILON) * 100) / 100;
      return Number.isInteger(rounded) ? String(rounded) : String(rounded);
    };

    const sideInfo = (tri, slot) => {
      const measurement = parseMeasurement(expectedLabel(tri, slot));
      const length = measurement.squared ? Math.sqrt(measurement.value) : measurement.value;
      const area = measurement.squared ? measurement.value : length * length;
      return {
        length,
        area,
        unit: measurement.unit
      };
    };

    const proofMarkup = (tri, triIndex) => {
      const a = sideInfo(tri, "a");
      const b = sideInfo(tri, "b");
      const h = sideInfo(tri, "h");
      const unit = a.unit !== "units" ? a.unit : (b.unit !== "units" ? b.unit : h.unit);
      const areaUnit = unit === "units" ? "square units" : `${unit}²`;
      const aLen = prettyNumber(a.length);
      const bLen = prettyNumber(b.length);
      const hLen = prettyNumber(h.length);
      const aArea = prettyNumber(a.area);
      const bArea = prettyNumber(b.area);
      const hArea = prettyNumber(h.area);

      return `<section class="pt86-proof" aria-label="Explanation for Triangle ${String.fromCharCode(65 + triIndex)}">
        <div class="pt86-proof-heading">Why Triangle ${String.fromCharCode(65 + triIndex)} works</div>
        <svg class="pt86-proof-svg" viewBox="0 0 420 300" role="img" aria-label="Right triangle with both leg lengths, hypotenuse length, and square areas">
          <line class="pt86-proof-triangle" x1="105" y1="210" x2="310" y2="210"></line>
          <line class="pt86-proof-triangle" x1="310" y1="210" x2="310" y2="72"></line>
          <line class="pt86-proof-triangle" x1="105" y1="210" x2="310" y2="72"></line>
          <path class="pt86-proof-right-angle" d="M290 210 V190 H310"></path>

          <!-- side-length labels -->
          <text class="pt86-proof-side-label" x="207" y="198" text-anchor="middle">${aLen} ${unit}</text>
          <text class="pt86-proof-side-label" x="364" y="98" text-anchor="middle">${bLen} ${unit}</text>
          <text class="pt86-proof-side-label" x="79" y="60" text-anchor="middle">${hLen} ${unit}</text>

          <!-- area under the base side length -->
          <rect class="pt86-proof-area-box" x="175" y="224" width="64" height="58" rx="8"></rect>
          <text class="pt86-proof-area-number" x="207" y="248" text-anchor="middle">${aArea}</text>
          <text class="pt86-proof-area-unit" x="207" y="267" text-anchor="middle">${areaUnit}</text>

          <!-- area under the vertical-leg side length -->
          <rect class="pt86-proof-area-box" x="326" y="110" width="76" height="58" rx="8"></rect>
          <text class="pt86-proof-area-number" x="364" y="134" text-anchor="middle">${bArea}</text>
          <text class="pt86-proof-area-unit" x="364" y="153" text-anchor="middle">${areaUnit}</text>

          <!-- area under the hypotenuse side length -->
          <rect class="pt86-proof-area-box is-hypotenuse" x="38" y="72" width="82" height="58" rx="8"></rect>
          <text class="pt86-proof-area-number" x="79" y="96" text-anchor="middle">${hArea}</text>
          <text class="pt86-proof-area-unit" x="79" y="115" text-anchor="middle">${areaUnit}</text>
        </svg>
        <p class="pt86-proof-sentence">
          The leg lengths are <strong>${aLen} ${unit}</strong> and <strong>${bLen} ${unit}</strong>. Their square areas are <strong>${aArea} ${areaUnit}</strong> and <strong>${bArea} ${areaUnit}</strong>, and together they equal <strong>${hArea} ${areaUnit}</strong>. Since √${hArea} = <strong>${hLen}</strong>, the hypotenuse is <strong>${hLen} ${unit}</strong>.
        </p>
      </section>`;
    };

    const slotMarkup = (tri, triIndex, slot, orientation) => {
      const [left, top] = orientation.slots[slot];
      const style = `left:${left}px;top:${top}px`;
      if (tri.g[0] === slot) {
        return `<div class="pt86-slot is-given" style="${style}"><span>${tri.g[1]}</span></div>`;
      }
      const key = keyFor(triIndex, slot);
      const bankIndex = data.answers[key];
      const label = bankIndex === undefined ? null : task.b[Number(bankIndex)];

      if (isTriangleLocked(triIndex)) {
        return `<div class="pt86-slot is-filled is-locked" style="${style}"><span>${label || expectedLabel(tri, slot)}</span></div>`;
      }

      return `<button type="button" class="pt86-slot${label ? " is-filled" : ""}" style="${style}" data-pt86-slot="${key}">
        <span>${label || "drop square"}</span>
      </button>`;
    };

    const triangleMarkup = (tri, triIndex) => {
      const orientation = ORIENTATIONS[tri.o] || ORIENTATIONS.br;
      const pa = orientation.points.a;
      const pr = orientation.points.r;
      const pb = orientation.points.b;
      const locked = isTriangleLocked(triIndex);

      return `<article class="pt86-triangle-card${locked ? " is-correct" : ""}">
        <div class="pt86-triangle-title">
          Triangle ${String.fromCharCode(65 + triIndex)}
          ${locked ? '<span class="pt86-correct-badge">Correct</span>' : ""}
        </div>
        <div class="pt86-stage">
          <svg class="pt86-triangle-svg" viewBox="0 0 320 270" aria-hidden="true">
            <line class="pt86-guide-line" x1="${pa[0]}" y1="${pa[1]}" x2="${pr[0]}" y2="${pr[1]}"></line>
            <line class="pt86-guide-line" x1="${pr[0]}" y1="${pr[1]}" x2="${pb[0]}" y2="${pb[1]}"></line>
            <line class="pt86-guide-line" x1="${pa[0]}" y1="${pa[1]}" x2="${pb[0]}" y2="${pb[1]}"></line>
            <path class="pt86-right-angle" d="${orientation.marker}"></path>
          </svg>
          ${slotMarkup(tri, triIndex, "a", orientation)}
          ${slotMarkup(tri, triIndex, "b", orientation)}
          ${slotMarkup(tri, triIndex, "h", orientation)}
        </div>
        ${locked ? proofMarkup(tri, triIndex) : ""}
      </article>`;
    };

    const used = new Set(Object.values(data.answers || {}).map(String));
    const lockedBankIndices = new Set();
    Object.entries(data.answers || {}).forEach(([key, bankIndex]) => {
      const triIndex = Number(String(key).split("-")[0]);
      if (isTriangleLocked(triIndex)) lockedBankIndices.add(String(bankIndex));
    });
    const bankMarkup = task.b.map((label, index) => {
      const isLockedBank = lockedBankIndices.has(String(index));
      return `<button
        type="button"
        draggable="${data.solved || isLockedBank ? "false" : "true"}"
        class="pt86-bank-item${String(data.selected) === String(index) ? " is-selected" : ""}${used.has(String(index)) ? " is-used" : ""}${isLockedBank ? " is-locked" : ""}"
        data-pt86-bank="${index}"
        aria-pressed="${String(data.selected) === String(index) ? "true" : "false"}"
        ${isLockedBank ? "disabled" : ""}>${label}</button>`;
    }).join("");

    const body = $("#standardsLabBody");
    body.innerHTML = `<style>
      .pt86-stage{
        position:relative;
        width:100%;
        max-width:320px;
        min-height:270px;
        aspect-ratio:320/270;
        margin:0 auto;
      }
      .pt86-slot{
        width:64px;
        height:64px;
        font-size:.82rem;
        box-shadow:0 2px 0 rgba(16,34,61,.08);
      }
      .pt86-slot.is-locked{
        cursor:default;
        border-style:solid;
        background:#dffafa;
        border-color:#008f92;
        box-shadow:2px 2px 0 #008f92;
      }
      .pt86-triangle-card.is-correct{
        border-color:#008f92;
        box-shadow:4px 4px 0 #008f92;
      }
      .pt86-triangle-title{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:.45rem;
        flex-wrap:wrap;
      }
      .pt86-correct-badge{
        display:inline-flex;
        align-items:center;
        min-height:26px;
        padding:.18rem .5rem;
        border-radius:999px;
        background:#dffafa;
        color:#075e58;
        border:1px solid #008f92;
        font-size:.72rem;
        letter-spacing:.03em;
      }
      .pt86-bank-item.is-locked{
        opacity:.58;
        cursor:default;
        transform:none!important;
        background:#eaf8f7;
        border-color:#008f92;
      }
      .pt86-proof{
        margin-top:.8rem;
        padding:.8rem;
        border:2px solid #008f92;
        border-radius:14px;
        background:#f4ffff;
      }
      .pt86-proof-heading{
        margin-bottom:.35rem;
        color:#075e58;
        font-weight:950;
        text-align:center;
      }
      .pt86-proof-svg{
        display:block;
        width:100%;
        max-width:420px;
        margin:0 auto;
      }
      .pt86-proof-triangle{
        stroke:#10223d;
        stroke-width:5;
        stroke-linecap:round;
      }
      .pt86-proof-right-angle{
        stroke:#008f92;
        stroke-width:4;
        fill:none;
      }
      .pt86-proof-side-label{
        fill:#10223d;
        font-size:16px;
        font-weight:900;
      }
      .pt86-proof-area-box{
        fill:#fff2b0;
        stroke:#10223d;
        stroke-width:2;
      }
      .pt86-proof-area-box.is-hypotenuse{
        fill:#dffafa;
        stroke:#008f92;
      }
      .pt86-proof-area-number{
        fill:#10223d;
        font-size:17px;
        font-weight:950;
      }
      .pt86-proof-area-unit{
        fill:#4b5b70;
        font-size:12px;
        font-weight:800;
      }
      .pt86-proof-sentence{
        max-width:34rem;
        margin:.35rem auto 0;
        color:#10223d;
        line-height:1.5;
      }
    </style>
    <section class="pt86-shell">
      <header class="pt86-header">
        <div>
          <p class="lab-mini-title">Question ${data.index + 1} of ${total}</p>
          <h4>Pythagorean Square Match</h4>
          <p>Each triangle already has one labeled square. Drag the 6 squares from the bank to the missing places so all 3 triangles are true right triangles.</p>
        </div>
        <span class="pt86-chip">${data.solved ? "Complete" : "8.6C"}</span>
      </header>

      <div class="pt86-coach-note">
        All three triangles in this question use the same unit. Some labels are side lengths and some are square areas, so decide what each number means before you place it.
      </div>

      <div class="pt86-triangle-grid">${task.t.map(triangleMarkup).join("")}</div>

      <section class="pt86-bank-panel">
        <h5>Square Bank</h5>
        <div class="pt86-bank-grid">${bankMarkup}</div>
      </section>

      <div class="pt86-actions">
        <button type="button" class="lab-action" id="checkPt86Task">${data.solved ? "Checked" : "Check"}</button>
        <button type="button" class="lab-action pt86-next" id="nextPt86Task"${data.solved ? "" : " hidden"}>${data.index === total - 1 ? "Finish lab" : "Next question"}</button>
      </div>
    </section>`;

    const rerender = message => {
      window.renderPythagorean86CLab(ctx);
      if (message) setLabFeedback(message);
    };

    const place = (slotKey, bankIndex) => {
      if (data.solved) return;

      const triIndex = Number(String(slotKey).split("-")[0]);
      if (isTriangleLocked(triIndex)) {
        return setLabFeedback("That triangle is already correct, so it is locked while you fix the others.", "correct");
      }

      if (lockedBankIndices.has(String(bankIndex))) {
        return setLabFeedback("That square belongs to a triangle you already solved.", "correct");
      }

      if (bankIndex === null || bankIndex === undefined || bankIndex === "") {
        if (data.answers[slotKey] !== undefined) {
          delete data.answers[slotKey];
          rerender("Square returned to the bank.");
        } else {
          setLabFeedback("Select a square from the bank first.", "incorrect");
        }
        return;
      }

      Object.keys(data.answers).forEach(key => {
        if (String(data.answers[key]) === String(bankIndex)) delete data.answers[key];
      });

      data.answers[slotKey] = String(bankIndex);
      data.selected = null;
      rerender("Placed. Continue until all 6 missing squares are filled.");
    };

    body.querySelectorAll("[data-pt86-bank]").forEach(button => {
      button.addEventListener("click", () => {
        if (data.solved) return;
        data.selected = button.dataset.pt86Bank;
        rerender("Square selected. Now click a missing square on a triangle.");
      });

      button.addEventListener("dragstart", event => {
        if (data.solved) return event.preventDefault();
        event.dataTransfer.setData("text/plain", button.dataset.pt86Bank);
        event.dataTransfer.effectAllowed = "move";
      });
    });

    body.querySelectorAll("[data-pt86-slot]").forEach(slot => {
      slot.addEventListener("click", () => place(slot.dataset.pt86Slot, data.selected));
      slot.addEventListener("dragover", event => {
        if (!data.solved) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }
      });
      slot.addEventListener("drop", event => {
        event.preventDefault();
        place(slot.dataset.pt86Slot, event.dataTransfer.getData("text/plain"));
      });
    });

    $("#checkPt86Task").addEventListener("click", () => {
      if (data.solved) return setLabFeedback("This question is complete. Choose Next question.", "correct");

      const keys = missingKeys();
      if (!keys.every(key => data.answers[key] !== undefined)) {
        return setLabFeedback("Fill all 6 missing squares before checking.", "incorrect");
      }

      const triangleCorrectness = task.t.map((tri, triIndex) =>
        Object.entries(tri.c).every(([slot, expectedBankIndex]) =>
          Number(data.answers[keyFor(triIndex, slot)]) === expectedBankIndex
        )
      );

      triangleCorrectness.forEach((isCorrect, triIndex) => {
        if (isCorrect) data.correctTriangles[triIndex] = true;
      });

      const allCorrect = triangleCorrectness.every(Boolean);
      const correctNames = triangleCorrectness
        .map((isCorrect, triIndex) => isCorrect ? String.fromCharCode(65 + triIndex) : null)
        .filter(Boolean);
      const remainingNames = triangleCorrectness
        .map((isCorrect, triIndex) => !isCorrect ? String.fromCharCode(65 + triIndex) : null)
        .filter(Boolean);

      if (!allCorrect) {
        window.renderPythagorean86CLab(ctx);

        if (correctNames.length) {
          const solvedWord = correctNames.length === 1 ? "Triangle" : "Triangles";
          const remainingWord = remainingNames.length === 1 ? "triangle" : "triangles";
          return setLabFeedback(
            `${solvedWord} ${correctNames.join(" and ")} ${correctNames.length === 1 ? "is" : "are"} correct. ${correctNames.length === 1 ? "It is" : "They are"} locked, and the diagram below ${correctNames.length === 1 ? "shows" : "show"} the side lengths and square areas. Keep working on ${remainingWord} ${remainingNames.join(" and ")}.`,
            "correct"
          );
        }

        return setLabFeedback(
          "None of the three triangles is correct yet. Recheck whether each label is a side length or a square area, then test the Pythagorean relationship.",
          "incorrect"
        );
      }

      data.solved = true;
      window.renderPythagorean86CLab(ctx);
      setLabFeedback(
        "All 3 triangles are correct. Each triangle now shows a standard right-triangle diagram with the two leg lengths, the hypotenuse length, all three square areas, and the Pythagorean explanation.",
        "correct"
      );
    });

    const next = $("#nextPt86Task");
    if (next) {
      next.addEventListener("click", () => {
        if (data.index >= TASKS.length - 1) return showLabCompletion("8.6C");

        data.index += 1;
        data.answers = {};
        data.selected = null;
        data.solved = false;
        data.correctTriangles = {};
        window.renderPythagorean86CLab(ctx);
        if (syncWhiteboardQuestion) syncWhiteboardQuestion();
        setLabFeedback("New question ready.");
      });
    }
  };
})();
