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
import { Surface } from "@/components/shared/Surface";
import { HorizonVisual } from "@/components/shared/HorizonVisual";
import { ScalingChart } from "@/components/charts/ScalingChart";
import { SizeCompareChart } from "@/components/charts/SizeCompareChart";
import { ExportButton } from "@/components/export/ExportButton";
import { useRevealOnMount } from "@/hooks/useRevealOnMount";

interface SingleTabProps {
  massSolar: number;
  preset: string;
  onMassChange: (m: number) => void;
  onPresetChange: (p: string) => void;
}

const SCALING_FIELDS = [
  { key: "rsKm", label: "Schwarzschild Radius", unit: "km", color: "var(--accent-cyan)" },
  { key: "tempK", label: "Hawking Temperature", unit: "K", color: "var(--accent-plasma)" },
  { key: "entropyJK", label: "B-H Entropy", unit: "J/K", color: "var(--accent-entropy)" },
  { key: "evapYr", label: "Evaporation Time", unit: "yr", color: "#facc15" },
] as const;

export function SingleTab({ massSolar, preset, onMassChange, onPresetChange }: SingleTabProps) {
  const [scalingField, setScalingField] = useState<(typeof SCALING_FIELDS)[number]["key"]>("rsKm");

  const props = useMemo(() => getAllProperties(massSolar), [massSolar]);
  const curves = useMemo(() => scalingCurves(massSolar), [massSolar]);
  const facts = useMemo(() => getFunFacts(props, massSolar), [props, massSolar]);
  const regime = getRegime(massSolar);
  const activeField = SCALING_FIELDS.find((f) => f.key === scalingField)!;
  const { ref: gridRef, revealed: gridRevealed } = useRevealOnMount<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-headline font-display text-foreground">Single Black Hole</h2>

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

      <div
        ref={gridRef}
        data-reveal
        data-revealed={gridRevealed}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(96px,auto)] gap-3"
      >
        {/* Hero tiles: the two obvious headline quantities plus entropy,
            the app's namesake result - all three get bigger typography
            and a taller footprint than the 5 secondary metrics below. */}
        <div className="col-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2">
          <MetricCard size="lg" label="Schwarzschild Radius" value={fmtSci(props.rsKm)} unit="km" accent="var(--accent-cyan)" />
        </div>
        <div className="col-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2">
          <MetricCard size="lg" label="Hawking Temperature" value={fmtSci(props.tempK)} unit="Kelvin" accent="var(--accent-plasma)" />
        </div>
        <div className="col-span-2 sm:col-span-4 lg:col-span-2 lg:row-span-2">
          <MetricCard size="lg" label="B-H Entropy" value={fmtSci(props.entropyJK)} unit="J/K" accent="var(--accent-entropy)" />
        </div>

        {/* Secondary metrics: denser, quieter, muted accents. */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <MetricCard size="sm" label="Luminosity" value={fmtSci(props.lumW)} unit="Watts" accent="var(--muted)" />
            <MetricCard size="sm" label="Surface Gravity" value={fmtSci(props.surfGrav)} unit="m/s²" accent="var(--muted)" />
            <MetricCard size="sm" label="Evaporation Time" value={fmtTime(props.evapYr)} accent="var(--muted)" />
            <MetricCard size="sm" label="Mass" value={fmtSci(props.massKg)} unit="kg" accent="var(--muted)" />
            <MetricCard size="sm" label="Event Horizon" value={fmtSci(props.rsM)} unit="metres" accent="var(--muted)" />
          </div>
        </div>

        {/* Facts card, narrow, beside the horizon visual - the app's one
            custom visual centerpiece, given the largest tile on screen. */}
        <Surface hoverLift className="flex flex-col gap-2 col-span-2 sm:col-span-4 lg:col-span-2 lg:row-span-2">
          <h3 className="text-caption uppercase tracking-widest text-muted">Did you know?</h3>
          <FactList facts={facts} limit={5} />
        </Surface>
        <div className="col-span-2 row-span-2 sm:col-span-4 sm:row-span-2 lg:col-span-4 lg:row-span-2">
          <HorizonVisual rsKm={props.rsKm} tempK={props.tempK} />
        </div>

        {/* Both charts stay full width: Size Comparison's fixed-aspect
            SVG would compress and risk label collisions at half width,
            and Scaling Relations has no natural half-width partner left -
            a full-width row is itself a legitimate bento size. */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-6">
          <h3 className="text-caption uppercase tracking-widest text-muted mb-2">Size Comparison</h3>
          <SizeCompareChart massSolar={massSolar} rsKm={props.rsKm} />
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-6">
          <h3 className="text-caption uppercase tracking-widest text-muted mb-2">Scaling Relations</h3>
          <div className="flex gap-2 mb-3 flex-wrap">
            {SCALING_FIELDS.map((f) => (
              <button
                key={f.key}
                onClick={() => setScalingField(f.key)}
                className="min-h-11 rounded-full px-3 py-1 text-caption transition-colors duration-150 ease-[var(--ease-standard)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklch,var(--accent-cyan)_35%,transparent)]"
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
    </div>
  );
}
