"use client";

import { useEffect, useRef, useState } from "react";

// A single fade+rise reveal per section, toggled by IntersectionObserver
// once on first mount - the same visibility-driven pattern HorizonVisual
// already uses for its offscreen pause, rather than introducing a second
// (framer-motion AnimatePresence) reveal mechanism into the codebase.
// Pair the returned ref/revealed state with the `data-reveal` /
// `data-revealed` CSS in globals.css.
export function useRevealOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
