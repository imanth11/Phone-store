import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  
  const response = NextResponse.json({ success: true, message: "Logged out" });

  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // حذف کوکی
  });

  return response;
}
