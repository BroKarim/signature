import type { Point } from "@/lib/signature/types";

type MidPoint = {
  x: number;
  y: number;
};

export function midpoint(a: Point, b: Point): MidPoint {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}
