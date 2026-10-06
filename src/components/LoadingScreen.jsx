'use client';

import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 150;
const ANIMATION_DURATION = 5200; // 4.2 seconds for frame playback
const TOTAL_LOADER_TIME = 5400;  // 5.0 seconds total before unmount

export default function LoadingScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const framesRef = useRef([]);

  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = 'hidden';

    // Array to store preloaded Image objects
    const loadedImages = [];
    for (let i = 3; i <= TOTAL_FRAMES; i++) {
      const pad = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `/logoAnimation/ezgif-frame-${pad}.png`;
      loadedImages.push(img);
    }
    framesRef.current = loadedImages;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startTime = performance.now();
    let animationFrameId;
    let lastDrawnFrame = -1;

    const render = (now) => {
      const elapsed = now - startTime;

      // Normalize time from 0 to 1 over ANIMATION_DURATION
      const normTime = Math.min(1, elapsed / ANIMATION_DURATION);
      const currentProgress = Math.floor(normTime * 100);
      setProgress(currentProgress);

      // Determine frame index (0 to 149)
      const targetFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(normTime * TOTAL_FRAMES));

      // Find the best available frame (target or nearest preloaded frame)
      let activeImg = loadedImages[targetFrameIndex];
      if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) {
        // Fallback to latest available preloaded frame
        for (let idx = targetFrameIndex; idx >= 0; idx--) {
          if (loadedImages[idx] && loadedImages[idx].complete && loadedImages[idx].naturalWidth > 0) {
            activeImg = loadedImages[idx];
            break;
          }
        }
      }

      // Draw onto canvas if we have a valid image frame
      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = activeImg.naturalWidth / activeImg.naturalHeight;

        let drawW, drawH, drawX, drawY;
        if (imgRatio > canvasRatio) {
          drawW = canvas.width;
          drawH = canvas.width / imgRatio;
          drawX = 0;
          drawY = (canvas.height - drawH) / 2;
        } else {
          drawH = canvas.height;
          drawW = canvas.height * imgRatio;
          drawX = (canvas.width - drawW) / 2;
          drawY = 0;
        }

        ctx.drawImage(activeImg, drawX, drawY, drawW, drawH);
      }

      // Stage 1: At 4.2s, trigger expand-disappear animation
      if (elapsed >= ANIMATION_DURATION && !isExpanding) {
        setIsExpanding(true);
      }

      // Stage 2: At 5.0s, finish loading screen
      if (elapsed < TOTAL_LOADER_TIME) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        setIsHidden(true);
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    // Safety timers
    const expandTimer = setTimeout(() => {
      setIsExpanding(true);
    }, ANIMATION_DURATION);

    const completeTimer = setTimeout(() => {
      setIsHidden(true);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, TOTAL_LOADER_TIME);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(expandTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F6F5F2] select-none ${
        isExpanding
          ? 'scale-150 opacity-0 filter blur-lg pointer-events-none'
          : 'scale-100 opacity-100'
      }`}
      style={{
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out, filter 0.8s ease-out',
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* Soft background ambient glow */}
      <div className="absolute w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Frame Canvas with default poster fallback */}
      <div className="relative w-full max-w-2xl aspect-video flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-auto object-contain max-h-[60vh] drop-shadow-lg rounded-2xl"
        />
      </div>

      {/* Sleek Loader Bar & Details */}
      <div className="flex flex-col items-center gap-3 mt-4 z-10 w-full max-w-xs px-6">
        <div className="w-full h-2 bg-neutral-200/80 rounded-full overflow-hidden p-0.5 border border-neutral-300/50 shadow-inner">
          <div
            className="h-full bg-jabee-orange rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_#FF6B1A]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs font-semibold text-neutral-600 tracking-wider font-display">
          <span className="uppercase text-[10px] tracking-[0.2em] text-jabee-black flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-jabee-orange animate-ping" />
            Initializing JABEE
          </span>
          <span className="text-jabee-orange font-extrabold text-sm">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
