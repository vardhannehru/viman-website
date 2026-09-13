"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { setStepCompleted, useCompletedSteps } from "@/lib/progress";

type NextStep = { label: string; href: string };

export function StepComplete({
  stepId,
  stepIndex,
  prompt,
  next,
}: {
  stepId: string;
  stepIndex: string;
  prompt: string;
  next: NextStep;
}) {
  const router = useRouter();
  const done = useCompletedSteps().includes(stepId);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onChange = (checked: boolean) => {
    setStepCompleted(stepId, checked);
    window.clearTimeout(timer.current);
    setLeaving(checked);
    if (checked) timer.current = window.setTimeout(() => router.push(next.href), 1400);
  };

  return (
    <section
      className={cn(
        "mt-16 rounded-3xl border p-6 transition-colors duration-500 md:p-8",
        done ? "border-cyan/40 bg-cyan/[0.06]" : "border-cloud/10 bg-cloud/[0.02]",
      )}
    >
      <label className="flex cursor-pointer items-start gap-4">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-void",
            done ? "border-cyan bg-cyan text-void" : "border-cloud/30 bg-transparent",
          )}
        >
          {done && <Check className="h-4 w-4" strokeWidth={2.5} />}
        </span>
        <span>
          <span className="block text-[1.0625rem] font-medium text-cloud">
            Did you complete this step?
          </span>
          <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-cloud-dim">
            {prompt}
          </span>
        </span>
      </label>

      <div aria-live="polite" className="pl-10">
        {done && (
          <div className="mt-5 flex flex-col gap-3 text-[0.9375rem] leading-relaxed">
            <p className="text-cyan">
              {leaving
                ? `Congratulations! Step ${stepIndex} completed — taking you to ${next.label}…`
                : `Step ${stepIndex} is marked complete.`}
            </p>
            <Link
              href={next.href}
              className="group inline-flex items-center gap-2 font-medium text-cloud"
            >
              {next.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
