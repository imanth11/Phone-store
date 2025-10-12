import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    // 🟢 توکن رو از کوکی می‌گیریم
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    // 🧩 بررسی صحت توکن
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ success: false, user: null });
    }

    // ✅ برگردوندن اطلاعات یوزر
    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Error in /api/me:", err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
