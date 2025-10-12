"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cartcontext';

function Login() {
    const router=useRouter();
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");

    const {login}=useCart();






useEffect(()=>{
    async function checkIslogin(){
        const res= await fetch("/api/me",{

            credentials:"include"
        })

        const data=await res.json();
        if(data.success){
            login(data.user)
            router.push("/product")
        }
    }
},[])



useEffect(()=>{
    const e =localStorage.getItem("email")
    if(e){
        setemail(JSON.parse(e))
    }
},[])
useEffect(()=>{
   localStorage.setItem("email",JSON.stringify(email) )


},[email]);


    async function Submit(e: React.FormEvent){
        e.preventDefault();

        const res=await fetch("/api/login",{

method:"POST",
headers:{"content-Type":"application/json"},
body:JSON.stringify({
    email,password
}),
credentials:"include"
})
        const data=await res.json();
if(data.success){
alert(data.message);

login(data.user)


router.push("/product")
}
else{
    alert(data.message);
  
}















    }
  return (
    <div className='flex flex-col items-center justify-center
    min-h-screen shadow-gray-400
    container mx-auto bg-gray-300'>

<h1 className='text-2xl mb-6'>Login</h1>





        <form onSubmit={Submit} className='space-y-4 '>

<input className='w-full border rounded text-black' type='email' value={email} 
onChange={(e)=>setemail(e.target.value)} placeholder='email'/>


<input className='w-full border rounded text-black' type='password' value={password} 
onChange={(e)=>setpassword(e.target.value)} placeholder='Password'/>
  
  

  <button type='submit' className='w-full text-amber-50 rounded
   bg-purple-700 hover:bg-green-700'>Login</button>
        </form>
    </div>
  )
}

export default Login