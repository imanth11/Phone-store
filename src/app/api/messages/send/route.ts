import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "../../models/Message";
import { getSessionUser, isAdmin } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const messageLimit = checkRateLimit(req, "support-message", 30, 60 * 1000, session.id);
  if (!messageLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many messages. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(messageLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await req.json();
    const message = String(body?.message || "").trim();
    const requestedUserId = String(body?.userId || session.id);
    const admin = isAdmin(session);

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Message must be 1–2000 characters." },
        { status: 400 },
      );
    }

    if (!admin && requestedUserId !== session.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden." },
        { status: 403 },
      );
    }

    await connectDB();

    let name = session.name;
    let email = session.email;

    if (admin && requestedUserId !== session.id) {
      const latestUserMessage = await Message.findOne({
        userId: requestedUserId,
        role: "user",
      }).sort({ createdAt: -1 });

      name = latestUserMessage?.name || "Customer";
      email = latestUserMessage?.email || "unknown@example.com";
    }

    const newMessage = await Message.create({
      name,
      email,
      userId: requestedUserId,
      message,
      role: admin && body?.role === "admin" ? "admin" : "user",
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to send message." },
      { status: 500 },
    );
  }
}
