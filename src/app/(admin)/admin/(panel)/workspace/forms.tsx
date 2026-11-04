"use client";

import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { Field, inputClass } from "@/components/admin/ui";
import { addMember, cancelBooking, cancelSubscription, confirmBooking, markNoShow, recordSubscription, removeMember } from "./actions";

export function AddMemberForm() {
  return (
    <ActionForm action={addMember} resetOnSuccess className="grid gap-4 @min-[34rem]:grid-cols-2">
      <Field label="Name" htmlFor="m-name"><input id="m-name" name="name" required className={inputClass} /></Field>
      <Field label="Phone" htmlFor="m-phone"><input id="m-phone" name="phone" inputMode="tel" className={inputClass} /></Field>
      <Field label="Email (optional)" htmlFor="m-email"><input id="m-email" name="email" type="email" className={inputClass} /></Field>
      <Field label="Notes (optional)" htmlFor="m-notes"><input id="m-notes" name="notes" className={inputClass} /></Field>
      <div className="col-span-full flex justify-end"><SubmitButton pendingText="Adding…">Add guest</SubmitButton></div>
    </ActionForm>
  );
}

export function RecordPaymentForm({ members }: { members: { id: string; name: string }[] }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <ActionForm action={recordSubscription} resetOnSuccess className="grid gap-4 @min-[34rem]:grid-cols-2">
      <Field label="Member" htmlFor="s-member">
        <select id="s-member" name="member_id" required className={inputClass} defaultValue="">
          <option value="" disabled>Choose a guest</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </Field>
      <Field label="Plan" htmlFor="s-plan" hint="E.g. Day pass, Weekly, Monthly">
        <input id="s-plan" name="plan" required className={inputClass} placeholder="Monthly" />
      </Field>
      <Field label="Amount (₦)" htmlFor="s-amount">
        <input id="s-amount" name="amount" required inputMode="numeric" className={inputClass} placeholder="25000" />
      </Field>
      <Field label="Duration (days)" htmlFor="s-days" hint="30 for a month, 7 for a week, 1 for a day pass">
        <input id="s-days" name="duration_days" required type="number" min={1} max={3650} defaultValue={30} className={inputClass} />
      </Field>
      <Field label="Payment method" htmlFor="s-method">
        <select id="s-method" name="payment_method" defaultValue="cash" className={inputClass}>
          <option value="cash">Cash</option>
          <option value="transfer">Bank transfer</option>
          <option value="card">Card</option>
          <option value="pos">POS</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <Field label="Start date" htmlFor="s-start">
        <input id="s-start" name="start_date" type="date" defaultValue={today} className={inputClass} />
      </Field>
      <Field label="Notes (optional)" htmlFor="s-notes">
        <input id="s-notes" name="notes" className={inputClass} />
      </Field>
      <div className="col-span-full flex justify-end"><SubmitButton pendingText="Recording…">Record payment</SubmitButton></div>
    </ActionForm>
  );
}

export function CancelButton({ id, memberName }: { id: string; memberName: string }) {
  return (
    <ActionForm action={cancelSubscription}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="secondary" pendingText="Cancelling…" confirm={`Cancel ${memberName}'s current subscription?`}>Cancel subscription</SubmitButton>
    </ActionForm>
  );
}

export function ConfirmBookingForm({ id, defaultAmount = 5000 }: { id: string; defaultAmount?: number }) {
  return (
    <ActionForm action={confirmBooking} className="grid gap-3 @min-[32rem]:grid-cols-[minmax(0,110px)_minmax(0,140px)_auto] @min-[32rem]:items-end">
      <input type="hidden" name="id" value={id} />
      <Field label="Amount (₦)" htmlFor={`b-amt-${id}`}>
        <input id={`b-amt-${id}`} name="amount" inputMode="numeric" required defaultValue={defaultAmount} className={inputClass} />
      </Field>
      <Field label="Paid with" htmlFor={`b-method-${id}`}>
        <select id={`b-method-${id}`} name="payment_method" defaultValue="cash" className={inputClass}>
          <option value="cash">Cash</option>
          <option value="transfer">Bank transfer</option>
          <option value="pos">POS</option>
          <option value="card">Card</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <SubmitButton pendingText="Confirming…">Confirm payment</SubmitButton>
    </ActionForm>
  );
}

export function CancelBookingButton({ id, name }: { id: string; name: string }) {
  return (
    <ActionForm action={cancelBooking}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="secondary" pendingText="Cancelling…" confirm={`Cancel ${name}'s booking?`}>Cancel</SubmitButton>
    </ActionForm>
  );
}

export function NoShowButton({ id, name }: { id: string; name: string }) {
  return (
    <ActionForm action={markNoShow}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="secondary" pendingText="Marking…" confirm={`Mark ${name} as a no-show?`}>No-show</SubmitButton>
    </ActionForm>
  );
}

export function RemoveMemberButton({ id, name }: { id: string; name: string }) {
  return (
    <ActionForm action={removeMember}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger" pendingText="Removing…" confirm={`Remove ${name} and all their payment history? This can't be undone.`}>Remove member</SubmitButton>
    </ActionForm>
  );
}
