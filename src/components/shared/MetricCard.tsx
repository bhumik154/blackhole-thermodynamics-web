interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}

export function MetricCard({ label, value, unit, accent = "var(--accent-plasma)" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-3.5 shadow-card transition-colors hover:border-[color-mix(in_oklch,var(--accent-plasma)_40%,transparent)]">
      <div className="text-caption uppercase tracking-widest text-muted">{label}</div>
      <div
        className="font-mono text-title font-bold leading-tight mt-1"
        style={{ color: accent }}
      >
        {value}
      </div>
      {unit ? <div className="text-caption text-muted mt-1">{unit}</div> : null}
    </div>
  );
}
