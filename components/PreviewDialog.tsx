"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type AnimationMode } from "@/lib/signature/export";
import type { Stroke } from "@/lib/signature/types";

type PreviewDialogProps = {
  strokes: Stroke[];
  animationMode: AnimationMode;
  disabled?: boolean;
};

// We render the preview by injecting the generated SVG markup into a sandboxed
// iframe so motion/react animations run correctly without eval.
// Simpler approach: since we already have the strokes, render a live
// AnimatedSignature component inline.

import { strokesToPaths, getBounds } from "@/lib/signature/export";
import { motion } from "motion/react";

const STROKE_COLOR = "#F7F5F3";
const BASE_STROKE_COLOR = "#6E665F";
const BASE_STROKE_OPACITY = 0.45;
const STROKE_WIDTH = 1.6;
const DURATION = 2.6;
const EASING = "easeOut";

function buildStrokeTiming(count: number, strokes: Stroke[], totalDuration: number): Array<{ duration: number; delay: number }> {
  const lengths = strokes.map((s) => Math.max(s.points.length - 1, 1));
  const totalLength = lengths.reduce((a, b) => a + b, 0);
  const durations = lengths.map((len) => (len / totalLength) * totalDuration);
  const delays = durations.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + durations[i - 1]);
    return acc;
  }, []);
  return Array.from({ length: count }, (_, i) => ({
    duration: durations[i] ?? totalDuration / count,
    delay: delays[i] ?? 0,
  }));
}

function LivePreview({ strokes, animationMode, replayKey }: { strokes: Stroke[]; animationMode: AnimationMode; replayKey: number }) {
  const paths = strokesToPaths(strokes);
  const allPoints = strokes.flatMap((s) => s.points);
  const bounds = getBounds(allPoints);

  const viewBox = bounds ? `${bounds.minX.toFixed(2)} ${bounds.minY.toFixed(2)} ${(bounds.maxX - bounds.minX).toFixed(2)} ${(bounds.maxY - bounds.minY).toFixed(2)}` : "0 0 300 120";

  const timing = buildStrokeTiming(paths.length, strokes, DURATION);

  return (
    <motion.svg key={replayKey} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {paths.map((path, i) => {
        const { duration, delay } = timing[i];
        return (
          <g key={i}>
            {animationMode === "fill" && <path d={path} fill="none" stroke={BASE_STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={BASE_STROKE_OPACITY} />}
            <motion.path
              d={path}
              fill="none"
              stroke={STROKE_COLOR}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration, ease: EASING, delay },
                opacity: { duration: 0.01, delay },
              }}
            />
          </g>
        );
      })}
    </motion.svg>
  );
}

export function PreviewDialog({ strokes, animationMode, disabled }: PreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Reset animation each time dialog opens
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setReplayKey((k) => k + 1));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const handleReplay = () => setReplayKey((k) => k + 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled} className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.25)]">
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-w-2xl flex-col gap-4 p-6">
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Preview — {animationMode === "fill" ? "Fill" : "Draw"}</DialogTitle>
          <Button type="button" variant="outline" size="xs" onClick={handleReplay} className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.25)]">
            <RotateCcw className="h-3 w-3" />
            Replay
          </Button>
        </DialogHeader>

        <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-border bg-card/70 p-6 shadow-inner">
          {strokes.length > 0 ? <LivePreview strokes={strokes} animationMode={animationMode} replayKey={replayKey} /> : <p className="text-xs text-muted-foreground">No signature to preview.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
