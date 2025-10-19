import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return NextResponse.json({ success: false, message: "❌ OPENAI_API_KEY not found on server" });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ success: false, message: "❌ Key invalid", error: err });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, models: data.data?.length || 0 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
