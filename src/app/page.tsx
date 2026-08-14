import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import { products } from "@/data/products";
import Ranges from "@/app/components/Range";
import ProductCarousel from "@/app/components/ProductDis";
import ProductImage from "@/app/components/ProductImage";

export default function Home() {
  const heroProduct = products.find((product) => product.range === "phone") || products[0];

  return (
    <>
      <section className="container-shell pt-8 sm:pt-12">
        <div className="grid overflow-hidden rounded-[2rem] bg-slate-950 lg:grid-cols-[1.08fr_.92fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-indigo-300">
              Smarter tech shopping
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              The essentials you want, without the clutter.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Browse phones, audio and charging gear through a fast, focused storefront
              that works beautifully on every screen.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/product"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-indigo-100"
              >
                Shop products
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/category/phone"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse phones
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 sm:min-h-[420px]">
            {heroProduct && (
              <div className="absolute inset-8 rounded-[2rem] bg-white/95 p-6 shadow-2xl shadow-slate-950/25 sm:inset-12">
                <div className="relative h-full">
                  <ProductImage
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    priority
                    className="p-4"
                  />
                </div>
              </div>
            )}
            <span className="absolute bottom-5 left-5 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              Featured device
            </span>
          </div>
        </div>

        <div className="grid gap-3 py-5 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Fast browsing", text: "Focused pages and responsive layouts." },
            { icon: ShieldCheck, title: "Safer checkout", text: "Totals are verified on the server." },
            { icon: Headphones, title: "Support when needed", text: "In-site customer chat for signed-in users." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-black text-slate-950">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Ranges items={products} />
      <ProductCarousel items={products} />

      <section className="container-shell py-12 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="section-kicker">Ready to browse?</p>
            <h2 className="section-title mt-2">See the complete collection</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Search, filter by category and sort products by price or name from one clean catalog.
            </p>
          </div>
          <Link
            href="/product"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-600"
          >
            <ShoppingBag size={17} aria-hidden="true" />
            Open catalog
          </Link>
        </div>
      </section>
    </>
  );
}
