import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function GetStartedButton() {
  return (
    <Button
      asChild
      size="lg"
      className="group relative h-12 overflow-hidden rounded-full border border-border/70 bg-card/80 px-7 text-sm font-semibold text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-border hover:bg-card/90 hover:shadow-[0_16px_38px_rgba(0,0,0,0.45)] active:translate-y-0"
    >
      <Link href="/create">
        <span className="relative z-10 flex items-center gap-2 transition-opacity duration-300 group-hover:opacity-0">
          Get Started
          {/* <ChevronRight size={16} strokeWidth={2} aria-hidden="true" /> */}
        </span>
        <span className="absolute inset-y-1.5 right-1.5 z-10 flex w-10 items-center justify-center rounded-full bg-foreground text-background transition-all duration-300 group-hover:w-[calc(100%-0.75rem)] group-hover:rounded-full">
          <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </Button>
  );
}
