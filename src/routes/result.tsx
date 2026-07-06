import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Award } from "lucide-react";
import { getParticipantStatus } from "@/lib/participants.functions";
import { loadEmail, clearEmail } from "@/lib/session";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Result — CODE RUSH 1.0" },
      { name: "description", content: "Your CODE RUSH 1.0 Round 1 result." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Result,
});

function Result() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"checking" | "ready">("checking");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadEmail();
    if (!stored) { navigate({ to: "/login" }); return; }
    setEmail(stored);
    getParticipantStatus({ data: { email: stored } })
      .then((res) => {
        if (res.status === "round1") { navigate({ to: "/round1" }); return; }
        if (res.status === "round2") { navigate({ to: "/round2" }); return; }
        setPhase("ready");
      })
      .catch(() => navigate({ to: "/login" }));
  }, [navigate]);

  if (phase === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
        <Award className="h-10 w-10 text-primary" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Round 1 Complete</p>
      <h1 className="mt-3 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
        You are not qualified for <span className="neon-text">Round 2</span>.
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-lg text-foreground/90">
        Thank you for participating in <strong className="text-primary">CODE RUSH 1.0</strong>.
      </p>
      {email && (
        <p className="mt-2 text-sm text-muted-foreground">Recorded for {email}</p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-md border border-primary/60 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/10"
        >
          Return Home
        </Link>
        <button
          onClick={() => { clearEmail(); navigate({ to: "/" }); }}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
