"use server";

import { revalidatePath } from "next/cache";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { done, fail, friendlyError, type ActionState } from "@/lib/admin/errors";
import { formString, parseNaira } from "@/lib/admin/util";
import { createClient } from "@/lib/supabase/server";

const METHODS = ["cash", "transfer", "card", "pos", "other"] as const;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function addMember(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const name = formString(form, "name");
  const phone = formString(form, "phone");
  const email = formString(form, "email").toLowerCase();
  const notes = formString(form, "notes");
  if (!name) return fail("Enter the guest's name.");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address, or leave it blank.");

  const supabase = await createClient();
  const { error } = await supabase.from("workspace_members").insert({ name, phone, email, notes });
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/workspace");
  return done(`${name} added.`);
}

export async function recordSubscription(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const memberId = formString(form, "member_id");
  const plan = formString(form, "plan");
  const amount = parseNaira(form.get("amount"));
  const method = formString(form, "payment_method") || "cash";
  const durationDays = Number.parseInt(formString(form, "duration_days") || "0", 10);
  const startRaw = formString(form, "start_date");
  const notes = formString(form, "notes");

  if (!memberId) return fail("Choose a member.");
  if (!plan) return fail("Enter a plan name (e.g. Day pass, Monthly).");
  if (amount === null) return fail("Enter the amount paid in naira.");
  if (!(METHODS as readonly string[]).includes(method)) return fail("Choose a payment method.");
  if (!Number.isInteger(durationDays) || durationDays <= 0 || durationDays > 3650) {
    return fail("Enter how many days the plan covers (1–3650).");
  }

  const start = startRaw ? new Date(startRaw) : new Date();
  if (Number.isNaN(start.getTime())) return fail("Enter a valid start date.");
  const end = addDays(start, durationDays - 1);

  const supabase = await createClient();
  const { error } = await supabase.from("workspace_subscriptions").insert({
    member_id: memberId,
    plan,
    amount,
    payment_method: method,
    start_date: toISODate(start),
    end_date: toISODate(end),
    status: "active",
    notes,
  });
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/workspace");
  return done(`Payment recorded. Access runs ${toISODate(start)} to ${toISODate(end)}.`);
}

export async function cancelSubscription(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const id = formString(form, "id");
  if (!id) return fail("Missing subscription.");
  const supabase = await createClient();
  const { error } = await supabase.from("workspace_subscriptions").update({ status: "cancelled" }).eq("id", id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/workspace");
  return done("Subscription cancelled.");
}

export async function removeMember(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const id = formString(form, "id");
  if (!id) return fail("Missing member.");
  const supabase = await createClient();
  const { error } = await supabase.from("workspace_members").delete().eq("id", id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/workspace");
  return done("Member removed.");
}
