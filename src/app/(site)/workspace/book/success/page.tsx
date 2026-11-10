import { getSitePage, sitePageMetadata } from "@/lib/site-content";
import { lines } from "@/lib/page-content";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { whatsappLink } from "@/lib/config";

export const generateMetadata = () => sitePageMetadata("booking-success");

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
  const [content, workspace] = await Promise.all([getSitePage("booking-success"), getSitePage("workspace")]);
  const v = content.values;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <span aria-hidden="true" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-2xl text-success-700">✓</span>
      <h1 className="mt-6 break-words text-3xl font-semibold tracking-tight text-marine-900 sm:text-4xl">{v.title}, {name}.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        See you on <span className="font-medium text-marine-900">{formatDate(date)}</span>. {v.intro}
      </p>
      <p className="mt-3 text-sm font-semibold text-marine-900">{formatPrice(Number(workspace.values.day_price))} {workspace.values.day_unit}</p>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-4 text-left text-sm text-marine-900">
        <p className="font-semibold">{v.instructions_title}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          {lines(v.instructions).map((line, i) => <li key={i}>{line}</li>)}
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
