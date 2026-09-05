import { getRegime } from "@/data/regimes";
import { fmtSci } from "@/lib/format";
import { Surface } from "./Surface";

interface RegimeBadgeProps {
  massSolar: number;
  /** Omit the default bottom margin, for call sites already spacing themselves (e.g. a pill row). */
  inline?: boolean;
}

export function RegimeBadge({ massSolar, inline = false }: RegimeBadgeProps) {
  const { name, color } = getRegime(massSolar);
  return (
    <Surface
      background="tint"
      tintColor={color}
      padding="sm"
      rounded="lg"
      shadow={false}
      className={`inline-flex items-center gap-2 ${inline ? "" : "mb-2"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="text-body font-medium" style={{ color }}>
        {name}
      </span>
      <span className="text-caption text-muted">· {fmtSci(massSolar)} M☉</span>
    </Surface>
  );
}
