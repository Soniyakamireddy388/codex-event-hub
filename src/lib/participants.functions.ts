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

    const qualified = score / total >= 0.6;
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
