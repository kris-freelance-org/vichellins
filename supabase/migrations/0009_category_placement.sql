-- Per-category placement toggles. Existing categories keep showing everywhere
-- (true default); admins can hide a category from the homepage or the top nav
-- without removing it from the shop or breaking existing /category/<slug> links.
alter table categories add column show_on_homepage boolean not null default true;
alter table categories add column show_on_nav boolean not null default true;
