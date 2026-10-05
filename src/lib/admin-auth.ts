import "server-only";
import { timingSafeEqual } from "node:crypto";

export function isValidAdminPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== "string") return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAdminRequest(req: Request): boolean {
  return isValidAdminPassword(req.headers.get("x-admin-password"));
}
