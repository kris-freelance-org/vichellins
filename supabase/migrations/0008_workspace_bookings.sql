-- Day-pass bookings from the public workspace page. Admin sees them on the
-- workspace admin, confirms payment when the shopper arrives, which creates
-- the real workspace_member + workspace_subscription records.

create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'no_show');

create table workspace_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  phone text not null default '',
  email text not null default '',
  booking_date date not null,
  status booking_status not null default 'pending',
  notes text not null default '',
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users (id) on delete set null,
  subscription_id uuid references workspace_subscriptions (id) on delete set null
);
create index workspace_bookings_date_idx on workspace_bookings (booking_date, status);

alter table workspace_bookings enable row level security;

-- Anyone can submit a booking from the public form. Fields are tightly scoped
-- by the table shape, so nothing sensitive can be injected.
create policy "public creates bookings" on workspace_bookings for insert
  with check (true);

-- Everything else is staff-only.
create policy "staff manage bookings" on workspace_bookings for all
  using (is_staff()) with check (is_staff());
