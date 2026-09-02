import { Readable } from "node:stream";
import { google } from "googleapis";
import sharp from "sharp";
import { env } from "@/lib/config";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_SIZE = 8 * 1024 * 1024;

async function driveClient() {
  if (!env.googleClientEmail || !env.googlePrivateKey || !env.driveFolderId) {
    throw new Error("Google Drive image storage environment variables are not configured.");
  }
  const auth = new google.auth.JWT({
    email: env.googleClientEmail,
    key: env.googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/drive"]
  });
  return google.drive({ version: "v3", auth });
}

export async function uploadToDrive(file: File, namePrefix: string) {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed.");
  }
  if (file.size > MAX_SIZE) throw new Error("Image must be 8MB or smaller.");

  const input = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(input)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const drive = await driveClient();
  const created = await drive.files.create({
    requestBody: {
      name: `${namePrefix}-${Date.now()}.webp`,
      parents: [env.driveFolderId],
      mimeType: "image/webp"
    },
    media: {
      mimeType: "image/webp",
      body: Readable.from(optimized)
    },
    fields: "id, webViewLink"
  });
  const id = created.data.id;
  if (!id) throw new Error("Google Drive did not return a file id.");

  await drive.permissions.create({
    fileId: id,
    requestBody: { role: "reader", type: "anyone" }
  });

  return {
    storageId: id,
    url: `https://drive.google.com/uc?export=view&id=${id}`
  };
}

export async function deleteFromDrive(urlOrId: string) {
  const fileId = urlOrId.match(/id=([^&]+)/)?.[1] || urlOrId;
  if (!fileId) return;
  const drive = await driveClient();
  await drive.files.delete({ fileId });
}
