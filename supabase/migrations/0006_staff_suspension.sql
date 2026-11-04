-- Staff can be suspended without removing them: their row stays (role, name,
-- history preserved) but they lose every staff-granted database privilege and
-- are redirected to login on the next admin request.

alter table staff add column is_active boolean not null default true;

create or replace function has_role(roles staff_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff
    where user_id = auth.uid()
      and role = any (roles)
      and is_active
  );
$$;
