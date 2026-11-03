import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { Icon } from "./Icon";

export function CategoryCard({ category, count, featured = false, index = 0 }: {
  category: Pick<Category, "name" | "slug" | "description" | "kind" | "imageUrl">;
  count: number;
  featured?: boolean;
  index?: number;
}) {
  const image = category.imageUrl || (category.kind === "phone" ? "/phones-lineup.jpg" : category.kind === "watch" ? "/smartwatch.png" : undefined);
  return (
    <Link
      href={`/category/${category.slug}`}
      className={`category-card group relative isolate block min-w-0 overflow-hidden rounded-2xl ${featured ? "bg-marine-700 text-white" : index % 3 === 1 ? "bg-[#f0f0fa] text-foreground" : index % 3 === 2 ? "bg-[#f5f2e9] text-foreground" : "bg-surface text-foreground"}`}
    >
      <div className="category-card-copy relative z-10 flex min-h-48 w-[58%] flex-col justify-between gap-5 py-6 pl-5 sm:pl-6">
        <div>
          {featured && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">Featured</p>}
          <h3 className={`category-card-title break-words font-bold leading-tight tracking-tight ${featured ? "mt-3" : ""}`}>{category.name}</h3>
          <p className={`mt-2 break-words text-xs leading-relaxed ${featured ? "text-marine-100" : "text-muted"}`}>{category.description}</p>
        </div>
        <span className={`inline-flex items-center gap-3 text-xs font-medium ${featured ? "text-gold-400" : "text-marine-700"}`}>
          {count} product{count === 1 ? "" : "s"} <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-2 right-1 top-4 w-[42%]" aria-hidden="true">
        {image ? (
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 170px, (min-width: 640px) 22vw, 42vw" className="object-contain object-right-bottom transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <ProductVisual kind={category.kind} tone={featured ? "#d0d0fc" : "#7272f4"} className="absolute bottom-0 right-0 h-full w-full transition-transform duration-300 group-hover:scale-105" />
        )}
      </div>
    </Link>
  );
}
