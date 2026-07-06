import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, Copy, ServerCog, KeyRound, Rocket, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/deployment")({
  head: () => ({
    meta: [
      { title: "Deployment Setup — CODE RUSH 1.0" },
      { name: "description", content: "Step-by-step guide to deploy this app on Vercel with the correct Supabase environment variables." },
      { property: "og:title", content: "Deployment Setup — CODE RUSH 1.0" },
      { property: "og:description", content: "Configure Supabase env vars on Vercel and go live." },
    ],
  }),
  component: DeploymentPage,
});

const ENV_VARS: { name: string; value: string; scope: "Public" | "Server" }[] = [
  { name: "VITE_SUPABASE_URL", value: "https://iamniiyvypzslwthuvfa.supabase.co", scope: "Public" },
  { name: "VITE_SUPABASE_PUBLISHABLE_KEY", value: "sb_publishable_29vm51xl5o0_7IujncLd5A_jgWmRelN", scope: "Public" },
  { name: "VITE_SUPABASE_PROJECT_ID", value: "iamniiyvypzslwthuvfa", scope: "Public" },
  { name: "SUPABASE_URL", value: "https://iamniiyvypzslwthuvfa.supabase.co", scope: "Server" },
  { name: "SUPABASE_PUBLISHABLE_KEY", value: "sb_publishable_29vm51xl5o0_7IujncLd5A_jgWmRelN", scope: "Server" },
];

function EnvRow({ name, value, scope }: { name: string; value: string; scope: string }) {
  const [copied, setCopied] = useState<"name" | "value" | null>(null);
  const copy = async (kind: "name" | "value", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1200);
    } catch { /* noop */ }
  };
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-card/40 p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs font-bold text-primary">{name}</code>
          <button
            onClick={() => copy("name", name)}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label={`Copy ${name}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{scope}</div>
      </div>
      <div className="flex items-center gap-2 overflow-hidden">
        <code className="min-w-0 flex-1 truncate rounded bg-background/60 px-2 py-1.5 font-mono text-xs">{value}</code>
        <button
          onClick={() => copy("value", value)}
          className="rounded border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied === "value" ? "Copied" : "Copy"}
        </button>
      </div>
      <span className="hidden text-xs text-muted-foreground sm:inline">{copied === "name" ? "Name copied" : ""}</span>
    </div>
  );
}

function DeploymentPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Guide</p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
          Deployment <span className="neon-text">Setup</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Deploy this project to Vercel with the correct Supabase environment variables. Follow the steps in order.
        </p>
      </div>

      {/* Framework panel */}
      <div className="mt-12 rounded-2xl border border-primary/40 bg-gradient-to-br from-card/80 to-background p-6 neon-border sm:p-8">
        <div className="flex items-start gap-4">
          <ServerCog className="mt-1 h-8 w-8 shrink-0 text-primary" />
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wider">Framework Settings</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This project is built with <strong className="text-foreground">TanStack Start</strong> — not Next.js or plain Vite. Use these settings in Vercel:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { k: "Framework Preset", v: "Other" },
                { k: "Build Command", v: "bun run build" },
                { k: "Output Directory", v: ".output/public" },
                { k: "Install Command", v: "bun install" },
                { k: "Node Version", v: "20.x" },
              ].map((row) => (
                <div key={row.k} className="rounded-lg border border-border bg-card/40 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{row.k}</div>
                  <code className="font-mono text-sm text-foreground">{row.v}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="mt-12 space-y-6">
        {[
          {
            icon: Rocket,
            title: "Push your project to GitHub",
            body: (
              <>
                Connect this project to GitHub from Lovable, then create a repository. Vercel will import directly from that repo.
              </>
            ),
          },
          {
            icon: ExternalLink,
            title: "Import the repo into Vercel",
            body: (
              <>
                Go to{" "}
                <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                  vercel.com/new
                </a>
                {" "}and click <strong>Import</strong> next to your GitHub repository.
              </>
            ),
          },
          {
            icon: ServerCog,
            title: "Set framework, build, and output",
            body: <>Override the auto-detected preset. Use the values in the Framework Settings panel above. Do NOT choose &quot;Vite&quot; with output <code className="font-mono text-xs">dist</code>.</>,
          },
          {
            icon: KeyRound,
            title: "Add Supabase environment variables",
            body: (
              <>
                Go to <strong>Vercel → Project → Settings → Environment Variables</strong>. Add each variable below for the
                {" "}<em>Production</em>, <em>Preview</em>, and <em>Development</em> environments.
              </>
            ),
          },
          {
            icon: Rocket,
            title: "Deploy",
            body: <>Click <strong>Deploy</strong>. After the first deploy, update your Supabase Auth redirect URLs to your new Vercel domain so login redirects continue to work.</>,
          },
        ].map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-xl border border-border bg-card/60 p-5 neon-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/10 font-display text-lg font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <s.icon className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold uppercase tracking-wide">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Env vars */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider">
          Environment <span className="neon-text">Variables</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Copy each name and value into Vercel exactly as shown. Names are case-sensitive.
        </p>
        <div className="mt-6 space-y-3">
          {ENV_VARS.map((v) => (
            <EnvRow key={v.name} name={v.name} value={v.value} scope={v.scope} />
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="mt-12 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-8 w-8 shrink-0 text-amber-400" />
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-amber-300">
              Backend-only features on Vercel
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The Gmail email notifications and admin database writes rely on server secrets managed inside Lovable Cloud
              (<code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>, <code className="font-mono text-xs">GOOGLE_MAIL_API_KEY</code>,
              <code className="font-mono text-xs"> LOVABLE_API_KEY</code>). These are not exportable to Vercel.
              If you deploy on Vercel, those features will stop working unless you provision equivalent credentials yourself.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Easiest path: publish directly from Lovable — all backend features keep working with zero configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Success */}
      <div className="mt-12 flex items-center justify-center gap-3 rounded-xl border border-primary/40 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <p className="text-sm font-semibold uppercase tracking-wider text-foreground">
          You&apos;re ready to deploy
        </p>
      </div>
    </div>
  );
}
