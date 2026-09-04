// Direct transliterations of physics.py's 6 formulas. Operator grouping is
// kept identical to the Python source (not algebraically simplified) so a
// line-by-line diff against physics.py stays trivial for future review.
// See AGENTS.md: never adjust a constant or formula here for convenience.

import { G, C, HBAR, K_B } from "./constants";

export function schwarzschildRadius(massKg: number): number {
  return (2 * G * massKg) / C ** 2;
}

export function hawkingTemperature(massKg: number): number {
  return (HBAR * C ** 3) / (8 * Math.PI * G * massKg * K_B);
}

export function bekensteinHawkingEntropy(massKg: number): number {
  return (4 * Math.PI * G * massKg ** 2 * K_B) / (HBAR * C);
}

export function hawkingLuminosity(massKg: number): number {
  return (HBAR * C ** 6) / (15360 * Math.PI * G ** 2 * massKg ** 2);
}

export function evaporationTime(massKg: number): number {
  return (5120 * Math.PI * G ** 2 * massKg ** 3) / (HBAR * C ** 4);
}

export function surfaceGravity(massKg: number): number {
  return C ** 4 / (4 * G * massKg);
}
