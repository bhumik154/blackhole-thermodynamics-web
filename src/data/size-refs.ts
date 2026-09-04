// Direct port of app.py's SIZE_REFS list.

export interface SizeRef {
  name: string;
  km: number;
}

export const SIZE_REFS: SizeRef[] = [
  { name: "Proton", km: 1.7e-18 },
  { name: "Virus", km: 1e-7 },
  { name: "Everest", km: 8.849e-3 },
  { name: "Moon", km: 1737 },
  { name: "Earth", km: 6371 },
  { name: "Jupiter", km: 71492 },
  { name: "Sun", km: 696000 },
  { name: "Solar Sys.", km: 4.5e9 },
];
