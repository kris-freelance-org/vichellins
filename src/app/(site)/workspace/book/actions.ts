"use server";

import { redirect } from "next/navigation";
import { fail, type ActionState } from "@/lib/admin/errors";
import { formString } from "@/lib/admin/util";
import { createClient } from "@/lib/supabase/server";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

export async function createBooking(_prev: ActionState, form: FormData): Promise<ActionState> {
  const name = formString(form, "name");
  const phone = formString(form, "phone");
  const email = formString(form, "email").toLowerCase();
  const booking_date = formString(form, "booking_date");
  const notes = formString(form, "notes").slice(0, 500);

  if (name.length < 2) return fail("Enter your full name.");
  if (!/^(?:\+?234|0)[789][01]\d{8}$/.test(phone.replace(/[\s-]/g, ""))) {
    return fail("Enter a valid Nigerian phone number, e.g. 08012345678.");
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email or leave it blank.");
  if (!isValidDate(booking_date)) return fail("Choose a visit date.");

  const today = new Date().toISOString().slice(0, 10);
  if (booking_date < today) return fail("Pick today or a future date.");

  const supabase = await createClient();
  const { error } = await supabase.from("workspace_bookings").insert({
    name,
    phone,
    email,
    booking_date,
    notes,
  });
  if (error) return fail("Couldn't save your booking. Please try again or reach out on WhatsApp.");

  redirect(`/workspace/book/success?date=${booking_date}&name=${encodeURIComponent(name)}`);
}
