"use client";

import { useMemo, useState } from "react";
import { getAllProperties } from "@/lib/physics/properties";
import { scalingCurves } from "@/lib/physics/scaling";
import { getRegime } from "@/data/regimes";
import { getFunFacts } from "@/data/facts";
import { fmtSci, fmtTime } from "@/lib/format";
import { MassInput } from "@/components/shared/MassInput";
import { RegimeBadge } from "@/components/shared/RegimeBadge";
import { MetricCard } from "@/components/shared/MetricCard";
import { FactList } from "@/components/shared/FactList";
import { HorizonVisual } from "@/components/shared/HorizonVisual";
import { ScalingChart } from "@/components/charts/ScalingChart";
import { SizeCompareChart } from "@/components/charts/SizeCompareChart";
import { ExportButton } from "@/components/export/ExportButton";

interface SingleTabProps {
  massSolar: number;
  preset: string;
  onMassChange: (m: number) => void;
  onPresetChange: (p: string) => void;
}

const SCALING_FIELDS = [
  { key: "rsKm", label: "Schwarzschild Radius", unit: "km", color: "var(--accent-cyan)" },
  { key: "tempK", label: "Hawking Temperature", unit: "K", color: "var(--accent-plasma)" },
  { key: "entropyJK", label: "B-H Entropy", unit: "J/K", color: "#34d399" },
  { key: "evapYr", label: "Evaporation Time", unit: "yr", color: "#facc15" },
] as const;

export function SingleTab({ massSolar, preset, onMassChange, onPresetChange }: SingleTabProps) {
  const [scalingField, setScalingField] = useState<(typeof SCALING_FIELDS)[number]["key"]>("rsKm");

  const props = useMemo(() => getAllProperties(massSolar), [massSolar]);
  const curves = useMemo(() => scalingCurves(massSolar), [massSolar]);
  const facts = useMemo(() => getFunFacts(props, massSolar), [props, massSolar]);
  const regime = getRegime(massSolar);
  const activeField = SCALING_FIELDS.find((f) => f.key === scalingField)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <MassInput
          massSolar={massSolar}
          onMassChange={onMassChange}
          presetLabel={preset}
          onPresetChange={onPresetChange}
          idPrefix="single"
        />
        <ExportButton
          input={{ mode: "single", props, regime, massSolar, facts }}
          filenameSuffix={fmtSci(massSolar, 2)}
        />
      </div>

      <RegimeBadge massSolar={massSolar} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Schwarzschild Radius" value={fmtSci(props.rsKm)} unit="km" accent="var(--accent-cyan)" />
        <MetricCard label="Hawking Temperature" value={fmtSci(props.tempK)} unit="Kelvin" accent="var(--accent-plasma)" />
        <MetricCard label="B-H Entropy" value={fmtSci(props.entropyJK)} unit="J/K" accent="#34d399" />
        <MetricCard label="Luminosity" value={fmtSci(props.lumW)} unit="Watts" accent="#f472b6" />
        <MetricCard label="Surface Gravity" value={fmtSci(props.surfGrav)} unit="m/s²" accent="#a78bfa" />
        <MetricCard label="Evaporation Time" value={fmtTime(props.evapYr)} accent="#facc15" />
        <MetricCard label="Mass" value={fmtSci(props.massKg)} unit="kg" accent="var(--muted)" />
        <MetricCard label="Event Horizon" value={fmtSci(props.rsM)} unit="metres" accent="var(--muted)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="flex flex-col gap-2">
          <div className="text-caption uppercase tracking-widest text-muted">Did you know?</div>
          <FactList facts={facts} limit={5} />
        </div>
        <HorizonVisual rsKm={props.rsKm} tempK={props.tempK} />
      </div>

      <div>
        <div className="text-caption uppercase tracking-widest text-muted mb-2">Size Comparison</div>
        <SizeCompareChart massSolar={massSolar} rsKm={props.rsKm} />
      </div>

      <div>
        <div className="text-caption uppercase tracking-widest text-muted mb-2">Scaling Relations</div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {SCALING_FIELDS.map((f) => (
            <button
              key={f.key}
              onClick={() => setScalingField(f.key)}
              className="rounded-full px-3 py-1 text-caption transition-colors"
              style={
                scalingField === f.key
                  ? { background: "color-mix(in oklch, var(--accent-cyan) 18%, transparent)", color: "var(--accent-cyan-soft)" }
                  : { color: "var(--muted)", border: "1px solid var(--surface-border)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <ScalingChart
          curves={curves}
          field={activeField.key}
          label={activeField.label}
          unit={activeField.unit}
          color={activeField.color}
          currentMass={massSolar}
          currentValue={props[activeField.key]}
        />
      </div>
    </div>
  );
}
