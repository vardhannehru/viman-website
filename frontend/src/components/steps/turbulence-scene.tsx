import { Plane } from "lucide-react";

const STREAKS = [
  { top: "20%", width: "28%", duration: "2.6s", delay: "-0.4s" },
  { top: "36%", width: "18%", duration: "3.4s", delay: "-2.1s" },
  { top: "57%", width: "34%", duration: "2.9s", delay: "-1.2s" },
  { top: "73%", width: "22%", duration: "3.8s", delay: "-2.8s" },
  { top: "86%", width: "14%", duration: "2.4s", delay: "-0.9s" },
] as const;

/** A small aircraft riding through light chop, with the air streaming past it. */
export function TurbulenceScene() {
  return (
    <div aria-hidden className="relative h-32 overflow-hidden rounded-2xl bg-[#eef2f8]">
      {STREAKS.map((streak) => (
        <span
          key={streak.top}
          className="absolute h-px animate-airflow bg-[#13235b]/20"
          style={{
            top: streak.top,
            width: streak.width,
            animationDuration: streak.duration,
            animationDelay: streak.delay,
          }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-turbulence">
          <Plane className="h-10 w-10 rotate-45 text-[#13235b]" strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}
