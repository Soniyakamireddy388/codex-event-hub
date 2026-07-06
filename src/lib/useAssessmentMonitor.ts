import { useEffect, useRef, useState } from "react";
import { recordViolation } from "@/lib/participants.functions";

type Options = {
  email: string | null;
  round: "round1" | "round2";
  enabled: boolean;
  onAutoSubmit: () => void;
};

export function useAssessmentMonitor({ email, round, enabled, onAutoSubmit }: Options) {
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const countRef = useRef(0);
  const cooldownRef = useRef(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !email) return;

    function trigger() {
      if (submittedRef.current || cooldownRef.current) return;
      cooldownRef.current = true;
      // brief cooldown so a single tab-switch doesn't fire blur + visibilitychange twice
      setTimeout(() => { cooldownRef.current = false; }, 800);

      const next = countRef.current + 1;
      countRef.current = next;
      setViolations(next);

      // persist (fire-and-forget)
      if (email) {
        void recordViolation({ data: { email, round, count: next } }).catch(() => {});
      }

      if (next === 1) {
        setWarning("Warning 1: Please do not leave the assessment window.");
      } else if (next === 2) {
        setWarning("Warning 2: One more violation will automatically submit your assessment.");
      } else if (next >= 3) {
        submittedRef.current = true;
        setWarning("Violation limit reached. Submitting your assessment…");
        onAutoSubmit();
      }
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") trigger();
    }
    function onBlur() { trigger(); }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled, email, round, onAutoSubmit]);

  return { violations, warning, dismissWarning: () => setWarning(null) };
}
