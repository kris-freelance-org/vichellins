import { getSitePage, sitePageMetadata } from "@/lib/site-content";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { whatsappLink } from "@/lib/config";
import { BookingForm } from "./BookingForm";

export const generateMetadata = () => sitePageMetadata("booking");

export default async function BookWorkspacePage() {
  const [content, workspace] = await Promise.all([getSitePage("booking"), getSitePage("workspace")]);
  const v = content.values;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/workspace" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-marine-700">
        ← Back to workspace
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-marine-900 sm:text-4xl">{v.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {v.intro}
      </p>
      <p className="mt-3 text-sm font-semibold text-marine-900">{formatPrice(Number(workspace.values.day_price))} {workspace.values.day_unit}</p>

      <div className="mt-8 rounded-3xl border border-line bg-white p-5 sm:p-7">
        <BookingForm />
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        {v.help_text}{" "}
        <a href={whatsappLink("Hi, I'd like to book the workspace for a few people.")} target="_blank" rel="noopener noreferrer" className="text-marine-700 underline">
          {v.help_button}
        </a>
        .
      </p>
    </div>
  );
}
