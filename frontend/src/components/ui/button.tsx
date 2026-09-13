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
        primary: ["bg-cloud text-void", "hover:bg-cloud/85"],
        glass: ["glass text-cloud", "hover:border-cloud/20 hover:bg-cloud/[0.09]"],
        ghost: ["text-cloud-dim hover:text-cloud", "hover:bg-cloud/[0.06]"],
        outline: [
          "border border-cloud/18 text-cloud",
          "hover:border-cloud/35 hover:bg-cloud/[0.05]",
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
  /** Adds the sheen sweep on hover. Off unless a button is genuinely the
   *  primary call to action on its screen. */
  sheen?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, magnetic, sheen = false, children, ...props },
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
