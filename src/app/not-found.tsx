import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-60 blur-2xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 rule-x"
      />

      <div className="relative text-center">
        <Pill tone="gold">Off the flight plan</Pill>

        <h1 className="mt-8 text-display text-gradient">404</h1>

        <p className="mx-auto mt-6 max-w-md text-lead text-mist">
          This heading doesn&apos;t appear on any chart we carry. Let&apos;s get you back
          on course.
        </p>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-3.5">
          <Button asChild size="lg" variant="glow">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-x-1" />
              Return to base
            </Link>
          </Button>
          <Button asChild size="lg" variant="glass">
            <Link href="/#roadmap">See the roadmap</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
