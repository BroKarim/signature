"use client";

import { motion } from "motion/react";

import type { AnimationMode } from "@/lib/signature/export";

type TypePreviewProps = {
  paths: string[];
  viewBox: string;
  animationMode: AnimationMode;
  replayKey: number;
};

const STROKE_COLOR = "#F7F5F3";
const BASE_STROKE_COLOR = "#6E665F";
const BASE_STROKE_OPACITY = 0.45;
const STROKE_WIDTH = 1.6;
const DURATION = 2.6;
const EASING = "easeOut";

function buildPathTiming(count: number, totalDuration: number) {
  if (count === 0) return [];
  const per = totalDuration / count;
  return Array.from({ length: count }, (_, i) => ({
    duration: per,
    delay: per * i,
  }));
}

export default function TypePreview({ paths, viewBox, animationMode, replayKey }: TypePreviewProps) {
  const timing = buildPathTiming(paths.length, DURATION);

  return (
    <motion.svg key={replayKey} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {paths.map((path, i) => {
        const { duration, delay } = timing[i] ?? { duration: DURATION, delay: 0 };
        return (
          <g key={i}>
            {animationMode === "fill" && (
              <path
                d={path}
                fill="none"
                stroke={BASE_STROKE_COLOR}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={BASE_STROKE_OPACITY}
              />
            )}
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
