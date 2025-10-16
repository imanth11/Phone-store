import path from "path";
import fs from "fs";
import { emit } from "process";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { User } from "../models/user";
import { connectDB } from "@/lib/mongodb";

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
  }
  
export async function POST(req:Request){


try{

    await connectDB();
    const {email , password}= await req.json();




const user = await User.findOne({ email });

if(!user){
    return NextResponse.json(

        {success:false,message:"Is not true"}
    )
}

const isvalid=await bcrypt.compare(password,user.password)

if(!isvalid){
    return NextResponse.json(
        {success:false,message:"your pass is not true"}
    )
}

const token = signToken({ id: user._id, email: user.email, name: user.name });

  // ✅ ذخیره در کوکی (امن)
  const res = NextResponse.json({ success: true, message: "Logged in" ,user: { id: user._id, name: user.name, email: user.email },});
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
  });

  return res;


}catch(err){
    console.error(err);
    return NextResponse.json(
        {success:false, message:"error in server"}
    )
}
}