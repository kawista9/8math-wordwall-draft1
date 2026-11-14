// Memory Matrix is intentionally public and independent of login/billing.
(() => {
  const root = document.getElementById('memory-matrix-game');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const get = id => root.querySelector('#' + id);
  const board = get('mm-board'), tiles = [];
  const totalRounds = 5;
  let round = 1, score = 0, best = 0, selected = new Set(), targets = [], phase = 'ready', generation = 0;
  try { best = Math.max(0, Number(localStorage.getItem('memory-matrix-best') || 0) || 0); } catch {}
  for (let n = 0; n < 9; n++) {
    const tile = document.createElement('button');
    tile.type = 'button'; tile.className = 'mm-cell'; tile.setAttribute('aria-label', 'Square ' + (n + 1));
    tile.addEventListener('click', () => select(n)); board.appendChild(tile); tiles.push(tile);
  }
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  function status(title, hint) { get('mm-status').textContent = title; get('mm-hint').textContent = hint; }
  function refresh() {
    get('mm-score').textContent = score;
    get('mm-round').textContent = round + ' / ' + totalRounds;
    get('mm-best').textContent = best;
    get('mm-start').textContent = phase === 'ready' ? 'Start free game' : phase === 'between' ? 'Next round' : phase === 'done' ? 'Play again' : 'Memorizing…';
    get('mm-start').disabled = phase === 'show' || phase === 'pick';
    get('mm-progress').textContent = phase === 'ready' ? '2 squares to remember' : phase === 'done' ? 'Final score: ' + score + ' / 500' : selected.size + ' of ' + targets.length + ' squares found';
    tiles.forEach(tile => { tile.disabled = phase !== 'pick'; });
  }
  function clearTiles() { tiles.forEach(tile => { tile.className = 'mm-cell'; tile.setAttribute('aria-pressed','false'); }); }
  function restart() {
    generation++; round = 1; score = 0; selected = new Set(); targets = []; phase = 'ready';
    clearTiles(); status('Ready to train your brain?', 'Memorize the gold squares, then tap those same squares.'); refresh();
  }
  async function start() {
    if (phase === 'show' || phase === 'pick') return;
    if (phase === 'done') restart();
    const current = ++generation;
    phase = 'show'; selected = new Set(); targets = []; clearTiles();
    const needed = round + 1;
    while (targets.length < needed) {
      const candidate = Math.floor(Math.random() * 9);
      if (!targets.includes(candidate)) targets.push(candidate);
    }
    status('Memorize the glowing squares', 'Look closely. The pattern will disappear.');
    refresh(); await sleep(400);
    if (current !== generation) return;
    targets.forEach(n => tiles[n].classList.add('mm-lit'));
    await sleep(1800 + round * 300);
    if (current !== generation) return;
    clearTiles(); phase = 'pick'; status('Your turn!', 'Tap every square that was glowing.'); refresh();
  }
  function finishRound(success) {
    if (success) {
      score += 100; best = Math.max(best, score);
      try { localStorage.setItem('memory-matrix-best', String(best)); } catch {}
    } else {
      targets.forEach(n => { if (!selected.has(n)) tiles[n].classList.add('mm-lit'); });
    }
    if (round === totalRounds) {
      phase = 'done';
      status('Training complete!', 'You earned ' + score + ' out of 500 points. Play again to improve.');
    } else {
      round++;
      phase = 'between';
      status(success ? 'Perfect memory! +100 points' : 'Good effort — keep training!', success ? 'You found every square. Ready for a harder pattern?' : 'The gold squares show the pattern you missed. Try the next round.');
    }
    refresh();
  }
  function select(n) {
    if (phase !== 'pick' || selected.has(n)) return;
    if (!targets.includes(n)) {
      tiles[n].classList.add('mm-wrong'); tiles[n].setAttribute('aria-pressed','true'); finishRound(false); return;
    }
    selected.add(n); tiles[n].classList.add('mm-correct'); tiles[n].setAttribute('aria-pressed','true');
    if (selected.size === targets.length) finishRound(true);
    else refresh();
  }
  get('mm-start').addEventListener('click', start);
  get('mm-restart').addEventListener('click', restart);
  restart();
})();