import type { Role } from "@/types";

function resolveAdminPasswordHash() {
  const encodedHash = cleanEnvValue(process.env.ADMIN_PASSWORD_HASH_BASE64);
  if (encodedHash) {
    try {
      const decodedHash = Buffer.from(encodedHash, "base64").toString("utf8").trim();
      if (decodedHash.startsWith("$2")) return decodedHash;
    } catch {
      // Fall back to the direct hash below.
    }
  }

  return cleanEnvValue(process.env.ADMIN_PASSWORD_HASH);
}

function cleanEnvValue(value: string | undefined) {
  const cleaned = value?.trim() || "";
  if (
    cleaned.length >= 2 &&
    ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'")))
  ) {
    return cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || "",
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL || "",
  googlePrivateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  authSecret: process.env.AUTH_SECRET || "development-secret-change-before-production",
  adminEmail: cleanEnvValue(process.env.ADMIN_EMAIL) || "admin@example.com",
  adminPasswordHash: resolveAdminPasswordHash(),
  adminName: process.env.ADMIN_NAME || "Kalpavruksha Admin",
  adminRole: (process.env.ADMIN_ROLE || "SUPER_ADMIN") as Role,
  whatsappNumber: process.env.WHATSAPP_NUMBER || "",
  businessPhone: process.env.BUSINESS_PHONE || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 8)
};
