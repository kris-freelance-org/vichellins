import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PageKey } from "../page-content";
import { imageFormat } from "./category-images";

export async function uploadPageImage(supabase: SupabaseClient, file: File, key: PageKey): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose an image no larger than 5 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const format = imageFormat(bytes);
  if (!format) throw new Error("Choose a JPG, PNG or WebP image.");
  const storage = supabase.storage.from("product-images");
  const path = `pages/${key}/${crypto.randomUUID()}.${format.extension}`;
  const { error } = await storage.upload(path, bytes, { contentType: format.contentType, cacheControl: "31536000" });
  if (error) throw new Error("The image couldn't be uploaded. Please try again.");
  return storage.getPublicUrl(path).data.publicUrl;
}

export async function removePageImage(supabase: SupabaseClient, url: string, key: PageKey) {
  const storage = supabase.storage.from("product-images");
  const base = storage.getPublicUrl("").data.publicUrl;
  if (!url.startsWith(base)) return;
  const path = url.slice(base.length);
  if (!path.startsWith(`pages/${key}/`) || !/^pages\/[a-z-]+\/[a-f0-9-]+\.(jpg|png|webp)$/.test(path)) return;
  await storage.remove([path]);
}
