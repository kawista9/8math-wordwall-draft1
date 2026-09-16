(function labModule() {
  const TASKS = [
    {
      t: [
        { g: ["a", "9 cm²"], c: { b: 0, h: 1 } },
        { g: ["h", "13 m"], c: { a: 2, b: 3 } },
        { g: ["a", "8 yd"], c: { b: 4, h: 5 } }
      ],
      b: ["16 cm²", "25 cm²", "5 m", "12 m", "15 yd", "289 yd²"]
    },
    {
      t: [
        { g: ["h", "625 ft²"], c: { a: 0, b: 1 } },
        { g: ["a", "20 in"], c: { b: 2, h: 3 } },
        { g: ["a", "36 cm²"], c: { b: 4, h: 5 } }
      ],
      b: ["7 ft", "576 ft²", "21 in", "29 in", "8 cm", "100 cm²"]
    },
    {
      t: [
        { g: ["h", "41 m"], c: { a: 0, b: 1 } },
        { g: ["a", "121 yd²"], c: { b: 2, h: 3 } },
        { g: ["a", "12 km"], c: { b: 4, h: 5 } }
      ],
      b: ["81 m²", "40 m", "60 yd", "61 yd", "35 km", "1369 km²"]
    },
    {
      t: [
        { g: ["b", "84 ft"], c: { a: 0, h: 1 } },
        { g: ["h", "65 cm"], c: { a: 2, b: 3 } },
        { g: ["b", "2025 in²"], c: { a: 4, h: 5 } }
      ],
      b: ["13 ft", "7225 ft²", "256 cm²", "63 cm", "28 in", "53 in"]
    },
    {
      t: [
        { g: ["h", "4225 yd²"], c: { a: 0, b: 1 } },
        { g: ["a", "36 cm"], c: { b: 2, h: 3 } },
        { g: ["b", "55 m"], c: { a: 4, h: 5 } }
      ],
      b: ["33 yd", "3136 yd²", "5929 cm²", "85 cm", "2304 m²", "73 m"]
    },
    {
      t: [
        { g: ["a", "65 ft"], c: { b: 0, h: 1 } },
        { g: ["h", "101 in"], c: { a: 2, b: 3 } },
        { g: ["h", "109 cm"], c: { a: 4, b: 5 } }
      ],
      b: ["5184 ft²", "97 ft", "400 in²", "99 in", "60 cm", "8281 cm²"]
    },
    {
      t: [
        { g: ["a", "39 yd"], c: { b: 0, h: 1 } },
        { g: ["b", "117 m"], c: { a: 2, h: 3 } },
        { g: ["h", "145 ft"], c: { a: 4, b: 5 } }
      ],
      b: ["6400 yd²", "89 yd", "1936 m²", "125 m", "576 ft²", "143 ft"]
    }
  ];

  const SLOT_CLASS = { a: "pt86-slot-legA", b: "pt86-slot-legB", h: "pt86-slot-hyp" };
  const SLOT_NAMES = ["a", "b", "h"];

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

    const slotMarkup = (tri, triIndex, slot) => {
      if (tri.g[0] === slot) {
        return `<div class="pt86-slot ${SLOT_CLASS[slot]} is-given"><span>${tri.g[1]}</span></div>`;
      }
      const key = keyFor(triIndex, slot);
      const bankIndex = data.answers[key];
      const label = bankIndex === undefined ? null : task.b[Number(bankIndex)];
      return `<button type="button" class="pt86-slot ${SLOT_CLASS[slot]}${label ? " is-filled" : ""}" data-pt86-slot="${key}">
        <span>${label || "drop square"}</span>
      </button>`;
    };

    const triangleMarkup = (tri, triIndex) => `<article class="pt86-triangle-card">
      <div class="pt86-triangle-title">Triangle ${String.fromCharCode(65 + triIndex)}</div>
      <div class="pt86-stage">
        <svg class="pt86-triangle-svg" viewBox="0 0 320 240" aria-hidden="true">
          <rect class="pt86-outline-square" x="24" y="144" width="72" height="72"></rect>
          <rect class="pt86-outline-square" x="224" y="64" width="72" height="72"></rect>
          <rect class="pt86-outline-square" x="96" y="24" width="72" height="72"></rect>
          <line class="pt86-guide-line" x1="96" y1="180" x2="224" y2="180"></line>
          <line class="pt86-guide-line" x1="224" y1="180" x2="224" y2="64"></line>
          <line class="pt86-guide-line" x1="96" y1="180" x2="224" y2="64"></line>
          <path class="pt86-right-angle" d="M214 180 v-14 h-14"></path>
        </svg>
        ${slotMarkup(tri, triIndex, "a")}
        ${slotMarkup(tri, triIndex, "b")}
        ${slotMarkup(tri, triIndex, "h")}
      </div>
    </article>`;

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
        All diagrams are intentionally the same size. Do not use the picture size to decide. Use the numbers, the units, and the right-triangle relationship.
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
        return setLabFeedback("At least one triangle is not a true right triangle yet. Recheck whether each label is a side length or a square area.", "incorrect");
      }

      data.solved = true;
      window.renderPythagorean86CLab(ctx);
      setLabFeedback("Correct. All 3 triangles are true right triangles.", "correct");
    });

    const next = $("#nextPt86Task");
    if (next) next.addEventListener("click", () => {
      if (data.index >= TASKS.length - 1) return showLabCompletion("8.6C");
      data.index += 1;
      data.answers = {};
      data.selected = null;
      data.solved = false;
      window.renderPythagorean86CLab(ctx);
      if (syncWhiteboardQuestion) syncWhiteboardQuestion();
      setLabFeedback("New question ready.");
    });
  };
})();
