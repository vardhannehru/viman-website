"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { contact } from "@/lib/site";
import { Button } from "@/components/ui/button";

/** Shown in place of any page that fails while rendering. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      <div className="relative max-w-lg text-center">
        <p className="text-[0.9375rem] font-medium text-mist">Unexpected turbulence</p>

        <h1 className="mt-6 text-heading text-cloud">Something went wrong.</h1>

        <p className="mx-auto mt-6 max-w-md text-lead text-mist">
          This page didn&apos;t load properly. Try again — and if it keeps happening, let us know
          at{" "}
          <a href={`mailto:${contact.email}`} className="text-cloud underline underline-offset-4">
            {contact.email}
          </a>
          .
        </p>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-3.5">
          <Button size="lg" variant="primary" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return to base
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
