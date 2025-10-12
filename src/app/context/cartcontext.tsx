"use client"

import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react';
import { tp } from '../product/page';
import discount from "@/discount.json"
import { LocateFixed } from 'lucide-react';


type contxttype={
cartitems:tp[];
Allitems:tp[]
users:Iuser|null
    addTocart:(product:tp)=>void
    Remove:(product:tp)=>void
    increase:(product:tp)=>void
    descrease:(product:tp)=>void
    totalprice:(code:string)=>number
    clearCart:()=>void
    realprice:()=>number
    login:(user:Iuser)=>void
    logout:()=>void
}
interface Icode{
  code:string,
  amount:number
}

export interface Iuser{
  id:number,
  name:string,
  email:string,
}


interface r{
    children:React.ReactNode;
}

const Cartcontext=createContext<contxttype|undefined>(undefined);

export function CartProvider({children}:r) {


const [cartitems,setcartitems]=useState<tp[]>([])

const [users,setusers]=useState<Iuser|null>(null);

const [Allitems,setAllitems]=useState<tp[]>([]);

console.log(users)
console.log(users?.email)
console.log(users?.name)



// useEffect(()=>{
//   const storedUser=localStorage.getItem("users");
//   if(storedUser){
//     setusers(JSON.parse(storedUser));
//   }
// },[])




 useEffect(() => {
   const storedCart = localStorage.getItem("cartitems");
   if (storedCart) {
     setcartitems(JSON.parse(storedCart));
   }
 }, []);

useEffect(() => {
  async function fetchUser() {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      
      const data = await res.json();
      console.log("data issssssss:"+data)
      if (data.success && data.user) {
        setusers(data.user);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }
  fetchUser();
}, []);

useEffect(() => {
  localStorage.setItem("cartitems", JSON.stringify(cartitems));
}, [cartitems]);



function login(user:Iuser){
setusers(user);
// localStorage.setItem("users",JSON.stringify(user))
}

function logout(){
  setusers(null);
  localStorage.removeItem("cartitems")
}



 function addTocart(product:tp){
    
  setcartitems(current=>{
    const select=current.find(item=>item.id===product.id);
    if(!select){
      product.qty=1;
      return [...current,product]
    }
    else{
return [...current]
    }
  })


}

function Remove(product: tp) {
  setcartitems(current =>
    current.filter(item => item.id !== product.id)
  );
  
}



function increase(product:tp){

setcartitems(current=>{

const selected = current.find(item=>item.id===product.id);

if(selected){

  
  return current.map(item=>{
    if(item.id==product.id){
      return {...item,qty:item.qty+1}
    }

    else{
      return item
    }
  })
}

else{
  return [...current]
}


})

}


 function descrease(product:tp){

  setcartitems(current=>{
    const selecet= current.find(item=>item.id===product.id);

    if(selecet){
      if(selecet.qty===1){
       return  current.filter(item=>item.id!==product.id);
         
      }
      else{
       return current.map(item=>{
          if(item.id==product.id){
            return {...item,qty:item.qty-1}
          }
          else{
            return item
          }
        })
      }
    }
    else{
      return [...current]
    }
  })

}

function totalprice(code:string){

  const price:number= cartitems.reduce((total,item)=>{
    return total+ item.price*(item.qty||1);
  },0)
     const dis=discount.find((co:Icode)=>co.code===code)


     console.log("discountCode from input:", code);
console.log("discount data:", discount);
console.log("found discount:", dis);
console.log("found discount:", dis?.amount);


     if(dis){
      return Number((price*((100-dis.amount)/100)).toFixed(1))
     }
     else{
      return price
     }

  
}

function realprice(){
  return cartitems.reduce((total,item)=>{
    return total + item.price*(item.qty)
  },0)
}


function clearCart(){

 setcartitems(()=>[])
}




  return (
    <Cartcontext.Provider value={{cartitems,Allitems,logout,users,login,realprice,clearCart,addTocart,Remove,increase,descrease,totalprice}}>

{children}
    </Cartcontext.Provider>
  )

}

export function useCart(){
    const context=useContext(Cartcontext);
    if (!context) {
      throw new Error("useCart must be used inside a CartProvider");
    }

    return context;
}



