// Shared victory effect for the public games.
(() => {
  const colors = ['#ffda54', '#59e9ff', '#ff71c9', '#98ff9e', '#d2a5ff'];
  const duration = 5000;
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
        position: 'absolute', left: x + 'px', top: y + 'px', whiteSpace: 'nowrap',
        color, font: '900 ' + size + 'px/1 system-ui',
        textShadow: '0 2px 3px #160b31, 0 0 12px currentColor',
      });
      overlay.append(element);
      return element;
    }

    if (reduceMotion.matches || typeof overlay.animate !== 'function') {
      particle('★ π ★', originX, originY, colors[0], 48).style.transform = 'translate(-50%, -50%)';
    } else {
      const spread = Math.min(innerWidth * 0.22, 180);
      const radius = Math.min(innerWidth * 0.25, 148);
      const bursts = [
        [0, -30, 0],
        [-spread, 35, 620],
        [spread, -50, 1240],
        [0, 55, 1970],
        [-spread, -50, 2700],
        [spread, 30, 3450],
      ];

      bursts.forEach(([offsetX, offsetY, delay], index) => {
        const x = Math.max(36, Math.min(innerWidth - 36, originX + offsetX));
        const y = Math.max(72, Math.min(innerHeight - 72, originY + offsetY));

        for (let spark = 0; spark < 18; spark++) {
          const angle = spark * Math.PI / 9 + index * 0.17;
          const distance = radius * (0.54 + Math.random() * 0.46);
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;
          const color = colors[(spark + index) % colors.length];
          const isTrail = spark % 3 === 2;
          const symbol = isTrail ? '' : spark % 3 === 0 ? '★' : 'π';
          const element = particle(symbol, x, y, color, 33 + Math.random() * 18);
          if (isTrail) {
            Object.assign(element.style, {
              width: '36px', height: '5px', borderRadius: '999px',
              background: 'linear-gradient(90deg, transparent, currentColor 55%, #fff6da)',
              boxShadow: '0 0 12px ' + color,
            });
          }

          const rotation = isTrail ? angle * 180 / Math.PI : dx * 0.22;
          const transform = (x, y, scale) =>
            `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg) scale(${scale})`;
          element.animate([
            { opacity: 0, transform: transform(0, 0, 0.3) },
            { opacity: 1, transform: transform(dx * 0.25, dy * 0.25, 1.12), offset: 0.16 },
            { opacity: 1, transform: transform(dx, dy, 1), offset: 0.65 },
            { opacity: 0, transform: transform(dx * 1.2, dy + 38, 0.68) },
          ], { duration: 1550, delay, easing: 'cubic-bezier(.18,.67,.32,1)', fill: 'both' });
        }
      });
    }

    setTimeout(() => {
      overlay.remove();
      if (active === overlay) active = undefined;
    }, duration);
  });
})();
