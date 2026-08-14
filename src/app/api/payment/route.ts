import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "../models/order";
import { calculateCartTotal, normalizeCartItems } from "@/lib/store";
import { getSessionUser } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Please sign in before checkout." },
      { status: 401 },
    );
  }

  const paymentLimit = checkRateLimit(req, "payment", 8, 60 * 1000, session.id);
  if (!paymentLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many checkout attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(paymentLimit.retryAfterSeconds) },
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
    if (totals.total <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid checkout total." },
        { status: 400 },
      );
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const useSandbox = process.env.ZARINPAL_USE_SANDBOX === "true";

    if (!merchantId || !appUrl) {
      return NextResponse.json(
        { success: false, message: "Payment service is not configured." },
        { status: 503 },
      );
    }

    const endpoint = useSandbox
      ? "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
      : "https://api.zarinpal.com/pg/v4/payment/request.json";

    const callbackUrl = new URL("/verify", appUrl).toString();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: Math.round(totals.total),
        description: `PhoneStore order for ${session.email}`,
        metadata: { email: session.email },
        callback_url: callbackUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment provider returned ${response.status}`);
    }

    const paymentData = await response.json();
    const authority = paymentData?.data?.authority;

    if (paymentData?.data?.code !== 100 || !authority) {
      return NextResponse.json(
        {
          success: false,
          message: paymentData?.errors?.message || "Payment request was rejected.",
        },
        { status: 502 },
      );
    }

    await connectDB();
    await Order.create({
      cartitems,
      userId: session.id,
      user: { name: session.name, email: session.email },
      amount: totals.total,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      discountCode,
      status: "pending_payment",
      paymentAuthority: authority,
    });

    const paymentUrl = useSandbox
      ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
      : `https://www.zarinpal.com/pg/StartPay/${authority}`;

    return NextResponse.json({
      success: true,
      url: paymentUrl,
      amount: totals.total,
    });
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to start payment." },
      { status: 500 },
    );
  }
}
