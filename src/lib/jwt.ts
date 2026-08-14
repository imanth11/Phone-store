import jwt from "jsonwebtoken";

export interface JwtUserPayload {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function signToken(payload: JwtUserPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtUserPayload;
  } catch {
    return null;
  }
}
