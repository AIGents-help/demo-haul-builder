-- Extend quote_requests
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','quoted','booked','follow_up','closed')),
  ADD COLUMN IF NOT EXISTS estimate_low numeric(10,2),
  ADD COLUMN IF NOT EXISTS estimate_high numeric(10,2),
  ADD COLUMN IF NOT EXISTS follow_up_date date,
  ADD COLUMN IF NOT EXISTS lead_notes text;

-- Allow admins to update quote_requests (for status changes)
DROP POLICY IF EXISTS "Admins can update quote requests" ON public.quote_requests;
CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete quote requests" ON public.quote_requests;
CREATE POLICY "Admins can delete quote requests"
  ON public.quote_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number serial,
  job_name text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('demolition','junk_removal','hauling')),
  customer_name text NOT NULL,
  customer_phone text,
  job_address text,
  zip text,
  job_date date,
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','in_progress','completed','invoiced','paid','issue')),
  quoted_amount numeric(10,2),
  final_amount numeric(10,2),
  paid boolean NOT NULL DEFAULT false,
  payment_method text CHECK (payment_method IN ('cash','card','venmo','zelle','check')),
  google_review_requested boolean NOT NULL DEFAULT false,
  before_photo_url text,
  after_photo_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view jobs" ON public.jobs;
CREATE POLICY "Admins can view jobs" ON public.jobs FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert jobs" ON public.jobs;
CREATE POLICY "Admins can insert jobs" ON public.jobs FOR INSERT
  TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update jobs" ON public.jobs;
CREATE POLICY "Admins can update jobs" ON public.jobs FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;
CREATE POLICY "Admins can delete jobs" ON public.jobs FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS jobs_touch_updated_at ON public.jobs;
CREATE TRIGGER jobs_touch_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage bucket for job photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos', 'job-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view job photos" ON storage.objects;
CREATE POLICY "Public can view job photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'job-photos');

DROP POLICY IF EXISTS "Admins can upload job photos" ON storage.objects;
CREATE POLICY "Admins can upload job photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'job-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update job photos" ON storage.objects;
CREATE POLICY "Admins can update job photos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'job-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete job photos" ON storage.objects;
CREATE POLICY "Admins can delete job photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'job-photos' AND public.has_role(auth.uid(), 'admin'));