import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Head back to the VIMAN checklist.",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      <div className="relative text-center">
        <Pill tone="neutral">Off the flight plan</Pill>

        <h1 className="mt-8 text-title text-cloud">404</h1>

        <p className="mx-auto mt-6 max-w-md text-lead text-mist">
          This heading doesn&apos;t appear on any chart we carry.
        </p>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-3.5">
          <Button asChild size="lg" variant="primary">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-x-1" />
              Return to base
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#roadmap">See the checklist</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
