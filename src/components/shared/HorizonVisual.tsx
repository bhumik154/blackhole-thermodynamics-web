"use client";

import { useEffect, useRef } from "react";
import { scaleLog } from "d3-scale";

interface HorizonVisualProps {
  rsKm: number;
  tempK: number;
}

// Full plausible rs_km domain across the app's mass range (1e-20 to 1e12
// M☉), mapped to a fixed on-screen radius range. This mapping is
// illustrative/decorative only - it does not represent a physical scale,
// which is why the caption below says so explicitly. The numeric physics
// elsewhere (metric cards, charts) is never touched by this component.
const RS_KM_DOMAIN: [number, number] = [1e-35, 1e14];
const SCREEN_RADIUS_RANGE: [number, number] = [10, 70];

const radiusScale = scaleLog().domain(RS_KM_DOMAIN).range(SCREEN_RADIUS_RANGE).clamp(true);

// Illustrative temperature -> color ramp (cool blue-white near the CMB,
// through plasma amber, to white-hot at extreme temperatures). Not a
// radiometric blackbody calculation - purely a visual read of "how hot".
function tempToColor(tempK: number): { core: string; glow: string } {
  if (tempK < 10) return { core: "#8fd6ff", glow: "rgba(143,214,255,0.5)" };
  if (tempK < 1e4) return { core: "#4fd8ff", glow: "rgba(79,216,255,0.55)" };
  if (tempK < 1e8) return { core: "#ff8a3d", glow: "rgba(255,138,61,0.6)" };
  return { core: "#ffffff", glow: "rgba(255,255,255,0.75)" };
}

export function HorizonVisual({ rsKm, tempK }: HorizonVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ angle: 0, paused: false, rsKm, tempK });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current.rsKm = rsKm;
    stateRef.current.tempK = tempK;
  }, [rsKm, tempK]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas || !container) return;
      const size = container.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        stateRef.current.paused = !entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    function draw() {
      const c = canvasRef.current;
      const context = c?.getContext("2d");
      if (!c || !context) return;
      const size = c.clientWidth;
      const cx = size / 2;
      const cy = size / 2;
      const { core, glow } = tempToColor(stateRef.current.tempK);
      const ringRadius = radiusScale(stateRef.current.rsKm) as number;

      context.clearRect(0, 0, size, size);

      // Outer glow
      const outerGrad = context.createRadialGradient(cx, cy, ringRadius * 0.6, cx, cy, ringRadius * 2.4);
      outerGrad.addColorStop(0, glow);
      outerGrad.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = outerGrad;
      context.fillRect(0, 0, size, size);

      // Rotating accretion-disk streaks
      context.save();
      context.translate(cx, cy);
      context.rotate(stateRef.current.angle);
      const streakCount = 5;
      for (let i = 0; i < streakCount; i++) {
        const a0 = (i / streakCount) * Math.PI * 2;
        const opacity = 0.15 + 0.1 * Math.sin(i * 1.7);
        context.strokeStyle = `rgba(255,255,255,${opacity})`;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(0, 0, ringRadius * 1.7, a0, a0 + 0.6);
        context.stroke();
      }
      context.restore();

      // Event horizon: solid black disk
      context.beginPath();
      context.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      context.fillStyle = "#030308";
      context.fill();

      // Photon ring
      context.beginPath();
      context.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      context.lineWidth = 2;
      context.strokeStyle = core;
      context.shadowColor = core;
      context.shadowBlur = 12;
      context.stroke();
      context.shadowBlur = 0;

      if (!stateRef.current.paused) {
        stateRef.current.angle += 0.003;
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl border border-surface-border bg-background-deep p-3 shadow-card flex flex-col items-center">
      <div ref={containerRef} className="w-full max-w-[220px] aspect-square">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="text-caption text-muted mt-2 text-center">
        Illustrative event horizon (not to scale)
      </div>
    </div>
  );
}
