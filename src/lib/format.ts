// Direct port of app.py's fmt_time / fmt_sci / fmt_big formatters.
//
// Python's f-string ".Nf"/".Ng" rounding is round-half-to-even; JS's
// Number.toFixed is round-half-away-from-zero. They only disagree on exact
// decimal ties (e.g. 182.625 -> "182.62" in Python, "182.63" via a naive
// JS toFixed), which is rare for continuous physics quantities but worth
// matching exactly for a faithful port - pyToFixed below implements the
// same round-half-to-even behavior Python uses.

export function pyToFixed(value: number, decimals: number): string {
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  let rounded: number;
  if (diff < 0.5) rounded = floor;
  else if (diff > 0.5) rounded = floor + 1;
  else rounded = floor % 2 === 0 ? floor : floor + 1;
  return (rounded / factor).toFixed(decimals);
}

// Python's "%.Ne" always pads the exponent to at least 2 digits with an
// explicit sign (e.g. "5.00e+05", not JS toExponential's "5.00e+5").
export function pyExponential(value: number, decimals: number): string {
  const [mantissa, expPart] = value.toExponential(decimals).split("e");
  const expNum = Number(expPart);
  const sign = expNum >= 0 ? "+" : "-";
  const expDigits = String(Math.abs(expNum)).padStart(2, "0");
  return `${mantissa}e${sign}${expDigits}`;
}

export function fmtTime(yr: number): string {
  if (yr < 1 / 365.25) return `${pyToFixed(yr * 365.25 * 24, 2)} hrs`;
  if (yr < 1) return `${pyToFixed(yr * 365.25, 2)} days`;
  if (yr < 1e3) return `${pyToFixed(yr, 2)} yr`;
  if (yr < 1e6) return `${pyToFixed(yr / 1e3, 2)} kyr`;
  if (yr < 1e9) return `${pyToFixed(yr / 1e6, 2)} Myr`;
  if (yr < 1e12) return `${pyToFixed(yr / 1e9, 2)} Gyr`;
  return `${pyExponential(yr, 2)} yr`;
}

// Python's %g-style formatting for the 0.01 <= |v| < 1e6 branch: d
// significant digits, switching to exponential once the exponent reaches
// the significant-digit count (matches JS's own toPrecision() switch-over,
// since fmt_sci's caller-side 0.01 gate keeps every value well clear of
// toPrecision's more negative exponential threshold), trailing zeros
// stripped either way - which toPrecision alone does not do.
function trimTrailingZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

function formatG(v: number, sig: number): string {
  if (v === 0) return "0";
  const precise = v.toPrecision(sig);
  if (precise.includes("e")) {
    const [mantissa, expPart] = precise.split("e");
    const expNum = Number(expPart);
    const sign = expNum >= 0 ? "+" : "-";
    const expDigits = String(Math.abs(expNum)).padStart(2, "0");
    return `${trimTrailingZeros(mantissa)}e${sign}${expDigits}`;
  }
  return trimTrailingZeros(precise);
}

export function fmtSci(v: number, d = 3): string {
  if (v === 0) return "0";
  if (Math.abs(v) >= 0.01 && Math.abs(v) < 1e6) {
    return formatG(v, d - 1);
  }
  return pyExponential(v, d - 1);
}

const BIG_NUMBER_NAMES: [number, string][] = [
  [1e6, "thousand"],
  [1e9, "million"],
  [1e12, "billion"],
  [1e15, "trillion"],
  [1e18, "quadrillion"],
  [1e21, "quintillion"],
  [1e24, "sextillion"],
  [1e27, "septillion"],
  [1e30, "octillion"],
  [1e33, "nonillion"],
  [1e36, "decillion"],
];

export function fmtBig(v: number): string {
  const a = Math.abs(v);
  if (a === 0) return "0";
  if (a < 1e-3) return pyExponential(v, 1);
  if (a < 1) return pyToFixed(v, 2);
  if (a < 1e3) return pyToFixed(v, 1);

  for (const [threshold, name] of BIG_NUMBER_NAMES) {
    if (a < threshold) {
      const val = v / (threshold / 1e3);
      const s = trimTrailingZeros(pyToFixed(val, 2));
      return `${s} ${name}`;
    }
  }

  if (a < 1e100) {
    const exp = Math.floor(Math.log10(a));
    const coeff = v / 10 ** exp;
    return `${pyToFixed(coeff, 1)} × 10^${exp}`;
  }

  return pyExponential(v, 1);
}
