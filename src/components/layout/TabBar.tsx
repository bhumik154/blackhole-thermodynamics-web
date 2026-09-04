import { Tab } from "@/hooks/useAppState";

interface TabBarProps {
  tab: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "single", label: "Single" },
  { key: "compare", label: "Compare" },
  { key: "feed", label: "Feed" },
];

export function TabBar({ tab, onChange }: TabBarProps) {
  return (
    <div className="inline-flex gap-1 rounded-lg border border-surface-border bg-surface p-1">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="rounded-md px-4 py-1.5 text-body transition-colors"
          style={
            tab === t.key
              ? { background: "color-mix(in oklch, var(--accent-cyan) 18%, transparent)", color: "var(--accent-cyan-soft)" }
              : { color: "var(--muted)" }
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
