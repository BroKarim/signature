import type { Point } from "@/lib/signature/types";

type RawPoint = Omit<Point, "v">;

type VelocityResult = {
  point: Point;
  velocity: number;
};

export function withVelocity(point: RawPoint, previous?: Point): VelocityResult {
  if (!previous) {
    return {
      point: { ...point, v: 0 },
      velocity: 0,
    };
  }

  const dx = point.x - previous.x;
  const dy = point.y - previous.y;
  const dt = Math.max(point.t - previous.t, 1);
  const velocity = Math.hypot(dx, dy) / dt;

  return {
    point: { ...point, v: velocity },
    velocity,
  };
}
