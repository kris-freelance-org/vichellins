import Link from "next/link";
import { RevenueChart, type DayPoint } from "./charts";
import { AdminIcon, type AdminIconName } from "./AdminIcon";
import { BarList, RangeTabs, StatTile } from "./stats";
import { Badge, Card, EmptyState, LinkButton, PageHeader, StatusBadge, Table, td, th } from "./ui";
import { dateTime } from "@/lib/admin/util";
import { formatPrice } from "@/lib/format";

export type DashboardData = {
  days: number;
  orders: number;
  booked_revenue: number;
  collected_revenue: number;
  average_order: number;
  awaiting_confirmation: number;
  awaiting_dispatch: number;
  out_for_delivery: number;
  daily: DayPoint[];
  top_products: { name: string; units: number; revenue: number }[];
  low_stock: { name: string; sku: string; stock: number; variant_label: string }[];
  recent_orders: { id: string; order_number: string; customer_name: string; total: number; status: string; payment_status: string; created_at: string }[];
};

export function DashboardView({ name, data: d }: { name: string; data: DashboardData }) {
  const attention: { label: string; value: number; href: string; icon: AdminIconName; tone: string }[] = [
    { label: "Awaiting confirmation", value: d.awaiting_confirmation, href: "/admin/orders?status=pending", icon: "clock", tone: "bg-gold-100 text-gold-700" },
    { label: "Ready to pack or send", value: d.awaiting_dispatch, href: "/admin/orders?status=confirmed", icon: "products", tone: "bg-marine-50 text-marine-700" },
    { label: "Out for delivery", value: d.out_for_delivery, href: "/admin/orders?status=out_for_delivery", icon: "delivery", tone: "bg-marine-50 text-marine-700" },
    { label: "Variants running low", value: d.low_stock.length, href: "/admin/inventory?show=low", icon: "inventory", tone: d.low_stock.length > 0 ? "bg-danger-50 text-danger-700" : "bg-success-50 text-success-700" },
  ];

  return (
    <>
      <PageHeader title={`Welcome back, ${name.split(/\s+/).filter(Boolean)[0] || "there"}`} description="Here’s what’s happening with your store."
        actions={<><LinkButton href="/admin/orders/new" icon="plus">Record an order</LinkButton><LinkButton href="/admin/products/new" variant="primary" icon="plus">Add product</LinkButton></>} />

      <div className="admin-overview-toolbar">
        <div><h2 className="text-sm font-semibold text-foreground">Store performance</h2><p className="mt-1 text-xs text-muted">A closer look at the last {d.days} days.</p></div>
        <RangeTabs base="/admin" days={d.days} />
      </div>
      <section aria-label="Key figures" className="mb-6 grid gap-4 @min-[32rem]:grid-cols-2 @min-[58rem]:grid-cols-4">
        <StatTile label="Total sales" value={formatPrice(d.booked_revenue)} icon="money" primary hint="Excludes cancelled & refunded orders" />
        <StatTile label="Orders placed" value={d.orders.toLocaleString("en-NG")} icon="orders" hint={`Over the last ${d.days} days`} />
        <StatTile label="Money received" value={formatPrice(d.collected_revenue)} icon="check" hint="Orders marked as paid" />
        <StatTile label="Average order value" value={formatPrice(d.average_order)} icon="analytics" hint="Across orders in this period" />
      </section>

      <div className="grid items-start gap-5 @min-[54rem]:grid-cols-[minmax(0,1.85fr)_minmax(17rem,1fr)]">
        <Card className="order-2 @min-[54rem]:order-1" title="Sales over time" description={`Daily booked sales for the last ${d.days} days.`} actions={<span className="flex items-center gap-1.5 text-[11px] text-muted"><span className="h-2 w-2 rounded-full bg-marine-700" aria-hidden="true" /> Sales</span>}>
          <RevenueChart data={d.daily} title={`Sales per day, last ${d.days} days`} />
        </Card>
        <Card className="order-1 @min-[54rem]:order-2" title="Needs your attention" description="Your current order queue and stock.">
          <ul className="-mx-2 divide-y divide-line/70">{attention.map(item => <li key={item.label}>
            <Link href={item.href} className="group flex min-h-17 items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><AdminIcon name={item.icon} className="h-[18px] w-[18px]" /></span>
              <span className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-muted">{item.label}</span>
              <span className="text-lg font-semibold tabular-nums tracking-tight text-foreground">{item.value}</span>
              <AdminIcon name="chevron" className="h-3.5 w-3.5 shrink-0 text-muted/70 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>)}</ul>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 @min-[44rem]:grid-cols-2">
        <Card title="Best sellers" description="The products your customers are choosing." actions={<Link href="/admin/analytics" className="admin-text-link">Analytics <AdminIcon name="arrow" className="h-3.5 w-3.5" /></Link>}>
          <BarList empty="Your best sellers will appear here after your first sale." items={d.top_products.map(p => ({ label: p.name, value: p.units, display: `${p.units} sold`, sub: formatPrice(p.revenue) }))} />
        </Card>
        <Card title="Stock to keep an eye on" description="Active variants at or below their low-stock level." actions={<Link href="/admin/inventory?show=low" className="admin-text-link">Inventory <AdminIcon name="arrow" className="h-3.5 w-3.5" /></Link>}>
          {d.low_stock.length === 0 ? <div className="flex items-center gap-3 py-6 text-sm text-muted"><AdminIcon name="check" className="h-5 w-5 text-success-700" /> All stocked up. Nothing is running low.</div> : <ul className="divide-y divide-line">{d.low_stock.map(item => <li key={item.sku} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <span className="min-w-0"><span className="block truncate text-xs font-medium text-foreground sm:text-sm">{item.name}</span><span className="mt-1 block truncate text-[11px] text-muted">{[item.variant_label, item.sku].filter(Boolean).join(" · ")}</span></span>
            <Link href={`/admin/inventory?q=${encodeURIComponent(item.sku)}`} className="shrink-0 rounded-md focus-visible:outline-marine-700"><Badge tone={item.stock === 0 ? "red" : "gold"}>{item.stock === 0 ? "Out of stock" : `${item.stock} left`}</Badge></Link>
          </li>)}</ul>}
        </Card>
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between gap-3"><div><h2 className="text-[15px] font-semibold text-foreground">Recent orders</h2><p className="mt-1 text-xs text-muted">The latest from your store.</p></div><Link href="/admin/orders" className="admin-text-link">View all orders <AdminIcon name="arrow" className="h-4 w-4" /></Link></div>
      {d.recent_orders.length === 0 ? <EmptyState title="Ready for your first order" body="Website orders and orders you record will appear here." action={<LinkButton href="/admin/orders/new" icon="plus">Record an order</LinkButton>} /> : <Table>
        <thead className="border-b border-line"><tr><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Total</th><th className={th}>Payment</th><th className={th}>Status</th><th className={th}><span className="sr-only">View order</span></th></tr></thead>
        <tbody className="divide-y divide-line">{d.recent_orders.map(order => <tr key={order.id}>
          <td className={td}><Link href={`/admin/orders/${order.id}`} className="font-semibold text-marine-700 hover:underline">{order.order_number}</Link><span className="mt-1 block text-[11px] text-muted">{dateTime.format(new Date(order.created_at))}</span></td>
          <td className={td}>{order.customer_name}</td><td className={`${td} whitespace-nowrap font-medium tabular-nums`}>{formatPrice(order.total)}</td>
          <td className={td}><StatusBadge status={order.payment_status} /></td><td className={td}><StatusBadge status={order.status} /></td>
          <td className={td}><Link href={`/admin/orders/${order.id}`} aria-label={`View order ${order.order_number}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-marine-50 hover:text-marine-700"><AdminIcon name="arrow" className="h-4 w-4" /></Link></td>
        </tr>)}</tbody>
      </Table>}
    </>
  );
}
