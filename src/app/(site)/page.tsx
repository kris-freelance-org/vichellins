import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Icon } from "@/components/Icon";
import { ProductVisual } from "@/components/ProductVisual";
import { getFeaturedProducts, getNewArrivals, getHomepageCategories, getAllProducts, getCategoryTreeIds } from "@/lib/catalog";
import { getSitePage, sitePageMetadata } from "@/lib/site-content";

export const generateMetadata = () => sitePageMetadata("home");

export default async function HomePage() {
  const [content, categories, featured, arrivals, all] = await Promise.all([
    getSitePage("home"), getHomepageCategories(), getFeaturedProducts(4), getNewArrivals(4), getAllProducts(),
  ]);
  const v = content.values;
  const treeIdsByCategory = new Map(
    await Promise.all(categories.map(async (c) => [c.id, await getCategoryTreeIds(c.id)] as const)),
  );
  const counts = Object.fromEntries(categories.map((c) => {
    const ids = new Set(treeIdsByCategory.get(c.id));
    return [c.id, all.filter((p) => ids.has(p.categoryId)).length];
  }));
  const wearables = categories.find((c) => c.kind === "watch");
  const audio = categories.find((c) => c.kind === "headphones" || c.kind === "earbuds" || c.kind === "speaker");
  const trustIcons = ["shield", "box", "truck", "check"] as const;

  return (
    <>
      <section aria-label="Discover Vichellins" className="store-container pt-5 sm:pt-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="flex items-center gap-2 text-muted"><span className="h-1.5 w-1.5 rounded-full bg-marine-700" />{v.welcome}</p>
          <Link href="/about" className="hidden items-center gap-1.5 font-medium text-marine-700 sm:inline-flex">{v.about_link}<Icon name="arrow" className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="home-hero-grid">
          <div className="home-hero relative isolate overflow-hidden rounded-[1.75rem] bg-marine-700 text-white">
            <div className="hero-orbit" aria-hidden="true" />
            <div className="hero-copy relative z-10">
              <p className="mb-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-marine-100"><span className="h-1.5 w-1.5 rounded-full bg-gold-400" />{v.eyebrow}</p>
              <h1 className="text-[clamp(2.5rem,4.3vw,4rem)] font-semibold leading-[1.06] tracking-[-0.05em] [overflow-wrap:anywhere]">
                {v.title}
                {v.accent && <span className="mt-1 block text-gold-400">{v.accent}</span>}
              </h1>
              <p className="mt-5 max-w-[21rem] whitespace-pre-line text-sm leading-7 text-marine-100">{v.intro}</p>
              <Link href={v.hero_link || "/shop"} className="group mt-7 inline-flex min-h-12 items-center justify-center gap-6 rounded-xl bg-gold-400 px-6 text-sm font-semibold text-marine-950 transition-colors hover:bg-gold-300">{v.hero_button}<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              <p className="mt-6 flex items-center gap-2 text-[11px] text-marine-100"><Icon name="shield" className="h-4 w-4 shrink-0 text-gold-300" />{v.hero_note}</p>
            </div>
            {v.hero_image && <Image src={v.hero_image} alt={v.hero_alt} width={1081} height={951} preload unoptimized className="hero-phones pointer-events-none absolute max-w-none object-scale-down object-right-bottom" />}
            <span aria-hidden="true" className="hero-image-label absolute bottom-7 right-7 text-[10px] uppercase tracking-[0.22em] text-marine-100">{v.image_caption}</span>
          </div>
          <Link href={wearables ? `/category/${wearables.slug}` : "/shop"} className="wearable-feature group relative isolate flex overflow-hidden rounded-[1.75rem] bg-[#f3f0e6] text-foreground">
            <div className="relative z-10 p-7 sm:p-8">
              <p className="eyebrow text-gold-700">{v.wearable_eyebrow}</p>
              <h2 className="mt-3 max-w-48 text-[2rem] font-semibold leading-[1.08] tracking-[-0.045em]">{v.wearable_title}</h2>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold">{v.wearable_button}<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </div>
            <span aria-hidden="true" className="absolute -bottom-16 -right-8 aspect-square w-[105%] rounded-full border border-[#dfdacb]" />
            {v.wearable_image && <Image src={v.wearable_image} alt={v.wearable_alt} width={454} height={454} sizes="(min-width: 1024px) 340px, (min-width: 640px) 250px, 190px" className="wearable-image absolute transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105" />}
            <span aria-hidden="true" className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 transition-colors group-hover:bg-gold-400"><Icon name="arrow" className="h-4 w-4" /></span>
          </Link>
        </div>
        <section aria-label="Why shop with Vichellins" className="border-b border-line py-7 sm:py-9">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:gap-8">
            {content.collections.trust.map((t, i) => <li key={i} className="flex items-start gap-3.5">
              <Icon name={trustIcons[i % trustIcons.length]} className="mt-0.5 h-[23px] w-[23px] shrink-0 text-marine-700" />
              <div><h3 className="text-xs font-semibold text-foreground sm:text-sm">{t.title}</h3><p className="mt-1.5 max-w-60 text-[11px] leading-relaxed text-muted sm:text-xs">{t.body}</p></div>
            </li>)}
          </ul>
        </section>
      </section>

      <section aria-labelledby="cats" className="store-container section-space">
        <div className="section-heading">
          <div><p className="eyebrow text-marine-700">{v.category_eyebrow}</p><h2 id="cats" className="section-title">{v.category_title}</h2></div>
          <Link href="/shop" className="section-link">All categories <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        {categories.length > 0 ? <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {categories.map((category, index) => <CategoryCard key={category.id} category={category} count={counts[category.id]} index={index} />)}
        </div> : <p className="mt-6 text-sm text-muted">Our collection is getting an upgrade. Check back soon or chat with us for help.</p>}
      </section>

      {featured.length > 0 && <section aria-labelledby="featured" className="section-space bg-[#f6f7fa] py-12 sm:py-16">
        <div className="store-container">
          <div className="section-heading">
            <div><p className="eyebrow text-marine-700">{v.featured_eyebrow}</p><h2 id="featured" className="section-title">{v.featured_title}</h2></div>
            <Link href="/shop?sort=popular" className="section-link">Shop favourites <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-7 grid gap-4 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>}

      {audio && <section className="store-container section-space" aria-labelledby="audio-title">
        <div className="audio-banner relative isolate overflow-hidden rounded-[1.75rem] bg-[#eeeffb]">
          <div className="relative z-10 max-w-lg px-7 py-10 sm:px-10 sm:py-12">
            <p className="eyebrow text-marine-700">{v.audio_eyebrow}</p>
            <h2 id="audio-title" className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.045em]">{v.audio_title}</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{v.audio_body}</p>
            <Link href={`/category/${audio.slug}`} className="mt-6 inline-flex min-h-12 items-center gap-6 rounded-xl bg-marine-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-marine-800">{v.audio_button}<Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <span aria-hidden="true" className="audio-wordmark pointer-events-none absolute bottom-0 right-4 select-none text-[clamp(7rem,18vw,15rem)] font-semibold leading-[0.8] tracking-tighter text-marine-700/[0.06]">{v.audio_wordmark}</span>
          <div className="audio-art" aria-hidden="true"><ProductVisual kind="headphones" tone="#2b2d3e" className="h-full w-full" /></div>
        </div>
      </section>}

      {arrivals.length > 0 && <section aria-labelledby="new" className="store-container section-space">
        <div className="section-heading">
          <div><p className="eyebrow text-marine-700">{v.new_eyebrow}</p><h2 id="new" className="section-title">{v.new_title}</h2></div>
          <Link href="/shop?sort=newest" className="section-link">All new arrivals <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <ul className="product-rail mt-7" aria-label="New arrivals">{arrivals.map((p) => <li key={p.id} className="min-w-0 snap-start"><ProductCard product={p} /></li>)}</ul>
      </section>}
    </>
  );
}
