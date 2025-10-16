import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cartitems: [
    {
      id: Number,
      name: String,
      price: Number,
      qty: Number,
      image: String,
    },
  ],
  user: {
    name: String,
    email: String,
  },
  amount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

