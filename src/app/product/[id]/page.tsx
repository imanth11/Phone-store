import React from "react";
import { getPro, tp } from "../page";
import Sendcart from "@/app/carts/Sendcart";
import { DiVim } from "react-icons/di";

interface Ip {
  params: Promise<{ id: number }>;
  
}




export default async function Des(props: Ip) {
  const { id } = await props.params;
  const items = await getPro();
  const item: tp = items.find((i: tp) => i.id === Number(id));

  
    return (
      <div className="bg-black">
      <div className="flex flex-col  h-screen gap-4 container mx-auto p-10">

    <div className=" rounded flex justify-center items-center drop-shadow-[10px_10px_15px_rgba(100,100,100,0.6)] bg-gradient-to-br from-purple-400  to-emerald-300">
<div className="items-center justify-items-center p-5 w-90 ">
      <Sendcart product={item} className={"!h-full !w-full !overflow-hidden "}/>
      </div>
    </div >

    

    <div className=" rounded bg-gradient-to-br from-red-500  ">
<div className="p-5 text-amber-50 font-medium">
<p >{item.name}</p>
<p >{item.des}</p>
</div>
    </div>

    </div>
    
    </div>
  );
}
