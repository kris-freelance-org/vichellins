import Link from "next/link";
import type { ReactNode } from "react";
import { InfoPage } from "./InfoPage";
import { getSitePage } from "@/lib/site-content";
import { lines, safeContentLink, type PageKey } from "@/lib/page-content";

export function ContentSections({ sections }: { sections: Record<string, string>[] }) {
  return sections.map((section, index) => <section key={index}>
    {section.heading && <h2>{section.heading}</h2>}
    {section.body && section.body.split(/\n\s*\n/).map((paragraph, i) => <p key={i} className="whitespace-pre-line">{paragraph}</p>)}
    {section.items && <ul>{lines(section.items).map((item, i) => <li key={i}>{item}</li>)}</ul>}
    {section.link_label && section.link_href && safeContentLink(section.link_href) && <p><Link href={section.link_href}>{section.link_label}</Link></p>}
  </section>);
}

export async function EditableInfoPage({ pageKey, children }: { pageKey: PageKey; children?: ReactNode }) {
  const content = await getSitePage(pageKey);
  return <InfoPage title={content.values.title} intro={content.values.intro}>
    {children}
    <ContentSections sections={content.collections.sections ?? []} />
  </InfoPage>;
}
