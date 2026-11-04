"use client";

import { useState } from "react";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { Field, inputClass } from "@/components/admin/ui";
import { signIn } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <ActionForm action={signIn} className="mt-8 grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Email address" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" placeholder="you@vichellinsnation.com" required className={inputClass} />
      </Field>
      <Field label="Password" htmlFor="password">
        <div className="relative">
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required className={`${inputClass} pr-19`} />
          <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute bottom-0 right-1 flex h-11 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium text-muted hover:text-marine-700"><AdminIcon name="eye" className="h-4 w-4" />{showPassword ? "Hide" : "Show"}</button>
        </div>
      </Field>
      <div className="pt-2 [&>button]:w-full"><SubmitButton pendingText="Signing in…">Sign in to your store <AdminIcon name="arrow" className="h-4 w-4" /></SubmitButton></div>
    </ActionForm>
  );
}
