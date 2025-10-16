"use client"
import React, { useEffect, useState } from 'react'
import { tp } from '../product/page';
import { error } from 'console';

interface order{
    _id: string;
    user: string;
    cartitems: tp[];
    createdAt: string;
}
function Admin() {


    const [orders, setOrders] = useState<order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
   async function fetchOrders(){
    const res=await fetch ("/api/orders");
    const data=await res.json();
    if(data.success){
      setOrders(data.orders)

      setLoading(false)
    }
   
   }
   fetchOrders();
  },[])




async function Remove(id:number){

try{


  const res=await fetch(`/api/orders/${id}`,{

    method:"DELETE",
  })


  const data=await res.json();

  if(data.success){
    setOrders(orders.filter(item=>parseInt(item._id)!=id))
  }
  else{
    alert("failed")
  }
}catch(err){
  alert("ERRor is:"+err)
}


}







  if (loading) return <p>is loadinnnnnnnng</p>
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded-lg shadow">
            <h2 className="font-semibold text-xl">Order #{order._id}</h2>
            <p>User: {JSON.stringify(order.user)}</p>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <h3 className="font-semibold mt-2">Products:</h3>
            <ul className="ml-4">
              {order.cartitems.map((item) => (
                <li key={item.id} className="flex items-center gap-4 space-y-4">
                  <img src={item.image} alt={item.name} className="rounded w-16 h-20 object-cover" />
                  <div>
                    <p>{item.name}</p>
                    <p>
                      {item.price} USD × {item.qty} = {item.price * item.qty} USD
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2">
              Total: {order.cartitems.reduce((sum, item) => sum + item.price * item.qty, 0)} USD
            </p>
            <div>
              <button  className='bg-red-500 w-20 rounded border shadow-2xl mt-2'
               onClick={()=>Remove(parseInt(order._id))}>Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin