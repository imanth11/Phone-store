// src/app/api/payment/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(req: Request) {
  const cookieStore = await cookies() // 🛑 بدون await

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "No login" });
  }

const usertoken=verifyToken(token);
if(!usertoken){
  return NextResponse.json({success:false,message:"No token"})
}










  try {
    const body = await req.json();
    const { amount, description, email, phone } = body;

    const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID!;
    const ZARINPAL_USE_SANDBOX = process.env.ZARINPAL_USE_SANDBOX === "true";

    const zarinpalBaseUrl = ZARINPAL_USE_SANDBOX
      ? "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
      : "https://api.zarinpal.com/pg/v4/payment/request.json";

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?amount=${amount}`;

    const response = await fetch(zarinpalBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount,
        description,
        metadata: { email, phone },
        callback_url: callbackUrl,
      }),
    });

    const data = await response.json();

    if (data.data?.code === 100) {
      const paymentUrl = ZARINPAL_USE_SANDBOX
        ? `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`
        : `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;

      return NextResponse.json({ success: true, url: paymentUrl });
    } else {
      return NextResponse.json({ success: false, message: data.data?.message || "Payment request failed" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Payment request error" }, { status: 500 });
  }
}



