import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export type ParticipantStatus =
  | { status: "round1"; email: string }
  | { status: "round2"; email: string }
  | { status: "not_qualified"; email: string };

// Register or look up a participant by email. Returns where the app should route them.
export const loginParticipant = createServerFn({ method: "POST" })
  .inputValidator((input) => emailSchema.parse(input))
  .handler(async ({ data }): Promise<ParticipantStatus> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email;

    // Upsert by email; if exists, this returns the existing row.
    const { data: existing, error: selErr } = await supabaseAdmin
      .from("participants")
      .select("email, round1_completed, qualified")
      .eq("email", email)
      .maybeSingle();
    if (selErr) throw new Error(selErr.message);

    let row = existing;
    if (!row) {
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from("participants")
        .insert({ email })
        .select("email, round1_completed, qualified")
        .single();
      if (insErr) throw new Error(insErr.message);
      row = inserted;
    }

    if (!row.round1_completed) return { status: "round1", email };
    if (row.qualified) return { status: "round2", email };
    return { status: "not_qualified", email };
  });

// Fetch a participant's current status (used to guard round pages).
export const getParticipantStatus = createServerFn({ method: "POST" })
  .inputValidator((input) => emailSchema.parse(input))
  .handler(async ({ data }): Promise<ParticipantStatus> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email;

    const { data: row, error } = await supabaseAdmin
      .from("participants")
      .select("email, round1_completed, qualified")
      .eq("email", email)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { status: "round1", email }; // not registered → treat as fresh

    if (!row.round1_completed) return { status: "round1", email };
    if (row.qualified) return { status: "round2", email };
    return { status: "not_qualified", email };
  });

// Submit Round 1. Prevents multiple attempts. Qualification threshold: >= 60%.
const submitSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  score: z.number().int().min(0).max(1000),
  total: z.number().int().min(1).max(1000),
});

export const submitRound1 = createServerFn({ method: "POST" })
  .inputValidator((input) => submitSchema.parse(input))
  .handler(async ({ data }): Promise<{ qualified: boolean; score: number; total: number }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { email, score, total } = data;

    const { data: existing, error: selErr } = await supabaseAdmin
      .from("participants")
      .select("round1_completed, qualified, round1_score")
      .eq("email", email)
      .maybeSingle();
    if (selErr) throw new Error(selErr.message);
    if (!existing) throw new Error("Participant not found. Please log in again.");
    if (existing.round1_completed) {
      throw new Error("You have already attempted Round 1.");
    }

    const qualified = score > 10;
    const { error: upErr } = await supabaseAdmin
      .from("participants")
      .update({
        round1_completed: true,
        round1_score: score,
        qualified,
        round1_completed_at: new Date().toISOString(),
      })
      .eq("email", email);
    if (upErr) throw new Error(upErr.message);

    return { qualified, score, total };
  });

// Submit Round 2 code. Only qualified participants may submit.
const round2Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  language: z.enum(["java", "python", "c"]),
  code: z.string().max(20000),
});

export const submitRound2 = createServerFn({ method: "POST" })
  .inputValidator((input) => round2Schema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { email, language, code } = data;

    const { data: p, error: selErr } = await supabaseAdmin
      .from("participants")
      .select("qualified, round1_completed")
      .eq("email", email)
      .maybeSingle();
    if (selErr) throw new Error(selErr.message);
    if (!p || !p.round1_completed || !p.qualified) {
      throw new Error("You are not qualified for Round 2.");
    }

    const { error: upErr } = await supabaseAdmin
      .from("round2_submissions")
      .upsert(
        { email, language, code, submitted_at: new Date().toISOString() },
        { onConflict: "email" }
      );
    if (upErr) throw new Error(upErr.message);
    return { ok: true };
  });

// Record a violation (tab switch / focus loss) count for the current round.
const violationSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  round: z.enum(["round1", "round2"]),
  count: z.number().int().min(0).max(999),
});

export const recordViolation = createServerFn({ method: "POST" })
  .inputValidator((input) => violationSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const column = data.round === "round1" ? "round1_violations" : "round2_violations";
    const { error } = await supabaseAdmin
      .from("participants")
      .update({ [column]: data.count })
      .eq("email", data.email);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
