import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);

  if (!user) {
    return NextResponse.json(
      { success: false, user: null },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
