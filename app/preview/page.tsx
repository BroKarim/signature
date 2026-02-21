"use client";

import { SignatureMotion } from "./signature";

export default function PreviewPage() {
  return (
    <main className="min-h-screen w-full bg-[#f7f3ee] text-[#2c2826]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 py-16">
        <header className="w-full text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Signature Preview</h1>
          <p className="mt-2 text-sm text-[#5a514b]">
            Render hasil export signature.tsx untuk pengecekan animasi.
          </p>
        </header>

        <div className="w-full rounded-3xl border border-[#e6ddd2] bg-white/80 p-8 shadow-sm">
          <div className="mx-auto w-full max-w-3xl">
            <SignatureMotion />
          </div>
        </div>
      </div>
    </main>
  );
}
