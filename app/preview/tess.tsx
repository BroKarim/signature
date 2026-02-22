"use client";

import { motion } from "motion/react";

export default function TestFill() {
  return (
    <motion.svg viewBox="97.89 42.72 472.29 182.80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", background: "#1a1a1a" }}>
      <path
        d="M 97.89 57.21 L 102.06 54.26 Q 106.24 51.31 127.83 47.02 Q 149.41 42.72 176.99 43.12 Q 204.57 43.51 280.43 59.18 Q 356.30 74.84 372.03 89.19 Q 387.75 103.53 392.94 119.39 Q 398.13 135.25 403.16 156.01 Q 408.19 176.77 415.16 189.46 Q 422.14 202.15 434.21 209.84 Q 446.27 217.53 459.78 219.72 Q 473.29 221.91 487.95 222.49 Q 502.61 223.07 526.08 224.06 Q 549.55 225.05 556.59 225.29 Q 563.63 225.52 566.56 225.52 Q 569.49 225.52 569.83 225.52"
        fill="none"
        stroke="#6E665F"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.45}
      />
      <motion.path
        d="M 97.89 57.21 L 102.06 54.26 Q 106.24 51.31 127.83 47.02 Q 149.41 42.72 176.99 43.12 Q 204.57 43.51 280.43 59.18 Q 356.30 74.84 372.03 89.19 Q 387.75 103.53 392.94 119.39 Q 398.13 135.25 403.16 156.01 Q 408.19 176.77 415.16 189.46 Q 422.14 202.15 434.21 209.84 Q 446.27 217.53 459.78 219.72 Q 473.29 221.91 487.95 222.49 Q 502.61 223.07 526.08 224.06 Q 549.55 225.05 556.59 225.29 Q 563.63 225.52 566.56 225.52 Q 569.49 225.52 569.83 225.52"
        fill="none"
        stroke="#F7F5F3"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 2.6, ease: "easeOut", delay: 0 },
          opacity: { duration: 0.01, delay: 0 },
        }}
      />
    </motion.svg>
  );
}
