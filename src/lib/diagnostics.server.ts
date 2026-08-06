// Server-only diagnostics. NEVER return raw secret values — presence + masked hints only.

export type EnvEntry = {
  name: string;
  present: boolean;
  /** Masked or public value; null when the value is secret. */
  value: string | null;
  scope: "public" | "secret";
};

export type FeatureEntry = {
  name: string;
  enabled: boolean;
  detail: string;
};

export type DiagnosticsReport = {
  generatedAt: string;
  env: EnvEntry[];
  features: FeatureEntry[];
};

function mask(value: string): string {
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 4)}${"•".repeat(6)}${value.slice(-4)}`;
}

export function buildDiagnosticsReport(): DiagnosticsReport {
  const url = process.env.SUPABASE_URL ?? "";
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
  const projectId = process.env.SUPABASE_PROJECT_ID ?? "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const lovableKey = process.env.LOVABLE_API_KEY ?? "";
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY ?? "";

  const env: EnvEntry[] = [
    { name: "SUPABASE_URL", present: !!url, value: url || null, scope: "public" },
    { name: "SUPABASE_PROJECT_ID", present: !!projectId, value: projectId || null, scope: "public" },
    {
      name: "SUPABASE_PUBLISHABLE_KEY",
      present: !!publishable,
      value: publishable ? mask(publishable) : null,
      scope: "public",
    },
    { name: "SUPABASE_SERVICE_ROLE_KEY", present: !!serviceRole, value: null, scope: "secret" },
    { name: "LOVABLE_API_KEY", present: !!lovableKey, value: null, scope: "secret" },
    { name: "GOOGLE_MAIL_API_KEY", present: !!gmailKey, value: null, scope: "secret" },
  ];

  const features: FeatureEntry[] = [
    {
      name: "Database (participants & submissions)",
      enabled: !!url && !!serviceRole,
      detail: "Requires backend URL + privileged server credentials.",
    },
    {
      name: "Public client reads",
      enabled: !!url && !!publishable,
      detail: "Browser client configured with publishable key.",
    },
    {
      name: "Admin email notifications (Gmail)",
      enabled: !!lovableKey && !!gmailKey,
      detail: "Round 1 / Round 2 summary emails to the organiser inbox.",
    },
  ];

  return { generatedAt: new Date().toISOString(), env, features };
}
