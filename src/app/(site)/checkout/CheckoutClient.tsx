"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/browser";

export type CheckoutZone = { id: string; name: string; fee: number; eta: string };
export type PaymentDefaults = { cod?: boolean; transfer?: boolean };
export type BankAccount = { bank_name: string; account_name: string; account_number: string };

type PaymentKey = "cod" | "transfer";
type Stage = "form" | "pay";

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  zone: string;
  payment: PaymentKey | "";
};

type PlacedOrder = {
  order_number: string;
  total: number;
  method: PaymentKey;
  amountDueNow: number;
  deliveryFee: number;
  subtotal: number;
};

const METHOD_META: Record<PaymentKey, { label: string; hint: string }> = {
  transfer: { label: "Bank transfer", hint: "Transfer the full order total before your order can be dispatched." },
  cod: { label: "Pay on delivery", hint: "Transfer only the delivery fee now. Pay the rest in cash when your order arrives." },
};

const input =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-marine-900 focus:border-marine-700 focus:outline-none aria-[invalid=true]:border-danger-700";

const PLACE_ORDER_ERRORS: Record<string, string> = {
  invalid_name: "Enter your full name.",
  invalid_phone: "Enter a valid Nigerian phone number.",
  invalid_address: "Enter your full delivery address.",
  invalid_zone: "That delivery area isn't available right now.",
  invalid_items: "Your cart has an issue. Reload the page and try again.",
  invalid_quantity: "One of the items has an invalid quantity.",
  variant_unavailable: "One of the items is no longer on sale.",
  insufficient_stock: "There isn't enough stock for one of your items.",
  payment_method_unavailable: "That payment method isn't available.",
};

function validate(f: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Enter your full name.";
  // Nigerian mobile numbers: 11 digits starting 0, or +234 / 234 followed by 10 digits.
  if (!/^(?:\+?234|0)[789][01]\d{8}$/.test(f.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid Nigerian phone number, e.g. 08012345678.";
  }
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) errors.email = "Enter a valid email or leave it blank.";
  if (f.address.trim().length < 8) errors.address = "Enter your full delivery address, with street and area.";
  return errors;
}

function enabledDefaults(defaults: PaymentDefaults): PaymentKey[] {
  const list: PaymentKey[] = [];
  if (defaults.cod) list.push("cod");
  if (defaults.transfer) list.push("transfer");
  return list;
}

function friendlyPlaceOrderError(message: string, detail?: string): string {
  const known = Object.keys(PLACE_ORDER_ERRORS).find((k) => message.includes(k));
  if (known === "insufficient_stock" && detail) return `Not enough stock for ${detail}. Edit your cart and try again.`;
  if (known) return PLACE_ORDER_ERRORS[known];
  return "Something went wrong placing your order. Please try again.";
}

