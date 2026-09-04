// Direct port of physics.py's get_all_properties().

import { M_SUN } from "./constants";
import {
  schwarzschildRadius,
  hawkingTemperature,
  bekensteinHawkingEntropy,
  hawkingLuminosity,
  evaporationTime,
  surfaceGravity,
} from "./engine";

export interface BlackHoleProperties {
  massSolar: number;
  massKg: number;
  rsM: number;
  rsKm: number;
  tempK: number;
  entropyJK: number;
  lumW: number;
  surfGrav: number;
  evapS: number;
  evapYr: number;
}

// 3.154e7, same as physics.py's seconds-per-year constant used inline in
// get_all_properties (not factored into constants.ts there either).
const SECONDS_PER_YEAR = 3.154e7;

export function getAllProperties(massSolar: number): BlackHoleProperties {
  const massKg = massSolar * M_SUN;
  const rs = schwarzschildRadius(massKg);
  const evapS = evaporationTime(massKg);

  return {
    massSolar,
    massKg,
    rsM: rs,
    rsKm: rs / 1e3,
    tempK: hawkingTemperature(massKg),
    entropyJK: bekensteinHawkingEntropy(massKg),
    lumW: hawkingLuminosity(massKg),
    surfGrav: surfaceGravity(massKg),
    evapS,
    evapYr: evapS / SECONDS_PER_YEAR,
  };
}
