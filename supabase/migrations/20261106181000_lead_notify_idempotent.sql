alter table public.quote_requests add column notified_at timestamptz;

create or replace function public.notify_new_lead()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
begin
  -- The edge function re-reads the row with the service role and only emails
  -- fresh, not-yet-notified leads, so no shared secret is needed.
  perform net.http_post(
    url := 'https://losvrrrhhwgfcmfgfyze.supabase.co/functions/v1/notify-new-lead',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('id', new.id)
  );
  return new;
exception when others then
  return new;
end;
$$;
revoke execute on function public.notify_new_lead() from public, anon, authenticated;
