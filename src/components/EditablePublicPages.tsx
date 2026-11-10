import Link from "next/link";
import { InfoPage } from "./InfoPage";
import { ContentSections } from "./EditableInfoPage";
import { getSitePage } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { deliveryZones } from "@/lib/config";
import { formatPrice } from "@/lib/format";

export async function EditableContactPage() {
  const content = await getSitePage("contact");
  const v = content.values;
  return <InfoPage title={v.title} intro={v.intro}>
    <section className="grid gap-4 sm:grid-cols-2">
      <a href={`https://wa.me/${v.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I have a question.")}`} target="_blank" rel="noopener noreferrer" className="!no-underline rounded-3xl bg-marine-900 p-6 text-white hover:bg-marine-800"><h2 className="!text-white">WhatsApp</h2><p className="mt-3 !text-marine-200">{v.whatsapp_body}</p></a>
      <div className="rounded-3xl bg-surface p-6"><h2>Phone and email</h2><p className="mt-3"><a href={`tel:${v.phone.replace(/[^+\d]/g, "")}`}>{v.phone}</a></p><p className="mt-2 break-words"><a href={`mailto:${encodeURIComponent(v.email)}`}>{v.email}</a></p></div>
    </section>
    <section><h2>Where we are</h2><p className="whitespace-pre-line">{v.address}</p><p>{v.location_note}</p></section>
    <section><h2>Business hours</h2><p>{v.hours}</p><p>{v.hours_note}</p></section>
    <ContentSections sections={content.collections.sections} />
  </InfoPage>;
}

export async function EditableFaqPage() {
  const content = await getSitePage("faq");
  const v = content.values;
  const questions = content.collections.questions;
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };
  return <InfoPage title={v.title} intro={v.intro}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <div className="divide-y divide-line rounded-3xl border border-line">{questions.map((f, i) => <details key={i} className="group px-5 py-4 sm:px-6"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-marine-900 [&::-webkit-details-marker]:hidden"><span className="break-words">{f.question}</span><span aria-hidden="true" className="text-xl text-gold-600 transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 whitespace-pre-line">{f.answer}</p></details>)}</div>
    <p>{v.help_text} {v.help_link && <Link href={v.help_link}>{v.help_label}</Link>}</p>
  </InfoPage>;
}

export async function EditableDeliveryPage() {
  const content = await getSitePage("delivery-returns");
  let zones: { id: string; name: string; fee: number; eta: string }[] = [...deliveryZones];
  if (supabaseConfigured) {
    try {
      const result = await (await createClient()).from("delivery_zones").select("id,name,fee,eta").eq("is_active", true).order("sort_order");
      if (!result.error) zones = result.data ?? [];
    } catch { /* Keep the existing offline defaults. */ }
  }
  return <InfoPage title={content.values.title} intro={content.values.intro}>
    <ContentSections sections={content.collections.sections.slice(0, 1)} />
    {zones.length > 0 && <div className="overflow-x-auto rounded-2xl border border-line"><table className="w-full text-left text-sm"><caption className="sr-only">Current delivery areas and fees</caption><thead className="bg-surface"><tr><th scope="col" className="px-4 py-3">Area</th><th scope="col" className="px-4 py-3">Fee</th><th scope="col" className="px-4 py-3">Usual time</th></tr></thead><tbody className="divide-y divide-line">{zones.map(z => <tr key={z.id}><td className="px-4 py-3">{z.name}</td><td className="whitespace-nowrap px-4 py-3">{formatPrice(z.fee)}</td><td className="px-4 py-3">{z.eta}</td></tr>)}</tbody></table></div>}
    <ContentSections sections={content.collections.sections.slice(1)} />
  </InfoPage>;
}
