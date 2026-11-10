"use client";

import { useEffect, useRef, useState } from "react";
import { PendingProvider, SubmitButton, useServerAction } from "@/components/admin/forms";
import { Card, Field, Notice, buttonStyles, inputClass } from "@/components/admin/ui";
import type { ContentField, PageContent, PageDefinition, PageKey } from "@/lib/page-content";
import { saveSitePage } from "./actions";

function ImageField({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const url = preview || value;
  return <div className="mt-2 space-y-3">
    {url ? <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Selected image preview" className="max-h-64 w-full object-contain" />
    </div> : <p className="rounded-xl border border-dashed border-line bg-surface p-6 text-sm text-muted">No image selected. Choose a photo below.</p>}
    <input ref={input} id={name} name={name} type="file" accept="image/jpeg,image/png,image/webp" aria-invalid={Boolean(error)} aria-describedby={`${name}-hint${error ? ` ${name}-error` : ""}`}
      className="block min-h-11 w-full min-w-0 rounded-xl border border-line p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-marine-50 file:px-3 file:py-2 file:text-marine-800"
      onChange={event => {
        const file = event.target.files?.[0];
        setError(""); setPreview("");
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
          setError("Choose a JPG, PNG or WebP image no larger than 5 MB."); event.target.value = ""; return;
        }
        setPreview(URL.createObjectURL(file));
      }} />
    <p id={`${name}-hint`} className="text-xs text-muted">JPG, PNG or WebP. Wide photos work best for banners.</p>
    {error && <p id={`${name}-error`} role="alert" className="text-sm text-danger-700">{error}</p>}
    {url && <button type="button" className="min-h-11 rounded-lg px-2 text-xs font-medium text-danger-700 hover:bg-danger-50" onClick={() => { onChange(""); setPreview(""); if (input.current) input.current.value = ""; }}>Remove image</button>}
  </div>;
}

function EditorField({ field, value, name, onChange }: { field: ContentField; value: string; name: string; onChange: (value: string) => void }) {
  const id = field.type === "image" ? name : `field-${name}`;
  return <Field label={field.label} htmlFor={id} hint={field.hint}>
    {field.type === "image" ? <ImageField name={name} value={value} onChange={onChange} />
      : field.type === "textarea" ? <textarea id={id} rows={4} value={value} required={field.required} maxLength={20000} onChange={e => onChange(e.target.value)} className={`${inputClass} h-auto py-3`} />
      : <input id={id} type={field.type === "number" ? "number" : "text"} min={field.type === "number" ? 0 : undefined} max={field.type === "number" ? 100000000 : undefined} step={field.type === "number" ? 1 : undefined} value={value} required={field.required} maxLength={1000} onChange={e => onChange(e.target.value)} className={inputClass} />}
  </Field>;
}

export function PageEditor({ pageKey, definition, content, saved = false }: { pageKey: PageKey; definition: PageDefinition; content: PageContent; saved?: boolean }) {
  const [data, setData] = useState<PageContent>(() => ({ values: { ...content.values }, collections: Object.fromEntries(Object.entries(content.collections).map(([key, rows]) => [key, rows.map((row, index) => ({ ...row, _editorId: `initial-${key}-${index}` }))])) }));
  const [dirty, setDirty] = useState(false);
  const { state, onSubmit, pending } = useServerAction(saveSitePage);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state?.message || saved) feedback.current?.focus(); }, [state, saved]);
  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);
  const update = (fn: (draft: PageContent) => void) => { setData(current => { const draft = structuredClone(current); fn(draft); return draft; }); setDirty(true); };
  return <PendingProvider pending={pending}><form onSubmit={onSubmit} aria-busy={pending} className="space-y-6">
    <input type="hidden" name="page_key" value={pageKey} /><input type="hidden" name="content" value={JSON.stringify(data)} /><input type="hidden" name="original" value={JSON.stringify(content)} />
    {(state?.message || (saved && !dirty)) && <div ref={feedback} tabIndex={-1} className="scroll-mt-28 outline-none">
      {saved && !dirty && <Notice tone="green">Page saved. Your changes are live. <a className="font-semibold underline" href={definition.path} target="_blank" rel="noopener noreferrer">View page</a></Notice>}
      {state?.message && <Notice tone={state.ok ? "green" : "red"}>{state.message}</Notice>}
    </div>}
    <fieldset disabled={pending} className="contents">
      {definition.groups.map(group => <Card key={group.title} title={group.title}><div className="grid gap-5 @min-[42rem]:grid-cols-2">{group.fields.map(field => <div key={field.key} className={field.type === "textarea" || field.type === "image" ? "@min-[42rem]:col-span-2" : ""}>
        <EditorField field={field} name={`image__${field.key}`} value={data.values[field.key]} onChange={value => update(draft => { draft.values[field.key] = value; })} />
      </div>)}</div></Card>)}
      {definition.collections.map(collection => <Card key={collection.key} title={collection.label} description="Add entries and use the arrows to change their order.">
        <div className="space-y-5">{data.collections[collection.key].map((row, index, rows) => <section key={row._editorId} className="border-b border-line pb-5 last:border-0" aria-label={`${collection.label} entry ${index + 1}`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-semibold text-muted">Entry {index + 1}</h3><div className="flex flex-wrap items-center gap-1">
            <button type="button" disabled={index === 0} aria-label={`Move entry ${index + 1} up`} className="min-h-11 min-w-11 rounded-lg px-2 text-sm text-marine-700 hover:bg-marine-50 disabled:opacity-30" onClick={() => update(draft => { const list = draft.collections[collection.key]; [list[index - 1], list[index]] = [list[index], list[index - 1]]; })}>↑</button>
            <button type="button" disabled={index === rows.length - 1} aria-label={`Move entry ${index + 1} down`} className="min-h-11 min-w-11 rounded-lg px-2 text-sm text-marine-700 hover:bg-marine-50 disabled:opacity-30" onClick={() => update(draft => { const list = draft.collections[collection.key]; [list[index], list[index + 1]] = [list[index + 1], list[index]]; })}>↓</button>
            <button type="button" className="min-h-11 rounded-lg px-3 text-xs text-danger-700 hover:bg-danger-50" onClick={() => update(draft => { draft.collections[collection.key].splice(index, 1); })}>Remove</button>
          </div></div>
          <div className="grid gap-4 @min-[42rem]:grid-cols-2">{collection.fields.map(field => <div key={field.key} className={field.type === "textarea" || field.type === "image" ? "@min-[42rem]:col-span-2" : ""}><EditorField field={field} name={`image__${collection.key}__${index}__${field.key}`} value={row[field.key] ?? ""} onChange={value => update(draft => { draft.collections[collection.key][index][field.key] = value; })} /></div>)}</div>
        </section>)}</div>
        <button type="button" disabled={data.collections[collection.key].length >= collection.max} className={`${buttonStyles.secondary} mt-4`} onClick={() => update(draft => { draft.collections[collection.key].push({ ...Object.fromEntries(collection.fields.map(f => [f.key, f.value ?? ""])), _editorId: crypto.randomUUID() }); })}>Add entry</button>
      </Card>)}
      <div className="sticky bottom-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm"><p className="text-xs text-muted">{pending ? "Saving your page…" : dirty ? "You have unsaved changes." : "Changes go live when you save."}</p><SubmitButton pendingText="Saving page…">Save page</SubmitButton></div>
    </fieldset>
  </form></PendingProvider>;
}
