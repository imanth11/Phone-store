import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "../../models/Message";
import { getSessionUser, isAdmin } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!isAdmin(session)) {
    return NextResponse.json(
      { success: false, error: "Admin access required." },
      { status: 403 },
    );
  }

  try {
    await connectDB();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return NextResponse.json(
      { success: true, messages: messages.reverse() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin message fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load conversations." },
      { status: 500 },
    );
  }
}
