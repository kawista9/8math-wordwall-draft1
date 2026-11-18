(() => {
  const challenge = document.querySelector('#real-number-challenge');
  const form = challenge.querySelector('form');
  const prompt = challenge.querySelector('legend');
  const choices = challenge.querySelector('.rn-choices');
  const slide = challenge.querySelector('img');
  const feedback = challenge.querySelector('[role="status"]');
  const check = form.querySelector('button');
  const next = challenge.querySelector('.rn-next');

  // Each problem lists its values in ascending order.
  const problems = [
    {
      question: 'Which list puts π, 3.2, √10, and 25/8 in order from least to greatest?',
      values: ['25/8', 'π', '√10', '3.2'],
      reason: '25/8 = 3.125, π ≈ 3.142, and √10 ≈ 3.162.'
    },
    {
      question: 'Four divers are at −4, −√18, −4.1, and −17/4 meters relative to sea level. Which list orders their positions from least to greatest?',
      values: ['−17/4', '−√18', '−4.1', '−4'],
      reason: '−17/4 = −4.25 and −√18 ≈ −4.243. Both are less than −4.1 and −4.'
    },
    {
      question: 'Four relay teams completed 82%, 0.805, 4/5, and √0.66 of their races. Which list orders these portions from least to greatest?',
      values: ['4/5', '0.805', '√0.66', '82%'],
      reason: '4/5 = 0.8, √0.66 ≈ 0.812, and 82% = 0.82.'
    },
    {
      question: 'Which list puts −0.45, −2/5, −√0.2, and −43% in order from least to greatest?',
      values: ['−0.45', '−√0.2', '−43%', '−2/5'],
      reason: '−√0.2 ≈ −0.447, −43% = −0.43, and −2/5 = −0.4.'
    },
    {
      question: 'Four ribbons measure 5.1, √26, 101/20, and 5.09 centimeters. Which list orders their lengths from least to greatest?',
      values: ['101/20', '5.09', '√26', '5.1'],
      reason: '101 ÷ 20 = 5.05 and √26 ≈ 5.099.'
    }
  ];

  const correctOrder = [0, 1, 2, 3];
  const distractors = [[1, 0, 2, 3], [0, 2, 1, 3], [3, 2, 1, 0]];
  let index = 0;
  let solved = false;

  function showProblem() {
    const problem = problems[index];
    solved = false;
    check.disabled = false;
    slide.hidden = index !== 0;
    prompt.textContent = problem.question;
    feedback.textContent = '';
    const orders = [...distractors];
    orders.splice((index + 1) % 4, 0, correctOrder);
    choices.replaceChildren(...orders.map(order => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'real-number-order';
      input.value = order.join(',');
      label.append(input, order.map(position => problem.values[position]).join('  <  '));
      return label;
    }));
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (solved) return;
    const selected = form.querySelector('input:checked');
    if (!selected) {
      feedback.textContent = 'Choose an answer first.';
      return;
    }
    if (selected.value !== correctOrder.join(',')) {
      feedback.textContent = 'Try again. Rewrite the numbers as decimals or estimate where they fall on a number line.';
      return;
    }
    solved = true;
    check.disabled = true;
    for (const input of choices.querySelectorAll('input')) input.disabled = true;
    feedback.textContent = 'Correct! ' + problems[index].reason;
    challenge.dispatchEvent(new CustomEvent('math-wall-win', {
      bubbles: true,
      detail: { smiles: true }
    }));
  });

  next.addEventListener('click', () => {
    index = (index + 1) % problems.length;
    showProblem();
    prompt.focus();
  });

  showProblem();
})();
