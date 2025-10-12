import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { create } from "domain";
import { verifyToken } from "@/lib/jwt";

const filepath=path.join(process.cwd(),"src","orders.json")
export async function POST(req:NextRequest){


const token=req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

const Isuser = token ? verifyToken(token) : null;

if (!Isuser) {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}

    try{
        const body=await req.json();


        const {cartitems,user}=body;
const filedata=fs.readFileSync(filepath,"utf-8");
const orders=JSON.parse(filedata);
        

const neworder={
    id:Date.now(),
    user,
    cartitems:Array.isArray(cartitems)?cartitems:[],
    createdAt:new Date().toISOString()
}

orders.push(neworder);
fs.writeFileSync(filepath,JSON.stringify(orders,null,2));

return NextResponse.json(
   { success:true,

orderId:neworder.id,
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
export async function GET(){


    try{
        const filedata=fs.readFileSync(filepath,"utf-8");
        const orders = JSON.parse(filedata);
        return NextResponse.json({ success: true, orders });
      } catch (error) {
        console.error("Error reading orders:", error);
        return NextResponse.json({ success: false, message: "Error reading orders" }, { status: 500 });
      }
    
}