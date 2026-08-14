import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, maxlength: 160 },
    userId: { type: String, required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    role: { type: String, enum: ["user", "admin"], required: true },
  },
  { timestamps: true },
);
MessageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
