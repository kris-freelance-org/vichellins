import Link from "next/link";
import { getNavCategories } from "@/lib/catalog";
import { whatsappLink } from "@/lib/config";
import { CartBadge } from "./CartBadge";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { DesktopNav, MobileNavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";

function SearchForm({ className = "", id = "site-search" }: { className?: string; id?: string }) {
  return (
    <form action="/shop" role="search" className={`site-search ${className}`}>
      <label htmlFor={id} className="sr-only">Search products</label>
      <Icon name="search" className="ml-4 h-[18px] w-[18px] shrink-0 text-muted" />
      <input id={id} name="q" type="search" placeholder="Find your next favourite gadget…" className="h-12 w-full min-w-0 bg-transparent px-3 text-base text-foreground placeholder:text-muted focus:outline-none sm:text-sm" />
      <button type="submit" aria-label="Search products" className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-marine-700 text-white transition-colors hover:bg-marine-800"><Icon name="arrow" className="h-[18px] w-[18px]" /></button>
    </form>
  );
}

export async function Header() {
  const categories = await getNavCategories();
  return (
    <>
      <div className="bg-marine-700 text-white">
        <div className="store-container flex min-h-9 items-center justify-center gap-2 text-[11px] sm:justify-between sm:text-xs">
          <p className="flex items-center gap-2"><Icon name="truck" className="h-4 w-4 text-gold-300" /> Your next upgrade, delivered across Lagos.</p>
          <Link href="/delivery-returns" className="hidden items-center gap-2 text-marine-100 hover:text-white sm:inline-flex">Delivery &amp; returns <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="store-container flex min-h-19 items-center gap-5 lg:gap-10">
          <Logo className="h-10 w-auto rounded-md sm:h-11" />
          <SearchForm className="hidden max-w-xl flex-1 md:flex" />
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <a href={whatsappLink("Hello Vichellins Nation, I need help choosing a product.")} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2.5 text-marine-900 xl:flex">
              <Icon name="chat" className="h-6 w-6" />
              <span className="text-xs leading-relaxed"><span className="block text-muted">A little advice?</span><span className="font-semibold">Let’s talk tech</span></span>
            </a>
            <div className="flex items-center gap-2 border-l border-line pl-3 sm:pl-5">
              <CartBadge />
              <MobileMenu>
                <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl text-marine-900 hover:bg-surface [&::-webkit-details-marker]:hidden" aria-label="Menu">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                </summary>
                <div className="absolute right-0 top-14 max-h-[calc(100dvh-7rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white p-4 shadow-xl">
                  <MobileNavLinks />
                  <p className="mb-2 mt-4 border-t border-line px-3 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Find your thing</p>
                  <ul className="space-y-1">{categories.map((c) => <li key={c.id}><Link href={`/category/${c.slug}`} className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm text-marine-900 hover:bg-surface">{c.name}<Icon name="arrow" className="h-4 w-4 text-muted" /></Link></li>)}</ul>
                </div>
              </MobileMenu>
            </div>
          </div>
        </div>
        <div className="store-container pb-3 md:hidden"><SearchForm id="mobile-site-search" /></div>
        <div className="hidden border-t border-line lg:block">
          <div className="store-container flex min-h-13 items-center justify-between gap-6">
            <DesktopNav />
            <nav aria-label="Categories" className="min-w-0 overflow-x-auto">
              <ul className="flex items-center gap-5">{categories.map((c) => <li key={c.id}><Link href={`/category/${c.slug}`} className="inline-flex min-h-12 items-center whitespace-nowrap text-xs font-medium text-muted transition-colors hover:text-marine-700">{c.name}</Link></li>)}</ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
