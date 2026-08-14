import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "../../models/Message";
import { getSessionUser, isAdmin } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const requestedUserId = new URL(req.url).searchParams.get("userId") || session.id;
  if (requestedUserId !== session.id && !isAdmin(session)) {
    return NextResponse.json(
      { success: false, error: "Forbidden." },
      { status: 403 },
    );
  }

  try {
    await connectDB();
    const messages = await Message.find({ userId: requestedUserId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json(
      { success: true, messages: messages.reverse() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Message fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load messages." },
      { status: 500 },
    );
  }
}
