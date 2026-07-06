CREATE TABLE public.round2_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  language text NOT NULL,
  code text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX round2_submissions_email_key ON public.round2_submissions (email);
GRANT ALL ON public.round2_submissions TO service_role;
ALTER TABLE public.round2_submissions ENABLE ROW LEVEL SECURITY;