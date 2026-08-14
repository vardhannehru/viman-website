"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "whitespace-nowrap rounded-full font-medium tracking-[-0.01em]",
    "transition-[transform,box-shadow,background-color,color,border-color] duration-500",
    "ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.975]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-cloud text-void",
          "shadow-[0_10px_40px_-12px_rgba(244,248,255,0.45)]",
          "hover:shadow-[0_18px_60px_-14px_rgba(34,224,255,0.55)]",
        ],
        glow: [
          "text-void",
          "bg-[linear-gradient(100deg,var(--color-cyan),var(--color-sky))]",
          "shadow-[0_10px_44px_-12px_rgba(34,224,255,0.65)]",
          "hover:shadow-[0_20px_70px_-14px_rgba(34,224,255,0.9)]",
        ],
        glass: [
          "glass text-cloud",
          "hover:border-cyan/35 hover:bg-cloud/[0.09]",
          "hover:shadow-[0_18px_60px_-24px_rgba(34,224,255,0.5)]",
        ],
        gold: [
          "text-void",
          "bg-[linear-gradient(100deg,var(--color-gold-soft),var(--color-gold))]",
          "shadow-[0_10px_40px_-14px_rgba(232,195,106,0.6)]",
          "hover:shadow-[0_20px_66px_-16px_rgba(232,195,106,0.85)]",
        ],
        ghost: ["text-cloud-dim hover:text-cloud", "hover:bg-cloud/[0.06]"],
        outline: [
          "border border-cloud/15 text-cloud",
          "hover:border-cyan/45 hover:bg-cyan/[0.06]",
        ],
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-[0.9375rem]",
        lg: "h-[3.35rem] px-8 text-[1rem]",
        xl: "h-16 px-10 text-[1.0625rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Wraps the button in a magnetic field. On by default for lg/xl. */
  magnetic?: boolean;
  /** Adds the sheen sweep on hover. */
  sheen?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, magnetic, sheen = true, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isMagnetic = magnetic ?? (size === "lg" || size === "xl");

    const node = (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {/* Slottable keeps `asChild` valid while still allowing the sheen
            sibling — the sweep is layered over the label on purpose. */}
        <Slottable>{children}</Slottable>
        {sheen && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 z-0 translate-x-[-120%] skew-x-[-18deg]",
              "bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.42),transparent)]",
              "transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              "group-hover/btn:translate-x-[120%]",
              variant === "glass" || variant === "ghost" || variant === "outline"
                ? "opacity-40"
                : "opacity-70",
            )}
          />
        )}
      </Comp>
    );

    return isMagnetic ? <Magnetic strength={0.28}>{node}</Magnetic> : node;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
