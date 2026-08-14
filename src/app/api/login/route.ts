import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { isAdminEmail } from "@/lib/session";
import { User } from "../models/user";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    const loginLimit = checkRateLimit(req, "login", 10, 15 * 60 * 1000, email);
    if (!loginLimit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many sign-in attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(loginLimit.retryAfterSeconds) },
        },
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: "Email or password is incorrect." },
        { status: 401 },
      );
    }

    const role = user.role === "admin" || isAdminEmail(user.email) ? "admin" : "user";
    const token = signToken({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Welcome back.",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      priority: "high",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to sign in right now." },
      { status: 500 },
    );
  }
}
