import { NextResponse } from "next/server";
import path from "path";
import bcrypt from "bcryptjs";

import fs from "fs";
import { json } from "stream/consumers";

const filepath=path.join(process.cwd(),"src","user.json");

interface Iuser{
    id:number,
    name:string,
    email:string,
    password:string
}


export async function POST(req:Request){

try{

const body=await req.json();
const {name,email,password}=body;

if(!name||!email||!password){
    return NextResponse.json({success:false,message:"fill in all the blanks"},
        {status:400}
    )
}

const filedata=fs.readFileSync(filepath,"utf-8");
const users=JSON.parse(filedata);


const existuser=users.find((u:Iuser)=>u.email===email);

if(existuser){
    return NextResponse.json({ success:false,message:"this email used before"
    },
    {status:400}

);
}



const hashpass=await bcrypt.hash(password,10)

const newuser={
    id:Date.now(),
    name,
    email,
    password:hashpass
}
users.push(newuser);
fs.writeFileSync(filepath,JSON.stringify(users,null,2),"utf-8");

return NextResponse.json(
    {success:true ,message:"inserted seccessfully",
        user:{id:newuser.id,name:newuser.name,email:newuser.email,
            
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
