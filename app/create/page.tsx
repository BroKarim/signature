"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import CanvasHeader, { type InputMode } from "@/components/create/CanvasHeader";
import TypePreview from "@/components/create/TypePreview";
import { Button } from "@/components/ui/button";
import SignatureCanvas, { type SignatureCanvasHandle } from "@/components/signature/SignatureCanvas";
import CodePreview from "@/components/CodePreview";
import { PreviewDialog } from "@/components/PreviewDialog";
import { generateMotionComponent, generateMotionComponentFromPaths, type AnimationMode } from "@/lib/signature/export";
import { convertTextToSignature } from "@/lib/signature/font";
import type { Stroke } from "@/lib/signature/types";

export default function CreatePage() {
  const [animationMode, setAnimationMode] = useState<AnimationMode>("draw");
  const [inputMode, setInputMode] = useState<InputMode>("canvas");
  const canvasRef = useRef<SignatureCanvasHandle | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [typedText, setTypedText] = useState("Brittany");
  const [fontName, setFontName] = useState("BrittanySignature");
  const [typePaths, setTypePaths] = useState<string[]>([]);
  const [typeViewBox, setTypeViewBox] = useState("0 0 300 120");
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeReplayKey, setTypeReplayKey] = useState(0);

  const codeOutput = useMemo(() => {
    const baseOptions = {
      componentName: "SignatureMotion",
      strokeColor: "#F7F5F3",
      baseStrokeColor: "#6E665F",
      baseStrokeOpacity: 0.45,
      strokeWidth: 1.6,
      duration: 2.6,
      easing: "easeOut",
      animationMode,
    };

    if (inputMode === "type") {
      if (typePaths.length === 0) return "";
      return generateMotionComponentFromPaths(typePaths, typeViewBox, baseOptions);
    }

    if (strokes.length === 0) return "";
    return generateMotionComponent(strokes, baseOptions);
  }, [strokes, animationMode, inputMode, typePaths, typeViewBox]);

  const handleStrokeEnd = (strokes: Stroke[]) => {
    setStrokes(strokes);
  };

  const handleClear = () => {
    if (inputMode === "type") {
      setTypedText("");
      setTypePaths([]);
      return;
    }
    canvasRef.current?.clear();
    setStrokes([]);
  };

  useEffect(() => {
    if (inputMode !== "type") return;
    let active = true;
    setTypeLoading(true);
    convertTextToSignature(typedText, fontName, { split: "glyph" })
      .then((result) => {
        if (!active) return;
        setTypePaths(result.paths);
        setTypeViewBox(result.viewBox);
      })
      .catch(() => {
        if (!active) return;
        setTypePaths([]);
        setTypeViewBox("0 0 300 120");
      })
      .finally(() => {
        if (active) setTypeLoading(false);
      });

    return () => {
      active = false;
    };
  }, [typedText, fontName, inputMode]);

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

        {/* Canvas / Type section */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <CanvasHeader
              inputMode={inputMode}
              onInputModeChange={setInputMode}
              mode={animationMode}
              onModeChange={setAnimationMode}
            />
            <div className="flex items-center gap-2">
              {inputMode === "type" && (
                <>
                  <select
                    aria-label="Signature font"
                    value={fontName}
                    onChange={(event) => setFontName(event.target.value)}
                    className="h-7 rounded-full border border-border bg-card px-3 text-[11px] font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.25)] outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="BrittanySignature">Brittany Signature</option>
                    <option value="AmsterdamSignature">Amsterdam Signature</option>
                  </select>
                  <input
                    type="text"
                    value={typedText}
                    onChange={(event) => setTypedText(event.target.value)}
                    placeholder="Type your signature"
                    className="h-7 min-w-[220px] rounded-full border border-border bg-card px-3 text-[11px] font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.25)] outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                </>
              )}
              <Button type="button" onClick={handleClear} variant="outline" size="xs" className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.25)]">
                Clear
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (inputMode === "type") {
                    setTypeReplayKey((prev) => prev + 1);
                  } else {
                    canvasRef.current?.replay();
                  }
                }}
                size="xs"
                className="rounded-full px-3 text-xs shadow-[0px_1px_2px_rgba(0,0,0,0.35)]"
              >
                Replay
              </Button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/70 shadow-[0px_6px_22px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-video w-full min-h-[320px] sm:aspect-[21/9] sm:min-h-[360px]">
              {inputMode === "type" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {typeLoading ? (
                    <div className="text-xs text-muted-foreground">Loading font...</div>
                  ) : typePaths.length > 0 ? (
                    <TypePreview
                      paths={typePaths}
                      viewBox={typeViewBox}
                      animationMode={animationMode}
                      replayKey={typeReplayKey}
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground">Type a name to preview.</div>
                  )}
                </div>
              ) : (
                <SignatureCanvas ref={canvasRef} animationMode={animationMode} onStrokeEnd={handleStrokeEnd} />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground shadow-[0px_2px_8px_rgba(0,0,0,0.25)] sm:hidden">Rotate your phone to landscape for more drawing space.</div>
        </div>

        {/* Export section */}
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-[0px_6px_22px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Export (TSX)</div>
            <div className="flex items-center gap-2">
              <PreviewDialog
                strokes={inputMode === "canvas" ? strokes : undefined}
                paths={inputMode === "type" ? typePaths : undefined}
                viewBox={inputMode === "type" ? typeViewBox : undefined}
                animationMode={animationMode}
                disabled={!codeOutput}
              />
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
