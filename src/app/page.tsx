

import Image from "next/image";
import { useCart } from "./context/cartcontext";
import Sendcart from "./carts/Sendcart";
import { getPro, tp } from "./product/page";
import { motion } from "framer-motion";
import ProductDis from "./components/ProductDis";
import Ranges from "./components/Range";

export default async function Home() {
  const items: tp[] = await getPro();

  return (
   <div>

    <div className="h-96">
<Ranges items={items}/>
    </div>

<div>
  <ProductDis items={items}/>
</div>
    </div>
  );
}


