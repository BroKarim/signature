"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import CanvasHeader from "@/components/create/CanvasHeader";
import { Button } from "@/components/ui/button";
import SignatureCanvas, { type SignatureCanvasHandle } from "@/components/signature/SignatureCanvas";
import CodePreview from "@/components/CodePreview";
import { PreviewDialog } from "@/components/PreviewDialog";
import { generateMotionComponent, type AnimationMode } from "@/lib/signature/export";
import type { Stroke } from "@/lib/signature/types";

export default function CreatePage() {
  const [animationMode, setAnimationMode] = useState<AnimationMode>("draw");
  const canvasRef = useRef<SignatureCanvasHandle | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  const codeOutput = useMemo(() => {
    if (strokes.length === 0) return "";
    return generateMotionComponent(strokes, {
      componentName: "SignatureMotion",
      strokeColor: "#F7F5F3",
      baseStrokeColor: "#6E665F",
      baseStrokeOpacity: 0.45,
      strokeWidth: 1.6,
      duration: 2.6,
      easing: "easeOut",
      animationMode,
    });
  }, [strokes, animationMode]);

  const handleStrokeEnd = (strokes: Stroke[]) => {
    setStrokes(strokes);
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setStrokes([]);
  };

  const handleCopy = async () => {
    if (!codeOutput) return;
    try {
      await navigator.clipboard.writeText(codeOutput);
      setCopied(true);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 sm:px-6 md:px-40">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Create Signature</h1>
          <p className="text-sm text-muted-foreground">Draw on the canvas below to generate a clean animated signature component.</p>
        </div>

        {/* Canvas section */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <CanvasHeader mode={animationMode} onModeChange={setAnimationMode} />
            <div className="flex items-center gap-2">
              <Button type="button" onClick={handleClear} variant="outline" size="xs" className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.25)]">
                Clear
              </Button>
              <Button type="button" onClick={() => canvasRef.current?.replay()} size="xs" className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.35)]">
                Replay
              </Button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/70 shadow-[0px_6px_22px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-video w-full min-h-[320px] sm:aspect-[21/9] sm:min-h-[360px]">
              <SignatureCanvas ref={canvasRef} animationMode={animationMode} onStrokeEnd={handleStrokeEnd} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground shadow-[0px_2px_8px_rgba(0,0,0,0.25)] sm:hidden">Rotate your phone to landscape for more drawing space.</div>
        </div>

        {/* Export section */}
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-[0px_6px_22px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Export (TSX)</div>
            <div className="flex items-center gap-2">
              <PreviewDialog strokes={strokes} animationMode={animationMode} disabled={!codeOutput} />
              <Button type="button" onClick={handleCopy} variant="outline" size="xs" disabled={!codeOutput} className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.25)]">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>
          <CodePreview code={codeOutput} placeholder="// Draw a signature to generate code." />
        </div>
      </div>
    </div>
  );
}
