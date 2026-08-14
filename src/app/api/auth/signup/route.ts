import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "../../models/user";
import { checkRateLimit } from "@/lib/rateLimit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    const signupLimit = checkRateLimit(req, "signup", 5, 15 * 60 * 1000, email);
    if (!signupLimit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many account creation attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(signupLimit.retryAfterSeconds) },
        },
      );
    }

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid name." },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email) || email.length > 160) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { success: false, message: "Password must be 8–128 characters." },
        { status: 400 },
      );
    }

    await connectDB();
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: String(newUser._id),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create account right now." },
      { status: 500 },
    );
  }
}
