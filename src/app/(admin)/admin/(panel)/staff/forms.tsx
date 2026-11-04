"use client";

import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { Field, inputClass } from "@/components/admin/ui";
import { createStaff, removeStaff, resetStaffPassword, setStaffActive, updateStaff } from "./actions";

const roleHelp = {
  owner: "Everything, including staff accounts.",
  staff: "Orders, products, stock, delivery, discounts and analytics.",
  editor: "Categories, spec fields and brands only.",
};

export function AddStaffForm() {
  return (
    <ActionForm action={createStaff} resetOnSuccess className="grid gap-4 @min-[34rem]:grid-cols-2">
      <Field label="Name" htmlFor="staff-name"><input id="staff-name" name="name" required className={inputClass} /></Field>
      <Field label="Email" htmlFor="staff-email"><input id="staff-email" name="email" type="email" required autoComplete="off" className={inputClass} /></Field>
      <Field label="Role" htmlFor="staff-role" hint={`Staff: ${roleHelp.staff} Editor: ${roleHelp.editor}`}>
        <select id="staff-role" name="role" defaultValue="staff" className={inputClass}>
          <option value="staff">Staff</option>
          <option value="editor">Editor</option>
          <option value="owner">Owner</option>
        </select>
      </Field>
      <div className="flex items-end"><SubmitButton pendingText="Creating…">Create account</SubmitButton></div>
    </ActionForm>
  );
}

export function StaffRow({ member, isMe }: { member: { id: string; name: string; role: string; email: string; isActive: boolean }; isMe: boolean }) {
  return (
    <li className={`rounded-xl border p-4 ${member.isActive ? "border-line bg-white" : "border-gold-300 bg-gold-50/40"}`}>
      <details>
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="font-medium text-marine-900">{member.name}{isMe && <span className="ml-2 text-xs font-normal text-muted">(you)</span>}</span>
            <span className="block text-xs text-muted">{member.email}</span>
          </span>
          <span className="flex items-center gap-3 text-sm">
            {!member.isActive && (
              <span className="rounded-full bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-800">Suspended</span>
            )}
            <span className="rounded-full bg-marine-50 px-2.5 py-1 text-xs font-medium capitalize text-marine-800">{member.role}</span>
            <span className="text-muted underline">Manage</span>
          </span>
        </summary>
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <ActionForm action={updateStaff} className="grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
            <input type="hidden" name="id" value={member.id} />
            <Field label="Name" htmlFor={`n-${member.id}`}><input id={`n-${member.id}`} name="name" defaultValue={member.name} required className={inputClass} /></Field>
            <Field label="Role" htmlFor={`r-${member.id}`}>
              <select id={`r-${member.id}`} name="role" defaultValue={member.role} className={inputClass}>
                <option value="staff">Staff</option>
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
            </Field>
            <SubmitButton variant="secondary">Save</SubmitButton>
          </ActionForm>
          {!isMe && (
            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <ActionForm action={resetStaffPassword}>
                <input type="hidden" name="id" value={member.id} />
                <SubmitButton variant="secondary" pendingText="Resetting…" confirm={`Reset ${member.name}'s password? Their old password stops working.`}>Reset password</SubmitButton>
              </ActionForm>
              <ActionForm action={setStaffActive}>
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="active" value={member.isActive ? "false" : "true"} />
                <SubmitButton
                  variant={member.isActive ? "secondary" : "primary"}
                  pendingText={member.isActive ? "Suspending…" : "Reactivating…"}
                  confirm={member.isActive ? `Suspend ${member.name}? They will be signed out and can't sign in until reactivated.` : undefined}
                >
                  {member.isActive ? "Suspend access" : "Reactivate access"}
                </SubmitButton>
              </ActionForm>
              <ActionForm action={removeStaff}>
                <input type="hidden" name="id" value={member.id} />
                <SubmitButton variant="danger" pendingText="Removing…" confirm={`Permanently delete ${member.name}'s account? This can't be undone. Suspend instead if you might restore access later.`}>Delete account</SubmitButton>
              </ActionForm>
            </div>
          )}
        </div>
      </details>
    </li>
  );
}
