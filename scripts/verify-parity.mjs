// Diffs the TypeScript physics engine's output against the reference
// output computed by the vendored Python original (scripts/gen-reference.py
// + scripts/reference/physics.py), with a 1e-9 relative tolerance that
// accounts for floating-point order-of-operations differences between
// Python and JS, not for actual formula drift. Run via: npm run verify:parity

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getAllProperties } from "../src/lib/physics/properties.ts";
import { scalingCurves } from "../src/lib/physics/scaling.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const referencePath = join(__dirname, "reference", "reference-output.json");
const reference = JSON.parse(readFileSync(referencePath, "utf-8"));

const PROPERTY_FIELD_MAP = {
  mass_solar: "massSolar",
  mass_kg: "massKg",
  rs_m: "rsM",
  rs_km: "rsKm",
  temp_K: "tempK",
  entropy_JK: "entropyJK",
  lum_W: "lumW",
  surf_grav: "surfGrav",
  evap_s: "evapS",
  evap_yr: "evapYr",
};

const TOLERANCE = 1e-9;

function relError(a, b) {
  if (a === 0 && b === 0) return 0;
  return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
}

let failures = [];
let checks = 0;

for (const entry of reference) {
  const { massSolar, properties, scalingSamples } = entry;
  const tsProps = getAllProperties(massSolar);

  for (const [pyField, tsField] of Object.entries(PROPERTY_FIELD_MAP)) {
    checks++;
    const pyValue = properties[pyField];
    const tsValue = tsProps[tsField];
    const err = relError(pyValue, tsValue);
    if (err > TOLERANCE) {
      failures.push({ massSolar, field: tsField, pyValue, tsValue, relError: err });
    }
  }

  const tsCurves = scalingCurves(massSolar);
  const sampleIndices = [0, 60, 119];
  const curveFieldMap = {
    massesSolar: "massesSolar",
    rsKm: "rsKm",
    tempK: "tempK",
    entropyJK: "entropyJK",
    evapYr: "evapYr",
  };

  for (const [pyField, tsField] of Object.entries(curveFieldMap)) {
    sampleIndices.forEach((idx, i) => {
      checks++;
      const pyValue = scalingSamples[pyField][i];
      const tsValue = tsCurves[tsField][idx];
      const err = relError(pyValue, tsValue);
      if (err > TOLERANCE) {
        failures.push({
          massSolar,
          field: `scaling.${tsField}[${idx}]`,
          pyValue,
          tsValue,
          relError: err,
        });
      }
    });
  }
}

console.log(`Checked ${checks} values across ${reference.length} masses.`);

if (failures.length > 0) {
  console.error(`\n${failures.length} PARITY FAILURES:\n`);
  console.table(
    failures.map((f) => ({
      massSolar: f.massSolar,
      field: f.field,
      pyValue: f.pyValue,
      tsValue: f.tsValue,
      relError: f.relError,
    }))
  );
  process.exit(1);
} else {
  console.log(`All values within ${TOLERANCE} relative tolerance. PARITY OK.`);
  process.exit(0);
}
