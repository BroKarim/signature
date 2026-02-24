// source : https://v0.app/chat/brillance-saa-s-landing-page-MnU0SoHnZec

import type { Metadata } from "next";
import { SignatureMotion } from "@/components/mysignature";

export const metadata: Metadata = {
  title: "Signature Motion Builder",
  description: "Craft animated signatures from canvas strokes or typed fonts, ready to export as React motion components.",
};
import { GetStartedButton } from "@/components/get-started";
export default function LandingPage() {
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden flex flex-col justify-start items-center bg-background text-foreground">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          <div className="self-stretch pt-[9px] overflow-hidden border-b border-border/40 flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="relative w-full max-w-[600px] px-4 py-6 sm:px-6 sm:py-8">
                    <SignatureMotion />
                    <span className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l border-white border-t border-border/70" />
                    <span className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r border-white border-t border-border/70" />
                    <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-white border-l border-border/70" />
                    <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-white border-r border-border/70" />
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[520px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    A calm signature studio to sketch, animate, and export your mark in seconds.
                  </div>
                  <GetStartedButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FeatureCard component definition inline to fix import error
