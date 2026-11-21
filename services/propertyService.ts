import { revalidateTag, unstable_cache as cache } from "next/cache";
import { PROPERTY_HEADERS, SHEETS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { formatPrice, nextId, slugify, todayIso } from "@/lib/utils";
import { propertySchema } from "@/schemas/property";
import { getImagesForProperty } from "@/services/imageService";
import { getSettings } from "@/services/settingsService";
import type { Property, PublicProperty } from "@/types";

function normalizeProperty(row: Record<string, unknown>): Property | null {
  const title = String(row.Title || "").trim();
  if (!title) return null;
  const propertyId = String(row.PropertyID || "").trim();
  const city = String(row.City || "").trim();
  const locality = String(row.Locality || "").trim();
  const price = Number(row.Price || 0);
  const parsed = propertySchema.safeParse({
    ...row,
    PropertyID: propertyId,
    Slug: String(row.Slug || "").trim() || `${slugify(title)}-${propertyId.toLowerCase()}`,
    Price: price,
    PriceDisplay: String(row.PriceDisplay || "").trim() || formatPrice(price),
    Negotiable: row.Negotiable || "No",
    Description: String(row.Description || "").trim() || `${title} in ${locality}, ${city}. Contact Kalpavruksha Real Estate for details.`,
    Featured: row.Featured || "No",
    Verified: row.Verified || "No",
    Status: row.Status || "Available",
    MainImage: row.MainImage || "",
    VideoURL: row.VideoURL || "",
    Published: row.Published || "No"
  });
  if (!parsed.success) {
    console.error(`[properties] Skipping invalid row ${propertyId || "without an ID"}.`, parsed.error.flatten().fieldErrors);
    return null;
  }
  return parsed.data as Property;
}

function isCompletePropertyRow(row: Record<string, unknown>) {
  return Boolean(String(row.Title || "").trim());
}

async function getPropertiesFresh() {
  const rows = await readSheet(SHEETS.properties);
  return rows.map(normalizeProperty).filter((property): property is Property => property !== null);
}

export const getProperties = cache(getPropertiesFresh, ["properties"], { revalidate: 30, tags: ["properties"] });

export async function getAdminProperties() {
  return getPropertiesFresh();
}

export async function getPropertyById(id: string) {
  return (await getPropertiesFresh()).find((property) => property.PropertyID === id) || null;
}

export async function getPropertyBySlug(slug: string): Promise<PublicProperty | null> {
  const property = (await getPublishedProperties()).find((item) => item.Slug === slug || item.PropertyID === slug);
  if (!property) return null;
  const images = await getImagesForProperty(property.PropertyID);
  return { ...property, Images: images };
}

export async function getPublishedProperties() {
  const settings = await getSettings();
  const properties = await getProperties();
  return properties.filter((property) => {
    if (property.Published !== "Yes" || property.Status === "Inactive") return false;
    if (property.Status === "Sold" && settings.ShowSoldProperties !== "Yes") return false;
    if (property.Status === "Rented" && settings.ShowRentedProperties !== "Yes") return false;
    return true;
  });
}

export async function createProperty(form: FormData, createdBy: string) {
  const sheetRows = await readSheet(SHEETS.properties);
  const data = Object.fromEntries(form);
  const placeholder = sheetRows.find((row) => row.PropertyID && !isCompletePropertyRow(row));
  const propertyId = String(data.PropertyID || placeholder?.PropertyID || nextId(sheetRows.map((row) => row.PropertyID), "KRE", 4));
  const parsed = propertySchema.parse({
    ...data,
    PropertyID: propertyId,
    Slug: data.Slug || "",
    PriceDisplay: data.PriceDisplay || "",
    DateAdded: todayIso(),
    DateUpdated: todayIso(),
    CreatedBy: createdBy
  });
  const slug = parsed.Slug || `${slugify(parsed.Title)}-${parsed.PropertyID.toLowerCase()}`;
  const row = {
    ...parsed,
    Slug: slug,
    PriceDisplay: parsed.PriceDisplay || formatPrice(parsed.Price),
    SEO_Title: parsed.SEO_Title || `${parsed.Title} in ${parsed.Locality}, ${parsed.City} | Kalpavruksha Real Estate`,
    SEO_Description:
      parsed.SEO_Description || `${parsed.PropertyType} for ${parsed.Purpose.toLowerCase()} in ${parsed.Locality}, ${parsed.City}. Contact Kalpavruksha Real Estate for details.`
  };
  const existingRow = sheetRows.some((item) => item.PropertyID === row.PropertyID);
  if (existingRow) {
    await updateSheetRowById(SHEETS.properties, PROPERTY_HEADERS, "PropertyID", row.PropertyID, row);
  } else {
    await appendSheetRow(SHEETS.properties, PROPERTY_HEADERS, row);
  }
  revalidateTag("properties", "max");
  return row as Property;
}

export async function updateProperty(form: FormData) {
  const data = Object.fromEntries(form);
  const parsed = propertySchema.parse({
    ...data,
    DateUpdated: todayIso(),
    PriceDisplay: data.PriceDisplay || formatPrice(Number(data.Price || 0))
  });
  await updateSheetRowById(SHEETS.properties, PROPERTY_HEADERS, "PropertyID", parsed.PropertyID, parsed);
  revalidateTag("properties", "max");
  return parsed as Property;
}

export async function archiveProperty(id: string) {
  await updateSheetRowById(SHEETS.properties, PROPERTY_HEADERS, "PropertyID", id, {
    Status: "Inactive",
    Published: "No",
    DateUpdated: todayIso()
  });
  revalidateTag("properties", "max");
}

export async function duplicateProperty(id: string, createdBy: string) {
  const property = await getPropertyById(id);
  if (!property) throw new Error("Property not found.");
  const rows = await getAdminProperties();
  const newId = nextId(rows.map((row) => row.PropertyID), "KRE", 4);
  const copy = {
    ...property,
    PropertyID: newId,
    Title: `${property.Title} Copy`,
    Slug: `${slugify(property.Title)}-${newId.toLowerCase()}`,
    Published: "No",
    Featured: "No",
    DateAdded: todayIso(),
    DateUpdated: todayIso(),
    CreatedBy: createdBy
  };
  await appendSheetRow(SHEETS.properties, PROPERTY_HEADERS, copy);
  revalidateTag("properties", "max");
  return copy;
}

export function filterProperties(properties: Property[], params: URLSearchParams) {
  let filtered = [...properties];
  const checks = ["purpose", "category", "type", "city", "locality", "facing", "furnishing", "possession"] as const;
  for (const key of checks) {
    const value = params.get(key);
    if (!value) continue;
    filtered = filtered.filter((property) => {
      const field =
        key === "purpose" ? property.Purpose :
        key === "category" ? property.Category :
        key === "type" ? property.PropertyType :
        key === "city" ? property.City :
        key === "locality" ? property.Locality :
        key === "facing" ? property.Facing :
        key === "furnishing" ? property.Furnishing :
        property.PossessionStatus;
      return slugify(field) === slugify(value);
    });
  }
  if (params.get("verified") === "yes") filtered = filtered.filter((property) => property.Verified === "Yes");
  const min = Number(params.get("min") || 0);
  const max = Number(params.get("max") || 0);
  if (min) filtered = filtered.filter((property) => property.Price >= min);
  if (max) filtered = filtered.filter((property) => property.Price <= max);
  const bedrooms = params.get("bedrooms");
  if (bedrooms) filtered = filtered.filter((property) => Number(property.Bedrooms || 0) >= Number(bedrooms));
  const areaMin = Number(params.get("areaMin") || 0);
  if (areaMin) filtered = filtered.filter((property) => Number(property.BuiltupArea || property.PlotArea || 0) >= areaMin);
  const sort = params.get("sort") || "newest";
  if (sort === "price-asc") filtered.sort((a, b) => a.Price - b.Price);
  if (sort === "price-desc") filtered.sort((a, b) => b.Price - a.Price);
  if (sort === "area") filtered.sort((a, b) => Number(b.BuiltupArea || b.PlotArea || 0) - Number(a.BuiltupArea || a.PlotArea || 0));
  if (sort === "featured") filtered.sort((a, b) => (b.Featured === "Yes" ? 1 : 0) - (a.Featured === "Yes" ? 1 : 0));
  if (sort === "newest") filtered.sort((a, b) => Date.parse(b.DateAdded || "") - Date.parse(a.DateAdded || ""));
  return filtered;
}

