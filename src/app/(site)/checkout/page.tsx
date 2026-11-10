import { createClient } from "@/lib/supabase/server";
import { getSitePage, sitePageMetadata } from "@/lib/site-content";
import { CheckoutClient, type BankAccount, type CheckoutZone, type PaymentDefaults } from "./CheckoutClient";

export const dynamic = "force-dynamic";
export const generateMetadata = () => sitePageMetadata("checkout");

export default async function CheckoutPage() {
  const content = await getSitePage("checkout");
  const supabase = await createClient();
  const [{ data: zoneRows }, { data: settingRows }] = await Promise.all([
    supabase
      .from("delivery_zones")
      .select("id, name, fee, eta")
      .eq("is_active", true)
      .order("sort_order")
      .order("name"),
    supabase
      .from("settings")
      .select("key, value")
      .in("key", ["payment.methods", "payment.bank_account"]),
  ]);

  const zones: CheckoutZone[] = (zoneRows ?? []).map((z) => ({
    id: z.id,
    name: z.name,
    fee: z.fee,
    eta: z.eta,
  }));

  const settings = Object.fromEntries((settingRows ?? []).map((r) => [r.key, r.value])) as {
    "payment.methods"?: PaymentDefaults;
    "payment.bank_account"?: BankAccount;
  };
  const defaultMethods: PaymentDefaults = settings["payment.methods"] ?? { cod: true, transfer: true };
  const bank: BankAccount = {
    bank_name: settings["payment.bank_account"]?.bank_name ?? "",
    account_name: settings["payment.bank_account"]?.account_name ?? "",
    account_number: settings["payment.bank_account"]?.account_number ?? "",
  };

  return <CheckoutClient zones={zones} defaultMethods={defaultMethods} bank={bank} copy={content.values} />;
}
