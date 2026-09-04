"use client";

import { useMemo } from "react";
import { scaleLog } from "d3-scale";
import { SIZE_REFS } from "@/data/size-refs";
import { getSizeContext } from "@/data/regimes";
import { fmtSci } from "@/lib/format";

interface SizeCompareChartProps {
  massSolar: number;
  rsKm: number;
}

const WIDTH = 480;
const MARGIN = { top: 8, right: 60, bottom: 24, left: 90 };
const ROW_HEIGHT = 28;

export function SizeCompareChart({ massSolar, rsKm }: SizeCompareChartProps) {
  const rows = useMemo(
    () => [
      ...SIZE_REFS.map((r) => ({ name: r.name, km: r.km, isBH: false })),
      { name: `BH (${fmtSci(massSolar, 2)} M☉)`, km: rsKm, isBH: true },
    ],
    [massSolar, rsKm]
  );

  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  const height = rows.length * ROW_HEIGHT;

  const xScale = useMemo(() => {
    const values = rows.map((r) => r.km).filter((v) => v > 0);
    return scaleLog()
      .domain([Math.min(...values), Math.max(...values)])
      .range([0, innerW])
      .clamp(true);
  }, [rows, innerW]);

  const xTicks = xScale.ticks(4);

  return (
    <div className="rounded-xl border border-surface-border bg-surface p-3 shadow-card">
      <div className="text-caption text-muted mb-1 uppercase tracking-wide">
        Size comparison · {getSizeContext(rsKm)}
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${height + MARGIN.top + MARGIN.bottom}`} className="w-full h-auto">
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {rows.map((row, i) => {
            const barWidth = Math.max(xScale(row.km), 1);
            const y = i * ROW_HEIGHT;
            return (
              <g key={row.name}>
                <text
                  x={-8}
                  y={y + ROW_HEIGHT / 2}
                  fontSize={10}
                  fontFamily="var(--font-sans)"
                  fill={row.isBH ? "var(--accent-cyan)" : "var(--muted)"}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {row.name}
                </text>
                <rect
                  x={0}
                  y={y + 4}
                  width={barWidth}
                  height={ROW_HEIGHT - 12}
                  rx={3}
                  fill={row.isBH ? "var(--accent-cyan)" : "color-mix(in oklch, var(--foreground) 10%, transparent)"}
                />
                <text
                  x={barWidth + 6}
                  y={y + ROW_HEIGHT / 2}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill="var(--muted)"
                  dominantBaseline="middle"
                >
                  {row.km < 0.01 || row.km >= 1e6 ? `${row.km.toExponential(1)} km` : `${row.km.toLocaleString("en-US", { maximumFractionDigits: 0 })} km`}
                </text>
              </g>
            );
          })}
          {xTicks.map((t) => (
            <text
              key={`xt-${t}`}
              x={xScale(t)}
              y={height + 16}
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill="var(--muted)"
              textAnchor="middle"
            >
              {fmtSci(t, 2)}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
