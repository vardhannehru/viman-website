import { useMemo, useSyncExternalStore } from "react";

/* Which roadmap steps the visitor has ticked off. Lives only in this browser's
   localStorage — listed on the cookie policy page. */
const KEY = "viman:progress";
const CHANGE = "viman:progress-change";

function snapshot() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

export function useCompletedSteps(): string[] {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => parse(raw), [raw]);
}

export function setStepCompleted(id: string, done: boolean) {
  const steps = new Set(parse(snapshot()));
  if (done) steps.add(id);
  else steps.delete(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...steps]));
  } catch {
    /* Storage blocked: the tick still shows for this visit. */
  }
  window.dispatchEvent(new Event(CHANGE));
}
