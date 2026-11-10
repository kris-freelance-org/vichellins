"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CONTENT, requireStaff } from "@/lib/admin/auth";
import { fail, type ActionState } from "@/lib/admin/errors";
import { uploadPageImage, removePageImage } from "@/lib/admin/page-images";
import { isPageKey, pageDefinitions } from "@/lib/page-content";
import { imageSlots, mergePageContent, validatePageContent } from "@/lib/page-content-validation";
import { loadSitePage } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";

export async function saveSitePage(_previous: ActionState, form: FormData): Promise<ActionState> {
  await requireStaff(CONTENT);
  const key = String(form.get("page_key") ?? "");
  if (!isPageKey(key)) return fail("Choose a valid page.");
  const payload = String(form.get("content") ?? "");
  if (payload.length > 200000) return fail("This page is too long. Shorten some text and try again.");
  let input: unknown;
  try { input = JSON.parse(payload); } catch { return fail("The page couldn't be read. Reload and try again."); }
  const result = validatePageContent(key, input);
  if (!result.data) return fail(result.error);
  const content = result.data;
  const slots = imageSlots(key, content);
  const uploads = slots.map(slot => ({ slot, file: form.get(slot.name) })).filter((item): item is { slot: typeof slots[number]; file: File } => item.file instanceof File && item.file.size > 0);
  if (uploads.reduce((sum, item) => sum + item.file.size, 0) > 5 * 1024 * 1024) return fail("Upload up to 5 MB of images per save. Save a few photos at a time.");
  const supabase = await createClient();
  const uploaded: string[] = [];
  let oldImages: string[] = [];
  try {
    const previous = await loadSitePage(supabase, key);
    if (String(form.get("original") ?? "") !== JSON.stringify(previous)) return fail("Someone else updated this page. Open it in a new tab to review their changes before saving yours.");
    const snapshot = await supabase.from("site_settings").select("value").eq("key", `page:${key}`).maybeSingle();
    if (snapshot.error) throw new Error("Couldn't check the saved page. Please try again.");
    if (snapshot.data && JSON.stringify(mergePageContent(key, snapshot.data.value)) !== JSON.stringify(previous)) return fail("Someone else just updated this page. Reload it before saving.");
    oldImages = imageSlots(key, previous).map(slot => slot.url).filter(Boolean);
    for (const { slot, file } of uploads) {
      const url = await uploadPageImage(supabase, file, key);
      uploaded.push(url);
      slot.set(url);
    }
    if (snapshot.data) {
      const saved = await supabase.from("site_settings").update({ value: content }).eq("key", `page:${key}`).eq("value", JSON.stringify(snapshot.data.value)).select("key");
      if (saved.error) throw new Error("The page couldn't be saved. Your changes are still here; please try again.");
      if (!saved.data?.length) throw new Error("Someone else updated this page while you were saving. Open it in another tab to review their changes.");
    } else {
      const saved = await supabase.from("site_settings").insert({ key: `page:${key}`, value: content });
      if (saved.error) throw new Error(saved.error.code === "23505" ? "Someone else just saved this page. Open it in another tab to review their changes." : "The page couldn't be saved. Please try again.");
    }
  } catch (error) {
    await Promise.allSettled(uploaded.map(url => removePageImage(supabase, url, key)));
    return fail(error instanceof Error ? error.message : "Couldn't save this page. Please try again.");
  }
  const kept = new Set(imageSlots(key, content).map(slot => slot.url));
  await Promise.allSettled([...new Set(oldImages)].filter(url => !kept.has(url)).map(url => removePageImage(supabase, url, key)));
  const path = pageDefinitions[key].path;
  revalidatePath(path);
  if (key === "workspace") {
    revalidatePath("/workspace/book");
    revalidatePath("/workspace/book/success");
  }
  revalidatePath(`/admin/pages/${key}`);
  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${key}?saved=${Date.now()}`);
}
