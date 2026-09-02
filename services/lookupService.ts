import { unstable_cache as cache, revalidateTag } from "next/cache";
import { LOOKUP_HEADERS, SHEETS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { nextId } from "@/lib/utils";
import { lookupSchema } from "@/schemas/lookups";
import type { LookupOption } from "@/types";

const fallbackLocations: LookupOption[] = [
  { ID: "LOC-FALLBACK-1", Name: "Bidar", City: "Bidar", Locality: "", Active: "Yes", DisplayOrder: "1" },
  { ID: "LOC-FALLBACK-2", Name: "Gumpa", City: "Bidar", Locality: "Gumpa", Active: "Yes", DisplayOrder: "2" },
  { ID: "LOC-FALLBACK-3", Name: "Beldale", City: "Bidar", Locality: "Beldale", Active: "Yes", DisplayOrder: "3" }
];

const fallbackCategories: LookupOption[] = [
  { ID: "CAT-FALLBACK-1", Name: "Apartment", Category: "Residential", Active: "Yes", DisplayOrder: "1" },
  { ID: "CAT-FALLBACK-2", Name: "Independent House", Category: "Residential", Active: "Yes", DisplayOrder: "2" },
  { ID: "CAT-FALLBACK-3", Name: "Villa", Category: "Residential", Active: "Yes", DisplayOrder: "3" },
  { ID: "CAT-FALLBACK-4", Name: "Residential Plot", Category: "Land", Active: "Yes", DisplayOrder: "4" },
  { ID: "CAT-FALLBACK-5", Name: "Agricultural Land", Category: "Land", Active: "Yes", DisplayOrder: "5" },
  { ID: "CAT-FALLBACK-6", Name: "Commercial Shop", Category: "Commercial", Active: "Yes", DisplayOrder: "6" },
  { ID: "CAT-FALLBACK-7", Name: "Office Space", Category: "Commercial", Active: "Yes", DisplayOrder: "7" },
  { ID: "CAT-FALLBACK-8", Name: "Warehouse", Category: "Commercial", Active: "Yes", DisplayOrder: "8" }
];

const fallbackAmenities: LookupOption[] = [
  { ID: "AMN-FALLBACK-1", Name: "Parking", Active: "Yes", DisplayOrder: "1" },
  { ID: "AMN-FALLBACK-2", Name: "Water Supply", Active: "Yes", DisplayOrder: "2" },
  { ID: "AMN-FALLBACK-3", Name: "Power Backup", Active: "Yes", DisplayOrder: "3" },
  { ID: "AMN-FALLBACK-4", Name: "Security", Active: "Yes", DisplayOrder: "4" }
];

function sortActive(rows: LookupOption[]) {
  return rows
    .filter((row) => row.Active !== "No")
    .sort((a, b) => Number(a.DisplayOrder || 100) - Number(b.DisplayOrder || 100) || a.Name.localeCompare(b.Name));
}

function withFallback(rows: LookupOption[], fallback: LookupOption[]) {
  const activeRows = sortActive(rows);
  return activeRows.length ? activeRows : fallback;
}

export const getLocations = cache(async () => withFallback((await readSheet(SHEETS.locations)) as unknown as LookupOption[], fallbackLocations), ["locations"], { revalidate: 300, tags: ["lookups"] });
export const getCategories = cache(async () => withFallback((await readSheet(SHEETS.categories)) as unknown as LookupOption[], fallbackCategories), ["categories"], { revalidate: 300, tags: ["lookups"] });
export const getAmenities = cache(async () => withFallback((await readSheet(SHEETS.amenities)) as unknown as LookupOption[], fallbackAmenities), ["amenities"], { revalidate: 300, tags: ["lookups"] });

export async function getAllLookup(tab: "LOCATIONS" | "CATEGORIES" | "AMENITIES") {
  return (await readSheet(tab)) as unknown as LookupOption[];
}

export async function saveLookup(tab: "LOCATIONS" | "CATEGORIES" | "AMENITIES", data: FormData) {
  const parsed = lookupSchema.parse(Object.fromEntries(data));
  const rows = await readSheet(tab);
  if (parsed.ID) {
    await updateSheetRowById(tab, LOOKUP_HEADERS, "ID", parsed.ID, parsed);
  } else {
    const prefix = tab === SHEETS.locations ? "LOC" : tab === SHEETS.categories ? "CAT" : "AMN";
    await appendSheetRow(tab, LOOKUP_HEADERS, { ...parsed, ID: nextId(rows.map((row) => row.ID), prefix, 4) });
  }
  revalidateTag("lookups", "max");
}