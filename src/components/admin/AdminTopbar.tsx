"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/admin/auth";
import { AdminIcon } from "./AdminIcon";

const labels: Record<string, string> = {
  orders: "Orders", products: "Products", inventory: "Inventory", discounts: "Discounts",
  categories: "Categories & specs", brands: "Brands", homepage: "Homepage", workspace: "Members",
  delivery: "Delivery zones", analytics: "Analytics", staff: "Staff", account: "Your account",
};

export function AdminTopbar({ name, role }: { name: string; role: Role }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);
  const section = segments[0];
  const title = labels[section] ?? "Overview";
  const contextualSearch = role === "editor"
    ? null
    : section === "orders"
      ? { action: "/admin/orders", placeholder: "Search orders, customers…" }
      : section === "inventory"
        ? { action: "/admin/inventory", placeholder: "Search products or SKU…" }
        : { action: "/admin/products", placeholder: "Search your products…" };
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();

  return (
    <header className="admin-topbar">
      <nav aria-label="Breadcrumb" className="admin-breadcrumb">
        <Link href="/admin">Store admin</Link><AdminIcon name="chevron" className="h-3.5 w-3.5 text-muted/60" />
        {segments.length > 1 ? <><Link href={`/admin/${section}`}>{title}</Link><AdminIcon name="chevron" className="h-3.5 w-3.5 text-muted/60" /><span aria-current="page">{segments[1] === "new" ? "Create new" : segments[1] === "import" ? "Import" : "Details"}</span></> : <span aria-current="page">{title}</span>}
      </nav>
      {contextualSearch && <form action={contextualSearch.action} role="search" aria-label="Admin search" className="admin-global-search">
        <label htmlFor="admin-global-q" className="sr-only">{contextualSearch.placeholder.replace("…", "")}</label>
        <AdminIcon name="search" className="h-4 w-4 shrink-0 text-muted" />
        <input id="admin-global-q" name="q" type="search" placeholder={contextualSearch.placeholder} />
        <button type="submit" aria-label="Search" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-marine-50 hover:text-marine-700"><AdminIcon name="arrow" className="h-4 w-4" /></button>
      </form>}
      <Link href="/admin/account" className="admin-profile" aria-label={`Account for ${name}`}>
        <span className="admin-avatar" aria-hidden="true">{initials || "VN"}</span>
        <span className="hidden min-w-0 xl:block"><span className="block max-w-36 truncate text-xs font-semibold text-foreground">{name}</span><span className="mt-0.5 block text-[11px] capitalize text-muted">{role}</span></span>
      </Link>
    </header>
  );
}
