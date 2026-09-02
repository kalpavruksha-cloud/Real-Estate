import { z } from "zod";
import { PUBLISHED_VALUES } from "@/lib/constants";

export const lookupSchema = z.object({
  ID: z.string().trim().optional().default(""),
  Name: z.string().trim().min(1, "Required"),
  Category: z.string().trim().default(""),
  City: z.string().trim().default(""),
  Locality: z.string().trim().default(""),
  Active: z.enum(PUBLISHED_VALUES).default("Yes"),
  DisplayOrder: z.string().trim().default("100"),
  Notes: z.string().trim().default("")
});

export const settingsSchema = z.object({
  BusinessName: z.string().trim().min(1).default("Kalpavruksha Real Estate"),
  Phone: z.string().trim().default(""),
  WhatsApp: z.string().trim().default(""),
  Email: z.string().trim().default(""),
  Address: z.string().trim().default(""),
  DefaultCity: z.string().trim().default(""),
  LocationPrivacy: z.string().trim().default("Approximate"),
  ShowSoldProperties: z.enum(PUBLISHED_VALUES).default("No"),
  ShowRentedProperties: z.enum(PUBLISHED_VALUES).default("No"),
  DefaultSEO_Title: z.string().trim().default("Kalpavruksha Real Estate"),
  DefaultSEO_Description: z.string().trim().default("Find trusted sale and rental properties with Kalpavruksha Real Estate."),
  Instagram: z.string().trim().default(""),
  Facebook: z.string().trim().default(""),
  YouTube: z.string().trim().default("")
});
