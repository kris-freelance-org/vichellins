"use client";

import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { Field, inputClass } from "@/components/admin/ui";
import {
  createZone,
  deleteZone,
  updateBankAccount,
  updatePaymentDefaults,
  updateZone,
} from "./actions";

type Zone = { id: string; name: string; fee: number; eta: string; is_active: boolean; sort_order: number };

function ZoneFields({ zone, prefix }: { zone?: Zone; prefix: string }) {
  return (
    <div className="grid gap-4 @min-[34rem]:grid-cols-2">
      <Field label="Area name" htmlFor={`${prefix}-name`}>
        <input id={`${prefix}-name`} name="name" defaultValue={zone?.name} required className={inputClass} placeholder="e.g. Lekki and Ajah" />
      </Field>
      <Field label="Delivery fee (₦)" htmlFor={`${prefix}-fee`} hint="Use 0 for free delivery.">
        <input id={`${prefix}-fee`} name="fee" inputMode="numeric" defaultValue={zone?.fee} required className={inputClass} />
      </Field>
      <Field label="Usual delivery time" htmlFor={`${prefix}-eta`} hint="Shown to shoppers, e.g. Same day to 24 hours.">
        <input id={`${prefix}-eta`} name="eta" defaultValue={zone?.eta} className={inputClass} />
      </Field>
      <Field label="Order" htmlFor={`${prefix}-order`} hint="Lower numbers come first.">
        <input id={`${prefix}-order`} name="sort_order" type="number" defaultValue={zone?.sort_order ?? 0} className={inputClass} />
      </Field>
    </div>
  );
}

export function AddZoneForm() {
  return (
    <ActionForm action={createZone} resetOnSuccess className="space-y-4">
      <ZoneFields prefix="new-zone" />
      <SubmitButton pendingText="Adding…">Add area</SubmitButton>
    </ActionForm>
  );
}

export function ZoneRow({ zone }: { zone: Zone }) {
  return (
    <li className="rounded-xl border border-line bg-white p-4">
      <ActionForm action={updateZone} className="space-y-4">
        <input type="hidden" name="id" value={zone.id} />
        <ZoneFields zone={zone} prefix={`zone-${zone.id}`} />
        <label className="flex items-center gap-2.5 text-sm text-marine-900">
          <input type="checkbox" name="is_active" defaultChecked={zone.is_active} className="h-4 w-4 accent-marine-700" />
          Available at checkout
        </label>
        <SubmitButton variant="secondary">Save</SubmitButton>
      </ActionForm>
      <div className="mt-3 border-t border-line pt-3">
        <ActionForm action={deleteZone}>
          <input type="hidden" name="id" value={zone.id} />
          <SubmitButton variant="danger" pendingText="Deleting…" confirm={`Delete ${zone.name}? Past orders keep their delivery details.`}>
            Delete area
          </SubmitButton>
        </ActionForm>
      </div>
    </li>
  );
}

export function PaymentDefaultsForm({ cod, transfer }: { cod: boolean; transfer: boolean }) {
  return (
    <ActionForm action={updatePaymentDefaults} className="space-y-4">
      <p className="text-sm text-muted">
        Shoppers see these choices at checkout unless a specific product overrides them. Keep at least one on.
      </p>
      <div className="space-y-2">
        <label className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 text-sm text-marine-900">
          <input type="checkbox" name="cod" defaultChecked={cod} className="mt-0.5 h-4 w-4 accent-marine-700" />
          <span>
            <span className="block font-semibold">Pay on delivery</span>
            <span className="block text-xs text-muted">The rider collects payment when the item is handed over.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 text-sm text-marine-900">
          <input type="checkbox" name="transfer" defaultChecked={transfer} className="mt-0.5 h-4 w-4 accent-marine-700" />
          <span>
            <span className="block font-semibold">Bank transfer</span>
            <span className="block text-xs text-muted">Shoppers see the bank details you set below.</span>
          </span>
        </label>
      </div>
      <SubmitButton>Save defaults</SubmitButton>
    </ActionForm>
  );
}

export function BankAccountForm({
  bankName,
  accountName,
  accountNumber,
}: {
  bankName: string;
  accountName: string;
  accountNumber: string;
}) {
  return (
    <ActionForm action={updateBankAccount} className="space-y-4">
      <p className="text-sm text-muted">
        Shown to shoppers who pick bank transfer at checkout. Leave blank to hide the details until you fill them in.
      </p>
      <div className="grid gap-4 @min-[34rem]:grid-cols-2">
        <Field label="Bank name" htmlFor="bank-name">
          <input id="bank-name" name="bank_name" defaultValue={bankName} maxLength={80} className={inputClass} placeholder="e.g. GTBank" />
        </Field>
        <Field label="Account name" htmlFor="account-name">
          <input id="account-name" name="account_name" defaultValue={accountName} maxLength={120} className={inputClass} placeholder="e.g. Vichellins Nation Ltd" />
        </Field>
        <Field label="Account number" htmlFor="account-number" hint="10 digits.">
          <input
            id="account-number"
            name="account_number"
            inputMode="numeric"
            defaultValue={accountNumber}
            maxLength={10}
            className={inputClass}
            placeholder="0123456789"
          />
        </Field>
      </div>
      <SubmitButton>Save bank details</SubmitButton>
    </ActionForm>
  );
}
