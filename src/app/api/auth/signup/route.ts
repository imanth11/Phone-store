import { NextResponse } from "next/server";
import path from "path";
import bcrypt from "bcryptjs";

import fs from "fs";
import { json } from "stream/consumers";
import { connectDB } from "@/lib/mongodb";
import { User } from "../../models/user";

const filepath=path.join(process.cwd(),"src","user.json");

interface Iuser{
    id:number,
    name:string,
    email:string,
    password:string
}


export async function POST(req:Request){

try{

    await connectDB();


const body=await req.json();
const {name,email,password}=body;

if(!name||!email||!password){
    return NextResponse.json({success:false,message:"fill in all the blanks"},
        {status:400}
    )
}




const existuser=await User.findOne({email});

if(existuser){
    return NextResponse.json({ success:false,message:"this email used before"
    },
    {status:400}

);
}



const hashpass=await bcrypt.hash(password,10)

const newuser=await User.create({
    name,email,password:hashpass
})

return NextResponse.json(
    {success:true ,message:"inserted seccessfully",
        user:{id:newuser._id,name:newuser.name,email:newuser.email,
            
        }
    }
)

}catch (err){
    console.error("error:",err);
    return NextResponse.json(
        { success: false, message: "خطای سرور" },
        { status: 500 });
}

}
