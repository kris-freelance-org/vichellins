"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, useCart } from "@/lib/cart-store";
import { whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/browser";

export type CheckoutZone = { id: string; name: string; fee: number; eta: string };
export type PaymentDefaults = { cod?: boolean; transfer?: boolean };
export type BankAccount = { bank_name: string; account_name: string; account_number: string };

type PaymentKey = "cod" | "transfer";

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  zone: string;
  payment: PaymentKey | "";
};

const METHOD_META: Record<PaymentKey, { label: string; hint: string }> = {
  transfer: { label: "Bank transfer", hint: "Send to the account details shown below, then confirm on WhatsApp." },
  cod: { label: "Pay on delivery", hint: "Pay the rider when you have inspected your item." },
};

const input =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-marine-900 focus:border-marine-700 focus:outline-none aria-[invalid=true]:border-danger-700";

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

export function CheckoutClient({
  zones,
  defaultMethods,
  bank,
}: {
  zones: CheckoutZone[];
  defaultMethods: PaymentDefaults;
  bank: BankAccount;
}) {
  const { items, subtotal } = useCart();

  // Per-variant override lookup. Loaded on mount for whatever's in the cart.
  // Missing entries behave the same as "no override" (fall back to globals), so
  // the UI stays usable while the fetch is in flight.
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
      // Supabase's PostgREST infers the embedded relation as an array; variant
      // -> product is many-to-one at runtime, so we normalise either shape.
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
    // Each product resolves to its override, or the globals if no override.
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
  const [sent, setSent] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Zone and payment are always resolved against the current live lists during
  // render, so a stale user choice (eg. picked a method before overrides loaded)
  // gracefully falls back to a valid option instead of blocking submit.
  const zone = zones.find((z) => z.id === fields.zone) ?? zones[0];
  const total = subtotal + (zone?.fee ?? 0);
  const selectedMethod = (effectiveMethods.includes(fields.payment as PaymentKey)
    ? fields.payment
    : effectiveMethods[0] ?? "") as PaymentKey | "";

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Almost done — just press send</h1>
        <p className="mt-3 text-muted">
          WhatsApp has opened with your order ready. Hit send there and we&apos;ll confirm stock and arrange delivery — usually within a few minutes.
        </p>
        <a href={sent} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center rounded-full bg-marine-700 px-7 text-sm font-semibold text-white hover:bg-marine-800">
          Open WhatsApp again
        </a>
        <p className="mt-4 text-xs text-muted">
          Your order isn&apos;t placed until you send that WhatsApp message.{" "}
          {confirmClear ? (
            <>
              Clear your cart?{" "}
              <button type="button" className="underline" onClick={() => { clearCart(); setSent(null); }}>
                Yes, clear it
              </button>
              {" · "}
              <button type="button" className="underline" onClick={() => setConfirmClear(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="underline" onClick={() => setConfirmClear(true)}>
              Clear my cart
            </button>
          )}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMethod || !zone) return;
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const lines = items.map(
      (i) => `• ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.qty} - ${formatPrice(i.price * i.qty)}`,
    );
    const paymentLabel = METHOD_META[selectedMethod].label;
    const bankBlock =
      selectedMethod === "transfer" && (bank.bank_name || bank.account_name || bank.account_number)
        ? [
            "",
            "Bank transfer details:",
            ...(bank.bank_name ? [`Bank: ${bank.bank_name}`] : []),
            ...(bank.account_name ? [`Account name: ${bank.account_name}`] : []),
            ...(bank.account_number ? [`Account number: ${bank.account_number}`] : []),
          ]
        : [];
    const message = [
      "New order from the website",
      "",
      ...lines,
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      `Delivery (${zone.name}): ${formatPrice(zone.fee)}`,
      `Total: ${formatPrice(total)}`,
      "",
      `Payment: ${paymentLabel}`,
      ...bankBlock,
      "",
      `Name: ${fields.name.trim()}`,
      `Phone: ${fields.phone.trim()}`,
      ...(fields.email.trim() ? [`Email: ${fields.email.trim()}`] : []),
      `Address: ${fields.address.trim()}`,
      ...(fields.notes.trim() ? [`Notes: ${fields.notes.trim()}`] : []),
    ].join("\n");
    const url = whatsappLink(message);
    setSent(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`e-${key}`} className="mt-1 text-xs text-danger-700">{errors[key]}</p>
    ) : null;
  const aria = (key: keyof Fields) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-marine-900">Checkout</h1>
      <p className="mt-2 text-sm text-muted">Delivery within Lagos only. No account needed.</p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
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
                {selectedMethod === "transfer" && (bank.bank_name || bank.account_name || bank.account_number) && (
                  <div className="rounded-2xl border border-line bg-surface p-4 text-sm text-marine-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Send transfer to</p>
                    <dl className="mt-2 space-y-1">
                      {bank.bank_name && (
                        <div className="flex justify-between gap-4"><dt className="text-muted">Bank</dt><dd className="font-medium">{bank.bank_name}</dd></div>
                      )}
                      {bank.account_name && (
                        <div className="flex justify-between gap-4"><dt className="text-muted">Account name</dt><dd className="font-medium">{bank.account_name}</dd></div>
                      )}
                      {bank.account_number && (
                        <div className="flex justify-between gap-4"><dt className="text-muted">Account number</dt><dd className="font-mono font-semibold">{bank.account_number}</dd></div>
                      )}
                    </dl>
                    <p className="mt-3 text-xs text-muted">
                      Send the exact total above, then confirm the transfer on WhatsApp so we can ship your order.
                    </p>
                  </div>
                )}
                {selectedMethod === "transfer" && !bank.account_number && (
                  <p className="text-xs text-muted">Bank details will be shared on WhatsApp once your order is confirmed.</p>
                )}
              </div>
            )}
          </fieldset>
        </div>

        <aside className="min-w-0 h-fit rounded-3xl bg-surface p-5 sm:p-6">
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
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{formatPrice(zone?.fee ?? 0)}</dd></div>
            <div className="flex justify-between text-base font-semibold text-marine-900"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <button
            type="submit"
            disabled={paymentsBlocked || !selectedMethod}
            className="mt-6 h-12 w-full rounded-full bg-marine-700 text-sm font-semibold text-white hover:bg-marine-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send order on WhatsApp
          </button>
          <p className="mt-3 text-xs text-muted">
            This opens WhatsApp with your order pre-filled. We confirm stock and payment details — usually within a few minutes.
          </p>
          <Link href="/cart" className="mt-3 flex min-h-11 items-center justify-center text-center text-sm text-muted underline">Edit cart</Link>
        </aside>
      </form>
    </div>
  );
}
