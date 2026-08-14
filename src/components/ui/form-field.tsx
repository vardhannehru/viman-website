"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/* -------------------------------------------------------------------------- */

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="mono-label text-mist-deep">
          {label}
        </label>
        {hint && !error && <span className="text-[0.75rem] text-mist-deep">{hint}</span>}
      </div>
      <div className="mt-3">{children}</div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex items-center gap-1.5 pt-2 text-[0.8125rem] text-[#ff8a94]"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const controlClasses = [
  "w-full rounded-2xl border border-cloud/10 bg-cloud/[0.03] px-5 py-4",
  "text-[0.9375rem] text-cloud placeholder:text-mist-deep",
  "backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:border-cloud/20",
  "focus:border-cyan/50 focus:bg-cyan/[0.04] focus:outline-none",
  "focus:shadow-[0_0_0_4px_rgba(34,224,255,0.10)]",
  "aria-[invalid=true]:border-[#ff8a94]/45 aria-[invalid=true]:bg-[#ff8a94]/[0.04]",
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlClasses, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(controlClasses, "min-h-36 resize-none", className)} {...props} />
));
Textarea.displayName = "Textarea";

/* -------------------------------------------------------------------------- */

/** Radio group rendered as selectable chips — faster to answer than a select. */
export function ChipGroup({
  options,
  value,
  onChange,
  name,
  label,
  error,
}: {
  options: readonly { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  label: string;
  error?: string;
}) {
  return (
    <Field label={label} htmlFor={name} error={error}>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative rounded-full border px-5 py-3 text-[0.875rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                selected
                  ? "border-cyan/45 bg-cyan/[0.09] text-cloud shadow-[0_0_28px_-8px_rgba(34,224,255,0.6)]"
                  : "border-cloud/10 bg-cloud/[0.02] text-mist hover:border-cloud/25 hover:text-cloud",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

/* -------------------------------------------------------------------------- */

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { children: React.ReactNode }
>(({ className, children, id, ...props }, ref) => (
  <label
    htmlFor={id}
    className={cn(
      "group flex cursor-pointer items-start gap-3 text-[0.875rem] leading-relaxed text-mist",
      className,
    )}
  >
    <span className="relative mt-0.5 flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-md border border-cloud/20 transition-all duration-400 group-hover:border-cyan/50 has-[:checked]:border-cyan has-[:checked]:bg-cyan">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="peer absolute inset-0 cursor-pointer opacity-0"
        {...props}
      />
      <svg
        viewBox="0 0 12 10"
        className="h-2.5 w-2.5 scale-0 text-void transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:scale-100"
        fill="none"
        aria-hidden
      >
        <path d="M1 5.2L4.2 8.4L11 1.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span>{children}</span>
  </label>
));
Checkbox.displayName = "Checkbox";
