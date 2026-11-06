
DROP POLICY IF EXISTS "Authenticated can update availability" ON public.availability;
DROP POLICY IF EXISTS "Authenticated can insert availability" ON public.availability;

CREATE POLICY "Public can update availability"
  ON public.availability FOR UPDATE
  USING (true) WITH CHECK (
    status IN ('open','filling','full')
    AND length(message) BETWEEN 1 AND 200
  );
