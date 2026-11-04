import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { policies, store, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Workspace",
  description: `Visit the ${store.name} workspace in Lagos — a quiet, well-lit place to work, meet and get hands-on with the gadgets we sell.`,
};

const amenities = [
  { title: "Fast Wi-Fi", body: "Fibre connection with a battery backup so your work never pauses." },
  { title: "Private desks", body: "Dedicated spots with power, lighting and a comfortable chair." },
  { title: "Meeting corner", body: "A small, quiet area for calls, interviews or a quick client sit-down." },
  { title: "Device bar", body: "Try the phones, laptops and audio we sell before you decide." },
  { title: "Refreshments", body: "Water, tea and coffee throughout the day on the house." },
  { title: "Secure", body: "Access-controlled entry and CCTV so your things stay yours." },
];

const plans = [
  { name: "Day pass", price: "₦5,000", unit: "per day", perks: ["Any open seat", "Wi-Fi and power", "Refreshments"] },
  { name: "Weekly", price: "₦25,000", unit: "per week", perks: ["Any open seat, 7 days", "Priority seating", "10% off accessories"] },
  { name: "Monthly", price: "₦70,000", unit: "per month", perks: ["Dedicated desk", "Printing credit", "Meeting corner access"] },
];

const gallery = [
  { src: "/elegant-smartphone-composition.png", alt: "A workspace lounge area with devices on display" },
  { src: "/phones-lineup.jpg", alt: "A row of phones laid out at the device bar" },
  { src: "/26763361_2111.i211.036.F.m012.c9.headphones black wireless realistic.jpg", alt: "Audio gear available to try at the workspace" },
  { src: "/smartwatch.png", alt: "Wearables on display at the workspace" },
];

export default function WorkspacePage() {
  const addressLine = "Lagos, Nigeria"; // placeholder — client should confirm the exact address
  const mapQuery = encodeURIComponent(`${store.name} ${addressLine}`);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-marine-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/60 bg-marine-800/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Our workspace
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">A calm place to work, meet and try the gear.</h1>
            <p className="mt-4 max-w-xl text-lg text-marine-200">
              Drop in for the day, or settle in for the month. Fast Wi-Fi, dedicated desks, and a device bar stocked with the phones, laptops and audio we sell.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/workspace/book" className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold-400 px-6 text-sm font-semibold text-marine-900 hover:bg-gold-300">
                Book a day
              </Link>
              <a href={whatsappLink("Hi, I'd like to use the workspace. Could you share availability?")} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white hover:bg-white/10">
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <Image src="/elegant-smartphone-composition.png" alt="Inside the Vichellins workspace" fill sizes="(min-width: 1024px) 500px, 100vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-marine-900 sm:text-3xl">What&apos;s inside</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">Small details, done well, so you can focus on your work.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <div key={a.title} className="rounded-2xl border border-line bg-white p-5">
              <h3 className="text-base font-semibold text-marine-900">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-marine-900 sm:text-3xl">A look around</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">A few photos from inside — swap these out any time from the admin.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((g) => (
              <div key={g.src} className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-line">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-marine-900 sm:text-3xl">Pick a plan</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">Pay in person, by transfer or on arrival. We&apos;ll record it on your account.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <div key={p.name} className={`rounded-2xl border p-6 ${i === 2 ? "border-gold-400 bg-marine-900 text-white" : "border-line bg-white"}`}>
              <div className="flex items-baseline justify-between">
                <h3 className={`text-lg font-semibold ${i === 2 ? "text-white" : "text-marine-900"}`}>{p.name}</h3>
                {i === 2 && <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-semibold text-marine-900">Popular</span>}
              </div>
              <p className={`mt-3 text-3xl font-bold ${i === 2 ? "text-white" : "text-marine-900"}`}>{p.price}</p>
              <p className={`text-xs ${i === 2 ? "text-marine-200" : "text-muted"}`}>{p.unit}</p>
              <ul className={`mt-5 space-y-2 text-sm ${i === 2 ? "text-marine-100" : "text-muted"}`}>
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span aria-hidden="true" className={`mt-0.5 h-4 w-4 rounded-full ${i === 2 ? "bg-gold-400" : "bg-marine-700"}`} />
                    {perk}
                  </li>
                ))}
              </ul>
              <Link href={i === 0 ? "/workspace/book" : "/contact"} className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold ${i === 2 ? "bg-gold-400 text-marine-900 hover:bg-gold-300" : "border border-marine-700 text-marine-700 hover:bg-marine-50"}`}>
                {i === 0 ? "Book a day" : "Reserve a spot"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-marine-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Visit us</h2>
            <p className="mt-2 text-marine-200">Come by any time during opening hours. No appointment needed for a day pass.</p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-marine-300">Address</dt>
                <dd className="mt-1 text-base text-white">{addressLine}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-marine-300">Hours</dt>
                <dd className="mt-1 text-base text-white">{policies.businessHours}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-marine-300">Phone</dt>
                <dd className="mt-1 text-base text-white">{store.phoneDisplay}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-marine-300">Email</dt>
                <dd className="mt-1 text-base text-white">{store.email}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold-400 px-5 text-sm font-semibold text-marine-900 hover:bg-gold-300">
                Open in Google Maps
              </a>
              <a href={whatsappLink("Hi, I'd like to visit the workspace. What time works today?")} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10">
                Message us
              </a>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl ring-1 ring-white/10">
            <iframe
              title="Workspace location map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
