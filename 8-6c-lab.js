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
      slots: { a: [24, 144], b: [224, 64], h: [96, 24] }
    },
    bl: {
      points: { a: [224, 180], r: [96, 180], b: [96, 64] },
      marker: "M116 180 V160 H96",
      slots: { a: [224, 144], b: [24, 64], h: [152, 24] }
    },
    tr: {
      points: { a: [96, 64], r: [224, 64], b: [224, 180] },
      marker: "M204 64 V84 H224",
      slots: { a: [24, 28], b: [224, 128], h: [96, 144] }
    },
    tl: {
      points: { a: [224, 64], r: [96, 64], b: [96, 180] },
      marker: "M116 64 V84 H96",
      slots: { a: [224, 28], b: [24, 128], h: [152, 144] }
    }
  };

  window.PYTHAGOREAN_86C_TOTAL = TASKS.length;

  window.renderPythagorean86CLab = function renderPythagorean86CLab(ctx) {
    const { labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion } = ctx;

    if (!labRuntime.data) labRuntime.data = { index: 0, answers: {}, selected: null, solved: false };
    const data = labRuntime.data;
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

    const slotMarkup = (tri, triIndex, slot, orientation) => {
      const [left, top] = orientation.slots[slot];
      const style = `left:${left}px;top:${top}px`;
      if (tri.g[0] === slot) {
        return `<div class="pt86-slot is-given" style="${style}"><span>${tri.g[1]}</span></div>`;
      }
      const key = keyFor(triIndex, slot);
      const bankIndex = data.answers[key];
      const label = bankIndex === undefined ? null : task.b[Number(bankIndex)];
      return `<button type="button" class="pt86-slot${label ? " is-filled" : ""}" style="${style}" data-pt86-slot="${key}">
        <span>${label || "drop square"}</span>
      </button>`;
    };

    const triangleMarkup = (tri, triIndex) => {
      const orientation = ORIENTATIONS[tri.o] || ORIENTATIONS.br;
      const pa = orientation.points.a;
      const pr = orientation.points.r;
      const pb = orientation.points.b;
      const rects = SLOT_NAMES.map(slot => {
        const [x, y] = orientation.slots[slot];
        return `<rect class="pt86-outline-square" x="${x}" y="${y}" width="72" height="72"></rect>`;
      }).join("");

      return `<article class="pt86-triangle-card">
        <div class="pt86-triangle-title">Triangle ${String.fromCharCode(65 + triIndex)}</div>
        <div class="pt86-stage">
          <svg class="pt86-triangle-svg" viewBox="0 0 320 240" aria-hidden="true">
            ${rects}
            <line class="pt86-guide-line" x1="${pa[0]}" y1="${pa[1]}" x2="${pr[0]}" y2="${pr[1]}"></line>
            <line class="pt86-guide-line" x1="${pr[0]}" y1="${pr[1]}" x2="${pb[0]}" y2="${pb[1]}"></line>
            <line class="pt86-guide-line" x1="${pa[0]}" y1="${pa[1]}" x2="${pb[0]}" y2="${pb[1]}"></line>
            <path class="pt86-right-angle" d="${orientation.marker}"></path>
          </svg>
          ${slotMarkup(tri, triIndex, "a", orientation)}
          ${slotMarkup(tri, triIndex, "b", orientation)}
          ${slotMarkup(tri, triIndex, "h", orientation)}
        </div>
      </article>`;
    };

    const used = new Set(Object.values(data.answers || {}).map(String));
    const bankMarkup = task.b.map((label, index) => `<button
      type="button"
      draggable="${data.solved ? "false" : "true"}"
      class="pt86-bank-item${String(data.selected) === String(index) ? " is-selected" : ""}${used.has(String(index)) ? " is-used" : ""}"
      data-pt86-bank="${index}"
      aria-pressed="${String(data.selected) === String(index) ? "true" : "false"}">${label}</button>`).join("");

    const body = $("#standardsLabBody");
    body.innerHTML = `<section class="pt86-shell">
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

      let correct = true;
      task.t.forEach((tri, triIndex) => {
        Object.entries(tri.c).forEach(([slot, expectedBankIndex]) => {
          if (Number(data.answers[keyFor(triIndex, slot)]) !== expectedBankIndex) correct = false;
        });
      });

      if (!correct) {
        return setLabFeedback("At least one triangle is not a true right triangle yet. Recheck whether each label is a side length or a square area, then test the Pythagorean relationship.", "incorrect");
      }

      data.solved = true;
      window.renderPythagorean86CLab(ctx);
      setLabFeedback("Correct. All 3 triangles are true right triangles.", "correct");
    });

    const next = $("#nextPt86Task");
    if (next) {
      next.addEventListener("click", () => {
        if (data.index >= TASKS.length - 1) return showLabCompletion("8.6C");

        data.index += 1;
        data.answers = {};
        data.selected = null;
        data.solved = false;
        window.renderPythagorean86CLab(ctx);
        if (syncWhiteboardQuestion) syncWhiteboardQuestion();
        setLabFeedback("New question ready.");
      });
    }
  };
})();
