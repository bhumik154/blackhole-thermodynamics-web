import { Surface } from "./Surface";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  /** "md" (default) is today's exact appearance. "lg" is for hero bento tiles (bigger value type); "sm" is a denser secondary tile. */
  size?: "sm" | "md" | "lg";
}

const VALUE_SIZE_CLASS: Record<NonNullable<MetricCardProps["size"]>, string> = {
  sm: "text-body",
  md: "text-title",
  lg: "text-headline",
};

const SURFACE_PADDING: Record<NonNullable<MetricCardProps["size"]>, "sm" | "md"> = {
  sm: "sm",
  md: "md",
  lg: "md",
};

export function MetricCard({ label, value, unit, accent = "var(--accent-plasma)", size = "md" }: MetricCardProps) {
  return (
    <Surface padding={SURFACE_PADDING[size]} interactive hoverLift accentFocus="cyan" className="block h-full">
      <div className="text-caption uppercase tracking-widest text-muted">{label}</div>
      <div
        className={`font-mono ${VALUE_SIZE_CLASS[size]} font-bold leading-tight mt-1`}
        style={{ color: accent }}
      >
        {value}
      </div>
      {unit ? <div className="text-caption text-muted mt-1">{unit}</div> : null}
    </Surface>
  );
}
