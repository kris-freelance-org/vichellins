import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultPageContent, type PageKey, type PageContent } from "./page-content";
import { mergePageContent } from "./page-content-validation";
import { supabaseConfigured } from "./supabase/env";
import { createClient } from "./supabase/server";

export async function loadSitePage(supabase: SupabaseClient, key: PageKey): Promise<PageContent> {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", `page:${key}`).maybeSingle();
  if (error) throw new Error("Couldn't load this page's content. Try again before editing.");
  if (data) return mergePageContent(key, data.value);
  const defaults = defaultPageContent(key);
  // Keep existing homepage edits when upgrading to the Pages editor.
  if (key === "home") {
    const legacy = await supabase.from("site_settings").select("value").eq("key", "homepage").maybeSingle();
    if (legacy.error) throw new Error("Couldn't load the saved homepage.");
    const value = legacy.data?.value;
    if (value && typeof value === "object") {
      defaults.values.title = typeof value.hero_headline === "string" ? value.hero_headline : defaults.values.title;
      defaults.values.accent = typeof value.hero_accent === "string" ? value.hero_accent : defaults.values.accent;
      defaults.values.intro = typeof value.hero_sub === "string" ? value.hero_sub : defaults.values.intro;
      if (Array.isArray(value.trust)) defaults.collections.trust = value.trust;
    }
  }
  return mergePageContent(key, defaults);
}

export const getSitePage = cache(async (key: PageKey): Promise<PageContent> => {
  if (!supabaseConfigured) return defaultPageContent(key);
  try { return await loadSitePage(await createClient(), key); }
  catch { return defaultPageContent(key); }
});

export async function sitePageMetadata(key: PageKey): Promise<Metadata> {
  const { values } = await getSitePage(key);
  return { title: values.seo_title || values.title, description: values.seo_description || values.intro };
}
