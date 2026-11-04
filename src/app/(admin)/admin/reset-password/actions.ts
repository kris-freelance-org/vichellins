"use server";

import { redirect } from "next/navigation";
import { fail, type ActionState } from "@/lib/admin/errors";
import { createClient } from "@/lib/supabase/server";

export async function finishReset(_prev: ActionState, form: FormData): Promise<ActionState> {
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (next.length < 10) return fail("Use at least 10 characters for the new password.");
  if (next !== confirm) return fail("The two new passwords don't match.");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return fail("Your reset link expired. Please request a new one.");

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    return fail(error.message.includes("weak") ? "That password is too easy to guess. Try a longer one." : "Couldn't change the password. Please try again.");
  }

  redirect("/admin/login?reset=1");
}
