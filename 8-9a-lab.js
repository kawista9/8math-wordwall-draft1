(() => {
  const QUESTIONS = [
    { title: "Read the intersection", lines: [[1, 1], [-1, 5]], point: [2, 3], prompt: "Which ordered pair is the solution to both graphed equations?", choices: ["(2, 3)", "(3, 2)", "(0, 1)", "(0, 5)"], correct: 0 },
    { title: "Find the y-coordinate", lines: [[2, -3], [-1, 3]], point: [2, 1], prompt: "What is the y-coordinate of the solution to the system?", choices: ["−3", "2", "1", "3"], correct: 2 },
    { title: "Intersection left of the y-axis", lines: [[-1, -1], [1, 3]], point: [-2, 1], prompt: "Which ordered pair satisfies both equations?", choices: ["(−2, −1)", "(−2, 1)", "(1, −2)", "(0, 3)"], correct: 1 },
    { title: "Solution on the x-axis", lines: [[0.5, 2], [-0.5, -2]], point: [-4, 0], prompt: "What is the x-coordinate of the solution to both equations?", choices: ["0", "−2", "4", "−4"], correct: 3 },
    { title: "Solution on the y-axis", lines: [[2, 1], [-1, 1]], point: [0, 1], prompt: "Which ordered pair is the solution of the system?", choices: ["(1, 0)", "(0, 1)", "(0, −1)", "(1, 1)"], correct: 1 },
    { title: "Verify both equations", lines: [[-2, 4], [1, -2]], point: [2, 0], prompt: "Which point lies on both graphed lines?", choices: ["(0, 4)", "(0, −2)", "(2, 0)", "(−2, 0)"], correct: 2 },
    { title: "Check a point in quadrant IV", lines: [[1, -5], [-1, 1]], point: [3, -2], prompt: "Which ordered pair simultaneously satisfies the two equations?", choices: ["(3, −2)", "(−2, 3)", "(3, 2)", "(0, 1)"], correct: 0 }
  ];
  const minus = value => String(value).replace(/-/g, "−");
  const equation = ([m, b]) => {
    const slope = m === 1 ? "x" : m === -1 ? "−x" : `${minus(m)}x`;
    return `y = ${slope}${b === 0 ? "" : b < 0 ? ` − ${-b}` : ` + ${b}`}`;
  };
  const graph = task => {
    const size = 360, origin = 180, step = 22;
    const px = x => origin + x * step, py = y => origin - y * step;
    const grid = Array.from({length: 15}, (_, i) => {
      const n = i - 7, c = px(n);
      return `<path d="M${c} 26V334 M26 ${c}H334" stroke="${n === 0 ? '#405674' : '#dce5f2'}" stroke-width="${n === 0 ? 2 : 1}"/>`;
    }).join("");
    const labels = [-6, -4, -2, 2, 4, 6].map(n => `<text x="${px(n)}" y="195" text-anchor="middle">${minus(n)}</text><text x="173" y="${py(n) + 4}" text-anchor="end">${minus(n)}</text>`).join("");
    const lines = task.lines.map(([m, b], i) => {
      const left = Math.max(-7, Math.min((-7 - b) / m, (7 - b) / m));
      const right = Math.min(7, Math.max((-7 - b) / m, (7 - b) / m));
      return `<line x1="${px(left)}" y1="${py(m * left + b)}" x2="${px(right)}" y2="${py(m * right + b)}" stroke="${i ? '#df6b2d' : '#245ac5'}" stroke-width="3.5" stroke-linecap="round"/>`;
    }).join("");
    return `<svg class="n89-graph" viewBox="0 0 ${size} ${size}" role="img" aria-label="Coordinate grid with the lines ${equation(task.lines[0])} and ${equation(task.lines[1])} crossing at one point"><rect x="26" y="26" width="308" height="308" fill="white" stroke="#b6c5dc"/>${grid}${lines}${labels}<text x="339" y="174">x</text><text x="188" y="21">y</text><text x="171" y="195">0</text></svg>`;
  };
  function reset(data, index) { Object.assign(data, {index, selected: null, answered: false}); }
  window.INTERSECTION_89A_TOTAL = QUESTIONS.length;
  window.reset89AQuestion = reset;
  window.render89ALab = ({labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion}) => {
    const data = labRuntime.data || (labRuntime.data = {index: 0, selected: null, answered: false});
    const task = QUESTIONS[data.index];
    setLabProgress(data.index + (data.answered ? 1 : 0), QUESTIONS.length, "Choose one answer, then check it.");
    $("#standardsLabBody").innerHTML = `<section class="n89-lab"><header><p class="n89-kicker">8.9A · QUESTION ${data.index + 1} OF ${QUESTIONS.length}</p><h4>${task.title}</h4></header><div class="n89-layout"><article class="n89-card"><h5>Two graphed equations</h5><div class="n89-legend"><span>${equation(task.lines[0])}</span><span>${equation(task.lines[1])}</span></div>${graph(task)}</article><article class="n89-card"><h5>${task.prompt}</h5><div class="n89-options">${task.choices.map((choice, i) => `<button type="button" class="n89-option${data.selected === i ? ' selected' : ''}${data.answered && i === task.correct ? ' correct' : ''}" data-option="${i}" ${data.answered ? 'disabled' : ''}><b>${String.fromCharCode(65+i)}</b><span>${choice}</span></button>`).join('')}</div>${data.answered ? `<div class="n89-reason"><strong>Check both equations</strong><p>At (${minus(task.point[0])}, ${minus(task.point[1])}), ${equation(task.lines[0])} gives ${minus(task.lines[0][0] * task.point[0] + task.lines[0][1])}, and ${equation(task.lines[1])} gives ${minus(task.lines[1][0] * task.point[0] + task.lines[1][1])}. Both match the y-coordinate. The lines meet at this point.</p></div>` : ''}<div class="n89-actions"><button type="button" class="lab-action" id="n89Check" ${data.selected === null || data.answered ? 'disabled' : ''}>Check answer</button><button type="button" class="lab-next" id="n89Next" ${data.answered ? '' : 'hidden'}>${data.index === QUESTIONS.length - 1 ? 'Finish lab' : 'Next question →'}</button></div></article></div></section>`;
    $("#standardsLabBody").querySelectorAll("[data-option]").forEach(button => button.addEventListener("click", () => {data.selected = Number(button.dataset.option); window.render89ALab({labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion});}));
    $("#n89Check").addEventListener("click", () => {
      if (data.selected === null || data.answered) return;
      if (data.selected !== task.correct) { setLabFeedback("That point or coordinate does not match the intersection. Read x horizontally and y vertically, then check both lines.", "incorrect"); return; }
      data.answered = true;
      window.render89ALab({labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion});
      setLabFeedback(`Correct. The intersection is (${minus(task.point[0])}, ${minus(task.point[1])}).`, "correct");
    });
    $("#n89Next").addEventListener("click", () => {
      if (!data.answered) return;
      if (data.index === QUESTIONS.length - 1) return showLabCompletion("8.9A");
      reset(data, data.index + 1);
      window.render89ALab({labRuntime, $, setLabProgress, setLabFeedback, showLabCompletion, syncWhiteboardQuestion});
      setLabFeedback(""); syncWhiteboardQuestion();
    });
  };
})();
