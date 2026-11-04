"use server";

import { revalidatePath } from "next/cache";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { done, fail, friendlyError, type ActionState } from "@/lib/admin/errors";
import { formString, parseNaira } from "@/lib/admin/util";
import { createClient } from "@/lib/supabase/server";

const METHODS = ["cash", "transfer", "card", "pos", "other"] as const;
const DAY_PASS_PLAN = "Day pass";

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

/**
 * The customer arrived, paid, and the admin is logging it. We either reuse
 * an existing member (matched by phone, then by lowercase name) or create a
 * fresh one, then record a workspace_subscription covering just the booked
 * day. The booking itself flips to 'confirmed' so it drops off the arrivals
 * list.
 */
export async function confirmBooking(_prev: ActionState, form: FormData): Promise<ActionState> {
  const me = await requireStaff(COMMERCE);
  const id = formString(form, "id");
  const amount = parseNaira(form.get("amount"));
  const method = formString(form, "payment_method") || "cash";
  if (!id) return fail("Missing booking.");
  if (amount === null) return fail("Enter the amount paid in naira.");
  if (!(METHODS as readonly string[]).includes(method)) return fail("Choose a payment method.");

  const supabase = await createClient();
  const { data: booking, error: lookupError } = await supabase
    .from("workspace_bookings")
    .select("id, name, phone, email, booking_date, status")
    .eq("id", id)
    .maybeSingle();
  if (lookupError) return fail(friendlyError(lookupError));
  if (!booking) return fail("That booking no longer exists.");
  if (booking.status !== "pending") return fail("This booking has already been handled.");

  // Prefer matching on phone — it's the most reliable identifier for walk-ins.
  let memberId: string | null = null;
  const phone = booking.phone?.trim() ?? "";
  if (phone) {
    const { data: byPhone } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();
    if (byPhone) memberId = byPhone.id;
  }
  if (!memberId) {
    const { data: byName } = await supabase
      .from("workspace_members")
      .select("id")
      .ilike("name", booking.name.trim())
      .limit(1)
      .maybeSingle();
    if (byName) memberId = byName.id;
  }
  if (!memberId) {
    const { data: created, error: insertError } = await supabase
      .from("workspace_members")
      .insert({ name: booking.name, phone: booking.phone, email: booking.email })
      .select("id")
      .single();
    if (insertError || !created) return fail(friendlyError(insertError));
    memberId = created.id;
  }

  const { data: subscription, error: subError } = await supabase
    .from("workspace_subscriptions")
    .insert({
      member_id: memberId,
      plan: DAY_PASS_PLAN,
      amount,
      payment_method: method,
      start_date: booking.booking_date,
      end_date: booking.booking_date,
      status: "active",
      notes: `From booking on ${booking.booking_date}`,
    })
    .select("id")
    .single();
  if (subError || !subscription) return fail(friendlyError(subError));

  const { error: updateError } = await supabase
    .from("workspace_bookings")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      confirmed_by: me.id,
      subscription_id: subscription.id,
    })
    .eq("id", id);
  if (updateError) return fail(friendlyError(updateError));

  revalidatePath("/admin/workspace");
  return done(`Payment confirmed for ${booking.name}.`);
}

export async function cancelBooking(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const id = formString(form, "id");
  if (!id) return fail("Missing booking.");
  const supabase = await createClient();
  const { error } = await supabase.from("workspace_bookings").update({ status: "cancelled" }).eq("id", id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/workspace");
  return done("Booking cancelled.");
}

export async function markNoShow(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(COMMERCE);
  const id = formString(form, "id");
  if (!id) return fail("Missing booking.");
  const supabase = await createClient();
  const { error } = await supabase.from("workspace_bookings").update({ status: "no_show" }).eq("id", id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/admin/workspace");
  return done("Marked as no-show.");
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
