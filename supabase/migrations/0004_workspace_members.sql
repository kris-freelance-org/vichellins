-- Workspace membership: walk-in guests and manually-recorded subscription payments.
-- No online billing engine; staff record payments made in person or by transfer.
-- A member's current status is derived from the newest subscription row.

create type membership_status as enum ('active', 'expired', 'cancelled');

create table workspace_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  phone text not null default '',
  email text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);
create index workspace_members_name_idx on workspace_members (lower(name));

create table workspace_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references workspace_members (id) on delete cascade,
  plan text not null check (length(trim(plan)) > 0),
  amount integer not null check (amount >= 0),
  payment_method text not null default 'cash',
  start_date date not null,
  end_date date not null,
  status membership_status not null default 'active',
  notes text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  check (end_date >= start_date)
);
create index workspace_subscriptions_member_idx on workspace_subscriptions (member_id);
create index workspace_subscriptions_end_idx on workspace_subscriptions (end_date);

alter table workspace_members enable row level security;
alter table workspace_subscriptions enable row level security;

create policy "staff manage members" on workspace_members for all
  using (is_staff()) with check (is_staff());
create policy "staff manage subscriptions" on workspace_subscriptions for all
  using (is_staff()) with check (is_staff());
