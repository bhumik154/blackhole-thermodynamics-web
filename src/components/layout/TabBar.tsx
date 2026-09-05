import { Tab } from "@/hooks/useAppState";
import { Surface } from "@/components/shared/Surface";

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
    <Surface padding="none" rounded="lg" shadow={false} className="inline-flex gap-1 p-1">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="min-h-11 flex items-center justify-center rounded-md px-4 py-2 text-body transition-colors duration-150 ease-[var(--ease-standard)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklch,var(--accent-cyan)_35%,transparent)]"
          style={
            tab === t.key
              ? { background: "color-mix(in oklch, var(--accent-cyan) 18%, transparent)", color: "var(--accent-cyan-soft)" }
              : { color: "var(--muted)" }
          }
        >
          {t.label}
        </button>
      ))}
    </Surface>
  );
}
