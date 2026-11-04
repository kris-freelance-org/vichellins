import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const query = await searchParams;
  const next = query.next;
  const reset = query.reset === "1";
  const error = typeof query.error === "string" ? query.error : null;
  return (
    <main className="admin-login">
      <section className="admin-login-brand" aria-label="Vichellins store management">
        <Logo className="h-12 w-auto rounded-lg" />
        <div className="relative z-10 my-auto py-16">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-marine-100">Behind every great upgrade</p>
          <h2 className="max-w-lg text-[clamp(3rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Your store.<br /><span className="text-gold-400">In good hands.</span></h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-marine-100">The space to keep your orders moving, your shelves stocked, and your business growing.</p>
          <div className="mt-12 flex flex-wrap gap-6 text-xs text-marine-100">
            <span className="flex items-center gap-2"><AdminIcon name="orders" className="h-4 w-4 text-gold-300" /> Orders</span>
            <span className="flex items-center gap-2"><AdminIcon name="products" className="h-4 w-4 text-gold-300" /> Products</span>
            <span className="flex items-center gap-2"><AdminIcon name="analytics" className="h-4 w-4 text-gold-300" /> Insights</span>
          </div>
        </div>
        <p className="relative z-10 text-[11px] text-marine-100">Vichellins Nation · Lagos, Nigeria</p>
        <div className="admin-login-orbit" aria-hidden="true" />
      </section>
      <section className="admin-login-content" aria-labelledby="login-title">
        <Link href="/" className="mb-12 inline-flex min-h-11 items-center gap-2 self-start text-xs text-muted hover:text-marine-700"><AdminIcon name="arrow" className="h-4 w-4 rotate-180" /> Back to storefront</Link>
        <div className="admin-login-form">
          <div className="mb-9 lg:hidden"><Logo className="h-11 w-auto rounded-lg" /></div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-marine-700">Your store workspace</p>
          <h1 id="login-title" className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Welcome back.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">Sign in to manage Vichellins Nation.</p>
          {reset && <p className="mt-5 rounded-xl border border-success-200 bg-success-50 p-3 text-sm text-success-800">Password updated. Sign in with your new password.</p>}
          {error === "expired_link" && <p className="mt-5 rounded-xl border border-danger-200 bg-danger-50 p-3 text-sm text-danger-800">That reset link has expired. Request a new one.</p>}
          {error === "missing_code" && <p className="mt-5 rounded-xl border border-danger-200 bg-danger-50 p-3 text-sm text-danger-800">That link is incomplete. Request a new one.</p>}
          <LoginForm next={typeof next === "string" ? next : ""} />
          <p className="mt-7 flex items-center justify-center gap-2 text-[11px] text-muted"><AdminIcon name="lock" className="h-3.5 w-3.5" /> For authorised store staff only</p>
        </div>
        <p className="mt-12 text-center text-[11px] text-muted">Good tech. Good people. Vichellins Nation.</p>
      </section>
    </main>
  );
}
