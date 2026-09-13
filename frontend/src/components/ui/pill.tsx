import { cn } from "@/lib/utils";

/** Small capsule used for eyebrows, phase tags and status chips. */
export function Pill({
  children,
  className,
  dot = true,
  tone = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  tone?: "cyan" | "gold" | "sky" | "neutral";
}) {
  const tones = {
    cyan: "border-cyan/25 text-cyan bg-cyan/[0.06]",
    gold: "border-gold/25 text-gold bg-gold/[0.06]",
    sky: "border-sky/25 text-sky bg-sky/[0.06]",
    neutral: "border-cloud/12 text-mist bg-cloud/[0.03]",
  } as const;

  const dots = {
    cyan: "bg-cyan shadow-[0_0_10px_2px_rgba(34,224,255,0.6)]",
    gold: "bg-gold shadow-[0_0_10px_2px_rgba(232,195,106,0.55)]",
    sky: "bg-sky shadow-[0_0_10px_2px_rgba(90,169,255,0.55)]",
    neutral: "bg-mist",
  } as const;

  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-2 rounded-full border px-3.5 py-2 backdrop-blur-sm",
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}
