import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <main className="admin-login">
      <section className="admin-login-brand" aria-label="Vichellins store management">
        <Logo className="h-12 w-auto rounded-lg" />
        <div className="relative z-10 my-auto py-16">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-marine-100">Locked out?</p>
          <h2 className="max-w-lg text-[clamp(3rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">We&apos;ll get you<br /><span className="text-gold-400">back in.</span></h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-marine-100">Enter the email tied to your admin account and we&apos;ll send a one-time link to pick a new password.</p>
        </div>
        <p className="relative z-10 text-[11px] text-marine-100">Vichellins Nation · Lagos, Nigeria</p>
        <div className="admin-login-orbit" aria-hidden="true" />
      </section>
      <section className="admin-login-content" aria-labelledby="forgot-title">
        <Link href="/admin/login" className="mb-12 inline-flex min-h-11 items-center gap-2 self-start text-xs text-muted hover:text-marine-700"><AdminIcon name="arrow" className="h-4 w-4 rotate-180" /> Back to sign in</Link>
        <div className="admin-login-form">
          <div className="mb-9 lg:hidden"><Logo className="h-11 w-auto rounded-lg" /></div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-marine-700">Password reset</p>
          <h1 id="forgot-title" className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Forgot your password?</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">We&apos;ll email you a one-time link to set a new one. The link works for about an hour.</p>
          <ForgotPasswordForm />
          <p className="mt-7 flex items-center justify-center gap-2 text-[11px] text-muted"><AdminIcon name="lock" className="h-3.5 w-3.5" /> Reset links come from your Supabase project email.</p>
        </div>
      </section>
    </main>
  );
}
