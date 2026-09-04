// Direct port of physics.py's scaling_curves(). np.logspace(lo, hi, 120) is
// reimplemented as a plain loop (120 points, linearly spaced in the
// exponent from lo to hi inclusive) - no numpy dependency needed.

import { M_SUN } from "./constants";
import {
  schwarzschildRadius,
  hawkingTemperature,
  bekensteinHawkingEntropy,
  evaporationTime,
} from "./engine";

export interface ScalingCurves {
  massesSolar: number[];
  rsKm: number[];
  tempK: number[];
  entropyJK: number[];
  evapYr: number[];
}

const SECONDS_PER_YEAR = 3.154e7;
const POINTS = 120;

function logspace(lo: number, hi: number, n: number): number[] {
  if (n === 1) return [10 ** lo];
  const step = (hi - lo) / (n - 1);
  const out: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = 10 ** (lo + i * step);
  }
  return out;
}

export function scalingCurves(massSolar: number): ScalingCurves {
  const logC = Math.log10(Math.max(massSolar, 1e-20));
  const lo = Math.max(logC - 4, -20);
  const hi = Math.min(logC + 4, 12);
  const massesSolar = logspace(lo, hi, POINTS);
  const massesKg = massesSolar.map((m) => m * M_SUN);

  return {
    massesSolar,
    rsKm: massesKg.map((m) => schwarzschildRadius(m) / 1e3),
    tempK: massesKg.map((m) => hawkingTemperature(m)),
    entropyJK: massesKg.map((m) => bekensteinHawkingEntropy(m)),
    evapYr: massesKg.map((m) => evaporationTime(m) / SECONDS_PER_YEAR),
  };
}
