"use client";

import { useRef } from "react";

import SignatureCanvas, { type SignatureCanvasHandle } from "@/components/signature/SignatureCanvas";

export default function MainCanvas() {
  const canvasRef = useRef<SignatureCanvasHandle | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(49,45,43,0.65)]">
          Canvas
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => canvasRef.current?.clear()}
            className="rounded-full border border-[rgba(55,50,47,0.18)] bg-white px-3 py-1.5 text-xs font-medium text-[#37322F] shadow-[0px_1px_2px_rgba(55,50,47,0.10)] transition hover:bg-white/90"
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded-full border border-transparent bg-[#37322F] px-3 py-1.5 text-xs font-medium text-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] transition hover:bg-[#2C2826]"
          >
            Replay
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden border-none rounded-2xl p-4 sm:p-8">
        <div className="relative h-full w-full">
          <SignatureCanvas ref={canvasRef} />
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(55,50,47,0.12)] bg-[#FDFCFB] px-4 py-3 text-xs text-[rgba(49,45,43,0.75)] shadow-[0px_2px_8px_rgba(55,50,47,0.08)] sm:hidden">
        Rotate your phone to landscape for more drawing space.
      </div>
    </div>
  );
}
