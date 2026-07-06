import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trophy, Bug } from "lucide-react";
import { getParticipantStatus } from "@/lib/participants.functions";
import { loadEmail, clearEmail } from "@/lib/session";

export const Route = createFileRoute("/round2")({
  head: () => ({
    meta: [
      { title: "Round 2 — CODE RUSH 1.0" },
      { name: "description", content: "Round 2 Debugging Challenge for CODE RUSH 1.0." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Round2,
});

function Round2() {
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
        if (res.status === "not_qualified") { navigate({ to: "/result" }); return; }
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
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/60 bg-primary/10 animate-pulse-glow">
        <Trophy className="h-10 w-10 text-primary" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">You Qualified</p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
        Welcome to <span className="neon-text">Round 2</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        The Debugging Challenge, <strong className="text-foreground">{email}</strong>. Hunt bugs across
        languages against the clock. Precision matters — every fix counts.
      </p>

      <div className="mt-10 rounded-2xl border border-primary/40 bg-card/60 p-8 text-left neon-border">
        <div className="flex items-center gap-3">
          <Bug className="h-6 w-6 text-primary" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wider">Instructions</h2>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>▸ You have 45 minutes to fix as many code snippets as possible.</li>
          <li>▸ Languages: C, C++, Java, and Python.</li>
          <li>▸ Each correct fix awards points; partial credit is not given.</li>
          <li>▸ Do not switch tabs. Do not use external tools or AI assistants.</li>
        </ul>
        <button
          className="mt-6 rounded-md bg-primary px-8 py-3 font-bold uppercase tracking-wider text-primary-foreground animate-pulse-glow"
          onClick={() => alert("Round 2 challenges will unlock at the scheduled start time.")}
        >
          Start Debugging Challenge
        </button>
      </div>

      <button
        onClick={() => { clearEmail(); navigate({ to: "/" }); }}
        className="mt-8 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
      >
        Sign out
      </button>
    </div>
  );
}
