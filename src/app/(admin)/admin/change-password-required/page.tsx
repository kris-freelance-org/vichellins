import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { getStaff } from "@/lib/admin/auth";
import { signOut } from "../actions";
import { ForcedChangeForm } from "./ForcedChangeForm";

export const metadata: Metadata = { title: "Set your password" };

export default async function ChangePasswordRequiredPage() {
  const me = await getStaff();
  if (!me) redirect("/admin/login");
  // Clearing the flag already? Send them on to the dashboard.
  if (!me.mustChangePassword) redirect("/admin");

  return (
    <main className="admin-login">
      <section className="admin-login-brand" aria-label="Vichellins store management">
        <Logo className="h-12 w-auto rounded-lg" />
        <div className="relative z-10 my-auto py-16">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-marine-100">One quick step</p>
          <h2 className="max-w-lg text-[clamp(3rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Make this<br /><span className="text-gold-400">yours.</span></h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-marine-100">Your account was set up with a temporary password. Pick a new one before using the admin.</p>
        </div>
        <p className="relative z-10 text-[11px] text-marine-100">Vichellins Nation · Lagos, Nigeria</p>
        <div className="admin-login-orbit" aria-hidden="true" />
      </section>
      <section className="admin-login-content" aria-labelledby="forced-title">
        <form action={signOut} className="mb-12 self-start">
          <button type="submit" className="inline-flex min-h-11 items-center gap-2 text-xs text-muted hover:text-marine-700">
            <AdminIcon name="logout" className="h-4 w-4" /> Sign out
          </button>
        </form>
        <div className="admin-login-form">
          <div className="mb-9 lg:hidden"><Logo className="h-11 w-auto rounded-lg" /></div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-marine-700">Set your password</p>
          <h1 id="forced-title" className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Pick a new password</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">Signed in as {me.email}. The temporary password you were given won&apos;t work after this.</p>
          <ForcedChangeForm />
        </div>
      </section>
    </main>
  );
}
