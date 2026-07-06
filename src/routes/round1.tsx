import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";
import { getParticipantStatus, submitRound1 } from "@/lib/participants.functions";
import { loadEmail, clearEmail } from "@/lib/session";
import { useAssessmentMonitor } from "@/lib/useAssessmentMonitor";
import { ViolationBanner } from "@/components/ViolationBanner";

export const Route = createFileRoute("/round1")({
  head: () => ({
    meta: [
      { title: "Round 1 — CODE RUSH 1.0" },
      { name: "description", content: "Round 1 Technical Quiz for CODE RUSH 1.0." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Round1,
});

type Question = {
  q: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  // Programming Fundamentals
  { q: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Heap", "Array"], answer: 1 },
  { q: "What is the time complexity of binary search on a sorted array of n elements?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1 },
  { q: "Which sorting algorithm has an average-case complexity of O(n log n)?", options: ["Bubble sort", "Insertion sort", "Merge sort", "Selection sort"], answer: 2 },
  // Java
  { q: "In Java, which keyword is used to inherit a class?", options: ["implements", "extends", "inherits", "super"], answer: 1 },
  { q: "Which of these is NOT a primitive type in Java?", options: ["int", "float", "String", "boolean"], answer: 2 },
  { q: "The default value of a boolean instance variable in Java is:", options: ["true", "false", "null", "0"], answer: 1 },
  // Python
  { q: "In Python, what does the expression '3 // 2' evaluate to?", options: ["1.5", "1", "2", "Error"], answer: 1 },
  { q: "Which Python collection is ordered and immutable?", options: ["list", "set", "dict", "tuple"], answer: 3 },
  { q: "What is the output of len('CODE RUSH')?", options: ["8", "9", "10", "Error"], answer: 1 },
  // C
  { q: "In C, what does 'malloc' return on failure?", options: ["0", "-1", "NULL", "undefined"], answer: 2 },
  { q: "Which C operator is used to access the value at a pointer's address?", options: ["&", "*", "->", "."], answer: 1 },
  // AI & Emerging Technologies
  { q: "Which of the following is a supervised learning algorithm?", options: ["K-Means", "Linear Regression", "DBSCAN", "PCA"], answer: 1 },
  { q: "GPT stands for:", options: ["General Processing Tool", "Generative Pre-trained Transformer", "Global Pattern Tracker", "Guided Predictive Text"], answer: 1 },
  // Logical Reasoning
  { q: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely:", options: ["Razzies only", "Lazzies", "Neither", "Cannot be determined"], answer: 1 },
  { q: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "44"], answer: 2 },
];

function Round1() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"checking" | "ready" | "submitting" | "error">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [remaining, setRemaining] = useState(10 * 60); // 10 minutes

  // Guard: verify email + not already attempted
  useEffect(() => {
    const stored = loadEmail();
    if (!stored) { navigate({ to: "/login" }); return; }
    setEmail(stored);
    getParticipantStatus({ data: { email: stored } })
      .then((res) => {
        if (res.status === "round2") { navigate({ to: "/round2" }); return; }
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
    if (phase === "ready" && remaining === 0) {
      void handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase]);

  const handleSubmit = useCallback(async () => {
    if (!email || phase === "submitting") return;
    setPhase("submitting");
    const score = QUESTIONS.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    try {
      const res = await submitRound1({ data: { email, score, total: QUESTIONS.length } });
      if (res.qualified) navigate({ to: "/round2" });
      else navigate({ to: "/result" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
      setPhase("error");
    }
  }, [email, phase, answers, navigate]);

  const { violations, warning, dismissWarning } = useAssessmentMonitor({
    email,
    round: "round1",
    enabled: phase === "ready",
    onAutoSubmit: () => { void handleSubmit(); },
  });

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

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const answered = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="sticky top-16 z-10 mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-primary/40 bg-background/80 px-5 py-3 backdrop-blur neon-border">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Round 1 · Technical Quiz</div>
          <div className="truncate font-display text-lg font-bold neon-text">{email}</div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden text-xs text-muted-foreground sm:block">
            <span className="text-primary font-bold">{answered}</span>/{QUESTIONS.length} answered
          </div>
          <div className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-display font-bold text-primary">
            <Clock className="h-4 w-4" /> {mins}:{secs}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/60 p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-primary/50 bg-primary/10 font-display text-sm font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 font-semibold">{q.q}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const selected = answers[i] === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                    className={`flex items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-all ${
                      selected
                        ? "border-primary bg-primary/15 text-foreground neon-border"
                        : "border-border bg-background/40 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {selected ? <CheckCircle2 className="h-4 w-4" /> : String.fromCharCode(65 + oi)}
                    </span>
                    <span className="min-w-0">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={phase === "submitting"}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-10 py-3 font-bold uppercase tracking-wider text-primary-foreground animate-pulse-glow disabled:opacity-70"
        >
          {phase === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Round 1"}
        </button>
        <p className="text-xs text-muted-foreground">You can only attempt Round 1 once. Make it count.</p>
      </div>
    </div>
  );
}
