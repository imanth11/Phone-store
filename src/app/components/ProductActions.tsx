"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { Product } from "@/types/store";
import { useCart } from "@/app/context/cartcontext";

export default function ProductActions({ product }: { product: Product }) {
  const { cartitems, addTocart, Remove, increase, descrease } = useCart();
  const item = cartitems.find((entry) => entry.id === product.id);

  if (!item) {
    return (
      <button
        type="button"
        onClick={() => addTocart(product)}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <ShoppingBag size={18} aria-hidden="true" />
        Add to cart
      </button>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-2">
        <button
          type="button"
          onClick={() => descrease(product)}
          className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-800 transition hover:bg-slate-200"
          aria-label={`Decrease ${product.name} quantity`}
        >
          <Minus size={17} />
        </button>
        <span className="min-w-12 text-center text-lg font-black text-slate-950">{item.qty}</span>
        <button
          type="button"
          onClick={() => increase(product)}
          className="grid size-11 place-items-center rounded-xl bg-slate-950 text-white transition hover:bg-indigo-600"
          aria-label={`Increase ${product.name} quantity`}
        >
          <Plus size={17} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/basket"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
        >
          View cart
        </Link>
        <button
          type="button"
          onClick={() => Remove(product)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
}
