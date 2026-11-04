"use server";

import { revalidatePath } from "next/cache";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { done, fail, friendlyError, type ActionState } from "@/lib/admin/errors";
import { formString, parseNaira } from "@/lib/admin/util";
import { createClient } from "@/lib/supabase/server";

function parseZone(form: FormData) {
  const name = formString(form, "name");
  const fee = parseNaira(form.get("fee"));
  if (!name) return { error: "Enter a name for the area." } as const;
  if (fee === null) return { error: "Enter the delivery fee in naira (0 for free delivery)." } as const;
  return {
    value: {
      name,
      fee,
      eta: formString(form, "eta"),
      sort_order: Number.parseInt(formString(form, "sort_order"), 10) || 0,
    },
  } as const;
}

export async function createZone(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const parsed = parseZone(form);
  if ("error" in parsed) return fail(parsed.error ?? "Check the form.");
  const supabase = await createClient();
  const { error } = await supabase.from("delivery_zones").insert(parsed.value);
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return done(`Added ${parsed.value.name}.`);
}

export async function updateZone(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const id = formString(form, "id");
  const parsed = parseZone(form);
  if ("error" in parsed) return fail(parsed.error ?? "Check the form.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("delivery_zones")
    .update({ ...parsed.value, is_active: form.get("is_active") === "on" })
    .eq("id", id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return done("Saved.");
}

export async function deleteZone(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const supabase = await createClient();
  const { error } = await supabase.from("delivery_zones").delete().eq("id", formString(form, "id"));
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return done("Area deleted.");
}

export async function updatePaymentDefaults(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const cod = form.get("cod") === "on";
  const transfer = form.get("transfer") === "on";
  if (!cod && !transfer) {
    return fail("Keep at least one payment method on, otherwise shoppers can't check out.");
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "payment.methods", value: { cod, transfer } }, { onConflict: "key" });
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return done("Default payment methods saved.");
}

export async function updateBankAccount(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const bank_name = formString(form, "bank_name");
  const account_name = formString(form, "account_name");
  const account_number = formString(form, "account_number").replace(/\s+/g, "");
  if (account_number && !/^\d{10}$/.test(account_number)) {
    return fail("Account number should be 10 digits.");
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert(
      { key: "payment.bank_account", value: { bank_name, account_name, account_number } },
      { onConflict: "key" },
    );
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return done("Bank account details saved.");
}
