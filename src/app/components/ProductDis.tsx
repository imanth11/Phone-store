"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/store";
import Sendcart from "@/app/carts/Sendcart";

export default function ProductCarousel({ items }: { items: Product[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const discounted = items.filter((item) => item.isDis);

  if (!discounted.length) return null;

  const scroll = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="container-shell py-8 sm:py-12" aria-labelledby="offers-heading">
      <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-4 py-7 sm:px-7 sm:py-9">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              Limited offers
            </p>
            <h2 id="offers-heading" className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Special discounts
            </h2>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="grid size-10 place-items-center rounded-xl border border-white/15 text-white transition hover:bg-white/10"
              aria-label="Scroll products left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="grid size-10 place-items-center rounded-xl border border-white/15 text-white transition hover:bg-white/10"
              aria-label="Scroll products right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {discounted.map((item) => (
            <div key={item.id} className="min-w-[78%] snap-start sm:min-w-[280px] lg:min-w-[300px]">
              <Sendcart product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
