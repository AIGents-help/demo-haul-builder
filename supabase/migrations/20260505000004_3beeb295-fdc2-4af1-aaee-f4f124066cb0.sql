
-- availability table (single-row pattern)
CREATE TABLE public.availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','filling','full')),
  message TEXT NOT NULL DEFAULT 'This week — openings available',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read availability"
  ON public.availability FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can update availability"
  ON public.availability FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can insert availability"
  ON public.availability FOR INSERT
  TO authenticated
  WITH CHECK (true);

INSERT INTO public.availability (status, message)
VALUES ('open', 'This week — openings available');

-- quote_requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  zip TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 7 AND 30
    AND (service IS NULL OR length(service) <= 80)
    AND (zip IS NULL OR length(zip) <= 12)
    AND (message IS NULL OR length(message) <= 2000)
  );

CREATE POLICY "Authenticated can view quote requests"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (true);
