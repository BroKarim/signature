"use client";

import type React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import type { Point, Stroke } from "@/lib/signature/types";
import { midpoint } from "@/lib/signature/smoothing";
import { withVelocity } from "@/lib/signature/velocity";

const LINE_COLOR = "#2C2826";
const GHOST_COLOR = "#1C1A19";
const MIN_WIDTH = 1.2;
const MAX_WIDTH = 3.6;
const VELOCITY_MAX = 2.5;
const MIN_DISTANCE = 0.35;

function toLocalPoint(
  event: React.PointerEvent<HTMLCanvasElement>,
  rect: DOMRect,
  previous?: Point
): Point {
  const rawPoint = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    t: performance.now(),
  };

  return withVelocity(rawPoint, previous).point;
}

type SignatureCanvasProps = {
  ghostEnabled?: boolean;
  onStrokeEnd?: (strokes: Stroke[]) => void;
};

export type SignatureCanvasHandle = {
  clear: () => void;
  replay: () => void;
};

const SignatureCanvas = forwardRef<SignatureCanvasHandle, SignatureCanvasProps>(
  ({ ghostEnabled = false, onStrokeEnd }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDrawingRef = useRef(false);
    const isReplayingRef = useRef(false);
    const replayTokenRef = useRef(0);
    const strokesRef = useRef<Stroke[]>([]);
    const currentStrokeRef = useRef<Stroke | null>(null);
    const lastMidpointRef = useRef<{ x: number; y: number } | null>(null);

    const cancelReplay = () => {
      replayTokenRef.current += 1;
      isReplayingRef.current = false;
    };

    const cloneStrokes = () =>
      strokesRef.current.map((stroke) => ({
        points: stroke.points.map((point) => ({ ...point })),
      }));

    const drawSegment = (
      ctx: CanvasRenderingContext2D,
      lastPoint: Point,
      point: Point,
      lastMidpoint: { x: number; y: number } | null
    ) => {
      const mid = midpoint(lastPoint, point);
      const velocityFactor = Math.min(point.v / VELOCITY_MAX, 1);
      const width = MAX_WIDTH - (MAX_WIDTH - MIN_WIDTH) * velocityFactor;

      const drawCurve = (offsetX = 0, offsetY = 0) => {
        ctx.beginPath();
        if (lastMidpoint) {
          ctx.moveTo(lastMidpoint.x + offsetX, lastMidpoint.y + offsetY);
          ctx.quadraticCurveTo(
            lastPoint.x + offsetX,
            lastPoint.y + offsetY,
            mid.x + offsetX,
            mid.y + offsetY
          );
        } else {
          ctx.moveTo(lastPoint.x + offsetX, lastPoint.y + offsetY);
          ctx.lineTo(mid.x + offsetX, mid.y + offsetY);
        }
        ctx.stroke();
      };

      if (ghostEnabled) {
        ctx.save();
        ctx.strokeStyle = GHOST_COLOR;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = width + 1.6;
        drawCurve(0.6, 0.8);
        ctx.restore();
      }

      ctx.strokeStyle = LINE_COLOR;
      ctx.globalAlpha = 1;
      ctx.lineWidth = width;
      drawCurve();

      return mid;
    };

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          strokesRef.current = [];
          currentStrokeRef.current = null;
          lastMidpointRef.current = null;
          cancelReplay();
        },
        replay: () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const strokes = strokesRef.current
            .map((stroke) => ({
              points: stroke.points.slice(),
            }))
            .sort((a, b) => {
              const at = a.points[0]?.t ?? 0;
              const bt = b.points[0]?.t ?? 0;
              return at - bt;
            });

          if (strokes.length === 0) return;

          cancelReplay();
          isReplayingRef.current = true;
          const token = replayTokenRef.current;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const playStroke = (stroke: Stroke) =>
            new Promise<void>((resolve) => {
              if (stroke.points.length < 2) {
                resolve();
                return;
              }

              const points = stroke.points;
              const baseTime = points[0].t;
              const times = points.map((point) => point.t - baseTime);
              const startTime = performance.now();
              let index = 1;
              let lastMidpoint: { x: number; y: number } | null = null;

              const step = () => {
                if (token !== replayTokenRef.current) {
                  resolve();
                  return;
                }

                const elapsed = performance.now() - startTime;

                while (index < points.length && times[index] <= elapsed) {
                  const lastPoint = points[index - 1];
                  const point = points[index];
                  lastMidpoint = drawSegment(ctx, lastPoint, point, lastMidpoint);
                  index += 1;
                }

                if (index >= points.length) {
                  resolve();
                  return;
                }

                requestAnimationFrame(step);
              };

              requestAnimationFrame(step);
            });

          (async () => {
            for (const stroke of strokes) {
              if (token !== replayTokenRef.current) return;
              await playStroke(stroke);
            }
            isReplayingRef.current = false;
          })();
        },
      }),
      []
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 2;
      };

      resize();

      const observer = new ResizeObserver(() => resize());
      observer.observe(container);

      return () => observer.disconnect();
    }, []);

    const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.setPointerCapture(event.pointerId);
      cancelReplay();
      isDrawingRef.current = true;
      lastMidpointRef.current = null;

      const rect = canvas.getBoundingClientRect();
      const point = toLocalPoint(event, rect);

      const stroke: Stroke = { points: [point] };
      currentStrokeRef.current = stroke;
      strokesRef.current.push(stroke);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current;
      const stroke = currentStrokeRef.current;
      if (!canvas || !stroke) return;

      const rect = canvas.getBoundingClientRect();
      const previous = stroke.points[stroke.points.length - 1];
      const point = toLocalPoint(event, rect, previous);
      if (previous) {
        const dx = point.x - previous.x;
        const dy = point.y - previous.y;
        if (Math.hypot(dx, dy) < MIN_DISTANCE) return;
      }
      stroke.points.push(point);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const lastPoint = stroke.points[stroke.points.length - 2];
      if (!lastPoint) return;
      lastMidpointRef.current = drawSegment(ctx, lastPoint, point, lastMidpointRef.current);
    };

    const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      isDrawingRef.current = false;
      currentStrokeRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
      if (onStrokeEnd) {
        onStrokeEnd(cloneStrokes());
      }
    };

    return (
      <div ref={containerRef} className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
      </div>
    );
  }
);

SignatureCanvas.displayName = "SignatureCanvas";

export default SignatureCanvas;
