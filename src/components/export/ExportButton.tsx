"use client";

import { ExportInput, downloadExport } from "@/lib/export";

interface ExportButtonProps {
  input: ExportInput;
  filenameSuffix: string;
}

export function ExportButton({ input, filenameSuffix }: ExportButtonProps) {
  return (
    <button
      onClick={() => downloadExport(input, filenameSuffix)}
      className="rounded-lg border border-surface-border bg-surface px-3.5 py-1.5 text-caption uppercase tracking-widest text-muted hover:text-accent-cyan hover:border-[color-mix(in_oklch,var(--accent-cyan)_40%,transparent)] transition-colors"
    >
      ⬇ Export
    </button>
  );
}
