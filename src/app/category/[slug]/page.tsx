import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { products } from "@/data/products";
import ProductCatalog from "@/app/components/ProductCatalog";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const allowedCategories = new Set(products.map((product) => product.range));

export function generateStaticParams() {
  return Array.from(allowedCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} products`,
    description: `Browse ${slug} products available at PhoneStore.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (!allowedCategories.has(slug)) notFound();

  const categoryProducts = products.filter((product) => product.range === slug);

  return (
    <section className="container-shell py-10 sm:py-14">
      <Link
        href="/product"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"
      >
        <ArrowLeft size={16} />
        All products
      </Link>
      <p className="section-kicker">Category</p>
      <h1 className="section-title mt-2 capitalize">{slug}</h1>
      <p className="mt-3 mb-8 text-sm text-slate-500">
        {categoryProducts.length} products in this category.
      </p>
      <ProductCatalog products={categoryProducts} initialCategory={slug} />
    </section>
  );
}
