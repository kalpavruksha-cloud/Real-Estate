import { unstable_cache as cache, revalidateTag } from "next/cache";
import { SETTINGS_HEADERS, SHEETS } from "@/lib/constants";
import { env } from "@/lib/config";
import { clearAndWriteSheet, readSheet } from "@/lib/google/sheets";
import { settingsSchema } from "@/schemas/lookups";
import type { SiteSettings } from "@/types";

const defaults: SiteSettings = {
  BusinessName: "Kalpavruksha Real Estate",
  Phone: env.businessPhone || "+91-8792991762",
  WhatsApp: env.whatsappNumber || "+91-8792991762",
  Email: process.env.BUSINESS_EMAIL || "re.kalpavrukshawealth.com",
  Address: process.env.BUSINESS_ADDRESS || "Near beldale petrol pump, Gumpa, Bidar-585403",
  DefaultCity: "Bidar",
  LocationPrivacy: "Approximate",
  ShowSoldProperties: "No",
  ShowRentedProperties: "No",
  DefaultSEO_Title: "Kalpavruksha Real Estate",
  DefaultSEO_Description: "Find trusted sale and rental properties with Kalpavruksha Real Estate."
};

async function getSettingsFresh(): Promise<SiteSettings> {
  const rows = await readSheet(SHEETS.settings);
  const sheetValues = Object.fromEntries(rows.filter((row) => row.Key && row.Value).map((row) => [row.Key, row.Value]));
  return settingsSchema.parse({ ...defaults, ...sheetValues });
}

export const getSettings = cache(getSettingsFresh, ["settings"], { revalidate: 300, tags: ["settings"] });

export async function updateSettings(settings: SiteSettings) {
  const parsed = settingsSchema.parse(settings);
  const rows = Object.entries(parsed).map(([Key, Value]) => ({ Key, Value, Notes: "" }));
  await clearAndWriteSheet(SHEETS.settings, SETTINGS_HEADERS, rows);
  revalidateTag("settings", "max");
}