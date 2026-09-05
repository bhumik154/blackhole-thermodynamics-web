import { PRESETS } from "@/data/presets";

interface MassInputProps {
  massSolar: number;
  onMassChange: (massSolar: number) => void;
  presetLabel: string;
  onPresetChange: (label: string) => void;
  idPrefix: string;
  accent?: string;
}

const MIN_MASS = 1e-20;
const MAX_MASS = 1e12;

// Shared by both fields below - kept as a literal class string rather than
// a Surface-wrapped component, since native <input>/<select> need their
// own element semantics and there are only 2 call sites, both in this file.
const inputSurfaceClass =
  "w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-body text-foreground focus:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklch,var(--accent-cyan)_35%,transparent)]";

export function MassInput({
  massSolar,
  onMassChange,
  presetLabel,
  onPresetChange,
  idPrefix,
  accent = "var(--accent-plasma)",
}: MassInputProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label htmlFor={`${idPrefix}-mass`} className="text-caption uppercase tracking-widest text-muted block mb-2">
          Mass (solar masses M☉)
        </label>
        <input
          id={`${idPrefix}-mass`}
          type="number"
          inputMode="decimal"
          min={MIN_MASS}
          max={MAX_MASS}
          value={massSolar}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            const clamped = Math.min(Math.max(v, MIN_MASS), MAX_MASS);
            onMassChange(clamped);
            if (presetLabel !== "Custom") onPresetChange("Custom");
          }}
          className={`${inputSurfaceClass} font-mono`}
          style={{ accentColor: accent }}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-preset`} className="text-caption uppercase tracking-widest text-muted block mb-2">
          Or load a preset
        </label>
        <select
          id={`${idPrefix}-preset`}
          value={presetLabel}
          onChange={(e) => {
            const label = e.target.value;
            onPresetChange(label);
            const preset = PRESETS.find((p) => p.label === label);
            if (preset && preset.massSolar !== null) onMassChange(preset.massSolar);
          }}
          className={inputSurfaceClass}
        >
          {PRESETS.map((p) => (
            <option key={p.label} value={p.label}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
