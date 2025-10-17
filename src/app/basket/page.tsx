"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../context/cartcontext";
import { tp } from "../product/page";
import discount from "../../discount.json";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Basket() {
  const { cartitems, users, clearCart, realprice, Remove, increase, descrease, totalprice } = useCart();
  const total = realprice();
  const router = useRouter();
  
  const [finalprice, setfinalprice] = useState(0);
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    setfinalprice(realprice());
  }, [cartitems]);

  async function Payment(amount: number) {
    if(!users){
      alert("Please login");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          description: "Buying cellphone!!",
          email: users?.email,
          phone: "09121111111",
        }),
      });

      const data = await res.json();
      console.log("Payment response:", data);

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment error: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment request failed.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-white">
        Shopping Cart
      </h2>

      <div className="space-y-6">
        {cartitems.map((item: tp, index: number) => (
          <div
            key={index}
            className="grid grid-cols-10 gap-4 items-center bg-gradient-to-r from-fuchsia-700 via-fuchsia-600 to-indigo-700 rounded-2xl shadow-lg p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <div className="col-span-2">
              <img
                className="w-full h-24 md:h-32 object-cover rounded-xl border-2 border-white/30"
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="col-span-8 flex flex-col justify-center">
              <div className="text-lg md:text-xl font-semibold text-white">
                {item.name}
              </div>
              <div className="text-white/90 mt-2 font-medium">{item.price} USD</div>

              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => increase(item)}
                  className="px-4 py-1 text-sm bg-green-500 hover:bg-green-600 rounded-lg text-white shadow-md transition transform active:scale-95"
                >
                  +
                </button>
                <span className="mt-1 text-white font-semibold">{item.qty}</span>
                <button
                  onClick={() => descrease(item)}
                  className="px-4 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white shadow-md transition transform active:scale-95"
                >
                  -
                </button>
                <button
                  onClick={() => Remove(item)}
                  className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-md transition transform active:scale-95"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discount code */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
        <input
          placeholder="Discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="w-full md:w-60 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
        />
        <button
          onClick={() => setfinalprice(totalprice(discountCode))}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition transform active:scale-95"
        >
          Verify
        </button>
      </div>

      {/* Total Price & Buy */}
      <div className="mt-6 bg-white/10 p-4 rounded-xl shadow-inner flex flex-col space-y-2">
        <h3 className="text-black font-semibold">Price: {total} USD</h3>
        <h3 className="text-black font-bold text-lg">Total Price: {finalprice} USD</h3>

        <button
          onClick={() => Payment(finalprice || total)}
          className="mt-3 w-full md:w-auto px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-lg transition transform active:scale-95"
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default Basket;
