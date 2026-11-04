"use client";

import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { Field, inputClass } from "@/components/admin/ui";
import { finishForcedChange } from "./actions";

export function ForcedChangeForm() {
  return (
    <ActionForm action={finishForcedChange} className="mt-8 grid gap-5">
      <Field label="New password" htmlFor="next" hint="At least 10 characters.">
        <input id="next" name="next" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
      </Field>
      <Field label="Repeat the new password" htmlFor="confirm">
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
      </Field>
      <div className="pt-2 [&>button]:w-full"><SubmitButton pendingText="Saving…">Set password</SubmitButton></div>
    </ActionForm>
  );
}
