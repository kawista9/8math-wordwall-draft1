// Shared victory effect for the public games.
(() => {
  const colors = ['#ffd45b', '#77e7ff', '#ff9dd3', '#a6ffb3', '#c9aaff'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active;

  document.addEventListener('math-wall-win', event => {
    active?.remove();
    const board = event.target.getBoundingClientRect();
    const originX = Math.max(32, Math.min(innerWidth - 32, board.left + board.width / 2));
    const originY = Math.max(64, Math.min(innerHeight - 64, board.top + board.height / 2));
    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.className = 'game-celebration';
    overlay.style.cssText = 'position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:1000';
    document.body.append(overlay);
    active = overlay;

    function particle(symbol, x, y, color, size) {
      const element = document.createElement('span');
      element.textContent = symbol;
      Object.assign(element.style, {
        position: 'absolute', left: x + 'px', top: y + 'px',
        color, font: '800 ' + size + 'px/1 system-ui', textShadow: '0 0 10px currentColor',
      });
      overlay.append(element);
      return element;
    }

    if (reduceMotion.matches || typeof overlay.animate !== 'function') {
      particle('✦ π ✦', originX, originY, colors[0], 32).style.transform = 'translate(-50%, -50%)';
    } else {
      const spread = Math.min(innerWidth * 0.26, 150);
      for (const [index, offset] of [-spread, spread, 0].entries()) {
        const x = originX + offset;
        const y = originY + (index === 2 ? 24 : -32);
        const delay = index * 170;
        for (let spark = 0; spark < 12; spark++) {
          const angle = spark * Math.PI / 6 + index * 0.15;
          const distance = 42 + Math.random() * 50;
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;
          const symbol = ['✦', 'π', '•', '✧'][spark % 4];
          const size = symbol === '•' ? 14 : 19 + Math.random() * 12;
          const element = particle(symbol, x, y, colors[(spark + index) % colors.length], size);
          element.animate([
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.35)' },
            { opacity: 1, offset: 0.16 },
            { opacity: 1, transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${dx}deg)`, offset: 0.62 },
            { opacity: 0, transform: `translate(calc(-50% + ${dx * 1.2}px), calc(-50% + ${dy + 34}px)) scale(0.65)` },
          ], { duration: 1030, delay, easing: 'cubic-bezier(.18,.67,.32,1)', fill: 'both' });
        }
      }
    }

    setTimeout(() => {
      overlay.remove();
      if (active === overlay) active = undefined;
    }, 1450);
  });
})();
