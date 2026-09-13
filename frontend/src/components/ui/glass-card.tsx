"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Radial highlight that tracks the cursor across the surface. */
  spotlight?: boolean;
  /** Subtle perspective tilt toward the cursor. */
  tilt?: boolean;
  /** Tilt magnitude in degrees. */
  tiltStrength?: number;
  as?: "div" | "article" | "li" | "section";
};

/**
 * The core surface of the product. Glass, layered, and quietly reactive —
 * light moves across it as the cursor does, and it leans in when addressed.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, children, spotlight = true, tilt = false, tiltStrength = 6, as = "div", ...props },
    forwardedRef,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement);

    const raf = React.useRef(0);

    const onPointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        const el = innerRef.current;
        if (!el) return;
        if (raf.current) return;

        const { clientX, clientY } = e;
        raf.current = requestAnimationFrame(() => {
          raf.current = 0;
          const rect = el.getBoundingClientRect();
          const px = (clientX - rect.left) / rect.width;
          const py = (clientY - rect.top) / rect.height;
          el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
          if (tilt) {
            const rx = (0.5 - py) * tiltStrength * 2;
            const ry = (px - 0.5) * tiltStrength * 2;
            el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
            el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
          }
        });
      },
      [tilt, tiltStrength],
    );

    const onPointerLeave = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "0%");
    }, []);

    // Polymorphic host element. Typed as "div" so the prop surface stays
    // checkable — every tag in the union accepts this exact prop set.
    const Comp = as as "div";

    return (
      <Comp
        ref={innerRef}
        onPointerMove={spotlight || tilt ? onPointerMove : undefined}
        onPointerLeave={spotlight || tilt ? onPointerLeave : undefined}
        className={cn(
          "group/card relative overflow-hidden rounded-3xl glass",
          "transition-[transform,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:border-cloud/20",
          tilt && "[transform:perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
          className,
        )}
        style={
          {
            "--mx": "50%",
            "--my": "0%",
          } as React.CSSProperties
        }
        {...props}
      >
        {spotlight && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
            style={{
              background:
                "radial-gradient(340px circle at var(--mx) var(--my), rgba(34,224,255,0.13), transparent 62%)",
            }}
          />
        )}
        {/* Top hairline that catches the light */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cloud/25 to-transparent"
        />
        <div className="relative">{children}</div>
      </Comp>
    );
  },
);
GlassCard.displayName = "GlassCard";
