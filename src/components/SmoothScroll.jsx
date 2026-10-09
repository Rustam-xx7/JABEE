'use client';
// Replaces src/components/SmoothScroll.jsx

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ---- Tuning knobs (lower number = floatier/smoother, higher = snappier) ----
// lerp          -> mouse wheel / trackpad
// syncTouchLerp -> phone/tablet glide AFTER you lift your finger (while dragging it follows 1:1)
const NORMAL = { lerp: 0.12, syncTouchLerp: 0.16 };   // ordinary sections: light smoothing
const ANIMATION = { lerp: 0.07, syncTouchLerp: 0.06 }; // pinned frame-animation sections: extra smooth
const SMOOTH_TOUCH = true; // set false to give phones/tablets native scrolling again

export default function SmoothScroll({ isLoading }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Stops ScrollTrigger from re-measuring every time the mobile address bar slides in/out.
    // That re-measuring is a classic cause of jitter in pinned sections on phones.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      ...NORMAL,
      syncTouch: SMOOTH_TOUCH,
      anchors: { offset: -70 }, // -70 = fixed navbar height
    });
    lenisRef.current = lenis;

    // Switch smoothness depending on whether a (visible) pinned animation is currently active.
    // Lenis reads these options live on every input, so changing them takes effect instantly.
    let inAnimation = false;
    const updateZone = () => {
      const now = ScrollTrigger.getAll().some(
        (st) => st.pin && st.isActive && st.trigger && st.trigger.getClientRects().length > 0
      );
      if (now !== inAnimation) {
        inAnimation = now;
        Object.assign(lenis.options, now ? ANIMATION : NORMAL);
      }
    };

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      updateZone();
    });

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isLoading) lenis.stop();
    else lenis.start();
  }, [isLoading]);

  return null;
}
