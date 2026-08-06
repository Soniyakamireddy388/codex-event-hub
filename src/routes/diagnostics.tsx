import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, ShieldCheck, Server, RefreshCw } from "lucide-react";
import { getDiagnostics } from "@/lib/diagnostics.functions";

type Report = Awaited<ReturnType<typeof getDiagnostics>>;

export const Route = createFileRoute("/diagnostics")({
  head: () => ({
    meta: [
      { title: "Diagnostics — CODE RUSH 1.0" },
      { name: "description", content: "Backend diagnostics for CODE RUSH 1.0: environment configuration status and enabled backend features." },
      { property: "og:title", content: "Diagnostics — CODE RUSH 1.0" },
      { property: "og:description", content: "Environment and backend feature status for the CODE RUSH 1.0 platform." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Diagnostics,
});

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest ${
        ok
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-destructive/50 bg-destructive/10 text-destructive"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

function Diagnostics() {
  const { data, isLoading, isFetching, error, refetch } = useQuery<Report>({
    queryKey: ["diagnostics"],
    queryFn: () => getDiagnostics(),
    staleTime: 15_000,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">System</p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-wide sm:text-4xl">
            Diagnostics <span className="neon-text">Panel</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configuration presence only — secret values are never displayed.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-md border border-primary/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load diagnostics.
        </div>
      )}

      {data && (
        <div className="space-y-8">
          <section className="rounded-2xl border border-primary/30 bg-card/70 p-6 backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider">
              <Server className="h-4 w-4 text-primary" /> Backend features
            </h2>
            <ul className="mt-4 space-y-3">
              {data.features.map((f) => (
                <li
                  key={f.name}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{f.detail}</p>
                  </div>
                  <StatusPill ok={f.enabled} label={f.enabled ? "Enabled" : "Disabled"} />
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-primary/30 bg-card/70 p-6 backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-primary" /> Environment
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-2 pr-4 font-semibold">Variable</th>
                    <th className="py-2 pr-4 font-semibold">Value</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.env.map((e) => (
                    <tr key={e.name} className="border-t border-border/50">
                      <td className="py-3 pr-4 font-mono text-xs text-foreground">{e.name}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                        {e.scope === "secret" ? "redacted" : (e.value ?? "—")}
                      </td>
                      <td className="py-3">
                        <StatusPill ok={e.present} label={e.present ? "Set" : "Missing"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-center text-xs text-muted-foreground">
            Generated {new Date(data.generatedAt).toUTCString()}
          </p>
        </div>
      )}
    </div>
  );
}
