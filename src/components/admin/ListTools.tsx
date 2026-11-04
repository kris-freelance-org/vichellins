import Link from "next/link";
import { AdminIcon } from "./AdminIcon";
import { buttonStyles } from "./ui";

export function ActiveFilters({ filters, clearHref }: {
  filters: { label: string; removeHref: string }[];
  clearHref: string;
}) {
  if (!filters.length) return null;
  return <nav aria-label="Active filters" className="mb-5 flex flex-wrap items-center gap-2 text-xs">
    <span className="mr-1 text-muted">Filtered by</span>
    {filters.map(filter => <Link key={filter.label} href={filter.removeHref}
      aria-label={`Remove filter: ${filter.label}`}
      className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-marine-100 bg-marine-50 px-3 font-medium text-marine-900 hover:border-marine-300">
      <span className="break-words [overflow-wrap:anywhere]">{filter.label}</span>
      <AdminIcon name="close" className="h-3.5 w-3.5 shrink-0" />
    </Link>)}
    <Link href={clearHref} className="admin-text-link px-2">Clear all</Link>
  </nav>;
}

export function Pagination({ page, pageSize, total, noun, href }: {
  page: number; pageSize: number; total: number; noun: string; href: (page: number) => string;
}) {
  if (!total) return null;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const disabled = `${buttonStyles.secondary} cursor-not-allowed opacity-40`;
  return <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center justify-between gap-3">
    <p className="text-xs tabular-nums text-muted">Showing <span className="font-medium text-foreground">{start}–{Math.min(page * pageSize, total)}</span> of {total.toLocaleString("en-NG")} {noun}</p>
    {pages > 1 && <div className="flex flex-wrap items-center gap-2">
      {page > 1 ? <Link href={href(page - 1)} rel="prev" className={buttonStyles.secondary}><AdminIcon name="chevron" className="h-3.5 w-3.5 rotate-180" />Previous</Link>
        : <span aria-disabled="true" className={disabled}><AdminIcon name="chevron" className="h-3.5 w-3.5 rotate-180" />Previous</span>}
      <span className="px-1 text-xs tabular-nums text-muted">Page {page} of {pages}</span>
      {page < pages ? <Link href={href(page + 1)} rel="next" className={buttonStyles.secondary}>Next<AdminIcon name="chevron" className="h-3.5 w-3.5" /></Link>
        : <span aria-disabled="true" className={disabled}>Next<AdminIcon name="chevron" className="h-3.5 w-3.5" /></span>}
    </div>}
  </nav>;
}
