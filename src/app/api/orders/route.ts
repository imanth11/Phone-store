import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { create } from "domain";
import { verifyToken } from "@/lib/jwt";
import Order from "../models/order";
import { connectDB } from "@/lib/mongodb";

const filepath=path.join(process.cwd(),"src","orders.json")
export async function POST(req:NextRequest){


const token=req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

const Isuser = token ? verifyToken(token) : null;

if (!Isuser) {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}

    try{

        await connectDB();
        const body=await req.json();
        console.log("Received order request:", body);

        const {cartitems,user,amount}=body;

        

        const neworder = await Order.create({ cartitems, user, amount, status: "paid" });




return NextResponse.json(
   { success:true,

order:neworder.id,
message:"order inserted successfuly"
   }

)
    }catch(error){
        console.error("Error happened:", error);

        return NextResponse.json({
            success:false, message:"error happend for adding"
        },{status:500})
    }
}
export async function GET() {
    try {
      await connectDB();
      const orders = await Order.find();
      return NextResponse.json({ success: true, orders });
    } catch (err) {
      return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
    }
  }