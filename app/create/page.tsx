"use client";

import { useRef, useState } from "react";

import SignatureCanvas, { type SignatureCanvasHandle } from "@/components/signature/SignatureCanvas";

export default function CreatePage() {
  const [ghostEnabled, setGhostEnabled] = useState(true);
  const canvasRef = useRef<SignatureCanvasHandle | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#F7F5F3] text-[#2F3037]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 sm:px-6 md:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Create Signature</h1>
          <p className="text-sm text-[rgba(49,45,43,0.70)]">
            Draw on the canvas below to generate a clean animated signature component.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(49,45,43,0.65)]">
              Canvas
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGhostEnabled((prev) => !prev)}
                className="rounded-full border border-[rgba(55,50,47,0.18)] bg-white px-3 py-1.5 text-xs font-medium text-[#37322F] shadow-[0px_1px_2px_rgba(55,50,47,0.10)] transition hover:bg-white/90"
              >
                Ghost {ghostEnabled ? "On" : "Off"}
              </button>
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

          <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(55,50,47,0.12)] bg-white/70 shadow-[0px_6px_22px_rgba(55,50,47,0.10)]">
            <div className="relative aspect-[16/9] w-full min-h-[320px] sm:aspect-[21/9] sm:min-h-[360px]">
              <SignatureCanvas ref={canvasRef} ghostEnabled={ghostEnabled} />
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(55,50,47,0.12)] bg-[#FDFCFB] px-4 py-3 text-xs text-[rgba(49,45,43,0.75)] shadow-[0px_2px_8px_rgba(55,50,47,0.08)] sm:hidden">
            Rotate your phone to landscape for more drawing space.
          </div>
        </div>
      </div>
    </div>
  );
}
