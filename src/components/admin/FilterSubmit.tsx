"use client";

import { useFormStatus } from "react-dom";
import { buttonStyles } from "./ui";

export function FilterSubmit({ label = "Apply filters" }: { label?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-busy={pending} className={buttonStyles.secondary}>
    {pending && <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />}
    {pending ? "Updating…" : label}
  </button>;
}
