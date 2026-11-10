-- Page editing is available to the content team, including editors. Keep the
-- existing commerce policies for other settings and limit this policy to pages.
create policy "content team inserts pages" on public.site_settings
  for insert to authenticated
  with check (
    (key like 'page:%' or key = 'homepage')
    and public.has_role(array['owner', 'staff', 'editor']::public.staff_role[])
  );

create policy "content team updates pages" on public.site_settings
  for update to authenticated
  using (
    (key like 'page:%' or key = 'homepage')
    and public.has_role(array['owner', 'staff', 'editor']::public.staff_role[])
  )
  with check (
    (key like 'page:%' or key = 'homepage')
    and public.has_role(array['owner', 'staff', 'editor']::public.staff_role[])
  );
