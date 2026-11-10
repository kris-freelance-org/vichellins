import Link from "next/link";
import { CONTENT, requireStaff } from "@/lib/admin/auth";
import { pageDefinitions } from "@/lib/page-content";
import { PageHeader } from "@/components/admin/ui";
import { AdminIcon } from "@/components/admin/AdminIcon";

export const metadata = { title: "Pages" };

export default async function PagesPage() {
  const staff = await requireStaff(CONTENT);
  return <>
    <PageHeader title="Pages" description="Update your website's words, photos, and search previews. Saved changes appear on the site immediately." />
    <div className="grid gap-3 @min-[42rem]:grid-cols-2">
      {Object.entries(pageDefinitions).map(([key, definition]) => <Link key={key} href={`/admin/pages/${key}`} className="group flex min-h-24 items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-marine-200 hover:bg-marine-50/30">
        <AdminIcon name={key === "workspace" ? "people" : "homepage"} className="h-5 w-5 shrink-0 text-marine-700" />
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-foreground">{definition.label}</span><span className="mt-1 block break-all text-xs text-muted">{definition.path}</span></span>
        <span className="flex items-center gap-2 text-xs font-medium text-marine-700">Edit<AdminIcon name="arrow" className="h-4 w-4" /></span>
      </Link>)}
    </div>
    <section className="mt-8 border-t border-line pt-6">
      <h2 className="text-sm font-semibold">Product and category pages</h2><p className="mt-2 text-sm text-muted">Edit individual product photos, descriptions, specifications, and category introductions in the catalogue.</p>
      <div className="mt-3 flex flex-wrap gap-5"><Link href="/admin/categories" className="admin-text-link">Edit categories<AdminIcon name="arrow" className="h-4 w-4" /></Link>{staff.role !== "editor" && <Link href="/admin/products" className="admin-text-link">Edit products<AdminIcon name="arrow" className="h-4 w-4" /></Link>}</div>
    </section>
  </>;
}
