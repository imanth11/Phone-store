import Link from "next/link";
import { BatteryCharging, Headphones, Smartphone } from "lucide-react";
import type { Product } from "@/types/store";

const categories = [
  {
    name: "Phones",
    href: "/category/phone",
    description: "Smartphones for work, play and everyday use.",
    icon: Smartphone,
  },
  {
    name: "Audio",
    href: "/category/headphone",
    description: "Wireless earbuds and headphones.",
    icon: Headphones,
  },
  {
    name: "Chargers",
    href: "/category/charger",
    description: "Power and charging essentials.",
    icon: BatteryCharging,
  },
];

export default function Ranges({ items }: { items: Product[] }) {
  return (
    <section className="container-shell py-14 sm:py-18" aria-labelledby="category-heading">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Shop by category</p>
          <h2 id="category-heading" className="section-title mt-2">
            Find what you need faster
          </h2>
        </div>
        <Link
          href="/product"
          className="hidden text-sm font-bold text-indigo-600 hover:text-indigo-700 sm:inline"
        >
          View all products →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => {
          const count = items.filter((item) => item.range === category.href.split("/").pop()).length;
          const Icon = category.icon;

          return (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="mb-8 grid size-12 place-items-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-indigo-600">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-black text-slate-950">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{category.description}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                {count} {count === 1 ? "product" : "products"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
