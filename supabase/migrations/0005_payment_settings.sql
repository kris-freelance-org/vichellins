-- Payment method defaults, bank account details, and per-product overrides.

-- Per-product override: null means "inherit the global defaults".
-- When set, must contain at least one and only valid method keys.
alter table products add column payment_methods text[]
  check (
    payment_methods is null
    or (
      array_length(payment_methods, 1) between 1 and 2
      and payment_methods <@ array['cod', 'transfer']
    )
  );

-- Seed site-wide defaults. Both methods on; bank details start blank
-- so the owner is prompted to fill them in from the admin page.
insert into settings (key, value) values
  ('payment.methods', '{"cod": true, "transfer": true}'::jsonb),
  ('payment.bank_account', '{"bank_name": "", "account_name": "", "account_number": ""}'::jsonb)
on conflict (key) do nothing;

-- Checkout needs to read these without authentication.
create policy "public reads payment settings" on settings for select
  using (key in ('payment.methods', 'payment.bank_account'));
