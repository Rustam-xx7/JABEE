'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TOTAL_BIKE_FRAMES = 200;

export default function BikeScrollCanvas({ isLoading, triggerId = 'bike-reveal-container' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);

  useEffect(() => {
    // Preload all 200 frames of bikeAnimation
    const images = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_BIKE_FRAMES; i++) {
      const pad = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `/bikeAnimation/ezgif-frame-${pad}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_BIKE_FRAMES) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Render frame 1 immediately as soon as ready
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const firstImg = images[0];
      firstImg.onload = () => {
        setImagesLoaded(true);
        drawFrame(ctx, canvas, firstImg);
      };
      if (firstImg.complete && firstImg.naturalWidth > 0) {
        drawFrame(ctx, canvas, firstImg);
      }
    }
  }, []);

  const drawFrame = (ctx, canvas, img) => {
    if (!ctx || !canvas || !img || !img.complete || img.naturalWidth === 0) return;

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
  };

  useEffect(() => {
    if (isLoading) return;

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const targetElement = document.getElementById(triggerId) || containerRef.current || canvas;
    if (!canvas || !targetElement) return;

    const ctx = canvas.getContext('2d');
    const images = imagesRef.current;

    // Draw initial frame 0
    if (images[0] && images[0].complete) {
      drawFrame(ctx, canvas, images[0]);
    }

    const frameObj = { currentFrame: 0 };

    // Pin the entire section so top header and bottom cards stay fixed seamlessly without empty gaps
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
        if (frameObj.currentFrame !== frameIndex) {
          frameObj.currentFrame = frameIndex;
          const targetImg = images[frameIndex];
          if (targetImg) {
            drawFrame(ctx, canvas, targetImg);
          }
        }
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      trigger.kill();
      clearTimeout(refreshTimer);
    };
  }, [isLoading, triggerId]);

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
