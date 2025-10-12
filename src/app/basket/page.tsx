"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../context/cartcontext";
import { tp } from "../product/page";
import discount from "../../discount.json"
import { useRouter } from "next/navigation";
import Link from "next/link";
function Basket() {
  const { cartitems,users, clearCart,realprice, Remove, increase, descrease, totalprice } = useCart();
  const total = realprice();

  const router=useRouter();
  
const [finalprice,setfinalprice]=useState(0)
  const [discountCode, setDiscountCode] = useState("")
  
  useEffect(() => {
    setfinalprice(realprice());
  }, [cartitems]);
  

  async function Payment(amount: number) {


if(!users){

  alert("Please login");
  router.push("/login")
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
        alert("Payment errorrrr: " + (data.message || "Unknown error"));
        

      }
    } catch (err) {
      console.error("Payment errorooor:", err);
      alert("Payment request failed.");
    }
  }

  return (
    <div className= "max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Shopping Cart</h2>

      <div className="space-y-6">
        {cartitems.map((item: tp, index: number) => (
          
          <div
            key={index}
            className="grid grid-cols-10 gap-4 items-center bg-fuchsia-900/40 rounded-2xl shadow-md p-4 hover:shadow-xl transition"
          >
            <div className="col-span-2">
              <img className="w-full object-cover rounded-xl" src={item.image} alt={item.name} />
            </div>

            <div className="col-span-8 flex flex-col justify-center">
              <div className="text-lg font-semibold text-white">{item.name}</div>

              
              <div className="text-black mt-2">{item.price} USD</div>

              <div className="flex space-x-5 mt-3">
                <button
                  onClick={() => increase(item)}
                  className="px-4 py-1 text-sm bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg text-white transition"
                >
                  +
                </button>
                <span className="mt-1">{item.qty}</span>
                <button
                  onClick={() => descrease(item)}
                  className="px-4 py-1 text-sm bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg text-white transition"
                >
                  -
                </button>
                <button
                  onClick={() => Remove(item)}
                  className="px-4 py-1 text-sm bg-red-600 hover:bg-fuchsia-500 rounded-lg text-white transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          ))}
      </div>
      <div className="flex flex-col items-start">

        <input placeholder="Discount" value={discountCode} 
        onChange={(e)=>setDiscountCode(e.target.value)} className="w-50 border" />
    
    <button onClick={()=>setfinalprice(totalprice(discountCode))}
     className="bg-red-600
      hover:bg-green-700 rounded text-amber-50 w-20 mt-5 h-8">Verify</button>
      </div>

      <div className="mt-6">
        <h3 className="text-black">Price: {total} USD</h3>
        
        <h3 className="text-black">Total Price: {finalprice} USD</h3>

        <button
          onClick={()=>Payment(finalprice||total)}
          className="bg-green-800 px-6 py-2 rounded-lg text-white mt-4"
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default Basket;
