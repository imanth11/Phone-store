// src/models/Order.ts
import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  user: {
    name: String,
    email: String,
  },
  cartitems: [
    {
      id: Number,
      title: String,
      price: Number,
      quantity: Number,
    },
  ],
  amount: Number,
  status: { type: String, default: "pending" }, // pending, paid
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
