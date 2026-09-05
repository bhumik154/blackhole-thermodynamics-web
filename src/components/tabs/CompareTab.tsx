"use client";

import { useMemo } from "react";
import { getAllProperties, BlackHoleProperties } from "@/lib/physics/properties";
import { getRegime } from "@/data/regimes";
import { getFunFacts } from "@/data/facts";
import { fmtSci, fmtTime } from "@/lib/format";
import { MassInput } from "@/components/shared/MassInput";
import { RegimeBadge } from "@/components/shared/RegimeBadge";
import { FactList } from "@/components/shared/FactList";
import { Surface } from "@/components/shared/Surface";
import { ExportButton } from "@/components/export/ExportButton";
import { PRESETS } from "@/data/presets";

interface CompareTabProps {
  massA: number;
  presetA: string;
  massB: number;
  presetB: string;
  onMassAChange: (m: number) => void;
  onPresetAChange: (p: string) => void;
  onMassBChange: (m: number) => void;
  onPresetBChange: (p: string) => void;
}

// Direct port of app.py's compare_row(): bolds and colors whichever side
// is larger, and shows the ratio between them once it exceeds 1.01x.
function CompareRow({
  label,
  valueA,
  valueB,
  unit,
  zebra,
}: {
  label: string;
  valueA: number | string;
  valueB: number | string;
  unit?: string;
  zebra: boolean;
}) {
  const strA = typeof valueA === "string" ? valueA : fmtSci(valueA);
  const strB = typeof valueB === "string" ? valueB : fmtSci(valueB);

  let winner: "A" | "B" | null = null;
  let ratioText: string | null = null;
  if (typeof valueA === "number" && typeof valueB === "number") {
    if (valueA > valueB) winner = "A";
    else if (valueB > valueA) winner = "B";
    const lo = Math.min(valueA, valueB);
    const hi = Math.max(valueA, valueB);
    const ratio = lo > 0 ? hi / lo : 0;
    if (ratio > 1.01) ratioText = `${fmtSci(ratio, 2)}×`;
  }

  return (
    <tr
      className={`border-b border-surface-border/40 last:border-0 ${
        zebra ? "bg-[color-mix(in_oklch,var(--foreground)_3%,transparent)]" : ""
      }`}
    >
      <td
        className="text-right font-mono text-body py-2.5 px-2 sm:px-3"
        style={{
          color: winner === "A" ? "var(--accent-plasma)" : "var(--muted)",
          fontWeight: winner === "A" ? 600 : 400,
        }}
      >
        {strA}
      </td>
      <td className="text-center px-2 sm:px-3">
        <div className="text-caption uppercase tracking-wide text-muted">{label}</div>
        {unit ? <div className="text-caption text-muted/60">{unit}</div> : null}
        {ratioText ? <div className="text-caption text-muted/40">{ratioText}</div> : null}
      </td>
      <td
        className="text-left font-mono text-body py-2.5 px-2 sm:px-3"
        style={{
          color: winner === "B" ? "var(--accent-cyan)" : "var(--muted)",
          fontWeight: winner === "B" ? 600 : 400,
        }}
      >
        {strB}
      </td>
    </tr>
  );
}

function presetNameFor(massSolar: number): string {
  const match = PRESETS.find((p) => p.massSolar === massSolar);
  return match ? match.label : `${fmtSci(massSolar)} M☉`;
}

export function CompareTab({
  massA,
  presetA,
  massB,
  presetB,
  onMassAChange,
  onPresetAChange,
  onMassBChange,
  onPresetBChange,
}: CompareTabProps) {
  const propsA: BlackHoleProperties = useMemo(() => getAllProperties(massA), [massA]);
  const propsB: BlackHoleProperties = useMemo(() => getAllProperties(massB), [massB]);
  const regimeA = getRegime(massA);
  const regimeB = getRegime(massB);
  const factsA = useMemo(() => getFunFacts(propsA, massA), [propsA, massA]);
  const factsB = useMemo(() => getFunFacts(propsB, massB), [propsB, massB]);

  const rows = [
    { label: "Mass", valueA: propsA.massKg, valueB: propsB.massKg, unit: "kg" },
    { label: "Radius", valueA: propsA.rsKm, valueB: propsB.rsKm, unit: "km" },
    { label: "Temperature", valueA: propsA.tempK, valueB: propsB.tempK, unit: "K" },
    { label: "Entropy", valueA: propsA.entropyJK, valueB: propsB.entropyJK, unit: "J/K" },
    { label: "Luminosity", valueA: propsA.lumW, valueB: propsB.lumW, unit: "W" },
    { label: "Surf. Gravity", valueA: propsA.surfGrav, valueB: propsB.surfGrav, unit: "m/s²" },
    { label: "Evaporation", valueA: fmtTime(propsA.evapYr), valueB: fmtTime(propsB.evapYr) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-headline font-display text-foreground">Compare Two Black Holes</h2>

      <div className="flex justify-end">
        <ExportButton
          input={{
            mode: "compare",
            propsA,
            propsB,
            regimeA,
            regimeB,
            massA,
            massB,
            factsA,
            factsB,
          }}
          filenameSuffix={`compare-${fmtSci(massA, 2)}-vs-${fmtSci(massB, 2)}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Surface hoverLift className="flex flex-col gap-3">
          <h3 className="text-caption uppercase tracking-widest" style={{ color: "var(--accent-plasma)" }}>
            Black Hole A
          </h3>
          <MassInput
            massSolar={massA}
            onMassChange={onMassAChange}
            presetLabel={presetA}
            onPresetChange={onPresetAChange}
            idPrefix="cmp-a"
            accent="var(--accent-plasma)"
          />
          <RegimeBadge massSolar={massA} inline />
        </Surface>
        <Surface hoverLift className="flex flex-col gap-3">
          <h3 className="text-caption uppercase tracking-widest" style={{ color: "var(--accent-cyan)" }}>
            Black Hole B
          </h3>
          <MassInput
            massSolar={massB}
            onMassChange={onMassBChange}
            presetLabel={presetB}
            onPresetChange={onPresetBChange}
            idPrefix="cmp-b"
            accent="var(--accent-cyan)"
          />
          <RegimeBadge massSolar={massB} inline />
        </Surface>
      </div>

      <Surface padding="none" hoverLift className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-surface-border">
              <th
                className="text-right font-display text-title py-2 px-2 sm:px-3 truncate max-w-[9rem] sm:max-w-none"
                style={{ color: "var(--accent-plasma)" }}
              >
                {presetNameFor(massA)}
              </th>
              <th className="text-caption text-muted uppercase px-2 sm:px-3">vs</th>
              <th
                className="text-left font-display text-title py-2 px-2 sm:px-3 truncate max-w-[9rem] sm:max-w-none"
                style={{ color: "var(--accent-cyan)" }}
              >
                {presetNameFor(massB)}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <CompareRow key={row.label} {...row} zebra={i % 2 === 1} />
            ))}
          </tbody>
        </table>
      </Surface>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Surface hoverLift className="flex flex-col gap-2">
          <h3 className="text-caption uppercase tracking-widest" style={{ color: "var(--accent-plasma)" }}>
            Facts: A
          </h3>
          <FactList facts={factsA} limit={3} />
        </Surface>
        <Surface hoverLift className="flex flex-col gap-2">
          <h3 className="text-caption uppercase tracking-widest" style={{ color: "var(--accent-cyan)" }}>
            Facts: B
          </h3>
          <FactList facts={factsB} limit={3} />
        </Surface>
      </div>
    </div>
  );
}
