import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function GetStartedButton() {
  return (
    <Button
      asChild
      size="lg"
      className="group relative h-11 overflow-hidden rounded-full border border-border/70 bg-card/80 px-6 pr-[3.25rem] text-sm font-semibold text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:border-border hover:bg-card/90 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] active:translate-y-0"
    >
      <Link href="/create">
        <span className="relative z-10 transition-opacity duration-200 group-hover:opacity-0">Get Started</span>

        <span className="absolute inset-y-1.5 right-1.5 z-10 flex w-8 items-center justify-center rounded-full bg-foreground text-background transition-all duration-300 group-hover:w-[calc(100%-0.75rem)]">
          <ChevronRight size={15} strokeWidth={2.5} aria-hidden="true" />
        </span>

        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </Button>
  );
}
