import { unstable_cache as cache, revalidateTag } from "next/cache";
import { SHEETS } from "@/lib/constants";
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

const lookupStorage = {
  LOCATIONS: {
    headers: ["LocationID", "City", "Locality", "State", "Country", "Active", "DisplayOrder"] as const,
    idColumn: "LocationID",
    prefix: "LOC"
  },
  CATEGORIES: {
    headers: ["TypeID", "Category", "PropertyType", "Active", "DisplayOrder", "Notes"] as const,
    idColumn: "TypeID",
    prefix: "TYP"
  },
  AMENITIES: {
    headers: ["AmenityID", "Amenity", "Category", "Active", "DisplayOrder"] as const,
    idColumn: "AmenityID",
    prefix: "AMN"
  }
} as const;

function fromSheetRow(tab: keyof typeof lookupStorage, row: Record<string, string>): LookupOption {
  if (tab === "LOCATIONS") {
    return {
      ID: row.LocationID || "",
      Name: row.Locality || row.City || "",
      City: row.City || "",
      Locality: row.Locality || "",
      Active: (row.Active || "Yes") as LookupOption["Active"],
      DisplayOrder: row.DisplayOrder || "100",
      Notes: ""
    };
  }
  if (tab === "CATEGORIES") {
    return {
      ID: row.TypeID || "",
      Name: row.PropertyType || "",
      Category: row.Category || "",
      Active: (row.Active || "Yes") as LookupOption["Active"],
      DisplayOrder: row.DisplayOrder || "100",
      Notes: row.Notes || ""
    };
  }
  return {
    ID: row.AmenityID || "",
    Name: row.Amenity || "",
    Category: row.Category || "",
    Active: (row.Active || "Yes") as LookupOption["Active"],
    DisplayOrder: row.DisplayOrder || "100",
    Notes: ""
  };
}

function toSheetRow(tab: keyof typeof lookupStorage, row: LookupOption) {
  if (tab === "LOCATIONS") {
    return {
      LocationID: row.ID,
      City: row.City || row.Name,
      Locality: row.Locality || "",
      State: "",
      Country: "India",
      Active: row.Active,
      DisplayOrder: row.DisplayOrder
    };
  }
  if (tab === "CATEGORIES") {
    return {
      TypeID: row.ID,
      Category: row.Category || "",
      PropertyType: row.Name,
      Active: row.Active,
      DisplayOrder: row.DisplayOrder,
      Notes: row.Notes || ""
    };
  }
  return {
    AmenityID: row.ID,
    Amenity: row.Name,
    Category: row.Category || "",
    Active: row.Active,
    DisplayOrder: row.DisplayOrder
  };
}

async function getLookupRows(tab: keyof typeof lookupStorage) {
  return (await readSheet(tab)).map((row) => fromSheetRow(tab, row)).filter((row) => row.ID && row.Name);
}

function sortActive(rows: LookupOption[]) {
  return rows
    .filter((row) => row.Active !== "No")
    .sort((a, b) => Number(a.DisplayOrder || 100) - Number(b.DisplayOrder || 100) || a.Name.localeCompare(b.Name));
}

function withFallback(rows: LookupOption[], fallback: LookupOption[]) {
  const activeRows = sortActive(rows);
  return activeRows.length ? activeRows : fallback;
}

export const getLocations = cache(async () => withFallback(await getLookupRows(SHEETS.locations), fallbackLocations), ["locations"], { revalidate: 300, tags: ["lookups"] });
export const getCategories = cache(async () => withFallback(await getLookupRows(SHEETS.categories), fallbackCategories), ["categories"], { revalidate: 300, tags: ["lookups"] });
export const getAmenities = cache(async () => withFallback(await getLookupRows(SHEETS.amenities), fallbackAmenities), ["amenities"], { revalidate: 300, tags: ["lookups"] });

export async function getAllLookup(tab: "LOCATIONS" | "CATEGORIES" | "AMENITIES") {
  return getLookupRows(tab);
}

export async function saveLookup(tab: "LOCATIONS" | "CATEGORIES" | "AMENITIES", data: FormData) {
  const parsed = lookupSchema.parse(Object.fromEntries(data));
  const rows = await readSheet(tab);
  const storage = lookupStorage[tab];
  const currentIds = rows.map((row) => row[storage.idColumn]);
  const normalized = {
    ...parsed,
    ID: parsed.ID || nextId(currentIds, storage.prefix, 3)
  } as LookupOption;
  const sheetRow = toSheetRow(tab, normalized);
  if (parsed.ID) {
    await updateSheetRowById(tab, storage.headers, storage.idColumn, parsed.ID, sheetRow);
  } else {
    await appendSheetRow(tab, storage.headers, sheetRow);
  }
  revalidateTag("lookups", "max");
}
