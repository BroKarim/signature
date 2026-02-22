import type { Point, Stroke } from "@/lib/signature/types";
import { midpoint } from "@/lib/signature/smoothing";

// ─── Path Helpers ────────────────────────────────────────────────────────────

function pointToString(point: { x: number; y: number }): string {
  return `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
}

export function strokeToPath(stroke: Stroke): string {
  const { points } = stroke;
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${pointToString(points[0])}`;

  const [first, second] = points;
  const firstMid = midpoint(first, second);
  let d = `M ${pointToString(first)} L ${pointToString(firstMid)}`;

  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const mid = midpoint(current, next);
    d += ` Q ${pointToString(current)} ${pointToString(mid)}`;
  }

  return d;
}

export function strokesToPaths(strokes: Stroke[]): string[] {
  return strokes.map(strokeToPath).filter((p) => p.length > 0);
}

// ─── Bounds ──────────────────────────────────────────────────────────────────

export type SignatureBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export function getBounds(points: Point[]): SignatureBounds | null {
  if (points.length === 0) return null;
  let minX = points[0].x,
    maxX = points[0].x;
  let minY = points[0].y,
    maxY = points[0].y;
  for (const { x, y } of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type AnimationMode = "draw" | "fill";

export type MotionExportOptions = {
  componentName?: string;
  strokeColor?: string;
  baseStrokeColor?: string;
  baseStrokeOpacity?: number;
  strokeWidth?: number;
  duration?: number;
  easing?: string;
  animationMode?: AnimationMode;
};

// ─── Per-stroke timing (cumulative delays) ───────────────────────────────────
//
// Each stroke gets a duration proportional to its point count (longer strokes
// take more time). Delays are cumulative so strokes animate sequentially,
// exactly like the reference implementation.

function buildStrokeTiming(paths: string[], strokes: Stroke[], totalDuration: number): Array<{ duration: number; delay: number }> {
  const lengths = strokes.map((s) => Math.max(s.points.length - 1, 1));
  const totalLength = lengths.reduce((a, b) => a + b, 0);

  const durations = lengths.map((len) => (len / totalLength) * totalDuration);

  const delays = durations.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + durations[i - 1]);
    return acc;
  }, []);

  return paths.map((_, i) => ({
    duration: durations[i] ?? totalDuration / paths.length,
    delay: delays[i] ?? 0,
  }));
}

// ─── Code Generators ─────────────────────────────────────────────────────────

function generateDrawMode(paths: string[], timing: Array<{ duration: number; delay: number }>, opts: Required<MotionExportOptions>, viewBox: string): string {
  const pathLines = paths
    .map((path, i) => {
      const { duration, delay } = timing[i];
      return [
        `      <motion.path`,
        `        d="${path}"`,
        `        fill="none"`,
        `        stroke="${opts.strokeColor}"`,
        `        strokeWidth={${opts.strokeWidth}}`,
        `        strokeLinecap="round"`,
        `        strokeLinejoin="round"`,
        `        initial={{ pathLength: 0, opacity: 0 }}`,
        `        animate={{ pathLength: 1, opacity: 1 }}`,
        `        transition={{`,
        `          pathLength: { duration: ${duration.toFixed(3)}, ease: "${opts.easing}", delay: ${delay.toFixed(3)} },`,
        `          opacity: { duration: 0.01, delay: ${delay.toFixed(3)} },`,
        `        }}`,
        `      />`,
      ].join("\n");
    })
    .join("\n");

  return [
    `import { motion } from "motion/react";`,
    ``,
    `export function ${opts.componentName}() {`,
    `  return (`,
    `    <motion.svg`,
    `      viewBox="${viewBox}"`,
    `      fill="none"`,
    `      xmlns="http://www.w3.org/2000/svg"`,
    `    >`,
    pathLines,
    `    </motion.svg>`,
    `  );`,
    `}`,
    ``,
  ].join("\n");
}

function generateFillMode(paths: string[], timing: Array<{ duration: number; delay: number }>, opts: Required<MotionExportOptions>, viewBox: string): string {
  // Fill mode: ghost/indent base layer (plain <path>) rendered first,
  // then motion.path on top animates pathLength 0 → 1 sequentially.
  const pathLines = paths
    .map((path, i) => {
      const { duration, delay } = timing[i];
      return [
        `      {/* stroke ${i + 1} — base (ink indent) */}`,
        `      <path`,
        `        d="${path}"`,
        `        fill="none"`,
        `        stroke="${opts.baseStrokeColor}"`,
        `        strokeWidth={${opts.strokeWidth}}`,
        `        strokeLinecap="round"`,
        `        strokeLinejoin="round"`,
        `        strokeOpacity={${opts.baseStrokeOpacity}}`,
        `      />`,
        `      {/* stroke ${i + 1} — animated fill */}`,
        `      <motion.path`,
        `        d="${path}"`,
        `        fill="none"`,
        `        stroke="${opts.strokeColor}"`,
        `        strokeWidth={${opts.strokeWidth}}`,
        `        strokeLinecap="round"`,
        `        strokeLinejoin="round"`,
        `        initial={{ pathLength: 0, opacity: 0 }}`,
        `        animate={{ pathLength: 1, opacity: 1 }}`,
        `        transition={{`,
        `          pathLength: { duration: ${duration.toFixed(3)}, ease: "${opts.easing}", delay: ${delay.toFixed(3)} },`,
        `          opacity: { duration: 0.01, delay: ${delay.toFixed(3)} },`,
        `        }}`,
        `      />`,
      ].join("\n");
    })
    .join("\n");

  return [
    `import { motion } from "motion/react";`,
    ``,
    `export function ${opts.componentName}() {`,
    `  return (`,
    `    <motion.svg`,
    `      viewBox="${viewBox}"`,
    `      fill="none"`,
    `      xmlns="http://www.w3.org/2000/svg"`,
    `    >`,
    pathLines,
    `    </motion.svg>`,
    `  );`,
    `}`,
    ``,
  ].join("\n");
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function generateMotionComponent(strokes: Stroke[], options: MotionExportOptions = {}): string {
  const paths = strokesToPaths(strokes);
  const allPoints = strokes.flatMap((s) => s.points);
  const bounds = getBounds(allPoints);

  const opts: Required<MotionExportOptions> = {
    componentName: options.componentName ?? "SignatureMotion",
    strokeColor: options.strokeColor ?? "#2C2826",
    baseStrokeColor: options.baseStrokeColor ?? "#6E665F",
    baseStrokeOpacity: options.baseStrokeOpacity ?? 0.45,
    strokeWidth: options.strokeWidth ?? 2.2,
    duration: options.duration ?? 2.6,
    easing: options.easing ?? "easeOut",
    animationMode: options.animationMode ?? "draw",
  };

  const viewBox = bounds ? `${bounds.minX.toFixed(2)} ${bounds.minY.toFixed(2)} ${(bounds.maxX - bounds.minX).toFixed(2)} ${(bounds.maxY - bounds.minY).toFixed(2)}` : "0 0 300 120";

  if (paths.length === 0) return "";

  const timing = buildStrokeTiming(paths, strokes, opts.duration);

  return opts.animationMode === "fill" ? generateFillMode(paths, timing, opts, viewBox) : generateDrawMode(paths, timing, opts, viewBox);
}
