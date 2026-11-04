"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import { fail, type ActionState } from "@/lib/admin/errors";
import { createClient } from "@/lib/supabase/server";

export async function finishForcedChange(_prev: ActionState, form: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  if (next.length < 10) return fail("Use at least 10 characters for the new password.");
  if (next !== confirm) return fail("The two new passwords don't match.");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    return fail(error.message.includes("weak") ? "That password is too easy to guess. Try a longer one." : "Couldn't change the password. Please try again.");
  }

  const { error: flagError } = await supabase.from("staff").update({ must_change_password: false }).eq("user_id", me.id);
  if (flagError) return fail("Password changed, but we couldn't clear the reset flag. Please try signing in again.");

  redirect("/admin");
}
