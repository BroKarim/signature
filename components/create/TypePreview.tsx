"use client";

import { motion } from "motion/react";

import type { AnimationMode } from "@/lib/signature/export";

type TypePreviewProps = {
  paths: string[];
  viewBox: string;
  animationMode: AnimationMode;
  replayKey: number;
};

const FILL_COLOR = "#F7F5F3";
const BASE_FILL_COLOR = "#6E665F";
const BASE_FILL_OPACITY = 0.45;
const DURATION = 4.0;
const EASING = "easeOut";

function parseViewBox(viewBox: string) {
  const [x, y, w, h] = viewBox.split(/\s+/).map((v) => Number.parseFloat(v));
  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
    w: Number.isFinite(w) ? w : 300,
    h: Number.isFinite(h) ? h : 120,
  };
}

export default function TypePreview({ paths, viewBox, animationMode, replayKey }: TypePreviewProps) {
  const { x, y, w, h } = parseViewBox(viewBox);
  const maskId = `type-mask-${replayKey}`;

  return (
    <motion.svg key={replayKey} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <mask id={maskId}>
        <rect x={x} y={y} width={w} height={h} fill="black" />
        <motion.rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="white"
          initial={{ width: 0 }}
          animate={{ width: w }}
          transition={{ duration: DURATION, ease: EASING }}
        />
      </mask>
      {animationMode === "fill" &&
        paths.map((path, i) => (
          <path key={`base-${i}`} d={path} fill={BASE_FILL_COLOR} fillOpacity={BASE_FILL_OPACITY} />
        ))}
      <g mask={`url(#${maskId})`}>
        {paths.map((path, i) => (
          <path key={`fill-${i}`} d={path} fill={FILL_COLOR} />
        ))}
      </g>
    </motion.svg>
  );
}
