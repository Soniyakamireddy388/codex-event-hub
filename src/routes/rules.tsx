import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Rules — CODE RUSH 1.0" },
      { name: "description", content: "Official rules and guidelines for CODE RUSH 1.0 online technical quiz and debugging challenge." },
      { property: "og:title", content: "Rules — CODE RUSH 1.0" },
      { property: "og:description", content: "Official rules and event guidelines." },
    ],
  }),
  component: Rules,
});

const rules = [
  "Participants must register with a valid college email ID before the event begins.",
  "The event is fully online. Ensure a stable internet connection throughout both rounds.",
  "Round 1 (Technical Quiz): 45 minutes, MCQs on programming, DSA, DBMS, OS and networks.",
  "Round 2 (Debugging Challenge): 45 minutes, fix code snippets in C, C++, Java, and Python.",
  "Only individual participation is allowed. Team entries will be disqualified.",
  "Use of AI tools, external help, screen-sharing, or plagiarism results in immediate disqualification.",
  "Keep webcam on if proctoring is enabled. Do not switch tabs during active rounds.",
  "The decision of the organising committee is final and binding.",
];

const dos = [
  "Log in 10 minutes before the scheduled start time.",
  "Read every question carefully — no negative marking in Round 1.",
  "Manage your time; the timer does not pause.",
  "Report technical issues via the contact page immediately.",
];

const donts = [
  "Don't share your login credentials.",
  "Don't use ChatGPT, Copilot, or external resources.",
  "Don't attempt to inspect or manipulate the platform.",
  "Don't re-open your browser mid-round unless necessary.",
];

export function Rules() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Event Guidelines</p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
          Rules & <span className="neon-text">Regulations</span>
        </h1>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card/60 p-8 neon-border">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider">General Rules</h2>
        <ol className="mt-6 space-y-4">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/10 font-display text-sm font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 text-sm text-foreground/90">{r}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-primary/30 bg-card/60 p-6">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider">Do's</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {dos.map((d) => <li key={d} className="flex gap-2"><span className="text-primary">▸</span>{d}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-destructive/40 bg-card/60 p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider">Don'ts</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {donts.map((d) => <li key={d} className="flex gap-2"><span className="text-destructive">▸</span>{d}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Rules;
