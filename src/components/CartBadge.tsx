"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { Icon } from "./Icon";

export function CartBadge() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex h-11 items-center justify-center gap-2.5 rounded-xl px-3 text-marine-900 transition-colors hover:bg-surface"
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
    >
      <Icon name="bag" className="h-[22px] w-[22px]" />
      <span className="hidden text-sm font-medium sm:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[11px] font-bold text-marine-900">
          {count}
        </span>
      )}
    </Link>
  );
}
