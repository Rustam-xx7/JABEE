'use client';
// Put in src/hooks/frameEaser.js
//
// Eases the displayed frame toward the scroll-driven target, so the animation glides
// instead of snapping frame-to-frame. Works on every device (touch included), because it
// runs on GSAP's ticker and doesn't depend on how the page itself is being scrolled.
import gsap from 'gsap';

export function createFrameEaser({ ease = 0.18, onFrame }) {
  let target = 0;
  let current = 0;
  let last = -1;
  let running = false;

  const stop = () => {
    if (running) {
      gsap.ticker.remove(tick);
      running = false;
    }
  };

  function tick() {
    // frame-rate independent: behaves the same on 60 Hz and 120 Hz screens
    const ratio = Math.min(gsap.ticker.deltaRatio(), 3);
    current += (target - current) * (1 - Math.pow(1 - ease, ratio));
    if (Math.abs(target - current) < 0.02) current = target;

    const idx = Math.round(current);
    if (idx !== last) {
      last = idx;
      onFrame(idx);
    }
    if (current === target) stop(); // settled: stop spending CPU until the next scroll
  }

  return {
    setTarget(value) {
      target = value;
      if (!running) {
        gsap.ticker.add(tick);
        running = true;
      }
    },
    kill: stop,
  };
}
