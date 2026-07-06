
CREATE TABLE public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  round1_completed boolean NOT NULL DEFAULT false,
  round1_score integer,
  qualified boolean NOT NULL DEFAULT false,
  round1_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX participants_email_idx ON public.participants (lower(email));

GRANT ALL ON public.participants TO service_role;

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (server functions) can access this table.
