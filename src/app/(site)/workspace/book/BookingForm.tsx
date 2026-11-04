"use client";

import { useState } from "react";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { createBooking } from "./actions";

const input =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-marine-900 focus:border-marine-700 focus:outline-none";

export function BookingForm() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  return (
    <ActionForm action={createBooking} className="grid gap-5">
      <div>
        <label htmlFor="book-name" className="text-sm font-medium text-marine-900">Full name</label>
        <input id="book-name" name="name" required autoComplete="name" className={input} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="book-phone" className="text-sm font-medium text-marine-900">Phone number</label>
          <input id="book-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="08012345678" className={input} />
        </div>
        <div>
          <label htmlFor="book-email" className="text-sm font-medium text-marine-900">Email <span className="font-normal text-muted">(optional)</span></label>
          <input id="book-email" name="email" type="email" autoComplete="email" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="book-date" className="text-sm font-medium text-marine-900">Visit date</label>
        <input
          id="book-date"
          name="booking_date"
          type="date"
          required
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={input}
        />
        <p className="mt-1.5 text-xs text-muted">Pick the day you&apos;d like to come in.</p>
      </div>
      <div>
        <label htmlFor="book-notes" className="text-sm font-medium text-marine-900">Anything we should know? <span className="font-normal text-muted">(optional)</span></label>
        <textarea id="book-notes" name="notes" rows={3} maxLength={500} className={`${input} h-auto py-3`} />
      </div>
      <div className="pt-2 [&>button]:w-full">
        <SubmitButton pendingText="Booking…">Reserve my day</SubmitButton>
      </div>
      <p className="text-center text-xs text-muted">No payment needed now — pay when you arrive.</p>
    </ActionForm>
  );
}
