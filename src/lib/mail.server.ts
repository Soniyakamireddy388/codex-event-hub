// Server-only helper for sending admin notification emails via the Gmail connector gateway.
// Do not import this from client code.

const ADMIN_EMAIL = "soniyakamireddy.ai@gmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function base64UrlEncode(str: string): string {
  // btoa handles ASCII; encode UTF-8 bytes first.
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRawEmail(opts: { to: string; subject: string; text: string }): string {
  const headers = [
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
  ].join("\r\n");
  const message = `${headers}\r\n\r\n${opts.text}`;
  return base64UrlEncode(message);
}

export async function sendAdminEmail(subject: string, text: string): Promise<void> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_MAIL_API_KEY = process.env.GOOGLE_MAIL_API_KEY;
  if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
    console.warn("[mail] Skipping admin email — Gmail connector env vars are missing.");
    return;
  }

  const raw = buildRawEmail({ to: ADMIN_EMAIL, subject, text });

  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[mail] Gmail send failed [${res.status}]: ${body}`);
    // Do not throw — email is a non-blocking side-effect of submission.
  }
}

export function formatSubmissionTime(iso: string): string {
  // e.g. "8 July 2026 10:35 AM"
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year} ${hours}:${minutes} ${ampm} UTC`;
}
