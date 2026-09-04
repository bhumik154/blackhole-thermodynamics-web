"""Computes get_all_properties()/scaling_curves() summary stats for a fixed
set of representative masses using the vendored reference physics.py, and
writes the result to reference-output.json for verify-parity.mjs to diff
against. Run via: python3 scripts/gen-reference.py
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "reference"))

from physics import get_all_properties, scaling_curves  # noqa: E402

MASSES = [
    1e-20, 1e-18, 1e-10, 1e-6, 1, 10, 21, 62, 100,
    1e4, 4e6, 1e9, 6.5e9, 1e12,
]

FIELDS = [
    "mass_solar", "mass_kg", "rs_m", "rs_km", "temp_K",
    "entropy_JK", "lum_W", "surf_grav", "evap_s", "evap_yr",
]


def main():
    results = []
    for m in MASSES:
        props = get_all_properties(m)
        curves = scaling_curves(m)
        results.append({
            "massSolar": m,
            "properties": {field: props[field] for field in FIELDS},
            # First, middle, and last scaling-curve sample per field, to
            # verify scaling_curves()'s domain/logspace math too, without
            # writing all 120 points per mass into the JSON.
            "scalingSamples": {
                "massesSolar": [
                    curves["masses_solar"][0],
                    curves["masses_solar"][60],
                    curves["masses_solar"][119],
                ],
                "rsKm": [curves["rs_km"][0], curves["rs_km"][60], curves["rs_km"][119]],
                "tempK": [curves["temp_K"][0], curves["temp_K"][60], curves["temp_K"][119]],
                "entropyJK": [curves["entropy_JK"][0], curves["entropy_JK"][60], curves["entropy_JK"][119]],
                "evapYr": [curves["evap_yr"][0], curves["evap_yr"][60], curves["evap_yr"][119]],
            },
        })

    out_path = Path(__file__).parent / "reference" / "reference-output.json"
    out_path.write_text(json.dumps(results, indent=2))
    print(f"Wrote {len(results)} mass entries to {out_path}")


if __name__ == "__main__":
    main()
