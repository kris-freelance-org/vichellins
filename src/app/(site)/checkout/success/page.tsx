"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { clearCart } from "@/lib/cart-store";
import { whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/browser";

type OrderItem = { name: string; variant_label: string; qty: number; unit_price: number };
type OrderEvent = { status: string; note: string | null; at: string };
type TrackedOrder = {
  order_number: string;
  status: string;
  payment_status: string;
  created_at: string;
  zone_name: string;
  delivery_fee: number;
  subtotal: number;
  discount_total: number;
  total: number;
  items: OrderItem[];
  events: OrderEvent[];
};

const STATUS_MESSAGES: Record<string, { tone: "gold" | "blue" | "green" | "red"; label: string; detail: string }> = {
  pending: {
    tone: "gold",
    label: "Waiting for payment confirmation",
    detail: "We'll confirm your transfer and approve the order, usually within a few minutes during business hours.",
  },
  confirmed: {
    tone: "blue",
    label: "Order confirmed",
    detail: "Payment received. We're getting your order ready for dispatch.",
  },
  packed: {
    tone: "blue",
    label: "Packed and ready",
    detail: "Your order is packed and will be handed to the rider shortly.",
  },
  out_for_delivery: {
    tone: "blue",
    label: "Out for delivery",
    detail: "A rider is on the way. Keep your phone close.",
  },
  delivered: {
    tone: "green",
    label: "Delivered",
    detail: "Thanks for shopping with us. Enjoy!",
  },
  cancelled: {
    tone: "red",
    label: "Cancelled",
    detail: "This order was cancelled. If this looks wrong, please reach out on WhatsApp.",
  },
  refunded: {
    tone: "red",
    label: "Refunded",
    detail: "A refund has been issued. Please check your bank account.",
  },
};

const TONE_CLASSES: Record<"gold" | "blue" | "green" | "red", string> = {
  gold: "border-gold-300 bg-gold-50 text-gold-800",
  blue: "border-marine-200 bg-marine-50 text-marine-800",
  green: "border-success-200 bg-success-50 text-success-800",
  red: "border-danger-200 bg-danger-50 text-danger-800",
};

export default function SuccessPage() {
  const params = useSearchParams();
  const orderParam = params.get("order");

  // Read the shopper's phone (needed for track_order) once on mount; it's stored
  // by the checkout page in sessionStorage so we don't have to put it in the URL.
  const [stored] = useState<{ order_number: string; phone: string } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("vn-last-order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const missingContext = !orderParam || !stored?.phone || stored.order_number !== orderParam;

  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(!missingContext);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (missingContext || !orderParam || !stored) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.rpc("track_order", {
        p_order_number: orderParam,
        p_phone: stored.phone,
      });
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
      } else {
        setOrder(data as TrackedOrder);
        // The order is in the database now; wipe the cart so the shopper doesn't double-order.
        clearCart();
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [missingContext, orderParam, stored]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-muted">Loading your order…</p>
      </div>
    );
  }

  if (missingContext) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Order placed</h1>
        <p className="mt-3 text-muted">
          {orderParam
            ? <>Your order number is <span className="font-semibold text-marine-900">{orderParam}</span>. We&apos;ve got your details — open WhatsApp to confirm your transfer and track progress.</>
            : "We couldn't find your order details here. If you've already paid, please reach out on WhatsApp."}
        </p>
        <Link
          href={whatsappLink(orderParam ? `Hi, I just placed order ${orderParam} and need to confirm.` : "Hi, I just placed an order and need help.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-marine-700 px-7 text-sm font-semibold text-white hover:bg-marine-800"
        >
          Contact us on WhatsApp
        </Link>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Order not found</h1>
        <p className="mt-3 text-muted">We couldn&apos;t find that order. Please reach out on WhatsApp so we can help.</p>
        <Link
          href={whatsappLink("Hi, I placed an order but can't track it.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-marine-700 px-7 text-sm font-semibold text-white hover:bg-marine-800"
        >
          Contact us on WhatsApp
        </Link>
      </div>
    );
  }

  const status = STATUS_MESSAGES[order.status] ?? STATUS_MESSAGES.pending;
  const paid = order.payment_status === "paid";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Thanks — we have your order</h1>
      <p className="mt-2 text-sm text-muted">
        Order number <span className="font-semibold text-marine-900">{order.order_number}</span>. Keep this handy if you need to get in touch.
      </p>

      <div className={`mt-6 rounded-2xl border p-4 text-sm ${TONE_CLASSES[status.tone]}`}>
        <p className="font-semibold">
          {status.label}
          {paid && order.status === "pending" ? " · Payment received" : ""}
        </p>
        <p className="mt-1">{status.detail}</p>
      </div>

      <section className="mt-8 rounded-3xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-marine-900">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {order.items.map((i, idx) => (
            <li key={`${i.name}-${idx}`} className="flex justify-between gap-4">
              <span className="min-w-0 break-words text-marine-900">
                {i.name} <span className="text-muted">x{i.qty}</span>
                {i.variant_label && <span className="block text-xs text-muted">{i.variant_label}</span>}
              </span>
              <span className="shrink-0 font-medium text-marine-900">{formatPrice(i.unit_price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium text-marine-900">{formatPrice(order.subtotal)}</dd></div>
          {order.discount_total > 0 && (
            <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd className="font-medium text-marine-900">−{formatPrice(order.discount_total)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-muted">Delivery ({order.zone_name})</dt><dd className="font-medium text-marine-900">{formatPrice(order.delivery_fee)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-marine-900"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </section>

      {order.events.length > 0 && (
        <section className="mt-6 rounded-3xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-marine-900">Progress</h2>
          <ol className="mt-4 space-y-4">
            {order.events.map((e, idx) => (
              <li key={`${e.at}-${idx}`} className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-marine-700" />
                <div>
                  <p className="text-sm font-medium capitalize text-marine-900">{e.status.replace(/_/g, " ")}</p>
                  {e.note && <p className="text-sm text-muted">{e.note}</p>}
                  <p className="text-xs text-muted">{new Date(e.at).toLocaleString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="h-12 flex-1 rounded-full bg-marine-700 px-6 text-sm font-semibold text-white hover:bg-marine-800 flex items-center justify-center"
        >
          Continue shopping
        </Link>
        <Link
          href={whatsappLink(`Hi, about my order ${order.order_number}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-marine-900 hover:border-marine-700"
        >
          Need help?
        </Link>
      </div>
    </div>
  );
}
