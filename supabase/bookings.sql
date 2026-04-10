create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  service_title text not null,
  service_duration text not null default '60 min',
  appointment_date date not null,
  appointment_time text not null,
  client_name text not null,
  client_phone text not null,
  client_email text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.bookings add column if not exists source text not null default 'website';
alter table public.bookings add column if not exists calendar_sync_status text not null default 'not_configured';
alter table public.bookings add column if not exists calendar_provider text not null default 'none';
alter table public.bookings add column if not exists external_event_id text;
alter table public.bookings add column if not exists synced_at timestamptz;
alter table public.bookings add column if not exists sync_error text;

alter table public.bookings drop constraint if exists bookings_calendar_sync_status_check;
alter table public.bookings
  add constraint bookings_calendar_sync_status_check
  check (calendar_sync_status in ('not_configured', 'pending', 'synced', 'failed'));

alter table public.bookings enable row level security;

drop policy if exists "Allow public inserts for bookings" on public.bookings;
create policy "Allow public inserts for bookings"
on public.bookings
for insert
to anon
with check (true);

drop policy if exists "Allow public reads for bookings" on public.bookings;
drop policy if exists "Allow authenticated reads for bookings" on public.bookings;
create policy "Allow authenticated reads for bookings"
on public.bookings
for select
to authenticated
using (true);

drop policy if exists "Allow public updates for bookings" on public.bookings;
drop policy if exists "Allow authenticated updates for bookings" on public.bookings;
create policy "Allow authenticated updates for bookings"
on public.bookings
for update
to authenticated
using (true)
with check (true);

create index if not exists bookings_appointment_date_idx
  on public.bookings (appointment_date, appointment_time);

create index if not exists bookings_calendar_sync_status_idx
  on public.bookings (calendar_sync_status);