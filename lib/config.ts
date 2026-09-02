import type { Role } from "@/types";

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || "",
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL || "",
  googlePrivateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  authSecret: process.env.AUTH_SECRET || "development-secret-change-before-production",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
  adminName: process.env.ADMIN_NAME || "Kalpavruksha Admin",
  adminRole: (process.env.ADMIN_ROLE || "SUPER_ADMIN") as Role,
  whatsappNumber: process.env.WHATSAPP_NUMBER || "",
  businessPhone: process.env.BUSINESS_PHONE || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 8)
};
