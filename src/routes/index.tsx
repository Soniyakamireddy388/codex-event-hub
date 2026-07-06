import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Bug, Trophy, Zap, Users, Clock } from "lucide-react";

const LOGO = "https://res.cloudinary.com/snbrllpp/image/upload/f_auto,q_auto/vvisc_logo_six37g";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-32 lg:px-8">
          <img
            src={LOGO}
            alt="VVISC logo"
            className="mb-8 h-28 w-28 rounded-full ring-4 ring-primary/40 animate-float animate-pulse-glow"
          />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <Zap className="h-3 w-3" /> Online Technical Event
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl">
            <span className="neon-text">CODE RUSH</span>{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">1.0</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/90 sm:text-xl">
            Online Technical Quiz & Debugging Challenge
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
            Conducted by <span className="text-primary">VVISC – IUCEE Student Council</span> · VVIT
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-lg border border-primary/40 bg-background/60 px-6 py-3 font-display text-lg font-bold uppercase tracking-[0.4em] neon-border">
              Code<span className="text-primary">.</span> Compete<span className="text-primary">.</span> Conquer<span className="text-primary">.</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="rounded-md bg-primary px-8 py-3 font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105 animate-pulse-glow"
            >
              Register / Login
            </Link>
            <Link
              to="/about"
              className="rounded-md border border-primary/60 px-8 py-3 font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wider sm:text-4xl">
            The <span className="neon-text">Challenge</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Two rounds. One winner. Are you ready?</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Code2, title: "Technical Quiz", desc: "MCQ-based round covering programming, DSA, and CS fundamentals." },
            { icon: Bug, title: "Debugging Challenge", desc: "Hunt bugs across languages against the clock. Precision matters." },
            { icon: Trophy, title: "Exciting Prizes", desc: "Certificates, cash prizes, and recognition for top performers." },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-6 transition-all hover:border-primary/60 hover:-translate-y-1 neon-border"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <f.icon className="relative h-10 w-10 text-primary" />
              <h3 className="relative mt-4 font-display text-xl font-bold uppercase tracking-wide">{f.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl border border-border bg-card/40 p-8 sm:grid-cols-3 neon-border">
          {[
            { icon: Users, label: "Participants", value: "500+" },
            { icon: Clock, label: "Total Duration", value: "90 min" },
            { icon: Trophy, label: "Winners", value: "Top 3" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-center gap-4">
              <s.icon className="h-8 w-8 text-primary" />
              <div>
                <div className="font-display text-3xl font-bold neon-text">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold uppercase sm:text-5xl">
          Ready to <span className="neon-text">rush</span>?
        </h2>
        <p className="mt-4 text-muted-foreground">Register now and claim your seat in the arena.</p>
        <Link
          to="/login"
          className="mt-8 inline-block rounded-md bg-primary px-10 py-4 font-bold uppercase tracking-wider text-primary-foreground animate-pulse-glow hover:scale-105 transition-transform"
        >
          Enter the Arena
        </Link>
      </section>
    </div>
  );
}
