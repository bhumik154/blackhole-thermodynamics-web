import { getRegime } from "@/data/regimes";
import { fmtSci } from "@/lib/format";

interface RegimeBadgeProps {
  massSolar: number;
}

export function RegimeBadge({ massSolar }: RegimeBadgeProps) {
  const { name, color } = getRegime(massSolar);
  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 mb-3"
      style={{
        background: `color-mix(in oklch, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in oklch, ${color} 30%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="text-body font-medium" style={{ color }}>
        {name}
      </span>
      <span className="text-caption text-muted">· {fmtSci(massSolar)} M☉</span>
    </div>
  );
}
