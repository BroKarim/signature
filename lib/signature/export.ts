import type { Point, Stroke } from "@/lib/signature/types";
import { midpoint } from "@/lib/signature/smoothing";

function pointToString(point: { x: number; y: number }): string {
  return `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
}

export function strokeToPath(stroke: Stroke): string {
  const points = stroke.points;
  if (points.length === 0) return "";

  if (points.length === 1) {
    return `M ${pointToString(points[0])}`;
  }

  const first = points[0];
  const second = points[1];
  let d = `M ${pointToString(first)}`;

  const firstMid = midpoint(first, second);
  d += ` L ${pointToString(firstMid)}`;

  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const mid = midpoint(current, next);
    d += ` Q ${pointToString(current)} ${pointToString(mid)}`;
  }

  return d;
}

export function strokesToPaths(strokes: Stroke[]): string[] {
  return strokes.map(strokeToPath).filter((path) => path.length > 0);
}

export type SignatureBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export function getBounds(points: Point[]): SignatureBounds | null {
  if (points.length === 0) return null;
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  return { minX, minY, maxX, maxY };
}

export type MotionExportOptions = {
  componentName?: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  easing?: string;
};

export function generateMotionComponent(
  strokes: Stroke[],
  options: MotionExportOptions = {}
): string {
  const paths = strokesToPaths(strokes);
  const points = strokes.flatMap((stroke) => stroke.points);
  const bounds = getBounds(points);

  const componentName = options.componentName ?? "SignatureMotion";
  const strokeColor = options.strokeColor ?? "#2C2826";
  const strokeWidth = options.strokeWidth ?? 2.2;
  const duration = options.duration ?? 2.6;
  const easing = options.easing ?? "easeOut";

  const viewBox = bounds ? `${bounds.minX.toFixed(2)} ${bounds.minY.toFixed(2)} ${(bounds.maxX - bounds.minX).toFixed(2)} ${(bounds.maxY - bounds.minY).toFixed(2)}` : "0 0 300 120";

  const perStroke = paths.length > 0 ? duration / paths.length : duration;

  const pathLines = paths
    .map((path, index) => {
      const delay = (perStroke * index).toFixed(3);
      const dur = perStroke.toFixed(3);
      return `      <motion.path\n        d=\"${path}\"\n        fill=\"none\"\n        stroke=\"${strokeColor}\"\n        strokeWidth={${strokeWidth}}\n        strokeLinecap=\"round\"\n        strokeLinejoin=\"round\"\n        initial={{ pathLength: 0 }}\n        animate={{ pathLength: 1 }}\n        transition={{ duration: ${dur}, ease: \"${easing}\", delay: ${delay} }}\n      />`;
    })
    .join("\n");

  return ` import { motion } from "motion/react"; export function ${componentName}() { return ( <svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg"> ${pathLines} </svg> ); } `;
}