import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const orderpath=path.join(process.cwd(),"src","orders.json")


export interface Iusers {
    id: number
    user: User
    cartitems: Cartitem[]
    createdAt: string
  }
  
  export interface User {
    name: string
    email: string
  }
  
  export interface Cartitem {
    id: number
    range: string
    isDis: boolean
    Dis: number
    name: string
    price: number
    image: string
    qty: number
    des?: string
  }

  interface Iparam{
    params:Promise<{id:string}>
    

  }
export async function DELETE(req:Request,props:Iparam){

try{

    const id=Number(props.params)



const data=fs.readFileSync(orderpath,"utf-8");

const orders=JSON.parse(data);

const newOrders=orders.filter((item:Iusers)=>item.id!=id);

fs.writeFileSync(orderpath,JSON.stringify(newOrders,null,2));

return NextResponse.json({success:true})



}catch(err){
    console.error(err)
    return NextResponse.json({success:false})
}


}