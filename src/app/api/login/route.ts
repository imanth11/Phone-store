import path from "path";
import fs from "fs";
import { emit } from "process";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

interface Iuser{
    id:number,
    name:string,
    email:string,
    password:string
}
export async function POST(req:Request){


try{
    const {email , password}= await req.json();


const filepath=path.join(process.cwd(),"src","user.json");
const filedata=fs.readFileSync(filepath,"utf-8");
const users=JSON.parse(filedata);

const user=users.find((u:Iuser)=>u.email===email)
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

const token = signToken({ id: user.id, email: user.email, name: user.name });

  // ✅ ذخیره در کوکی (امن)
  const res = NextResponse.json({ success: true, message: "Logged in" ,user: { id: user.id, name: user.name, email: user.email },});
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;


}catch(err){
    console.error(err);
    return NextResponse.json(
        {success:false, message:"error in server"}
    )
}
}