import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = { title: "Booking confirmed" };

const dateFormat = new Intl.DateTimeFormat("en-NG", {
  timeZone: "Africa/Lagos",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value: string | undefined): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "your chosen date";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "your chosen date" : dateFormat.format(d);
}

export default async function BookingSuccessPage({ searchParams }: PageProps<"/workspace/book/success">) {
  const query = await searchParams;
  const date = typeof query.date === "string" ? query.date : undefined;
  const name = typeof query.name === "string" ? query.name : "there";

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <span aria-hidden="true" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-2xl text-success-700">✓</span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-marine-900 sm:text-4xl">You&apos;re booked, {name}.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        See you on <span className="font-medium text-marine-900">{formatDate(date)}</span>. We&apos;ll have your name at the front desk — pay ₦5,000 for the day pass when you arrive.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-4 text-left text-sm text-marine-900">
        <p className="font-semibold">Before you come</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>Bring a valid ID at the door.</li>
          <li>Pay on arrival by cash, bank transfer or POS.</li>
          <li>Need to change your date? Message us on WhatsApp.</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/workspace" className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm font-semibold text-marine-900 hover:border-marine-700">
          Back to workspace
        </Link>
        <a
          href={whatsappLink(`Hi, I just booked the workspace${date ? ` for ${formatDate(date)}` : ""}. Just checking in.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center rounded-full bg-marine-700 px-6 text-sm font-semibold text-white hover:bg-marine-800"
        >
          Message us
        </a>
      </div>
    </div>
  );
}
