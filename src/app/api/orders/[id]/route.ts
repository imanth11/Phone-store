import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { getSessionUser, isAdmin } from "@/lib/session";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, props: RouteProps) {
  const session = getSessionUser(req);
  if (!isAdmin(session)) {
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 403 },
    );
  }

  try {
    await connectDB();
    const { id } = await props.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID." },
        { status: 400 },
      );
    }

    const result = await Order.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order delete error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete order." },
      { status: 500 },
    );
  }
}
