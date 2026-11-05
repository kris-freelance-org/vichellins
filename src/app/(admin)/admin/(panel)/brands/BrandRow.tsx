"use client";

import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { inputClass, td } from "@/components/admin/ui";
import { deleteBrand, updateBrand } from "./actions";

export function BrandRow({ id, name, productCount }: { id: string; name: string; productCount: number }) {
  return (
    <tr>
      <td className={td}>
        <ActionForm action={updateBrand} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <label htmlFor={`brand-${id}`} className="sr-only">Brand name</label>
          <input
            id={`brand-${id}`}
            name="name"
            defaultValue={name}
            required
            className={`${inputClass} mt-0 min-w-[160px] flex-1`}
          />
          <SubmitButton variant="secondary">Save</SubmitButton>
        </ActionForm>
      </td>
      <td className={td}>{productCount}</td>
      <td className={`${td} text-right`}>
        <ActionForm action={deleteBrand} className="inline-flex">
          <input type="hidden" name="id" value={id} />
          <SubmitButton
            variant="danger"
            pendingText="Deleting…"
            confirm={
              productCount > 0
                ? `Delete ${name}? Its ${productCount} product${productCount === 1 ? "" : "s"} will be left with no brand.`
                : `Delete ${name}?`
            }
          >
            Delete
          </SubmitButton>
        </ActionForm>
      </td>
    </tr>
  );
}
