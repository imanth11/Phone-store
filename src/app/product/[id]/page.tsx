import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice, getDiscountedUnitPrice } from "@/lib/pricing";
import ProductImage from "@/app/components/ProductImage";
import ProductActions from "@/app/components/ProductActions";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === Number(id));

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.des.slice(0, 150),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === Number(id));
  if (!product) notFound();

  const salePrice = getDiscountedUnitPrice(product);
  const currency = process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.des,
    image: product.image.startsWith("data:")
      ? undefined
      : new URL(product.image, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString(),
    category: product.range,
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: salePrice,
      availability: "https://schema.org/InStock",
      url: new URL(
        `/product/${product.id}`,
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      ).toString(),
    },
  };

  return (
    <section className="container-shell py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href="/product"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority
            className="p-8 sm:p-12"
          />
          {product.isDis && (
            <span className="absolute left-5 top-5 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              Save {product.Dis}%
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="section-kicker">{product.range}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black text-slate-950">
              {formatPrice(salePrice)}
            </span>
            {product.isDis && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="mt-7 max-w-xl whitespace-pre-line text-base leading-7 text-slate-600">
            {product.des.replaceAll("/n", "\n")}
          </p>

          <div className="mt-8 max-w-md">
            <ProductActions product={product} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: CheckCircle2, title: "Easy cart", text: "Update quantity anytime" },
              { icon: ShieldCheck, title: "Verified total", text: "Calculated server-side" },
              { icon: Truck, title: "Order history", text: "Track past purchases" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <Icon size={18} className="text-indigo-600" aria-hidden="true" />
                <h2 className="mt-3 text-sm font-black text-slate-950">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
