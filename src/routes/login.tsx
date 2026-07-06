import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

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
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative w-full max-w-md rounded-2xl border border-primary/40 bg-card/80 p-8 backdrop-blur-xl neon-border">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={LOGO} alt="VVISC" className="h-16 w-16 rounded-full ring-2 ring-primary/50 animate-pulse-glow" />
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wider neon-text">
            {mode === "login" ? "Participant Login" : "Register"}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">CODE RUSH 1.0 · Access Portal</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Backend not connected yet. Enable Lovable Cloud to activate authentication."); }}>
          {mode === "register" && (
            <Field icon={User} label="Full name" type="text" placeholder="Your name" />
          )}
          <Field icon={Mail} label="Email" type="email" placeholder="you@college.edu" />
          <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow"
          >
            {mode === "login" ? "Enter Arena" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New here?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "login" ? "Create account" : "Login instead"}
          </button>
        </div>

        <div className="mt-6 border-t border-border/50 pt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to the <Link to="/rules" className="text-primary hover:underline">event rules</Link>.
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type, placeholder }: { icon: React.ElementType; label: string; type: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 focus-within:border-primary focus-within:neon-glow">
        <Icon className="h-4 w-4 text-primary" />
        <input
          type={type}
          required
          placeholder={placeholder}
          className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}
