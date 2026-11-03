import Image from "next/image";
import Link from "next/link";
import {
  getBrandById,
  getCategoryById,
  getDefaultVariant,
  getMaxPrice,
  getMinPrice,
  getProductKind,
  isInStock,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { CardActions } from "./CardActions";
import { ProductVisual } from "./ProductVisual";

export async function ProductCard({
  product,
  prominent = false,
}: {
  product: Product;
  /** Hero-sized variant used on home-page featured sections. */
  prominent?: boolean;
}) {
  const href = `/product/${product.slug}`;
  const kind = getProductKind(product);
  const [category, brand] = await Promise.all([
    getCategoryById(product.categoryId),
    getBrandById(product.brandId),
  ]);
  const soldOut = !isInStock(product);
  const min = getMinPrice(product);
  const hasRange = getMaxPrice(product) !== min;
  const single = product.variants.length === 1 ? getDefaultVariant(product) : undefined;
  const saleVariant = product.variants.find(
    (v) => v.price === min && v.compareAtPrice && v.compareAtPrice > v.price,
  );
  const discount = saleVariant?.compareAtPrice
    ? Math.round((1 - saleVariant.price / saleVariant.compareAtPrice) * 100)
    : 0;
  const primaryImage = product.images[0];

  const cartItem = single
    ? {
        variantId: single.id,
        slug: product.slug,
        name: product.name,
        variantLabel: Object.values(single.optionValues).join(" / "),
        price: single.price,
        maxQty: single.stock,
        kind,
        tone: product.tone,
        image: primaryImage?.url,
      }
    : null;

  return (
    <article className="product-card @container group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white p-2.5 sm:p-3">
      <Link
        href={href}
        aria-label={`${product.name}${soldOut ? " – out of stock" : ""}`}
        className={`relative block aspect-[5/4] overflow-hidden ${
          prominent ? "rounded-2xl bg-marine-50" : "rounded-xl bg-[#f5f6f8]"
        }`}
      >
        <div className="absolute left-3 top-3 z-10 flex gap-1.5">
          {product.condition !== "new" && (
            <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-semibold capitalize text-marine-900">
              {product.condition}
            </span>
          )}
          {discount > 0 && !soldOut && (
            <span className="rounded-md bg-gold-400 px-2 py-1 text-[10px] font-semibold text-marine-950">−{discount}%</span>
          )}
          {prominent && (
            <span className="rounded-full bg-marine-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
              Favourite
            </span>
          )}
        </div>
        {primaryImage ? (
          <div className="absolute inset-4 sm:inset-5">
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes={prominent ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
              className={`object-contain transition-transform duration-300 group-hover:scale-[1.03] ${soldOut ? "opacity-40" : ""}`}
            />
          </div>
        ) : (
          <ProductVisual
            kind={kind}
            tone={product.tone}
            className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
              prominent ? "p-16" : "p-8"
            } ${soldOut ? "opacity-40" : ""}`}
          />
        )}
      </Link>
      <div className={`flex flex-1 flex-col px-1 pb-1 ${prominent ? "mt-5" : "mt-4"}`}>
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">{brand?.name || category?.name}</p>
        <div className="mt-1.5 flex min-w-0 flex-col items-start gap-2">
          <h3
            className={`min-w-0 break-words text-marine-900 ${
              prominent ? "font-bold text-xl leading-tight tracking-tight sm:text-2xl" : "text-sm font-semibold leading-snug tracking-tight sm:text-base"
            }`}
          >
            <Link href={href} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p
            className={`shrink-0 font-semibold tabular-nums text-marine-900 ${
              prominent ? "text-xl sm:text-2xl" : "text-base tracking-tight sm:text-lg"
            }`}
          >
            {hasRange && (
              <span
                className={`mr-1 font-normal text-muted ${prominent ? "text-sm" : "text-xs"}`}
              >
                From
              </span>
            )}
            {formatPrice(min)}
            {discount > 0 && saleVariant?.compareAtPrice && <del className="ml-2 text-[11px] font-normal text-muted">{formatPrice(saleVariant.compareAtPrice)}</del>}
          </p>
        </div>
        <p className={`text-muted ${prominent ? "mt-2 text-sm" : "mt-2 text-[11px] leading-relaxed"}`}>
          {product.warranty.months > 0 ? `${product.warranty.months} month warranty` : "No warranty"}
          {" · "}
          <span className={soldOut ? "text-muted" : "text-success-700"}>{soldOut ? "Out of stock" : "In stock"}</span>
        </p>
        <div className={`flex flex-1 flex-wrap items-end gap-2 pt-4 ${prominent ? "mt-2" : ""}`}>
          <CardActions href={href} item={cartItem} soldOut={soldOut} />
        </div>
      </div>
    </article>
  );
}
