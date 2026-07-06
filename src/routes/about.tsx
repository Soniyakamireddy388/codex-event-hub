import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Globe, Award, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Event — CODE RUSH 1.0" },
      { name: "description", content: "Learn about CODE RUSH 1.0, an online technical quiz and debugging challenge by VVISC – IUCEE Student Council, VVIT." },
      { property: "og:title", content: "About CODE RUSH 1.0" },
      { property: "og:description", content: "Online Technical Quiz & Debugging Challenge by VVISC · VVIT." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">The Event</p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
          About <span className="neon-text">Code Rush</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          CODE RUSH 1.0 is a flagship online technical event bringing together aspiring coders,
          debuggers, and problem-solvers for a battle of logic, speed, and precision.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
          { icon: Target, title: "Mission", body: "To cultivate a culture of competitive coding, sharpen debugging instincts, and celebrate technical excellence among students." },
          { icon: Globe, title: "Format", body: "Fully online — participate from anywhere. Two intense rounds: a Technical Quiz followed by a Debugging Challenge." },
          { icon: Calendar, title: "Schedule", body: "Round 1: Technical Quiz (45 min). Round 2: Debugging Challenge (45 min). Live leaderboard throughout." },
          { icon: Award, title: "Recognition", body: "Digital certificates for all participants. Cash prizes and merchandise for top-3 finalists." },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card/60 p-6 neon-border">
            <c.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-primary/40 bg-gradient-to-br from-card/80 to-background p-8 neon-border">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider">
          Organised by <span className="neon-text">VVISC</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          The <strong className="text-foreground">VVISC – IUCEE Student Council</strong> at
          Vasireddy Venkatadri Institute of Technology (VVIT) is a student-led council under the
          Indo-Universal Collaboration for Engineering Education (IUCEE), driving initiatives in
          engineering education, innovation, and community building.
        </p>
      </div>
    </div>
  );
}
