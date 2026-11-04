"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { signOut } from "@/app/(admin)/admin/actions";
import type { Role } from "@/lib/admin/auth";
import { Logo } from "@/components/Logo";
import { AdminIcon, type AdminIconName } from "./AdminIcon";

type Item = { href: string; label: string; icon: AdminIconName; roles: Role[] };
const all: Role[] = ["owner", "staff", "editor"];
const commerce: Role[] = ["owner", "staff"];
const groups: { title: string; items: Item[] }[] = [
  { title: "Overview", items: [
    { href: "/admin", label: "Dashboard", icon: "overview", roles: all },
    { href: "/admin/analytics", label: "Analytics", icon: "analytics", roles: commerce },
  ] },
  { title: "Commerce", items: [
    { href: "/admin/orders", label: "Orders", icon: "orders", roles: commerce },
    { href: "/admin/products", label: "Products", icon: "products", roles: commerce },
    { href: "/admin/inventory", label: "Inventory", icon: "inventory", roles: commerce },
    { href: "/admin/discounts", label: "Discounts", icon: "discount", roles: commerce },
  ] },
  { title: "Catalogue", items: [
    { href: "/admin/categories", label: "Categories & specs", icon: "categories", roles: all },
    { href: "/admin/brands", label: "Brands", icon: "brands", roles: all },
  ] },
  { title: "Store", items: [
    { href: "/admin/homepage", label: "Homepage", icon: "homepage", roles: all },
    { href: "/admin/delivery", label: "Delivery settings", icon: "delivery", roles: commerce },
    { href: "/admin/workspace", label: "Workspace", icon: "people", roles: commerce },
    { href: "/admin/staff", label: "Staff", icon: "account", roles: ["owner"] },
  ] },
];

export function Sidebar({ name, role }: { name: string; role: Role }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => { if (menu.current) menu.current.open = false; }, [pathname]);
  const active = (href: string) => href === "/admin" ? pathname === href : pathname.startsWith(href + "/") || pathname === href;

  const nav = (
    <nav aria-label="Admin" className="admin-navigation">
      {groups.map(group => {
        const items = group.items.filter(item => item.roles.includes(role));
        return items.length > 0 && <div key={group.title} className="admin-nav-group">
          <p className="admin-nav-heading">{group.title}</p>
          <ul>{items.map(item => <li key={item.href}>
            <Link href={item.href} aria-current={active(item.href) ? "page" : undefined} className="admin-nav-link">
              <AdminIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
              {active(item.href) && <span className="admin-nav-dot" aria-hidden="true" />}
            </Link>
          </li>)}</ul>
        </div>;
      })}
    </nav>
  );
  const account = (
    <div className="admin-sidebar-footer">
      <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-shop-link">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-marine-700"><AdminIcon name="homepage" className="h-[18px] w-[18px]" /></span>
        <span className="flex-1"><span className="block text-xs font-semibold">Your storefront</span><span className="mt-0.5 block text-[11px] text-muted">See what shoppers see</span></span>
        <AdminIcon name="external" className="h-3.5 w-3.5" />
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link href="/admin/account" className="admin-footer-action" title={name}><AdminIcon name="account" className="h-4 w-4" /> Account</Link>
        <form action={signOut}><button type="submit" className="admin-footer-action"><AdminIcon name="logout" className="h-4 w-4" /> Sign out</button></form>
      </div>
    </div>
  );

  return (
    <>
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-gold-400 focus:px-5 focus:py-3 focus:text-marine-900">Skip to content</a>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><Logo href="/admin" className="h-10 w-auto rounded-md" /><p className="mt-3 text-[10px] font-medium uppercase tracking-[0.17em] text-muted">Store management</p></div>
        <div className="admin-sidebar-nav">{nav}</div>
        {account}
      </aside>
      <header className="admin-mobile-header">
        <Logo href="/admin" className="h-9 w-auto rounded-md" />
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-muted">Store admin</span>
        <details ref={menu} className="relative" onKeyDown={event => {
          if (event.key === "Escape" && menu.current) {
            menu.current.open = false;
            menu.current.querySelector("summary")?.focus();
          }
        }} onClick={event => {
          if ((event.target as Element).closest("a") && menu.current) menu.current.open = false;
        }}>
          <summary aria-label="Open admin navigation" className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-line text-marine-900 hover:bg-surface [&::-webkit-details-marker]:hidden"><AdminIcon name="menu" className="h-5 w-5" /></summary>
          <div className="admin-mobile-menu">{nav}{account}</div>
        </details>
      </header>
    </>
  );
}
