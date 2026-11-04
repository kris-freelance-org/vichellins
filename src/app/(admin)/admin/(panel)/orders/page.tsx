import Link from "next/link";
import Form from "next/form";
import { FilterSubmit } from "@/components/admin/FilterSubmit";
import { redirect } from "next/navigation";
import { ActiveFilters, Pagination } from "@/components/admin/ListTools";
import { LoadError } from "@/components/admin/LoadError";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { EmptyState, inputClass, LinkButton, PageHeader, StatusBadge, Table, td, th } from "@/components/admin/ui";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { dateTime } from "@/lib/admin/util";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Orders" };

const PAGE_SIZE = 25;
const STATUSES = ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled", "refunded"];

type Row = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  customer_name: string;
  customer_phone: string;
  zone_name: string;
  total: number;
  created_at: string;
  source: string | null;
  order_items: { qty: number }[];
};

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireStaff(COMMERCE);
  const params = await searchParams;
  const status = typeof params.status === "string" && STATUSES.includes(params.status) ? params.status : "";
  const queue = !status && params.queue === "dispatch" ? "dispatch" : "";
  const payment = typeof params.payment === "string" && ["unpaid", "paid", "failed", "refunded"].includes(params.payment) ? params.payment : "";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 60) : "";
  const page = Math.max(1, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, status, payment_status, payment_method, customer_name, customer_phone, zone_name, total, created_at, source, order_items(qty)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  else if (queue === "dispatch") query = query.in("status", ["confirmed", "packed"]);
  if (payment) query = query.eq("payment_status", payment);
  if (q) {
    // Strip characters that have meaning inside a PostgREST filter list.
    const safe = q.replace(/[,()%*\\]/g, " ").trim();
    if (safe) query = query.or(`order_number.ilike.%${safe}%,customer_name.ilike.%${safe}%,customer_phone.ilike.%${safe}%`);
  }

  const [{ data, count, error }, countsResult] = await Promise.all([
    query,
    supabase.from("orders").select("status"),
  ]);
  const rows = (data ?? []) as unknown as Row[];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const counts: Record<string, number> = {};
  for (const r of countsResult.data ?? []) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const all = Object.values(counts).reduce((a, b) => a + b, 0);

  const link = (over: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const base: Record<string, string> = { status, queue, payment, q, page: page > 1 ? String(page) : "" };
    for (const [k, v] of Object.entries({ ...base, ...over })) if (v) next.set(k, v);
    const s = next.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  };

  if (error?.code === "PGRST103" && page > 1) {
    const available = await query.range(0, 0);
    if (!available.error && available.count !== null) {
      const lastPage = Math.max(1, Math.ceil(available.count / PAGE_SIZE));
      redirect(link({ page: lastPage > 1 ? String(lastPage) : undefined }));
    }
  }
  if (!error && page > pages) redirect(link({ page: pages > 1 ? String(pages) : undefined }));
  const filtered = Boolean(q || status || payment || queue);
  const filters = [
    ...(q ? [{ label: `Search: ${q}`, removeHref: link({ q: undefined, page: undefined }) }] : []),
    ...(status ? [{ label: `Status: ${status.replace(/_/g, " ")}`, removeHref: link({ status: undefined, page: undefined }) }] : []),
    ...(queue && !status ? [{ label: "Ready to pack or send", removeHref: link({ queue: undefined, page: undefined }) }] : []),
    ...(payment ? [{ label: `Payment: ${payment}`, removeHref: link({ payment: undefined, page: undefined }) }] : []),
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track payments, prepare orders, and keep deliveries moving."
        actions={<LinkButton href="/admin/orders/new" variant="primary" icon="plus">Record an order</LinkButton>}
      />

      <nav aria-label="Order status" className="admin-status-tabs mb-5">
        {[["", `All${countsResult.error ? "" : ` (${all})`}`], ...STATUSES.map((s) => [s, `${s.replace(/_/g, " ")}${countsResult.error ? "" : ` (${counts[s] ?? 0})`}`])].map(([value, text]) => (
          <Link
            key={value || "all"}
            href={link({ status: value || undefined, queue: undefined, page: undefined })}
            aria-current={!queue && status === value ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-medium capitalize transition-colors ${!queue && status === value ? "border-marine-700 bg-marine-700 text-white" : "border-line bg-white text-muted hover:border-marine-200 hover:text-marine-700"}`}
          >
            {text}
          </Link>
        ))}
      </nav>

      <Form action="/admin/orders" key={[q, status, payment, queue].join(":")} className="admin-filterbar mb-5 flex flex-wrap items-end gap-3" role="search" aria-label="Filter orders">
        {status && <input type="hidden" name="status" value={status} />}
        {queue && !status && <input type="hidden" name="queue" value={queue} />}
        <div className="min-w-0 basis-full flex-1 sm:basis-56">
          <label htmlFor="q" className="text-sm font-medium text-marine-900">Search</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Order number, name or phone" className={inputClass} />
        </div>
        <div>
          <label htmlFor="payment" className="text-sm font-medium text-marine-900">Payment</label>
          <select id="payment" name="payment" defaultValue={payment} className={inputClass}>
            <option value="">Any</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <FilterSubmit />
      </Form>
      <ActiveFilters filters={filters} clearHref="/admin/orders" />

      {error ? <LoadError subject="your orders" /> : rows.length === 0 ? (
        <EmptyState
          title={filtered ? "No orders match these filters" : "No orders yet"}
          body={filtered ? "Try another name or order number, or clear the filters to see all orders." : "Orders placed on the website, or recorded here, will appear in this list."}
          action={filtered ? <LinkButton href="/admin/orders">Clear filters</LinkButton> : <LinkButton href="/admin/orders/new" icon="plus">Record an order</LinkButton>}
        />
      ) : (
        <>
        <ul aria-label="Orders" className="space-y-3 @min-[48rem]:hidden">
          {rows.map(o => {
            const itemCount = o.order_items.reduce((n, i) => n + i.qty, 0);
            return <li key={o.id}>
            <Link href={`/admin/orders/${o.id}`} className="group block rounded-2xl border border-line bg-white p-4 transition-colors hover:border-marine-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-marine-700">{o.order_number}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-3 break-words text-sm font-medium">{o.customer_name}</p>
              <p className="mt-1 break-words text-xs text-muted">{o.customer_phone} · {o.zone_name}</p>
              <p className="mt-2 text-xs text-muted">{dateTime.format(new Date(o.created_at))}{o.source ? ` · ${o.source}` : ""}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <div><span className="block text-base font-semibold tabular-nums">{formatPrice(o.total)}</span><span className="text-xs text-muted">{itemCount} item{itemCount === 1 ? "" : "s"} · {o.payment_method === "cod" ? "Pay on delivery" : o.payment_method === "transfer" ? "Bank transfer" : o.payment_method}</span></div>
                <StatusBadge status={o.payment_status} />
              </div>
              <span className="mt-3 flex items-center justify-end gap-2 text-xs font-medium text-marine-700">View order<AdminIcon name="arrow" className="h-4 w-4" /></span>
            </Link>
          </li>;
          })}
        </ul>
        <div className="hidden @min-[48rem]:block"><Table>
          <thead className="border-b border-line">
            <tr>
              <th className={th}>Order</th>
              <th className={th}>Customer</th>
              <th className={th}>Area</th>
              <th className={th}>Total</th>
              <th className={th}>Payment</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((o) => {
              const items = o.order_items.reduce((n, i) => n + i.qty, 0);
              return (
                <tr key={o.id}>
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-semibold text-marine-800 underline">{o.order_number}</Link>
                    <span className="block text-xs text-muted">{dateTime.format(new Date(o.created_at))}{o.source ? ` · ${o.source}` : ""}</span>
                  </td>
                  <td className={td}>
                    {o.customer_name}
                    <span className="block text-xs text-muted">{o.customer_phone}</span>
                  </td>
                  <td className={td}>{o.zone_name}</td>
                  <td className={td}>
                    {formatPrice(o.total)}
                    <span className="block text-xs text-muted">{items} item{items === 1 ? "" : "s"}</span>
                  </td>
                  <td className={td}>
                    <StatusBadge status={o.payment_status} />
                    <span className="mt-1 block text-xs text-muted">{o.payment_method === "cod" ? "Pay on delivery" : o.payment_method === "transfer" ? "Bank transfer" : o.payment_method}</span>
                  </td>
                  <td className={td}><StatusBadge status={o.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </Table></div>
        </>
      )}

      {!error && <Pagination page={page} pageSize={PAGE_SIZE} total={total} noun="orders" href={p => link({ page: p > 1 ? String(p) : undefined })} />}
    </>
  );
}
