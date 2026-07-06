import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { loginParticipant } from "@/lib/participants.functions";
import { saveEmail } from "@/lib/session";

const LOGO = "https://res.cloudinary.com/snbrllpp/image/upload/f_auto,q_auto/vvisc_logo_six37g";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — CODE RUSH 1.0" },
      { name: "description", content: "Login to participate in CODE RUSH 1.0 online technical quiz and debugging challenge." },
      { property: "og:title", content: "Login — CODE RUSH 1.0" },
      { property: "og:description", content: "Access your CODE RUSH 1.0 participant portal." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginParticipant({ data: { email: trimmed } });
      saveEmail(result.email);
      if (result.status === "round1") navigate({ to: "/round1" });
      else if (result.status === "round2") navigate({ to: "/round2" });
      else navigate({ to: "/result" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative w-full max-w-md rounded-2xl border border-primary/40 bg-card/80 p-8 backdrop-blur-xl neon-border">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={LOGO} alt="VVISC" className="h-16 w-16 rounded-full ring-2 ring-primary/50 animate-pulse-glow" />
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wider neon-text">
            Participant Login
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            CODE RUSH 1.0 · Access Portal
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 focus-within:border-primary focus-within:neon-glow">
              <Mail className="h-4 w-4 text-primary" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : <>Enter Arena</>}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Your email uniquely identifies your attempt.</span>
        </div>

        <div className="mt-4 border-t border-border/50 pt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to the{" "}
          <Link to="/rules" className="text-primary hover:underline">event rules</Link>.
        </div>
      </div>
    </div>
  );
}
