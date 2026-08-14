import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1, max: 20 },
    image: { type: String, required: true },
    Dis: { type: Number, default: 0 },
    isDis: { type: Boolean, default: false },
    range: { type: String },
    des: { type: String },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    cartitems: { type: [orderItemSchema], required: true },
    userId: { type: String, required: true, index: true },
    user: {
      name: String,
      email: String,
    },
    amount: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0 },
    discountCode: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending_payment", "paid", "failed", "cancelled"],
      default: "pending_payment",
      index: true,
    },
    paymentAuthority: { type: String, index: true, sparse: true, unique: true },
    paymentRefId: { type: String },
  },
  { timestamps: true },
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
