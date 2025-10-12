"use client"

import React from "react";
import { useCart } from "../context/cartcontext";
import { tp } from "../product/page";
import Link from "next/link";

interface ss {
  product: tp;
  className:string;
}

function Sendcart({ product,className="" }: ss) {
  const { cartitems, addTocart, Remove } = useCart();
  const isclick = cartitems.some((item) => item.id === product.id);

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-md 
    hover:shadow-2xl transition transform 
    hover:-translate-y-1 duration-300 ${className} `}>
      <div className="relative w-full  ">
      <Link href={`/product/${product.id}`}> <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        /></Link> 
      </div>
      <div className="p-5 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        
        
          {product.isDis?
          <div>
          <p className="text-gray-600 mt-2 text-base line-through">{product.price} USD</p>
          
         <p>{product.price*((100-product.Dis)/100)}</p></div>:
         
         <p className="text-gray-600 mt-2 text-base ">{product.price} USD</p>}
        
        {!isclick ? (
          <button
            onClick={() => {
              addTocart(product);
            }}
            className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:opacity-90 active:scale-95 transition"
          >
            Add to Cart
          </button>
        ) : (
          <button
            onClick={() => {
              Remove(product);
            }}
            className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium hover:opacity-90 active:scale-95 transition"
          >
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Sendcart;
