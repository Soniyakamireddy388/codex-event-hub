ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS round1_violations integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS round2_violations integer NOT NULL DEFAULT 0;