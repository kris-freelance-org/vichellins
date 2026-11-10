import { defaultPageContent, pageDefinitions, safeContentLink, type ContentField, type PageContent, type PageDefinition, type PageKey } from "./page-content";

export function validPageImage(value: string): boolean {
  if (!value) return true;
  if (/[\x00-\x20\\]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  try {
    const url = new URL(value);
    return url.origin === new URL(base).origin && url.pathname.startsWith("/storage/v1/object/public/product-images/pages/");
  } catch { return false; }
}

function fieldError(field: ContentField, value: unknown): string | null {
  if (typeof value !== "string") return `Enter a valid value for ${field.label}.`;
  if (value.length > (field.type === "textarea" ? 20000 : 1000)) return `${field.label} is too long.`;
  if (field.required && !value.trim()) return `Enter ${field.label.toLowerCase()}.`;
  if (field.type === "link" && !safeContentLink(value)) return `Use a website address or a path beginning with / for ${field.label.toLowerCase()}.`;
  if (field.type === "image" && !validPageImage(value)) return `Upload a valid image for ${field.label.toLowerCase()}.`;
  if (field.type === "number" && (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > 100000000)) return `Enter a whole number between 0 and 100,000,000 for ${field.label.toLowerCase()}.`;
  return null;
}
const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

export function validatePageContent(key: PageKey, input: unknown): { data: PageContent; error?: never } | { error: string; data?: never } {
  if (!record(input) || !record(input.values) || !record(input.collections)) return { error: "The page could not be read. Reload and try again." };
  const definition: PageDefinition = pageDefinitions[key];
  const data: PageContent = { values: {}, collections: {} };
  for (const field of definition.groups.flatMap(g => g.fields)) {
    const value = input.values[field.key];
    const error = fieldError(field, value);
    if (error) return { error };
    data.values[field.key] = (value as string).trim();
  }
  for (const collection of definition.collections) {
    const rows = input.collections[collection.key];
    if (!Array.isArray(rows) || rows.length > collection.max) return { error: `${collection.label} can have up to ${collection.max} entries.` };
    data.collections[collection.key] = [];
    for (const row of rows) {
      if (!record(row)) return { error: `Check the entries in ${collection.label.toLowerCase()}.` };
      const clean: Record<string, string> = {};
      for (const field of collection.fields) {
        const error = fieldError(field, row[field.key]);
        if (error) return { error: `${collection.label}: ${error}` };
        clean[field.key] = (row[field.key] as string).trim();
      }
      data.collections[collection.key].push(clean);
    }
  }
  return { data };
}

/** Merge newly introduced fields into saved pages without overwriting saved empty lists. */
export function mergePageContent(key: PageKey, input: unknown): PageContent {
  const defaults = defaultPageContent(key);
  if (!record(input)) return defaults;
  const merged = { values: { ...defaults.values, ...(record(input.values) ? input.values : {}) }, collections: { ...defaults.collections, ...(record(input.collections) ? input.collections : {}) } };
  const result = validatePageContent(key, merged);
  return result.data ?? defaults;
}

export function imageSlots(key: PageKey, data: PageContent): { name: string; url: string; set: (url: string) => void }[] {
  const definition: PageDefinition = pageDefinitions[key];
  return [
    ...definition.groups.flatMap(g => g.fields.filter(f => f.type === "image").map(f => ({ name: `image__${f.key}`, url: data.values[f.key], set: (url: string) => { data.values[f.key] = url; } }))),
    ...definition.collections.flatMap(c => data.collections[c.key].flatMap((row, index) => c.fields.filter(f => f.type === "image").map(f => ({ name: `image__${c.key}__${index}__${f.key}`, url: row[f.key], set: (url: string) => { row[f.key] = url; } })))),
  ];
}
