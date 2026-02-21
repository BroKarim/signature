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
};

export type SignatureCanvasHandle = {
  clear: () => void;
};

const SignatureCanvas = forwardRef<SignatureCanvasHandle, SignatureCanvasProps>(
  ({ ghostEnabled = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDrawingRef = useRef(false);
    const strokesRef = useRef<Stroke[]>([]);
    const currentStrokeRef = useRef<Stroke | null>(null);
    const lastMidpointRef = useRef<{ x: number; y: number } | null>(null);

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
      const mid = midpoint(lastPoint, point);
      const velocityFactor = Math.min(point.v / VELOCITY_MAX, 1);
      const width = MAX_WIDTH - (MAX_WIDTH - MIN_WIDTH) * velocityFactor;

      const drawSegment = (offsetX = 0, offsetY = 0) => {
        ctx.beginPath();
        if (lastMidpointRef.current) {
          ctx.moveTo(lastMidpointRef.current.x + offsetX, lastMidpointRef.current.y + offsetY);
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
        drawSegment(0.6, 0.8);
        ctx.restore();
      }

      ctx.strokeStyle = LINE_COLOR;
      ctx.globalAlpha = 1;
      ctx.lineWidth = width;
      drawSegment();
      lastMidpointRef.current = mid;
    };

    const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      isDrawingRef.current = false;
      currentStrokeRef.current = null;
      canvas.releasePointerCapture(event.pointerId);
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
