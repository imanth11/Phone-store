"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/app/context/cartcontext";
import type { Product } from "@/types/store";
import { formatPrice, getDiscountedUnitPrice } from "@/lib/pricing";
import ProductImage from "@/app/components/ProductImage";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function Sendcart({ product, className = "" }: ProductCardProps) {
  const { cartitems, addTocart, Remove } = useCart();
  const inCart = cartitems.some((item) => item.id === product.id);
  const salePrice = getDiscountedUnitPrice(product);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 ${className}`}
    >
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="p-5 transition duration-500 group-hover:scale-105"
        />
        {product.isDis && product.Dis > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-2.5 py-1 text-xs font-bold text-white">
            -{product.Dis}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-4 flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {product.range}
          </p>
          <Link
            href={`/product/${product.id}`}
            className="line-clamp-2 text-base font-bold text-slate-900 transition hover:text-indigo-600 sm:text-lg"
          >
            {product.name}
          </Link>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-950">
              {formatPrice(salePrice)}
            </span>
            {product.isDis && product.Dis > 0 && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {inCart ? (
          <button
            type="button"
            onClick={() => Remove(product)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 size={17} aria-hidden="true" />
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={() => addTocart(product)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={17} aria-hidden="true" />
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
