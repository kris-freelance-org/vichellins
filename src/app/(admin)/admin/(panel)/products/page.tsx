import Link from "next/link";
import Form from "next/form";
import { FilterSubmit } from "@/components/admin/FilterSubmit";
import { redirect } from "next/navigation";
import { ActiveFilters, Pagination } from "@/components/admin/ListTools";
import { LoadError } from "@/components/admin/LoadError";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { EmptyState, LinkButton, PageHeader, StatusBadge, Table, td, th, inputClass } from "@/components/admin/ui";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { flattenTree, loadCategories } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Products" };

const PAGE_SIZE = 20;

type Row = {
  id: string;
  name: string;
  slug: string;
  status: string;
  featured: boolean;
  category: { name: string } | null;
  brand: { name: string } | null;
  variants: { price: number; stock: number; is_active: boolean }[];
  product_images: { url: string; sort_order: number }[];
};

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireStaff(COMMERCE);
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const status = typeof params.status === "string" && ["draft", "published", "archived"].includes(params.status) ? params.status : "";
  const category = typeof params.category === "string" && /^[0-9a-f-]{36}$/i.test(params.category) ? params.category : "";
  const page = Math.max(1, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id, name, slug, status, featured, category:categories(name), brand:brands(name), variants(price, stock, is_active), product_images(url, sort_order)",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (q) query = query.ilike("name", `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
  if (["draft", "published", "archived"].includes(status)) query = query.eq("status", status);
  if (/^[0-9a-f-]{36}$/i.test(category)) query = query.eq("category_id", category);

  const [{ data, count, error }, categories] = await Promise.all([query, loadCategories(supabase)]);
  const rows = (data ?? []) as unknown as Row[];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (p: number, overrides: Record<string, string | undefined> = {}) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ q, status, category, ...overrides })) if (value) next.set(key, value);
    if (p > 1) next.set("page", String(p));
    const s = next.toString();
    return `/admin/products${s ? `?${s}` : ""}`;
  };
  if (error?.code === "PGRST103" && page > 1) {
    const available = await query.range(0, 0);
    if (!available.error && available.count !== null) redirect(link(Math.max(1, Math.ceil(available.count / PAGE_SIZE))));
  }
  if (!error && page > pages) redirect(link(pages));
  const filtered = Boolean(q || status || category);
  const filters = [
    ...(q ? [{ label: `Search: ${q}`, removeHref: link(1, { q: undefined }) }] : []),
    ...(status ? [{ label: `Status: ${status}`, removeHref: link(1, { status: undefined }) }] : []),
    ...(category ? [{ label: `Category: ${categories.find(c => c.id === category)?.name ?? "Selected category"}`, removeHref: link(1, { category: undefined }) }] : []),
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage what shoppers see, from product details to availability."
        actions={
          <>
            <LinkButton href="/admin/products/import" icon="download">Bulk import</LinkButton>
            <LinkButton href="/admin/products/new" variant="primary" icon="plus">Add product</LinkButton>
          </>
        }
      />

      <Form action="/admin/products" key={[q, status, category].join(":")} className="admin-filterbar mb-5 flex flex-wrap items-end gap-3" role="search" aria-label="Filter products">
        <div className="min-w-0 basis-full flex-1 sm:basis-48">
          <label htmlFor="q" className="text-sm font-medium text-marine-900">Search</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Product name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="status" className="text-sm font-medium text-marine-900">Status</label>
          <select id="status" name="status" defaultValue={status} className={inputClass}>
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium text-marine-900">Category</label>
          <select id="category" name="category" defaultValue={category} className={inputClass}>
            <option value="">All</option>
            {flattenTree(categories).map((c) => (
              <option key={c.id} value={c.id}>{"— ".repeat(c.depth)}{c.name}</option>
            ))}
          </select>
        </div>
        <FilterSubmit />
      </Form>
      <ActiveFilters filters={filters} clearHref="/admin/products" />

      {error ? <LoadError subject="your products" /> : rows.length === 0 ? (
        <EmptyState
          title={q || status || category ? "No products match" : "No products yet"}
          body={q || status || category ? "Try a different search or clear the filters." : "Add your first product to start selling."}
          action={filtered ? <LinkButton href="/admin/products">Clear filters</LinkButton> : <LinkButton href="/admin/products/new" variant="primary">Add product</LinkButton>}
        />
      ) : (
        <>
        <ul aria-label="Products" className="space-y-3 @min-[48rem]:hidden">
          {rows.map(p => {
            const active = p.variants.filter(v => v.is_active);
            const prices = active.map(v => v.price);
            const stock = active.reduce((n, v) => n + v.stock, 0);
            const image = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];
            return <li key={p.id}>
              <Link href={`/admin/products/${p.id}`} className="group block rounded-2xl border border-line bg-white p-4 transition-colors hover:border-marine-200">
                <div className="flex items-start gap-3">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image.url} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl border border-line bg-surface object-contain p-1" />
                  ) : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface text-muted"><AdminIcon name="products" className="h-6 w-6" /></span>}
                  <div className="min-w-0"><p className="break-words text-sm font-semibold text-marine-900">{p.name}</p><p className="mt-1 break-words text-xs text-muted">{[p.brand?.name, p.category?.name, p.featured ? "Featured" : null].filter(Boolean).join(" · ") || "No category or brand"}</p></div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><StatusBadge status={p.status} /><span className={`text-xs font-medium ${stock === 0 ? "text-danger-700" : "text-muted"}`}>{stock === 0 ? "Out of stock" : `${stock} in stock`} · {active.length} variant{active.length === 1 ? "" : "s"}</span></div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3"><span className="text-sm font-semibold tabular-nums">{prices.length ? `${Math.min(...prices) !== Math.max(...prices) ? "From " : ""}${formatPrice(Math.min(...prices))}` : "No active price"}</span><span className="flex items-center gap-2 text-xs font-medium text-marine-700">Edit product<AdminIcon name="arrow" className="h-4 w-4" /></span></div>
              </Link>
            </li>;
          })}
        </ul>
        <div className="hidden @min-[48rem]:block"><Table>
          <thead className="border-b border-line">
            <tr>
              <th className={th}>Product</th>
              <th className={th}>Category</th>
              <th className={th}>Status</th>
              <th className={th}>Price</th>
              <th className={th}>Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => {
              const active = p.variants.filter((v) => v.is_active);
              const prices = active.map((v) => v.price);
              const stock = active.reduce((n, v) => n + v.stock, 0);
              const image = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];
              return (
                <tr key={p.id}>
                  <td className={td}>
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image.url} alt="" className="h-12 w-12 shrink-0 rounded-xl border border-line bg-surface p-1 object-contain" />
                      ) : (
                        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-xs text-muted">–</span>
                      )}
                      <span>
                        <span className="block font-medium text-marine-900 hover:underline">{p.name}</span>
                        <span className="block text-xs text-muted">
                          {p.brand?.name ?? "No brand"}
                          {p.featured && " · Featured"}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className={td}>{p.category?.name ?? "–"}</td>
                  <td className={td}><StatusBadge status={p.status} /></td>
                  <td className={td}>
                    {prices.length === 0
                      ? "–"
                      : Math.min(...prices) === Math.max(...prices)
                        ? formatPrice(Math.min(...prices))
                        : `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}`}
                  </td>
                  <td className={td}>
                    {stock === 0 ? <span className="font-medium text-danger-700">Out of stock</span> : stock}
                    <span className="block text-xs text-muted">{active.length} variant{active.length === 1 ? "" : "s"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table></div>
        </>
      )}

      {!error && <Pagination page={page} pageSize={PAGE_SIZE} total={total} noun="products" href={link} />}
    </>
  );
}
