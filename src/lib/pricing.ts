import type { Product } from "@/types/store";

export function getDiscountedUnitPrice(product: Product): number {
  if (!product.isDis || !product.Dis) return product.price;
  return Number((product.price * ((100 - product.Dis) / 100)).toFixed(2));
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD",
    maximumFractionDigits: 2,
  }).format(value);
}
