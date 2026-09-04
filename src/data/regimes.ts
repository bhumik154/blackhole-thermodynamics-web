// Direct port of app.py's get_regime() / get_size_context(). Colors are
// the original app's exact hex values, kept as direct visual identifiers
// separate from the site's plasma/cyan data accents.

export type RegimeTag = "micro" | "sub" | "stellar" | "imbh" | "smbh";

export interface Regime {
  name: string;
  color: string;
  tag: RegimeTag;
}

export function getRegime(massSolar: number): Regime {
  if (massSolar < 1e-10) return { name: "Primordial / Micro", color: "#f472b6", tag: "micro" };
  if (massSolar < 3) return { name: "Sub-Stellar / Exotic", color: "#fb923c", tag: "sub" };
  if (massSolar < 100) return { name: "Stellar-Mass", color: "#38bdf8", tag: "stellar" };
  if (massSolar < 1e7) return { name: "Intermediate (IMBH)", color: "#a78bfa", tag: "imbh" };
  return { name: "Supermassive (SMBH)", color: "#facc15", tag: "smbh" };
}

export function getSizeContext(km: number): string {
  if (km < 1737) return "smaller than the Moon";
  if (km < 6371) return "between the Moon and Earth";
  if (km < 696000) return "between Earth and the Sun";
  if (km < 4.5e9) return "larger than the Sun";
  return "larger than the Solar System";
}
