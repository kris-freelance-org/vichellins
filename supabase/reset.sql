-- Fresh-start reset for client hand-off.
-- Wipes every user-entered row (products, orders, content, workspace data, analytics)
-- while leaving the schema, staff accounts, and auth users intact.
--
-- How to run:
--   1. Open Supabase dashboard -> SQL Editor
--   2. Paste this file, run it
--   3. Rotate the project API keys afterwards (Settings -> API)
--
-- Note: This does NOT clear Supabase Storage. Old image files stay in the
-- `product-images` bucket but become orphaned (no row points at them). If you
-- also want Storage cleared, do it from Supabase dashboard -> Storage.

begin;

truncate table
  analytics_events,
  inventory_movements,
  payments,
  order_events,
  order_items,
  orders,
  variants,
  product_option_values,
  product_options,
  product_images,
  products,
  spec_definitions,
  categories,
  brands,
  discount_codes,
  delivery_zones,
  content_blocks,
  settings,
  site_settings,
  workspace_subscriptions,
  workspace_bookings,
  workspace_members
restart identity cascade;

alter sequence order_number_seq restart with 1001;

commit;
