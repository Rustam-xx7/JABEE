'use client';
// Replaces src/components/BikeScrollCanvas.jsx

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFrameSequence, nearestLoaded } from '../hooks/useFrameSequence';

const FOLDER = 'bikeAnimation';
const TOTAL_BIKE_FRAMES = 200;

// "contain" fit, same as before; now a plain function outside the component
function drawFrame(ctx, canvas, img) {
  if (!ctx || !canvas || !img || img.naturalWidth === 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

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
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

export default function BikeScrollCanvas({ isLoading, triggerId = 'bike-reveal-container' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const currentFrameRef = useRef(0);
  const redrawRef = useRef(null);

  // Bike frames are NOT needed for the first screen, so they start downloading only once
  // the loader has finished (eager: !isLoading) and load in the background.
  const { framesRef, ready } = useFrameSequence(FOLDER, TOTAL_BIKE_FRAMES, { eager: !isLoading });

  // --- ScrollTrigger: created once the loader is gone ---
  useEffect(() => {
    if (isLoading) return;

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const targetElement = document.getElementById(triggerId) || containerRef.current || canvas;
    if (!canvas || !targetElement) return;

    const ctx = canvas.getContext('2d');

    // Draw the closest frame that has actually loaded, never a blank canvas.
    const draw = (index) => {
      currentFrameRef.current = index;
      drawFrame(ctx, canvas, nearestLoaded(framesRef.current, index));
    };
    redrawRef.current = () => draw(currentFrameRef.current);

    draw(0);

    const trigger = ScrollTrigger.create({
      trigger: targetElement,
      start: 'top top',
      end: '+=1300',
      pin: true,
      pinSpacing: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          TOTAL_BIKE_FRAMES - 1,
          Math.floor(self.progress * (TOTAL_BIKE_FRAMES - 1))
        );
        if (frameIndex !== currentFrameRef.current) draw(frameIndex);
      },
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      trigger.kill();
      clearTimeout(refreshTimer);
      redrawRef.current = null;
    };
  }, [isLoading, triggerId, framesRef]);

  // --- When every frame has arrived: repaint the current frame at full accuracy ---
  useEffect(() => {
    if (!ready) return;
    redrawRef.current?.();
    ScrollTrigger.refresh();
  }, [ready]);

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center py-1 sm:py-2 relative z-10">
      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
        {/* Canvas for rendering 200 bike animation frames */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-auto max-h-[650px] object-contain rounded-2xl drop-shadow-2xl scale-[1.04] sm:scale-100 origin-center transition-transform"
        />

        {/* Dynamic progress badge */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-neutral-200/80 flex items-center gap-2 z-20">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-jabee-orange animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold text-jabee-black tracking-wide">
            JABEE Fleet Transformation
          </span>
        </div>
      </div>
    </div>
  );
}
