import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send, Instagram, Linkedin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CODE RUSH 1.0" },
      { name: "description", content: "Get in touch with the CODE RUSH 1.0 team at VVISC – IUCEE Student Council, VVIT." },
      { property: "og:title", content: "Contact — CODE RUSH 1.0" },
      { property: "og:description", content: "Reach the CODE RUSH 1.0 organising team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">We're listening</p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
          Get in <span className="neon-text">Touch</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Questions about registration, rules, or technical issues? Reach the organising team.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "vvisc@vvit.net" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Address", value: "VVIT, Nambur, Guntur, Andhra Pradesh — 522508" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 rounded-xl border border-border bg-card/60 p-5 neon-border">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="mt-0.5 truncate font-semibold">{c.value}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <a href="#" className="grid h-11 w-11 place-items-center rounded-lg border border-border text-primary hover:bg-primary/10">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="grid h-11 w-11 place-items-center rounded-lg border border-border text-primary hover:bg-primary/10">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); alert("Message noted. Enable Lovable Cloud to send real messages."); }}
          className="rounded-2xl border border-primary/40 bg-card/60 p-6 neon-border"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="you@college.edu" />
          </div>
          <Input label="Subject" placeholder="How can we help?" className="mt-4" />
          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea
              rows={5}
              required
              className="w-full rounded-md border border-border bg-background/60 p-3 text-sm outline-none focus:border-primary focus:neon-glow"
              placeholder="Type your message..."
            />
          </label>
          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-bold uppercase tracking-wider text-primary-foreground hover:scale-[1.02] transition-transform animate-pulse-glow"
          >
            <Send className="h-4 w-4" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        required
        {...props}
        className="w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary focus:neon-glow"
      />
    </label>
  );
}
