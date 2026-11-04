import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase sends magic/recovery links here with ?code=<pkce>&next=<destination>.
 * We swap the code for a real session cookie, then forward to the destination
 * (defaulting to the admin panel). Failures land on the login screen.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const raw = url.searchParams.get("next") ?? "/admin";
  const next = raw.startsWith("/admin") && !raw.startsWith("//") && !raw.includes("\\") ? raw : "/admin";

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/admin/login?error=expired_link", url.origin));
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
