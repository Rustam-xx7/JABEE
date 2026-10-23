'use client';
// Replaces src/components/LoadingScreen.jsx (same props: onComplete)

import React, { useEffect, useRef, useState } from 'react';
import { loadSequence, nearestLoaded } from '../hooks/useFrameSequence';

const LOGO = { folder: 'zubbyAnimation', count: 300 };

// What must be ready before the site is revealed. Keep this list SHORT:
// only what the user sees in the first screen or two. Bike frames are NOT here;
// they load in the background after the loader (see BikeScrollCanvas notes).
const CRITICAL = [LOGO, { folder: 'character1Animation', count: 150 }];

const MIN_TIME = 2500;   // never flash the loader away instantly on fast connections
const MAX_TIME = 10000;  // safety net: on a terrible connection, let the user in anyway
const EXIT_MS = 700;     // matches the expand/fade transition below

export default function LoadingScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete; // always latest, without re-running the effect

  const [progress, setProgress] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // ---- 1. Real progress: fraction of critical frames actually downloaded ----
    const total = CRITICAL.reduce((s, c) => s + c.count, 0);
    const loadedByFolder = {};
    let real = 0; // 0..1
    const entries = CRITICAL.map(({ folder, count }) => {
      loadedByFolder[folder] = 0;
      return loadSequence(folder, count, (fraction) => {
        loadedByFolder[folder] = fraction * count;
        real = Object.values(loadedByFolder).reduce((a, b) => a + b, 0) / total;
      });
    });
    const logoFrames = entries[0].frames;

    // ---- 2. Draw loop: eases the bar toward real progress, scrubs the logo with it ----
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const start = performance.now();
    let shown = 0;
    let lastPct = -1;
    let finished = false;
    let raf;
    let exitTimer;

    const draw = (img) => {
      if (!img) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cr = canvas.width / canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      let w, h, x, y;
      if (ir > cr) { w = canvas.width; h = w / ir; x = 0; y = (canvas.height - h) / 2; }
      else { h = canvas.height; w = h * ir; y = 0; x = (canvas.width - w) / 2; }
      ctx.drawImage(img, x, y, w, h);
    };

    const finish = () => {
      setIsHidden(true);
      document.body.style.overflow = '';
      onCompleteRef.current?.();
    };

    const tick = (now) => {
      const elapsed = now - start;

      shown += (real - shown) * 0.12;                 // smooth, never jumps
      if (real >= 1 && 1 - shown < 0.002) shown = 1;  // snap the last sliver
      const display = Math.min(shown, elapsed / MIN_TIME, 1); // honour MIN_TIME

      // logo animation is driven by progress, so it plays exactly as fast as loading
      const idx = Math.min(LOGO.count - 1, Math.floor(display * LOGO.count));
      draw(nearestLoaded(logoFrames, idx));

      const pct = Math.floor(display * 100);
      if (pct !== lastPct) { lastPct = pct; setProgress(pct); }

      if (!finished && (display >= 1 || elapsed > MAX_TIME)) {
        finished = true;
        setProgress(100);
        setIsExpanding(true);
        exitTimer = setTimeout(finish, EXIT_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, []); // runs once; onComplete is read through the ref

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black select-none ${
        isExpanding
          ? 'opacity-0 scale-[1.02] filter blur-sm pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        transition: `opacity ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), filter ${EXIT_MS}ms ease-out`,
        willChange: 'opacity, transform, filter',
      }}
    >
      <div className="relative w-full max-w-4xl aspect-video flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-auto object-contain max-h-[60vh] md:max-h-[68vh]"
        />
      </div>

      <div className="flex flex-col items-center gap-3.5 mt-2 z-10 w-full max-w-xs px-6">
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden p-0 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-orange-600 via-jabee-orange to-amber-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_#FF6B1A]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-xs font-semibold tracking-wider font-display">
          <span className="uppercase text-[10px] tracking-[0.2em] text-neutral-400 flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-jabee-orange animate-ping" />
            Initializing ZUBBY
          </span>
          <span className="text-white font-mono font-bold text-sm">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
