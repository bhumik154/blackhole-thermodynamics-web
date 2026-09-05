"use client";

import { ExportInput, downloadExport } from "@/lib/export";
import { Surface } from "@/components/shared/Surface";

interface ExportButtonProps {
  input: ExportInput;
  filenameSuffix: string;
}

export function ExportButton({ input, filenameSuffix }: ExportButtonProps) {
  return (
    <Surface
      as="button"
      padding="sm"
      rounded="lg"
      interactive
      onClick={() => downloadExport(input, filenameSuffix)}
      className="text-caption uppercase tracking-widest text-muted hover:text-accent-cyan"
    >
      ⬇ Export
    </Surface>
  );
}
