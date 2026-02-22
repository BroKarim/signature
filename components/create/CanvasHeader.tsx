"use client";

import type { AnimationMode } from "@/lib/signature/export";

type CanvasHeaderProps = {
  mode: AnimationMode;
  onModeChange: (mode: AnimationMode) => void;
};

export default function CanvasHeader({ mode, onModeChange }: CanvasHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Canvas
      </div>
      <select
        aria-label="Animation mode"
        value={mode}
        onChange={(event) => onModeChange(event.target.value as AnimationMode)}
        className="h-7 rounded-full border border-border bg-card px-3 text-[11px] font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.25)] outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <option value="draw">Draw</option>
        <option value="fill">Fill</option>
      </select>
    </div>
  );
}
