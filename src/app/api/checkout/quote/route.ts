import { NextResponse } from "next/server";
import { calculateCartTotal, normalizeCartItems } from "@/lib/store";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const quoteLimit = checkRateLimit(req, "checkout-quote", 60, 60 * 1000);
  if (!quoteLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many pricing requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(quoteLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await req.json();
    const cartitems = normalizeCartItems(body?.cartitems);
    const discountCode = String(body?.discountCode || "").trim();

    if (!cartitems.length) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty." },
        { status: 400 },
      );
    }

    const totals = calculateCartTotal(cartitems, discountCode);

    return NextResponse.json({
      success: true,
      ...totals,
      discountValid: Boolean(!discountCode || totals.discountPercent > 0),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to calculate cart total." },
      { status: 400 },
    );
  }
}
