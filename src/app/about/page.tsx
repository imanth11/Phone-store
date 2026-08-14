import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, LayoutGrid, ShieldCheck, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the PhoneStore shopping experience and what the store is built to provide.",
};

export default function AboutPage() {
  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="section-kicker">About PhoneStore</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
          A simpler way to shop everyday mobile tech.
        </h1>
        <p className="mt-6 text-base leading-8 text-slate-600">
          PhoneStore is designed around a focused catalog, clear product discovery,
          straightforward cart management and secure server-verified checkout. The goal
          is to keep the experience fast and understandable from the first visit to the
          final order.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Smartphone,
            title: "Focused catalog",
            text: "Phones and the accessories customers are most likely to need.",
          },
          {
            icon: LayoutGrid,
            title: "Clear discovery",
            text: "Search, filters and category pages make products easier to find.",
          },
          {
            icon: ShieldCheck,
            title: "Safer checkout",
            text: "Prices and cart totals are recalculated on the server before payment.",
          },
          {
            icon: BadgeCheck,
            title: "Account support",
            text: "Signed-in customers can review orders and contact support in-site.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10">
        <h2 className="text-2xl font-black">Explore the store</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Use the product catalog to compare what is currently available, or open the
          support chat if you have a question about an order.
        </p>
        <Link
          href="/product"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-indigo-100"
        >
          Browse products
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
