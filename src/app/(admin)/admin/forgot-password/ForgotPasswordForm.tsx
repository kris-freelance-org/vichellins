"use client";

import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { Field, inputClass } from "@/components/admin/ui";
import { requestReset } from "./actions";

export function ForgotPasswordForm() {
  return (
    <ActionForm action={requestReset} className="mt-8 grid gap-5">
      <Field label="Email address" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" placeholder="you@vichellinsnation.com" required className={inputClass} />
      </Field>
      <div className="pt-2 [&>button]:w-full"><SubmitButton pendingText="Sending…">Send reset link</SubmitButton></div>
    </ActionForm>
  );
}
