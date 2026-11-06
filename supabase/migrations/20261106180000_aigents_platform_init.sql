-- AIGents platform: DiAntonio's Demo & Hauling — consolidated schema (replaces Lovable Cloud project).
-- Security fixes vs. the Lovable schema:
--   * admin role is granted only to an explicit allowlist (Lovable version made EVERY signup an admin)
--   * availability can only be changed by admins (Lovable version let anonymous visitors edit it)
--   * new quote requests notify Corey server-side via a DB webhook (no public email-sending endpoint)

create extension if not exists pg_net schema extensions;

-- ---------- roles ----------
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create table public.admin_allowlist (
  email text primary key
);
alter table public.admin_allowlist enable row level security; -- no policies: service role only
insert into public.admin_allowlist (email) values
  ('tonykates@gmail.com'),
  ('t0nykates@gmail.com'),
  ('coreydiantonio18@icloud.com'),
  ('dakotaskyekates@gmail.com'),
  ('dakates24@gmail.com');

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.admin_allowlist where email = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created_role after insert on auth.users
  for each row execute function public.handle_new_user_role();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- ---------- availability ----------
create table public.availability (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'open' check (status in ('open','filling','full')),
  message text not null default 'This week — openings available' check (length(message) between 1 and 200),
  updated_at timestamptz not null default now()
);
alter table public.availability enable row level security;
create policy "Public can read availability" on public.availability for select using (true);
create policy "Admins can update availability" on public.availability for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert availability" on public.availability for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
insert into public.availability (status, message) values ('open', 'This week — openings available');

-- ---------- quote requests (leads) ----------
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service text,
  zip text,
  message text,
  source text default 'website',
  status text not null default 'new'
    check (status in ('new','contacted','quoted','booked','follow_up','closed')),
  estimate_low numeric(10,2),
  estimate_high numeric(10,2),
  follow_up_date date,
  lead_notes text,
  created_at timestamptz not null default now()
);
alter table public.quote_requests enable row level security;

create policy "Anyone can submit a quote request" on public.quote_requests for insert
  with check (
    length(name) between 1 and 120
    and length(phone) between 7 and 30
    and (service is null or length(service) <= 80)
    and (zip is null or length(zip) <= 12)
    and (message is null or length(message) <= 2000)
    and status = 'new'
  );
create policy "Admins can view quote requests" on public.quote_requests for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update quote requests" on public.quote_requests for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete quote requests" on public.quote_requests for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert quote requests" on public.quote_requests for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- jobs ----------
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  job_number serial,
  job_name text not null,
  service_type text not null check (service_type in ('demolition','junk_removal','hauling')),
  customer_name text not null,
  customer_phone text,
  job_address text,
  zip text,
  job_date date,
  status text not null default 'scheduled'
    check (status in ('scheduled','in_progress','completed','invoiced','paid','issue')),
  quoted_amount numeric(10,2),
  final_amount numeric(10,2),
  paid boolean not null default false,
  payment_method text check (payment_method in ('cash','card','venmo','zelle','check')),
  google_review_requested boolean not null default false,
  before_photo_url text,
  after_photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.jobs enable row level security;
create policy "Admins manage jobs" on public.jobs for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger jobs_touch_updated_at before update on public.jobs
  for each row execute function public.touch_updated_at();

-- ---------- storage: job photos ----------
insert into storage.buckets (id, name, public) values ('job-photos', 'job-photos', true)
  on conflict (id) do nothing;
create policy "Admins can upload job photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'job-photos' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can update job photos" on storage.objects for update to authenticated
  using (bucket_id = 'job-photos' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete job photos" on storage.objects for delete to authenticated
  using (bucket_id = 'job-photos' and public.has_role(auth.uid(), 'admin'));

-- ---------- new-lead notification (DB webhook -> notify-new-lead edge function) ----------
-- The shared secret lives in Vault as 'lead_hook_secret' and must match the
-- LEAD_HOOK_SECRET edge-function secret.
create or replace function public.notify_new_lead()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare
  hook_secret text;
begin
  select decrypted_secret into hook_secret from vault.decrypted_secrets where name = 'lead_hook_secret';
  if hook_secret is null then
    return new;
  end if;
  perform net.http_post(
    url := 'https://losvrrrhhwgfcmfgfyze.supabase.co/functions/v1/notify-new-lead',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-lead-hook-secret', hook_secret),
    body := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
exception when others then
  return new; -- never block a lead from being saved
end;
$$;
revoke execute on function public.notify_new_lead() from public, anon, authenticated;
create trigger quote_requests_notify after insert on public.quote_requests
  for each row execute function public.notify_new_lead();
