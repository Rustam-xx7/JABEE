'use client';
// Put in src/hooks/useFrameSequence.js
import { useEffect, useRef, useState } from 'react';

// Module-level cache: every component asking for the same folder shares ONE set of
// Image objects (desktop + mobile instances, loader + scroll canvas, etc.).
const cache = new Map();

function loadOne(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return new Promise((resolve) => {
    img.onload = () =>
      img.decode ? img.decode().catch(() => {}).then(() => resolve(img)) : resolve(img);
    img.onerror = () => resolve(img); // never block on one bad frame
  });
}

// Starts loading a folder once. Any number of callers can subscribe to progress (0..1).
// Returns the cache entry: { frames, promise, listeners, loaded }.
export function loadSequence(folder, count, onProgress) {
  let entry = cache.get(folder);

  if (!entry) {
    entry = { frames: new Array(count).fill(null), loaded: 0, listeners: new Set(), promise: null };
    cache.set(folder, entry);
    const e = entry;
    const src = (i) => `/${folder}/frame-${String(i + 1).padStart(3, '0')}.webp`;
    const BATCH = 8; // a few at a time: fast, but doesn't flood the connection

    e.promise = (async () => {
      for (let s = 0; s < count; s += BATCH) {
        const idx = [];
        for (let i = s; i < Math.min(s + BATCH, count); i++) idx.push(i);
        await Promise.all(
          idx.map(async (i) => {
            e.frames[i] = await loadOne(src(i));
            e.loaded++;
            e.listeners.forEach((fn) => fn(e.loaded / count));
          })
        );
      }
      return e.frames;
    })();
  }

  if (onProgress) {
    entry.listeners.add(onProgress);
    onProgress(entry.loaded / count); // catch up immediately if already partly/fully loaded
  }
  return entry;
}

// For scroll canvases. Pass eager:false to delay loading (e.g. until the loader is done).
// trackProgress is off by default: it would re-render the component once per loaded frame.
export function useFrameSequence(folder, count, { eager = true, trackProgress = false } = {}) {
  const framesRef = useRef([]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!eager) return;
    let alive = true;
    const onP = trackProgress ? (v) => alive && setProgress(v) : null;
    const entry = loadSequence(folder, count, onP);
    framesRef.current = entry.frames;
    entry.promise.then(() => alive && setReady(true));
    return () => {
      alive = false;
      if (onP) entry.listeners.delete(onP);
    };
  }, [folder, count, eager, trackProgress]);

  return { framesRef, progress, ready };
}

// Closest frame that has actually loaded, so a late frame never draws a blank canvas.
export function nearestLoaded(frames, index) {
  for (let d = 0; d < frames.length; d++) {
    for (const i of [index - d, index + d]) {
      const f = frames[i];
      if (f && f.complete && f.naturalWidth > 0) return f;
    }
  }
  return null;
}
