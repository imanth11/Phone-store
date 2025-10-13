import Sendcart from "../carts/Sendcart";

export interface tp{
  id:number,
  name:string ,
  price:number,
  image:string,
  qty:number,
 Dis:number,
 isDis:boolean,
 range:string,
 des:string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export async function getPro() {
  const res = await fetch(`${baseUrl}/api/products`,{
    cache:"no-store"
  });
  if (!res.ok) {
    console.error("Fetch error:", res.status, await res.text());
    return [];
  }
  return res.json();
}




export default async function ProductsPage() {
  const data: tp[] = await getPro();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-fuchsia-800 via-fuchsia-700 to-indigo-700 p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center">Products</h1>
        <p className="mt-2 text-center text-sm text-white/80">Discover curated items — clean, fast and responsive.</p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
        {data.map((product) => (
          <div key={product.id} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-200 hover:-translate-y-1">
            <Sendcart product={product} className="" />
          </div>
        ))}
      </div>
    </main>
  );
}

