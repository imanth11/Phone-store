import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "../../models/order";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get("Authority");

    if (!authority) {
      return NextResponse.json(
        { success: false, message: "Missing payment authority." },
        { status: 400 },
      );
    }

    await connectDB();
    const order = await Order.findOne({
      paymentAuthority: authority,
      userId: session.id,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Payment session not found." },
        { status: 404 },
      );
    }

    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        orderId: String(order._id),
        alreadyVerified: true,
      });
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const useSandbox = process.env.ZARINPAL_USE_SANDBOX === "true";

    if (!merchantId) {
      return NextResponse.json(
        { success: false, message: "Payment service is not configured." },
        { status: 503 },
      );
    }

    const endpoint = useSandbox
      ? "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
      : "https://api.zarinpal.com/pg/v4/payment/verify.json";

    const providerResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: Math.round(order.amount),
        authority,
      }),
    });

    if (!providerResponse.ok) {
      throw new Error(`Payment verify provider returned ${providerResponse.status}`);
    }

    const data = await providerResponse.json();
    const code = data?.data?.code;

    if (code === 100 || code === 101) {
      order.status = "paid";
      order.paymentRefId = data?.data?.ref_id ? String(data.data.ref_id) : "";
      await order.save();

      return NextResponse.json({
        success: true,
        orderId: String(order._id),
        refId: order.paymentRefId,
      });
    }

    order.status = "failed";
    await order.save();

    return NextResponse.json(
      {
        success: false,
        message: data?.errors?.message || data?.data?.message || "Payment was not verified.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to verify payment." },
      { status: 500 },
    );
  }
}
