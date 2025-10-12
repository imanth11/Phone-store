"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cartcontext";

interface Iuser {
  id: number;
  name: string;
  email: string;
}





export default function VerifyPage() {
  const router = useRouter();
  const { cartitems, clearCart } = useCart();

  const [statusMessage, setStatusMessage] = useState("در حال بررسی پرداخت...");
  const [user, setUser] = useState<Iuser | null>(null);
  const [readyToVerify, setReadyToVerify] = useState(false);
  useEffect(() => {
    async function loadUserAndVerify() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();

        if (data.success && data.user) {
          setUser(data.user);
       
        } else {
          setStatusMessage("کاربر تایید نشد ❌");
        }
      } catch (err) {
        console.error("خطا در گرفتن اطلاعات کاربر:", err);
        setStatusMessage("خطا در ارتباط با سرور ❌");
      }
    }

    loadUserAndVerify();
  }, []);


  useEffect(() => {
    if (user && cartitems.length > 0) {
      setReadyToVerify(true);
    }
  }, [user, cartitems]);

  useEffect(() => {
    if (readyToVerify) {
      verifyPayment(user!);
    }
  }, [readyToVerify]);



  async function verifyPayment(user: Iuser) {
    const params = new URLSearchParams(window.location.search);
    const authority = params.get("Authority");
    const status = params.get("Status");
    const amount = params.get("amount");

    if (status === "OK" && authority) {
      try {
        const verifyRes = await fetch(
          `/api/payment/verify?Authority=${authority}&amount=${amount}`
        );
        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          setStatusMessage("پرداخت موفق بود ✅");

          const orderReq = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartitems,
              user: { name: user.name, email: user.email }
            })
          });

          const orderData = await orderReq.json();

          if (orderData.success) {
            alert("سفارش با موفقیت ثبت شد ✅");
            clearCart();
            router.push("/basket");
          } else {
            alert("ثبت سفارش موفق نبود ❌");
            router.push("/basket");
          }
        } else {
          setStatusMessage("پرداخت تایید نشد ❌");
        }
      } catch (err) {
        console.error("خطا در تایید پرداخت:", err);
        setStatusMessage("خطا در تایید پرداخت ❌");
      }
    } else {
      setStatusMessage("پرداخت لغو شد ❌");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-2xl mb-6">{statusMessage}</h2>
      <button
        onClick={() => router.push("/basket")}
        className="bg-green-600 px-6 py-2 rounded-lg text-white hover:bg-green-500"
      >
        بازگشت به سبد خرید
      </button>
    </div>
  );
}


