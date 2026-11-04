import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/config";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a workspace day",
  description: "Reserve a day pass at the Vichellins Nation workspace. Pay when you arrive.",
};

export default function BookWorkspacePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/workspace" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-marine-700">
        ← Back to workspace
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-marine-900 sm:text-4xl">Book a day pass</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Reserve a seat for the day you want to visit. ₦5,000 — paid when you arrive by cash, transfer or POS. We&apos;ll have your name waiting.
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-white p-5 sm:p-7">
        <BookingForm />
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Have a group or need a different plan?{" "}
        <a href={whatsappLink("Hi, I'd like to book the workspace for a few people.")} target="_blank" rel="noopener noreferrer" className="text-marine-700 underline">
          Chat with us on WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