export function CheckoutClient({
  zones,
  defaultMethods,
  bank,
}: {
  zones: CheckoutZone[];
  defaultMethods: PaymentDefaults;
  bank: BankAccount;
}) {
  const router = useRouter();
  const { items, subtotal } = useCart();

  // Per-variant override lookup. Missing entries fall back to globals so the UI
  // stays usable while the fetch is in flight.
  const [overrides, setOverrides] = useState<Record<string, PaymentKey[] | null>>({});
  useEffect(() => {
    const variantIds = [...new Set(items.map((i) => i.variantId))];
    if (variantIds.length === 0) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("variants")
        .select("id, products(payment_methods)")
        .in("id", variantIds);
      if (cancelled) return;
      const next: Record<string, PaymentKey[] | null> = {};
      for (const row of (data ?? []) as unknown as {
        id: string;
        products: { payment_methods: string[] | null } | { payment_methods: string[] | null }[] | null;
      }[]) {
        const product = Array.isArray(row.products) ? row.products[0] : row.products;
        const methods = product?.payment_methods ?? null;
        next[row.id] = methods ? methods.filter((m): m is PaymentKey => m === "cod" || m === "transfer") : null;
      }
      setOverrides(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  const globalEnabled = useMemo(() => enabledDefaults(defaultMethods), [defaultMethods]);
  const effectiveMethods = useMemo<PaymentKey[]>(() => {
    if (items.length === 0) return globalEnabled;
    const perProduct = items.map((i) => overrides[i.variantId] ?? globalEnabled);
    return perProduct.reduce<PaymentKey[]>(
      (acc, methods) => acc.filter((m) => methods.includes(m)),
      [...perProduct[0]],
    );
  }, [overrides, items, globalEnabled]);

  const [fields, setFields] = useState<Fields>(() => ({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    zone: zones[0]?.id ?? "",
    payment: "",
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [stage, setStage] = useState<Stage>("form");
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const zone = zones.find((z) => z.id === fields.zone) ?? zones[0];
  const total = subtotal + (zone?.fee ?? 0);
  const selectedMethod = (effectiveMethods.includes(fields.payment as PaymentKey)
    ? fields.payment
    : effectiveMethods[0] ?? "") as PaymentKey | "";
  const amountDueNow = selectedMethod === "cod" ? (zone?.fee ?? 0) : total;
  const amountDueOnDelivery = selectedMethod === "cod" ? subtotal : 0;

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  if (items.length === 0 && stage === "form") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Nothing to check out</h1>
        <p className="mt-3 text-muted">Your cart&apos;s empty — add something first.</p>
        <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-marine-700 px-7 text-sm font-semibold text-white hover:bg-marine-800">
          Browse the shop
        </Link>
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Checkout is temporarily closed</h1>
        <p className="mt-3 text-muted">Delivery areas haven&apos;t been set yet. Please try again shortly.</p>
      </div>
    );
  }

  const paymentsBlocked = effectiveMethods.length === 0;
  const bankSet = Boolean(bank.bank_name || bank.account_name || bank.account_number);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMethod || !zone || submitting) return;
    const found = validate(fields);
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const orderItems = items.map((i: CartItem) => ({ variant_id: i.variantId, qty: i.qty }));
    const { data, error } = await supabase.rpc("place_order", {
      p_name: fields.name.trim(),
      p_phone: fields.phone.trim(),
      p_email: fields.email.trim() || null,
      p_address: fields.address.trim(),
      p_zone_id: zone.id,
      p_payment: selectedMethod,
      p_notes: fields.notes.trim() || null,
      p_items: orderItems,
      p_source: "website",
    });
    setSubmitting(false);

    if (error) {
      setSubmitError(friendlyPlaceOrderError(error.message, (error as { details?: string }).details));
      return;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.order_number) {
      setSubmitError("Something went wrong placing your order. Please try again.");
      return;
    }

    const placedOrder: PlacedOrder = {
      order_number: row.order_number,
      total: row.total ?? total,
      method: selectedMethod,
      amountDueNow,
      deliveryFee: zone.fee,
      subtotal,
    };
    setPlaced(placedOrder);
    try {
      sessionStorage.setItem(
        "vn-last-order",
        JSON.stringify({ order_number: placedOrder.order_number, phone: fields.phone.trim() }),
      );
    } catch {
      // Private mode / quota full: success page falls back to a friendly message.
    }
    setStage("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markTransferDone() {
    if (!placed) return;
    router.push(`/checkout/success?order=${encodeURIComponent(placed.order_number)}`);
  }

  if (stage === "pay" && placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marine-900">
          {placed.method === "cod" ? "Pay the delivery fee" : "Complete your payment"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Your order <span className="font-semibold text-marine-900">{placed.order_number}</span> is reserved.{" "}
          {placed.method === "cod"
            ? "Transfer the delivery fee now and we'll dispatch once it's confirmed. Pay the rest in cash when it arrives."
            : "Transfer the full amount below. We'll dispatch once it's confirmed."}
        </p>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Amount to transfer now</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-marine-900">{formatPrice(placed.amountDueNow)}</p>
          {placed.method === "cod" && (
            <p className="mt-1 text-xs text-muted">
              Plus {formatPrice(placed.subtotal)} payable to the rider on delivery.
            </p>
          )}

          {bankSet ? (
            <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              {bank.bank_name && (
                <div className="flex justify-between gap-4"><dt className="text-muted">Bank</dt><dd className="font-medium text-marine-900">{bank.bank_name}</dd></div>
              )}
              {bank.account_name && (
                <div className="flex justify-between gap-4"><dt className="text-muted">Account name</dt><dd className="font-medium text-marine-900">{bank.account_name}</dd></div>
              )}
              {bank.account_number && (
                <div className="flex justify-between gap-4"><dt className="text-muted">Account number</dt><dd className="font-mono text-lg font-semibold text-marine-900">{bank.account_number}</dd></div>
              )}
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-muted">Reference</dt>
                <dd className="font-mono font-semibold text-marine-900">{placed.order_number}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-5 rounded-2xl border border-gold-300 bg-gold-50 p-4 text-sm text-gold-800">
              Bank details are being prepared. Please reach out on WhatsApp to get the account details for your transfer.
            </p>
          )}
          <p className="mt-4 text-xs text-muted">Please use your order number as the transfer reference so we can match your payment.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={markTransferDone}
            className="h-12 flex-1 rounded-full bg-marine-700 px-6 text-sm font-semibold text-white hover:bg-marine-800"
          >
            Transfer done
          </button>
          <Link
            href={whatsappLink(`Hi, I just placed order ${placed.order_number} but I have a question before transferring.`)}
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

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`e-${key}`} className="mt-1 text-xs text-danger-700">{errors[key]}</p>
    ) : null;
  const aria = (key: keyof Fields) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
  });

  const proceedLabel = submitting
    ? "Placing order…"
    : selectedMethod === "cod"
      ? `Proceed to pay delivery fee · ${formatPrice(amountDueNow)}`
      : `Proceed to pay · ${formatPrice(amountDueNow)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Checkout</h1>
      <p className="mt-2 text-sm text-muted">Delivery within Lagos only. No account needed.</p>

      <form onSubmit={submitOrder} noValidate className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <div className="min-w-0 space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-marine-900">Your details</legend>
            <div>
              <label htmlFor="f-name" className="text-sm font-medium text-marine-900">Full name</label>
              <input id="f-name" autoComplete="name" value={fields.name} onChange={set("name")} className={input} {...aria("name")} />
              {err("name")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="f-phone" className="text-sm font-medium text-marine-900">Phone number</label>
                <input id="f-phone" type="tel" autoComplete="tel" inputMode="tel" value={fields.phone} onChange={set("phone")} className={input} {...aria("phone")} />
                {err("phone")}
              </div>
              <div>
                <label htmlFor="f-email" className="text-sm font-medium text-marine-900">Email <span className="font-normal text-muted">(optional)</span></label>
                <input id="f-email" type="email" autoComplete="email" value={fields.email} onChange={set("email")} className={input} {...aria("email")} />
                {err("email")}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-marine-900">Delivery</legend>
            <div>
              <label htmlFor="f-zone" className="text-sm font-medium text-marine-900">Area</label>
              <select id="f-zone" value={fields.zone} onChange={set("zone")} className={input}>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} · {formatPrice(z.fee)}
                  </option>
                ))}
              </select>
              {zone?.eta && <p className="mt-1 text-xs text-muted">Usually {zone.eta.toLowerCase()}.</p>}
            </div>
            <div>
              <label htmlFor="f-address" className="text-sm font-medium text-marine-900">Delivery address</label>
              <textarea id="f-address" rows={3} autoComplete="street-address" value={fields.address} onChange={set("address")} className={`${input} h-auto py-3`} {...aria("address")} />
              {err("address")}
            </div>
            <div>
              <label htmlFor="f-notes" className="text-sm font-medium text-marine-900">Note for us <span className="font-normal text-muted">(optional)</span></label>
              <textarea id="f-notes" rows={2} value={fields.notes} onChange={set("notes")} className={`${input} h-auto py-3`} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-semibold text-marine-900">Payment</legend>
            {paymentsBlocked ? (
              <div className="mt-3 rounded-2xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-800">
                Your cart mixes items that only accept different payment methods, so there&apos;s no single way to pay for them together. Remove one of them, or check them out separately.
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {effectiveMethods.map((id) => (
                  <label key={id} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${selectedMethod === id ? "border-marine-700 bg-marine-50" : "border-line"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={selectedMethod === id}
                      onChange={() => setFields((f) => ({ ...f, payment: id }))}
                      className="mt-1 accent-marine-700"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-marine-900">{METHOD_META[id].label}</span>
                      <span className="block text-xs text-muted">{METHOD_META[id].hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </div>

        <aside className="min-w-0 h-fit rounded-3xl bg-surface p-5 sm:p-6 lg:sticky lg:top-36">
          <h2 className="text-lg font-semibold text-marine-900">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.variantId} className="flex justify-between gap-4">
                <span className="min-w-0 break-words text-marine-900">
                  {i.name} <span className="text-muted">x{i.qty}</span>
                  {i.variantLabel && <span className="block text-xs text-muted">{i.variantLabel}</span>}
                </span>
                <span className="shrink-0 font-medium text-marine-900">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium text-marine-900">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery ({zone?.name ?? "—"})</dt><dd className="font-medium text-marine-900">{formatPrice(zone?.fee ?? 0)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-marine-900"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            {selectedMethod && (
              <div className="rounded-2xl bg-white p-3 text-xs">
                <div className="flex justify-between gap-4 text-marine-900">
                  <span className="text-muted">Pay now</span>
                  <span className="font-semibold">{formatPrice(amountDueNow)}</span>
                </div>
                {selectedMethod === "cod" && (
                  <div className="mt-1 flex justify-between gap-4 text-marine-900">
                    <span className="text-muted">Pay on delivery</span>
                    <span className="font-semibold">{formatPrice(amountDueOnDelivery)}</span>
                  </div>
                )}
              </div>
            )}
          </dl>
          {submitError && (
            <p role="alert" className="mt-4 rounded-2xl border border-danger-200 bg-danger-50 p-3 text-sm text-danger-800">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            disabled={paymentsBlocked || !selectedMethod || submitting}
            className="mt-6 h-12 w-full rounded-full bg-marine-700 text-sm font-semibold text-white hover:bg-marine-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {proceedLabel}
          </button>
          <p className="mt-3 text-xs text-muted">
            {selectedMethod === "cod"
              ? "Transfer the delivery fee to the account we show you, then click Transfer done."
              : "We'll show you the bank details on the next step. Transfer, then click Transfer done."}
          </p>
          <Link href="/cart" className="mt-3 flex min-h-11 items-center justify-center text-center text-sm text-muted underline">Edit cart</Link>
        </aside>
      </form>
    </div>
  );
}
