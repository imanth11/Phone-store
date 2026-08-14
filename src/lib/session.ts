import type { NextRequest } from "next/server";
import { verifyToken, type JwtUserPayload } from "@/lib/jwt";

export function getSessionUser(req: NextRequest): JwtUserPayload | null {
  const token = req.cookies.get("token")?.value;
  return token ? verifyToken(token) : null;
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase());
}

export function isAdmin(user: JwtUserPayload | null): boolean {
  if (!user) return false;
  return user.role === "admin" || isAdminEmail(user.email);
}
