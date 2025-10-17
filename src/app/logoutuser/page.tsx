"use client";

import { useCart } from '@/app/context/cartcontext'
import { useRouter } from 'next/navigation';
import React from 'react'

function Logoutuser() {
    const { logout, cartitems, clearCart } = useCart();
    const router = useRouter();

    async function out() {
        const res = await fetch("/api/logout", {
            method: "POST"
        })
        clearCart();
        logout();
        router.push("/login");
    }

    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={out}
                className="w-full md:w-60 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg transition transform active:scale-95"
            >
                Log out
            </button>
        </div>
    );
}

export default Logoutuser;
