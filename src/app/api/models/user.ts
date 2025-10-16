import mongoose, { Schema, model, models } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// جلوگیری از دوباره تعریف شدن مدل در Hot Reload
export const User = models.User || model<IUser>("User", userSchema);
