import "server-only";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/config";
import type { Role } from "@/types";

const COOKIE_NAME = "kre_admin_session";
const secret = new TextEncoder().encode(env.authSecret);

export interface AdminSession {
  email: string;
  name: string;
  role: Role;
}

export async function verifyPassword(email: string, password: string) {
  if (!env.adminEmail || !env.adminPasswordHash) {
    console.error("[auth] Admin credentials are missing.", {
      emailConfigured: Boolean(env.adminEmail),
      passwordHashConfigured: Boolean(env.adminPasswordHash)
    });
    return false;
  }
  if (!env.adminPasswordHash.startsWith("$2")) {
    console.error("[auth] ADMIN_PASSWORD_HASH is not a valid bcrypt hash.");
    return false;
  }
  if (email.toLowerCase() !== env.adminEmail.toLowerCase()) return false;
  try {
    return await bcrypt.compare(password, env.adminPasswordHash);
  } catch (error) {
    console.error("[auth] Password verification failed.", error);
    return false;
  }
}

export async function createSession() {
  const session: AdminSession = {
    email: env.adminEmail,
    name: env.adminName,
    role: env.adminRole
  };
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as Role
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

