import { tp } from "@/app/product/page";
import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export async function POST(req: Request) {
  const { message } = await req.json();

  // گرفتن محصولات سایت برای استفاده در prompt
  
  const productsRes = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  

console.log("thisdivjdpf",productsRes);

  if (!productsRes.ok) {
    throw new Error(`Failed to fetch products: ${productsRes.status}`);
  }
  
  const products = await productsRes.json();

  const systemPrompt = `
  You are a helpful shopping assistant for a tech e-commerce site.
  Only answer questions related to the products below.
  If the question is unrelated, respond with: "I only assist with products on this store."

  Products:
  ${products.map((p:tp) => `${p.name}: ${p.des}. Price: ${p.price}$`).join("\n")}
  `;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // مدل سبک و سریع مخصوص وب‌اپ‌ها
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    }),
  });
console.log("ifdijdjo",res)
  const data = await res.json();
  console.log("result of data",data)

  const reply = data?.choices?.[0]?.message?.content || "An error occurred.";

  return NextResponse.json({ reply });
}
