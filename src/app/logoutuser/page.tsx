"use client";

import { useCart } from '@/app/context/cartcontext'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Logoutuser() {
    const { logout } = useCart();
    const router = useRouter();
   

  async function out(){
    const res=await fetch("/api/logout",{
        method:"POST"
    })
    logout();
        router.push("/login");
  }

    return (
        <div>
            <button className='bg-red-600 w-full' onClick={out}>Log out</button>
        </div>
    );
}

export default Logoutuser;
