"use client";

import { useMemo, useState } from "react";
import { scaleLog } from "d3-scale";
import { line as d3line } from "d3-shape";
import { motion, useReducedMotion } from "framer-motion";
import { ScalingCurves } from "@/lib/physics/scaling";
import { fmtSci } from "@/lib/format";
import { standardEase, DURATION } from "@/lib/motion";
import { Surface } from "@/components/shared/Surface";

interface ScalingChartProps {
  curves: ScalingCurves;
  field: keyof Pick<ScalingCurves, "rsKm" | "tempK" | "entropyJK" | "evapYr">;
  label: string;
  unit: string;
  color: string;
  currentMass: number;
  currentValue: number;
}

const WIDTH = 480;
const HEIGHT = 260;
const MARGIN = { top: 16, right: 16, bottom: 32, left: 56 };

export function ScalingChart({
  curves,
  field,
  label,
  unit,
  color,
  currentMass,
  currentValue,
}: ScalingChartProps) {
  const [hover, setHover] = useState<{ x: number; mass: number; value: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { xScale, yScale, pathD, markerPos } = useMemo(() => {
    const xs = curves.massesSolar;
    const ys = curves[field];
    const innerW = WIDTH - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

    const xDomain: [number, number] = [Math.min(...xs), Math.max(...xs)];
    const yValues = ys.filter((v) => v > 0);
    const yDomain: [number, number] = [Math.min(...yValues), Math.max(...yValues)];

    const xScale = scaleLog().domain(xDomain).range([0, innerW]).clamp(true);
    const yScale = scaleLog().domain(yDomain).range([innerH, 0]).clamp(true);

    const lineGen = d3line<number>()
      .x((_, i) => xScale(xs[i]))
      .y((_, i) => (ys[i] > 0 ? yScale(ys[i]) : innerH));
    const pathD = lineGen(ys) ?? "";

    const markerPos = {
      x: xScale(currentMass),
      y: yScale(Math.max(currentValue, yDomain[0])),
    };

    return { xScale, yScale, pathD, markerPos };
  }, [curves, field, currentMass, currentValue]);

  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const xTicks = xScale.ticks(4);
  const yTicks = yScale.ticks(4);

  function handleMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const mass = xScale.invert(px);
    const xs = curves.massesSolar;
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < xs.length; i++) {
      const d = Math.abs(Math.log10(xs[i]) - Math.log10(mass));
      if (d < closestDist) {
        closestDist = d;
        closest = i;
      }
    }
    setHover({ x: xScale(xs[closest]), mass: xs[closest], value: curves[field][closest] });
  }

  return (
    <Surface padding="md" hoverLift>
      <div className="text-caption text-muted mb-1 uppercase tracking-wide">{label}</div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${label} scaling chart, current value ${fmtSci(currentValue)} ${unit} at ${fmtSci(currentMass)} solar masses`}
      >
        <defs>
          <filter id={`glow-${field}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {yTicks.map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={innerW}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--surface-border)"
              strokeWidth={1}
            />
          ))}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={2}
            filter={`url(#glow-${field})`}
          />
          <motion.circle
            cx={markerPos.x}
            cy={markerPos.y}
            r={5}
            fill={color}
            stroke="var(--background)"
            strokeWidth={1.5}
            initial={false}
            animate={{ cx: markerPos.x, cy: markerPos.y }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: DURATION.base, ease: standardEase }}
          />
          {hover ? (
            <line
              x1={hover.x}
              x2={hover.x}
              y1={0}
              y2={innerH}
              stroke="var(--muted)"
              strokeDasharray="3 3"
            />
          ) : null}
          <rect
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          />
          {xTicks.map((t) => (
            <text
              key={`xt-${t}`}
              x={xScale(t)}
              y={innerH + 16}
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill="var(--muted)"
              textAnchor="middle"
            >
              {fmtSci(t, 2)}
            </text>
          ))}
          {yTicks.map((t) => (
            <text
              key={`yt-${t}`}
              x={-8}
              y={yScale(t)}
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill="var(--muted)"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {fmtSci(t, 2)}
            </text>
          ))}
        </g>
      </svg>
      <div className="text-caption text-muted mt-1 font-mono">
        {hover
          ? `${fmtSci(hover.mass)} M☉ · ${fmtSci(hover.value)} ${unit}`
          : `Mass (M☉) vs ${label} (${unit})`}
      </div>
    </Surface>
  );
}
