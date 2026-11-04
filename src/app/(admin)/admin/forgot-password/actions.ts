"use server";

import { headers } from "next/headers";
import { done, fail, type ActionState } from "@/lib/admin/errors";
import { createClient } from "@/lib/supabase/server";

function siteOrigin(host: string | null): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (!host) return "http://localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function requestReset(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.");

  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = siteOrigin(requestHeaders.get("host"));
  const redirectTo = `${origin}/auth/callback?next=/admin/reset-password`;

  await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  // We never say whether the email exists in the system: that would let outsiders
  // enumerate staff. Either way, the response is the same.
  return done("If that email has an admin account, we've sent a reset link. Check your inbox and spam folder.");
}
