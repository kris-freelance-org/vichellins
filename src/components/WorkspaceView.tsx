import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { lines, type PageContent } from "@/lib/page-content";

export function WorkspaceView({ content }: { content: PageContent }) {
  const v = content.values;
  const mapQuery = encodeURIComponent(v.address);
  const whatsapp = (message: string) => `https://wa.me/${v.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  return <>
    <section className="relative isolate overflow-hidden bg-marine-900 text-white">
      {v.banner && <Image src={v.banner} alt={v.banner_alt} fill preload sizes="100vw" quality={90}
        unoptimized={v.banner_fit !== "cover"}
        className={`-z-20 ${v.banner_fit === "cover" ? "object-cover" : "object-scale-down object-right"}`} />}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-marine-950/95 via-marine-950/80 to-marine-950/40" />
      <div className="store-container flex min-h-[520px] items-center py-16 sm:min-h-[580px] sm:py-24">
        <div className="max-w-2xl">
          {v.eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">{v.eyebrow}</p>}
          <h1 className="mt-5 break-words text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.045em]">{v.title}</h1>
          {v.intro && <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-marine-100 sm:text-lg">{v.intro}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workspace/book" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gold-400 px-6 text-sm font-semibold text-marine-950 hover:bg-gold-300">{v.book_button}</Link>
            <a href={whatsapp("Hi, I'd like to use the workspace. Could you share availability?")} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-marine-950/30 px-6 text-sm font-semibold text-white hover:bg-marine-900/70">{v.chat_button}</a>
          </div>
        </div>
      </div>
    </section>
    {content.collections.amenities.length > 0 && <section className="store-container py-14 sm:py-18">
      <h2 className="text-2xl font-semibold tracking-tight text-marine-900 sm:text-3xl">{v.amenities_title}</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{v.amenities_intro}</p>
      <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">{content.collections.amenities.map((a, i) => <div key={i} className="border-t border-line pt-5"><h3 className="text-base font-semibold text-marine-900">{a.title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{a.body}</p></div>)}</div>
    </section>}
    {content.collections.gallery.some(g => g.image) && <section className="bg-surface/70 py-14"><div className="store-container">
      <h2 className="text-2xl font-semibold text-marine-900 sm:text-3xl">{v.gallery_title}</h2><p className="mt-2 text-sm text-muted">{v.gallery_intro}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{content.collections.gallery.filter(g => g.image).map((g, i) => <div key={i} className="relative aspect-square overflow-hidden rounded-2xl"><Image src={g.image} alt={g.alt} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw" className="object-cover" /></div>)}</div>
    </div></section>}
    <section className="store-container py-14 sm:py-18">
      <h2 className="text-2xl font-semibold text-marine-900 sm:text-3xl">{v.plans_title}</h2><p className="mt-2 text-sm text-muted">{v.plans_intro}</p>
      <div className="mt-7 grid gap-4 lg:grid-cols-3">{["day", "week", "month"].map((key, i) => <div key={key} className={`flex min-w-0 flex-col rounded-2xl border p-6 ${i === 2 ? "border-marine-900 bg-marine-900 text-white" : "border-line bg-white"}`}>
        <h3 className="break-words text-lg font-semibold">{v[`${key}_name`]}</h3><p className="mt-4 break-words text-3xl font-semibold tabular-nums">{formatPrice(Number(v[`${key}_price`]))}</p><p className={`mt-1 text-xs ${i === 2 ? "text-marine-200" : "text-muted"}`}>{v[`${key}_unit`]}</p>
        <ul className={`mb-6 mt-5 flex-1 list-disc space-y-2 pl-4 text-sm ${i === 2 ? "text-marine-100" : "text-muted"}`}>{lines(v[`${key}_perks`]).map((perk, n) => <li key={n}>{perk}</li>)}</ul>
        <Link href={key === "day" ? "/workspace/book" : "/contact"} className={`inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold ${i === 2 ? "bg-gold-400 text-marine-950 hover:bg-gold-300" : "border border-marine-700 text-marine-700 hover:bg-marine-50"}`}>{key === "day" ? v.book_button : "Reserve a spot"}</Link>
      </div>)}</div>
    </section>
    <section className="bg-marine-900 py-14 text-white"><div className="store-container grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div><h2 className="text-2xl font-semibold sm:text-3xl">{v.visit_title}</h2><p className="mt-3 max-w-xl whitespace-pre-line leading-relaxed text-marine-200">{v.visit_intro}</p>
        <dl className="mt-6 space-y-4 text-sm">{[["Address", v.address], ["Hours", v.hours], ["Phone", v.phone], ["Email", v.email]].map(([label, value]) => <div key={label}><dt className="text-xs uppercase tracking-wider text-marine-200">{label}</dt><dd className="mt-1 break-words text-base">{value}</dd></div>)}</dl>
        <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-gold-400 px-5 text-sm font-semibold text-marine-950 hover:bg-gold-300">Open in Google Maps</a>
      </div>
      {v.address && <div className="min-h-72 overflow-hidden rounded-2xl"><iframe title="Workspace location map" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} className="h-full min-h-72 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
    </div></section>
  </>;
}
