import mongoose, { Schema, models } from "mongoose";
const ordermodel=new Schema(
    {
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
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
      { timestamps: true }

);

const Order=models.order || mongoose.model("order",ordermodel);

export default Order;