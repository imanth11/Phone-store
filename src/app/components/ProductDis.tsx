"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { tp } from "../product/page";
import Sendcart from "../carts/Sendcart";


interface Props {
  items: tp[];
}

export default function ProductCarousel({ items }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative w-full p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl">
      {/* Title */}
      <h2 className="text-white text-3xl font-bold mb-4">Special Discounts</h2>

      {/* Carousel */}
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 bg-black/40 p-2 rounded-full hover:bg-black/70 transition"
        >
          <FaChevronLeft className="text-white" size={20} />
        </button>

        {/* Scrollable container */}
        <motion.div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-200 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {items.map((item, index) =>
            item.isDis ? (
              <motion.div
                key={item.id}
                className="min-w-[250px] bg-white rounded-xl shadow-lg p-4 flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Sendcart className="" product={item} />
              </motion.div>
            ) : null
          )}
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 bg-black/40 p-2 rounded-full hover:bg-black/70 transition"
        >
          <FaChevronRight className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
}
