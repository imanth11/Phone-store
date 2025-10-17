"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cartcontext';

function Login() {
    const router = useRouter();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const { login, cartitems } = useCart();

    useEffect(() => {
        async function checkIslogin() {
            const res = await fetch("/api/me", {
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                login(data.user)
                router.push("/product")
            }
        }
    }, [])

    useEffect(() => {
        const e = localStorage.getItem("email")
        if (e) setemail(JSON.parse(e))
    }, [])

    useEffect(() => {
        localStorage.setItem("email", JSON.stringify(email))
    }, [email]);


    
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Login
                </h1>

                <form onSubmit={Submit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            type="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg transition transform active:scale-95"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;
