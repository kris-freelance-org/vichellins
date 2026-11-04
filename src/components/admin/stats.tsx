import Link from "next/link";
import type { ReactNode } from "react";
import { AdminIcon, type AdminIconName } from "./AdminIcon";

export function StatTile({ label, value, hint, icon, primary = false }: { label: string; value: ReactNode; hint?: string; icon?: AdminIconName; primary?: boolean }) {
  return (
    <div className={`admin-stat min-w-0 rounded-2xl border p-5 sm:p-6 ${primary ? "border-marine-700 bg-marine-700 text-white" : "border-line bg-white text-foreground"}`}>
      <div className={`flex items-center justify-between gap-3 text-xs ${primary ? "text-marine-100" : "text-muted"}`}><p>{label}</p>{icon && <AdminIcon name={icon} className="h-[18px] w-[18px] shrink-0" />}</div>
      <p className="mt-4 break-words text-[clamp(1.5rem,2.8cqi,1.9rem)] font-semibold leading-tight tracking-[-0.035em] tabular-nums">{value}</p>
      {hint && <p className={`mt-3 text-[11px] leading-relaxed ${primary ? "text-marine-100" : "text-muted"}`}>{hint}</p>}
    </div>
  );
}

export type BarItem = { label: string; value: number; display: string; sub?: string };

/**
 * Horizontal bars for comparing magnitude. One colour, value at the tip of
 * each bar, label in text ink. Thin rounded bars keep the product names primary.
 */
export function BarList({ items, empty }: { items: BarItem[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-muted">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((i, index) => (
        <li key={i.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-marine-900">{i.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-marine-900">{i.display}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface" role="img" aria-label={`${i.label}: ${i.display}`}>
            <div
              className={`h-full rounded-full ${index === 0 ? "bg-marine-700" : "bg-marine-300"}`}
              style={{ width: `${Math.max((i.value / max) * 100, i.value > 0 ? 2 : 0)}%` }}
            />
          </div>
          {i.sub && <p className="mt-1 text-xs text-muted">{i.sub}</p>}
        </li>
      ))}
    </ul>
  );
}

export function RangeTabs({ base, days, options = [7, 30, 90] }: { base: string; days: number; options?: number[] }) {
  return (
    <nav aria-label="Date range" className="admin-range-tabs">
      {options.map((d) => (
        <Link
          key={d}
          href={`${base}?days=${d}`}
          aria-current={d === days ? "page" : undefined}
          aria-label={`Last ${d} days`}
          className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-xs font-medium transition-colors ${d === days ? "bg-marine-700 text-white" : "text-muted hover:bg-surface hover:text-marine-700"}`}
        >
          {d} days
        </Link>
      ))}
    </nav>
  );
}
