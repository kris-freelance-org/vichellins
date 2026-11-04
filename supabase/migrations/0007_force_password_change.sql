-- When the owner creates a staff member or resets their password, the temp
-- password lets them sign in once. The admin shell redirects them to a
-- lockdown page where they must pick a new password before doing anything else.
alter table staff add column must_change_password boolean not null default false;
