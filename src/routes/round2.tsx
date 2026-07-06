import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Loader2, Clock, Bug, CheckCircle2 } from "lucide-react";
import { getParticipantStatus, submitRound2 } from "@/lib/participants.functions";
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

type Lang = "java" | "python" | "c";

const STARTERS: Record<Lang, string> = {
  java: `// Fix the bug so the program prints the sum of numbers 1..n correctly.
public class Sum {
  public static void main(String[] args) {
    int n = 10;
    int sum = 0;
    for (int i = 1; i < n; i++) {
      sum += i;
    }
    System.out.println(sum);
  }
}
`,
  python: `# Fix the bug so the function returns the factorial of n.
def factorial(n):
    result = 0
    for i in range(1, n + 1):
        result *= i
    return result

print(factorial(5))
`,
  c: `/* Fix the bug so the program prints the largest of the three numbers. */
#include <stdio.h>
int main() {
    int a = 5, b = 12, c = 7, max;
    if (a > b) max = a;
    else max = b;
    if (max > c) max = c;
    printf("%d\\n", max);
    return 0;
}
`,
};

const CHALLENGE = `You are given a small program in your chosen language that contains one or more bugs.
Read the code, identify the defect(s), and edit the code so it produces the correct output described in the comments.
Submit before the timer runs out — the code will be auto-submitted at 00:00.`;

function Round2() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"checking" | "ready" | "submitting" | "submitted" | "error">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [language, setLanguage] = useState<Lang>("python");
  const [code, setCode] = useState<string>(STARTERS.python);
  const [touchedLangs, setTouchedLangs] = useState<Record<Lang, boolean>>({ java: false, python: false, c: false });
  const [remaining, setRemaining] = useState(20 * 60);
  const submittedRef = useRef(false);

  // Access guard: must be qualified.
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
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : "Unable to verify participant.");
        setPhase("error");
      });
  }, [navigate]);

  // Timer
  useEffect(() => {
    if (phase !== "ready") return;
    const t = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "ready" && remaining === 0 && !submittedRef.current) {
      void handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase]);

  function selectLanguage(lang: Lang) {
    if (language === lang) return;
    setLanguage(lang);
    if (!touchedLangs[lang]) {
      setCode(STARTERS[lang]);
    }
  }

  function handleCodeChange(next: string) {
    setCode(next);
    if (!touchedLangs[language]) {
      setTouchedLangs((t) => ({ ...t, [language]: true }));
    }
  }

  async function handleSubmit(auto = false) {
    if (!email || submittedRef.current) return;
    submittedRef.current = true;
    setPhase("submitting");
    try {
      await submitRound2({ data: { email, language, code } });
      setPhase("submitted");
    } catch (err) {
      submittedRef.current = false;
      setErrorMsg((err instanceof Error ? err.message : "Submission failed.") + (auto ? " (auto-submit)" : ""));
      setPhase("error");
    }
  }

  if (phase === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-destructive">Access Error</h1>
        <p className="mt-3 text-sm text-muted-foreground">{errorMsg}</p>
        <button
          onClick={() => { clearEmail(); navigate({ to: "/login" }); }}
          className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (phase === "submitted") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/60 bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-black uppercase neon-text">Submitted</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your Round 2 submission has been recorded. Thank you for participating in CODE RUSH 1.0.
        </p>
        <button
          onClick={() => { clearEmail(); navigate({ to: "/" }); }}
          className="mt-8 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          Sign out
        </button>
      </div>
    );
  }

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const langLabel: Record<Lang, string> = { java: "Java", python: "Python", c: "C" };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="sticky top-16 z-10 mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-primary/40 bg-background/80 px-5 py-3 backdrop-blur neon-border">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Round 2 · Debugging Challenge</div>
          <div className="truncate font-display text-lg font-bold neon-text">{email}</div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-display font-bold text-primary">
          <Clock className="h-4 w-4" /> {mins}:{secs}
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card/60 p-6">
        <div className="mb-3 flex items-center gap-3">
          <Bug className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wider">Challenge</h2>
        </div>
        <p className="whitespace-pre-line text-sm text-muted-foreground">{CHALLENGE}</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs uppercase tracking-widest text-muted-foreground">Language:</span>
        {(["java", "python", "c"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => selectLanguage(l)}
            className={`rounded-md border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
              language === l
                ? "border-primary bg-primary/15 text-primary neon-border"
                : "border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {langLabel[l]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/40 bg-[#0b0f1a] neon-border">
        <CodeEditor
          value={code}
          language={language}
          placeholder="Write your fix here..."
          onChange={(e) => handleCodeChange(e.target.value)}
          padding={16}
          data-color-mode="dark"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 14,
            minHeight: 380,
            background: "transparent",
          }}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={() => handleSubmit(false)}
          disabled={phase === "submitting"}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-10 py-3 font-bold uppercase tracking-wider text-primary-foreground animate-pulse-glow disabled:opacity-70"
        >
          {phase === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Round 2"}
        </button>
        <p className="text-xs text-muted-foreground">Your code will auto-submit when the timer hits 00:00.</p>
      </div>
    </div>
  );
}
