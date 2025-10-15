// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// تعریف تایپ برای cached connection
interface MongooseCached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// اضافه کردن به global برای جلوگیری از چندبار اتصال در dev
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCached | undefined;
}

let cached: MongooseCached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
}
