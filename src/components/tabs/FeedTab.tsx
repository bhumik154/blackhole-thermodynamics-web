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
import { ExportButton } from "@/components/export/ExportButton";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-title font-display text-foreground">Feed the Black Hole</div>
          <div className="text-caption text-muted mt-1">
            Starting mass: {fmtSci(baselineMass)} M☉. Throw things in. See what happens.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="rounded-lg border border-surface-border bg-surface px-3.5 py-1.5 text-caption uppercase tracking-widest text-muted hover:text-accent-plasma transition-colors"
          >
            🔄 Reset
          </button>
          <ExportButton
            input={{ mode: "feed", props, regime, massSolar: mass, log: log.map((i) => ({ item: THROWABLES[i] })) }}
            filenameSuffix={`feed-${fmtSci(mass, 2)}`}
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5"
          style={{
            background: `color-mix(in oklch, ${regime.color} 12%, transparent)`,
            border: `1px solid color-mix(in oklch, ${regime.color} 30%, transparent)`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: regime.color }} />
          <span className="text-body font-medium" style={{ color: regime.color }}>
            {regime.name}
          </span>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface px-3.5 py-1.5 flex items-center gap-2">
          <span className="text-caption uppercase tracking-widest text-muted">Mass</span>
          <span className="font-mono text-body font-bold" style={{ color: "var(--accent-plasma)" }}>
            {fmtSci(mass)} M☉
          </span>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface px-3.5 py-1.5 flex items-center gap-2">
          <span className="text-caption uppercase tracking-widest text-muted">Consumed</span>
          <span className="font-mono text-body font-bold" style={{ color: "var(--accent-cyan)" }}>
            {log.length}
          </span>
        </div>
      </div>

      <div>
        <div className="text-caption uppercase tracking-widest text-muted mb-2">Throw something in</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {THROWABLES.map((item, i) => {
            const kgStr = item.kg >= 1e6 ? item.kg.toExponential(2) : item.kg.toLocaleString("en-US");
            return (
              <button
                key={item.name}
                onClick={() => onThrow(i, item.kg / M_SUN)}
                className="rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-[color-mix(in_oklch,var(--accent-cyan)_40%,transparent)] hover:bg-[color-mix(in_oklch,var(--accent-cyan)_6%,var(--surface))]"
              >
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-caption text-foreground font-medium">{item.name}</div>
                <div className="font-mono text-caption text-muted/60 mt-0.5">{kgStr} kg</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-caption uppercase tracking-widest text-muted mb-2">Current Properties</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Schwarzschild Radius" value={fmtSci(props.rsKm)} unit="km" accent="var(--accent-cyan)" />
          <MetricCard label="Hawking Temperature" value={fmtSci(props.tempK)} unit="Kelvin" accent="var(--accent-plasma)" />
          <MetricCard label="B-H Entropy" value={fmtSci(props.entropyJK)} unit="J/K" accent="#34d399" />
          <MetricCard label="Evaporation Time" value={fmtTime(props.evapYr)} accent="#facc15" />
        </div>
      </div>

      {log.length > 0 ? (
        <>
          <div>
            <div className="text-caption uppercase tracking-widest mb-2" style={{ color: "var(--accent-plasma)" }}>
              Growth since you started
            </div>
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
                      style={{ color: grew ? "#34d399" : "var(--accent-plasma)" }}
                    >
                      {prefix}
                      {fmtSci(displayRatio)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-caption uppercase tracking-widest text-muted mb-2">What you&apos;ve created</div>
            <FactList facts={facts} limit={3} />
          </div>

          {lastItem ? (
            <div className="rounded-lg border border-surface-border bg-surface px-4 py-3">
              <div className="text-caption text-muted italic leading-relaxed">
                {lastItem.icon} {lastItem.quip}
              </div>
            </div>
          ) : null}

          <div>
            <div className="text-caption uppercase tracking-widest text-muted mb-2">
              Consumed ({log.length} items)
            </div>
            <div className="max-h-72 overflow-y-auto flex flex-col gap-0 rounded-lg border border-surface-border bg-surface">
              {[...log]
                .map((idx, i) => ({ idx, i }))
                .reverse()
                .map(({ idx, i }) => {
                  const item = THROWABLES[idx];
                  const kgStr = item.kg >= 1e6 ? item.kg.toExponential(2) : item.kg.toLocaleString("en-US");
                  return (
                    <div key={i} className="flex gap-2.5 items-start p-3 border-b border-surface-border/40 last:border-0">
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
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
