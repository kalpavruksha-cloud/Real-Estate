import "server-only";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
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
  if (email.trim().toLowerCase() !== env.adminEmail.trim().toLowerCase()) return false;

  // Existing deployments originally documented ADMIN_PASSWORD_HASH as a plain
  // password. Continue to accept that legacy configuration so those projects
  // can sign in, while preferring bcrypt (directly or through the Base64 env).
  if (!env.adminPasswordHash.startsWith("$2")) {
    console.warn("[auth] Using legacy plain-text ADMIN_PASSWORD_HASH; migrate to ADMIN_PASSWORD_HASH_BASE64.");
    const suppliedDigest = createHash("sha256").update(password).digest();
    const configuredDigest = createHash("sha256").update(env.adminPasswordHash).digest();
    return timingSafeEqual(suppliedDigest, configuredDigest);
  }

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

