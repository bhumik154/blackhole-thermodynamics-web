"use client";

import { useMemo } from "react";
import { getAllProperties, BlackHoleProperties } from "@/lib/physics/properties";
import { getRegime } from "@/data/regimes";
import { getFunFacts } from "@/data/facts";
import { THROWABLES } from "@/data/throwables";
import { M_SUN } from "@/lib/physics/constants";
import { fmtSci, fmtTime } from "@/lib/format";
import { MetricCard } from "@/components/shared/MetricCard";
import { FactList } from "@/components/shared/FactList";
import { RegimeBadge } from "@/components/shared/RegimeBadge";
import { Surface } from "@/components/shared/Surface";
import { ExportButton } from "@/components/export/ExportButton";
import { useRevealOnMount } from "@/hooks/useRevealOnMount";

interface FeedTabProps {
  mass: number;
  log: number[]; // indices into THROWABLES
  baselineMass: number;
  onThrow: (index: number, addedMassSolar: number) => void;
  onReset: () => void;
}

const GROWTH_FIELDS = [
  { label: "Mass", key: "massKg" as const },
  { label: "Radius", key: "rsKm" as const },
  { label: "Temperature", key: "tempK" as const },
  { label: "Entropy", key: "entropyJK" as const },
];

export function FeedTab({ mass, log, baselineMass, onThrow, onReset }: FeedTabProps) {
  const props: BlackHoleProperties = useMemo(() => getAllProperties(mass), [mass]);
  const startProps = useMemo(() => getAllProperties(baselineMass), [baselineMass]);
  const regime = getRegime(mass);
  const facts = useMemo(() => getFunFacts(props, mass), [props, mass]);
  const lastItem = log.length > 0 ? THROWABLES[log[log.length - 1]] : null;
  const { ref: metricGridRef, revealed: metricGridRevealed } = useRevealOnMount<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-headline font-display text-foreground">Feed the Black Hole</h2>
          <div className="text-caption text-muted mt-1">
            Starting mass: {fmtSci(baselineMass)} M☉. Throw things in. See what happens.
          </div>
        </div>
        <div className="flex gap-2">
          <Surface
            as="button"
            padding="sm"
            rounded="lg"
            interactive
            accentFocus="plasma"
            onClick={onReset}
            className="text-caption uppercase tracking-widest text-muted hover:text-accent-plasma"
          >
            🔄 Reset
          </Surface>
          <ExportButton
            input={{ mode: "feed", props, regime, massSolar: mass, log: log.map((i) => ({ item: THROWABLES[i] })) }}
            filenameSuffix={`feed-${fmtSci(mass, 2)}`}
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <RegimeBadge massSolar={mass} inline />
        <Surface padding="sm" rounded="lg" hoverLift className="inline-flex items-center gap-2">
          <span className="text-caption uppercase tracking-widest text-muted">Mass</span>
          <span className="font-mono text-body font-bold" style={{ color: "var(--accent-plasma)" }}>
            {fmtSci(mass)} M☉
          </span>
        </Surface>
        <Surface padding="sm" rounded="lg" hoverLift className="inline-flex items-center gap-2">
          <span className="text-caption uppercase tracking-widest text-muted">Consumed</span>
          <span className="font-mono text-body font-bold" style={{ color: "var(--accent-cyan)" }}>
            {log.length}
          </span>
        </Surface>
      </div>

      <div>
        <h3 className="text-caption uppercase tracking-widest text-muted mb-2">Throw something in</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {THROWABLES.map((item, i) => {
            const kgStr = item.kg >= 1e6 ? item.kg.toExponential(2) : item.kg.toLocaleString("en-US");
            return (
              <Surface
                key={item.name}
                as="button"
                padding="sm"
                rounded="lg"
                interactive
                contentLayout="stack"
                onClick={() => onThrow(i, item.kg / M_SUN)}
                className="text-left block"
              >
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-caption text-foreground font-medium">{item.name}</div>
                <div className="font-mono text-caption text-muted/60 mt-0.5">{kgStr} kg</div>
              </Surface>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-caption uppercase tracking-widest text-muted mb-2">Current Properties</h3>
        <div
          ref={metricGridRef}
          data-reveal
          data-revealed={metricGridRevealed}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {/* Same 3 headline quantities get hero treatment as the Single
              tab, for a consistent "which numbers matter" story across
              the app. */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <MetricCard size="lg" label="Schwarzschild Radius" value={fmtSci(props.rsKm)} unit="km" accent="var(--accent-cyan)" />
          </div>
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <MetricCard size="lg" label="Hawking Temperature" value={fmtSci(props.tempK)} unit="Kelvin" accent="var(--accent-plasma)" />
          </div>
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <MetricCard size="lg" label="B-H Entropy" value={fmtSci(props.entropyJK)} unit="J/K" accent="var(--accent-entropy)" />
          </div>
          <div className="col-span-2 sm:col-span-4 lg:col-span-6">
            <MetricCard size="sm" label="Evaporation Time" value={fmtTime(props.evapYr)} accent="var(--muted)" />
          </div>
        </div>
      </div>

      {log.length > 0 ? (
        <>
          <Surface hoverLift className="flex flex-col gap-2">
            <h3 className="text-caption uppercase tracking-widest" style={{ color: "var(--accent-plasma)" }}>
              Growth since you started
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GROWTH_FIELDS.map(({ label, key }) => {
                const ratio = startProps[key] !== 0 ? props[key] / startProps[key] : 0;
                const grew = ratio > 1;
                const displayRatio = ratio >= 1 ? ratio : ratio > 0 ? 1 / ratio : 0;
                const prefix = ratio >= 1 ? "×" : "÷";
                return (
                  <div key={label}>
                    <div className="text-caption uppercase tracking-wide text-muted">{label}</div>
                    <div
                      className="font-mono text-body font-semibold"
                      style={{ color: grew ? "var(--accent-entropy)" : "var(--accent-plasma)" }}
                    >
                      {prefix}
                      {fmtSci(displayRatio)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Surface>

          <Surface hoverLift className="flex flex-col gap-2">
            <h3 className="text-caption uppercase tracking-widest text-muted">What you&apos;ve created</h3>
            <FactList facts={facts} limit={3} />
          </Surface>

          {lastItem ? (
            <Surface padding="md" rounded="lg" hoverLift>
              <div className="text-caption text-muted italic leading-relaxed">
                {lastItem.icon} {lastItem.quip}
              </div>
            </Surface>
          ) : null}

          <div>
            <h3 className="text-caption uppercase tracking-widest text-muted mb-2">
              Consumed ({log.length} items)
            </h3>
            <Surface padding="none" rounded="lg" className="max-h-72 overflow-y-auto flex flex-col gap-0">
              {[...log]
                .map((idx, i) => ({ idx, i }))
                .reverse()
                .map(({ idx, i }, rowIndex) => {
                  const item = THROWABLES[idx];
                  const kgStr = item.kg >= 1e6 ? item.kg.toExponential(2) : item.kg.toLocaleString("en-US");
                  return (
                    <div
                      key={i}
                      className={`flex gap-2.5 items-start p-3 border-b border-surface-border/40 last:border-0 ${
                        rowIndex % 2 === 1 ? "bg-[color-mix(in_oklch,var(--foreground)_3%,transparent)]" : ""
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-caption text-foreground font-medium">{item.name}</span>
                          <span className="font-mono text-caption text-muted/50">+{kgStr} kg</span>
                        </div>
                        <div className="text-caption text-muted/70 mt-0.5">{item.quip}</div>
                      </div>
                    </div>
                  );
                })}
            </Surface>
          </div>
        </>
      ) : null}
    </div>
  );
}
