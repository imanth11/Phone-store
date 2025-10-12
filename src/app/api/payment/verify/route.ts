// src/app/api/payment/verify/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get("Authority");
    const amount = searchParams.get("amount");

    if (!authority || !amount) {
      return NextResponse.json({ success: false, message: "Authority or amount missing" }, { status: 400 });
    }

    const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID!;
    const ZARINPAL_USE_SANDBOX = process.env.ZARINPAL_USE_SANDBOX === "true";

    const zarinpalVerifyUrl = ZARINPAL_USE_SANDBOX
      ? "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
      : "https://api.zarinpal.com/pg/v4/payment/verify.json";

    const res = await fetch(zarinpalVerifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: parseInt(amount),
        authority,
      }),
    });

    const data = await res.json();

    if (data.data?.code === 100) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: data.data?.message });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}




