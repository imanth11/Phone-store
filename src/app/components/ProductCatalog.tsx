"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/types/store";
import Sendcart from "@/app/carts/Sendcart";

type SortOption = "featured" | "price-low" | "price-high" | "name";

export default function ProductCatalog({
  products,
  initialCategory = "all",
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>("featured");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((product) => product.range)))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = category === "all" || product.range === category;
      const queryMatch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.des.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(b.isDis) - Number(a.isDis);
    });
  }, [products, query, category, sort]);

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              className="form-input pl-11"
              type="search"
            />
          </label>

          <label className="relative">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="form-input min-w-44 appearance-none pr-10 capitalize"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All categories" : item}
                </option>
              ))}
            </select>
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </label>

          <label>
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="form-input min-w-44"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>

        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {visibleProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <Sendcart key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-black text-slate-950">No products found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another search term or choose a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setSort("featured");
            }}
            className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
