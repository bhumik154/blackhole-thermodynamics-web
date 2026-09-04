import { cubicBezier } from "framer-motion";

// The one shared deceleration curve used across framer-motion transitions,
// GSAP tweens (which accept a raw (t: number) => number function for `ease`
// with no plugin required), and plain CSS transitions (the matching
// --ease-standard token in globals.css) - so motion feels like one system,
// not several accidentally-different ones.
export const STANDARD_EASE_BEZIER = [0.25, 0.1, 0.25, 1] as const;
export const standardEase = cubicBezier(...STANDARD_EASE_BEZIER);

// Linear, non-decelerating loop - a deliberate second category, not scope
// creep back into "multiple inconsistent easings". Continuous idle motion
// (the horizon visual's accretion-disk rotation) needs a constant angular
// speed, not a deceleration curve, or it would visibly speed up and slow
// down every loop instead of spinning steadily.
export const linearEase = (t: number) => t;

// Duration ladder (seconds), for GSAP/framer-motion call sites.
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  moderate: 0.5,
  slow: 0.8,
} as const;
