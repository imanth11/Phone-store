import { products } from "@/data/products";
import discountCodes from "@/discount.json";
import type { CartItem, Product } from "@/types/store";
import { getDiscountedUnitPrice } from "@/lib/pricing";

type DiscountCode = {
  code: string;
  amount: number;
};

const discounts = discountCodes as DiscountCode[];

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}

export function normalizeCartItems(
  incoming: Array<{ id?: unknown; qty?: unknown }> | undefined,
): CartItem[] {
  if (!Array.isArray(incoming)) return [];

  const merged = new Map<number, number>();

  for (const entry of incoming) {
    const id = Number(entry?.id);
    const qty = Math.min(Math.max(Number(entry?.qty) || 1, 1), 20);
    if (!Number.isInteger(id)) continue;
    merged.set(id, Math.min((merged.get(id) || 0) + qty, 20));
  }

  return Array.from(merged.entries())
    .map(([id, qty]) => {
      const product = getProductById(id);
      return product ? { ...product, qty } : null;
    })
    .filter((item): item is CartItem => Boolean(item));
}

export function calculateCartTotal(
  items: CartItem[],
  discountCode?: string,
): { subtotal: number; discountAmount: number; total: number; discountPercent: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + getDiscountedUnitPrice(item) * item.qty,
    0,
  );

  const normalizedCode = discountCode?.trim().toLowerCase();
  const matched = normalizedCode
    ? discounts.find((item) => item.code.toLowerCase() === normalizedCode)
    : undefined;

  const discountPercent = matched?.amount || 0;
  const discountAmount = Number((subtotal * (discountPercent / 100)).toFixed(2));
  const total = Number(Math.max(subtotal - discountAmount, 0).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    total,
    discountPercent,
  };
}
