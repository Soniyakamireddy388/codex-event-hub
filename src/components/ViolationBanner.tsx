import { AlertTriangle, X } from "lucide-react";

export function ViolationBanner({
  warning,
  violations,
  onDismiss,
}: {
  warning: string | null;
  violations: number;
  onDismiss: () => void;
}) {
  if (!warning) return null;
  const critical = violations >= 2;
  return (
    <div
      className={`fixed inset-x-0 top-16 z-50 mx-auto flex max-w-3xl items-start gap-3 rounded-xl border px-5 py-4 shadow-lg backdrop-blur ${
        critical
          ? "border-destructive/70 bg-destructive/15 text-destructive-foreground"
          : "border-primary/60 bg-primary/15 text-foreground"
      }`}
      role="alert"
    >
      <AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${critical ? "text-destructive" : "text-primary"}`} />
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-widest opacity-80">Activity Alert · Violations: {violations}/3</div>
        <p className="mt-1 text-sm font-semibold">{warning}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="rounded-md p-1 opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
