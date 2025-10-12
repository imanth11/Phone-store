import jwt from "jsonwebtoken";
export interface JwtUserPayload {
    id: number;
    name: string;
    email: string;
  }
const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key"; // تو .env بذار

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // توکن ۷ روزه
}

export function verifyToken(token: string):JwtUserPayload | null{
  try {
    const playload= jwt.verify(token, JWT_SECRET||"");
    return playload as JwtUserPayload;
  } catch (err) {
    return null;
  }
}
