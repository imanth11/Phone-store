import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import  { connectDB } from "@/lib/mongodb";
import {Order} from "../../models/order";


interface Is{
  params:Promise<{id:string}>
}

export async function DELETE(
  req: Request,
  props:Is  
) {
  try {
    await connectDB(); // اتصال به MongoDB

    const id=props.params
    const result = await Order.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}