'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TOTAL_CHARACTER_FRAMES = 100;

export default function Character1ScrollCanvas({ isLoading, triggerId = 'story' }) {
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);

  useEffect(() => {
    // Preload all 100 frames of character1Animation
    const images = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_CHARACTER_FRAMES; i++) {
      const pad = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `/character1Animation/ezgif-frame-${pad}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_CHARACTER_FRAMES) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Render frame 1 immediately on initial load
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
    const targetElement = document.getElementById(triggerId) || canvas;
    if (!canvas || !targetElement) return;

    const ctx = canvas.getContext('2d');
    const images = imagesRef.current;

    // Draw initial frame 0
    if (images[0] && images[0].complete) {
      drawFrame(ctx, canvas, images[0]);
    }

    const frameObj = { currentFrame: 0 };

    // Pin the entire story section so text stays fixed while character animates
    const trigger = ScrollTrigger.create({
      trigger: targetElement,
      start: 'top top',
      end: '+=1200',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          TOTAL_CHARACTER_FRAMES - 1,
          Math.floor(self.progress * (TOTAL_CHARACTER_FRAMES - 1))
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
    <div className="w-full flex justify-center items-center py-2 relative z-10">
      <div className="relative max-h-[620px] w-full flex items-center justify-center">
        {/* Canvas for rendering 100 character animation frames with blend mode to seamlessly fit background */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="max-h-[580px] w-auto object-contain drop-shadow-xl mix-blend-multiply"
        />

        {/* Floating status badge next to character */}
        <div className="absolute bottom-6 right-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-soft border border-white/60 flex items-center gap-3 animate-float-1 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-jabee-orange" />
          <span className="text-xs font-semibold text-jabee-black">Scroll Down to commute</span>
        </div>
      </div>
    </div>
  );
}
