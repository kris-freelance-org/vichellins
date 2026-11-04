import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { AddZoneForm, BankAccountForm, PaymentDefaultsForm, ZoneRow } from "./forms";

export const metadata = { title: "Delivery settings" };

type PaymentMethods = { cod?: boolean; transfer?: boolean };
type BankAccount = { bank_name?: string; account_name?: string; account_number?: string };

export default async function DeliverySettingsPage() {
  await requireStaff(COMMERCE);
  const supabase = await createClient();
  const [{ data: zoneRows }, { data: settingRows }] = await Promise.all([
    supabase
      .from("delivery_zones")
      .select("id, name, fee, eta, is_active, sort_order")
      .order("sort_order")
      .order("name"),
    supabase
      .from("settings")
      .select("key, value")
      .in("key", ["payment.methods", "payment.bank_account"]),
  ]);

  const zones = zoneRows ?? [];
  const settings = Object.fromEntries((settingRows ?? []).map((r) => [r.key, r.value])) as {
    "payment.methods"?: PaymentMethods;
    "payment.bank_account"?: BankAccount;
  };
  const methods = settings["payment.methods"] ?? { cod: true, transfer: true };
  const bank = settings["payment.bank_account"] ?? {};

  return (
    <>
      <PageHeader
        title="Delivery settings"
        description="Set how shoppers pay and where you deliver. Changes take effect on checkout immediately."
      />
      <div className="space-y-6">
        <Card title="Default payment methods" description="Applies to every product unless you set a different choice on the product itself.">
          <PaymentDefaultsForm cod={methods.cod ?? true} transfer={methods.transfer ?? true} />
        </Card>

        <Card title="Bank account details" description="Only used when a shopper chooses bank transfer.">
          <BankAccountForm
            bankName={bank.bank_name ?? ""}
            accountName={bank.account_name ?? ""}
            accountNumber={bank.account_number ?? ""}
          />
        </Card>

        <Card title="Delivery areas" description="Delivery is within Lagos only. Each area has a flat fee shoppers choose at checkout.">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-marine-900">Add an area</h3>
              <AddZoneForm />
            </div>
            {zones.length === 0 ? (
              <EmptyState title="No delivery areas yet" body="Add at least one area, or shoppers won't be able to check out." />
            ) : (
              <ul className="space-y-3">{zones.map((z) => <ZoneRow key={z.id} zone={z} />)}</ul>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
