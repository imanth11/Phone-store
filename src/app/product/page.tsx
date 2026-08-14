import type { Metadata } from "next";
import { products } from "@/data/products";
import type { Product } from "@/types/store";
import ProductCatalog from "@/app/components/ProductCatalog";

export type tp = Product & { qty?: number };

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all PhoneStore products by category, price and name.",
};

export async function getPro(): Promise<Product[]> {
  return products;
}

export default function ProductsPage() {
  return (
    <section className="container-shell py-10 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="section-kicker">Catalog</p>
        <h1 className="section-title mt-2">All products</h1>
        <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
          Search the catalog, filter by category, and sort the products in the way that works for you.
        </p>
      </div>

      <ProductCatalog products={products} />
    </section>
  );
}
