import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "../models/order";
import { getSessionUser, isAdmin } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = getSessionUser(req);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const scope = new URL(req.url).searchParams.get("scope");
    const wantsAllOrders = scope === "all";

    if (wantsAllOrders && !isAdmin(session)) {
      return NextResponse.json(
        { success: false, message: "Admin access required." },
        { status: 403 },
      );
    }

    await connectDB();
    const query = wantsAllOrders ? {} : { userId: session.id };
    const orders = await Order.find(query)
      .select(
        "_id cartitems user userId amount subtotal discountAmount discountCode status paymentRefId createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, orders },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch orders." },
      { status: 500 },
    );
  }
}
