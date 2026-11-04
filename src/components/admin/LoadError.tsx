"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Notice, buttonStyles } from "./ui";

export function LoadError({ subject }: { subject: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <Notice tone="red">
    <p className="font-medium">We couldn&apos;t load {subject}.</p>
    <p className="mt-1">Your data hasn&apos;t changed. Try loading this page again.</p>
    <button type="button" disabled={pending} className={`${buttonStyles.secondary} mt-3`}
      onClick={() => startTransition(() => router.refresh())}>{pending ? "Trying again…" : "Try again"}</button>
  </Notice>;
}
