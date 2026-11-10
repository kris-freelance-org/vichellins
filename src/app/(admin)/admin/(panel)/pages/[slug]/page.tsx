import { notFound } from "next/navigation";
import { CONTENT, requireStaff } from "@/lib/admin/auth";
import { isPageKey, pageDefinitions } from "@/lib/page-content";
import { loadSitePage } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { LoadError } from "@/components/admin/LoadError";
import { PageEditor } from "../PageEditor";

export const metadata = { title: "Edit page" };

export default async function EditPage({ params, searchParams }: PageProps<"/admin/pages/[slug]">) {
  await requireStaff(CONTENT);
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  if (!isPageKey(slug)) notFound();
  const definition = pageDefinitions[slug];
  let content;
  try { content = await loadSitePage(await createClient(), slug); }
  catch { return <><PageHeader title={definition.label} /><LoadError subject="this page's saved content" /></>; }
  return <>
    <PageHeader title={`Edit ${definition.label.toLowerCase()}`} description="Write in plain text. Upload JPG, PNG or WebP images, up to 5 MB per save."
      actions={<LinkButton href="/admin/pages">All pages</LinkButton>} />
    <PageEditor key={`${query.saved ?? ""}:${JSON.stringify(content)}`} saved={typeof query.saved === "string"} pageKey={slug} definition={definition} content={content} />
  </>;
}
