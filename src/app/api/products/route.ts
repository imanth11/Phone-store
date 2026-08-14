import { NextResponse } from "next/server";
import { products } from "@/data/products";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
