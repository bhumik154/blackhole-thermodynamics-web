// Direct port of app.py's PRESETS dict. Array (not object) since insertion
// order drives the dropdown and enables .find() for the Compare tab's
// reverse preset-name lookup.

export interface Preset {
  label: string;
  massSolar: number | null; // null = "Custom"
}

export const PRESETS: Preset[] = [
  { label: "Custom", massSolar: null },
  { label: "Primordial Micro (1e-18 M☉)", massSolar: 1e-18 },
  { label: "Stellar (10 M☉)", massSolar: 10 },
  { label: "Cygnus X-1 (21 M☉)", massSolar: 21 },
  { label: "GW150914 (62 M☉)", massSolar: 62 },
  { label: "Sagittarius A* (4M M☉)", massSolar: 4e6 },
  { label: "M87* (6.5B M☉)", massSolar: 6.5e9 },
];
