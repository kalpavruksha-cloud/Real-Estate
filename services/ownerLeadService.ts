import { revalidateTag } from "next/cache";
import { OWNER_HEADERS, SHEETS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { nextId, todayIso } from "@/lib/utils";
import { ownerLeadSchema, ownerLeadUpdateSchema } from "@/schemas/leads";
import type { OwnerLead } from "@/types";

export async function getOwnerLeads() {
  const rows = await readSheet(SHEETS.ownerLeads);
  return rows.filter((row) => row.OwnerLeadID).map((row) => ({
    ...row,
    SellRent: row.Intent || row.SellRent || "",
    ImageURLs: row.ImageLinks || row.ImageURLs || ""
  })) as unknown as OwnerLead[];
}

export async function createOwnerLead(input: unknown, imageUrls = "") {
  const rows = await getOwnerLeads();
  const parsed = ownerLeadSchema.parse(input);
  const row: OwnerLead = {
    OwnerLeadID: nextId(rows.map((item) => item.OwnerLeadID), "OWN", 6),
    DateTime: todayIso(),
    ...parsed,
    ImageURLs: imageUrls,
    Status: "New",
    AssignedTo: "",
    Notes: ""
  };
  await appendSheetRow(SHEETS.ownerLeads, OWNER_HEADERS, {
    ...row,
    Intent: row.SellRent,
    ImageLinks: row.ImageURLs
  });
  revalidateTag("leads", "max");
  return row;
}

export async function updateOwnerLead(input: unknown) {
  const parsed = ownerLeadUpdateSchema.parse(input);
  await updateSheetRowById(SHEETS.ownerLeads, OWNER_HEADERS, "OwnerLeadID", parsed.OwnerLeadID, parsed);
  revalidateTag("leads", "max");
}



export async function convertOwnerLeadToProperty(ownerLeadId: string, createdBy: string) {
  const lead = (await getOwnerLeads()).find((item) => item.OwnerLeadID === ownerLeadId);
  if (!lead) throw new Error("Owner lead not found.");
  const form = new FormData();
  const firstImage = lead.ImageURLs.split(",").map((item) => item.trim()).filter(Boolean)[0] || "";
  const fields: Record<string, string> = {
    Title: `${lead.PropertyType || lead.Category} for ${lead.SellRent} in ${lead.Locality}`,
    Purpose: lead.SellRent,
    Category: lead.Category,
    PropertyType: lead.PropertyType || lead.Category,
    Price: lead.ExpectedPrice || "0",
    Negotiable: "Yes",
    City: lead.City,
    Locality: lead.Locality,
    Address: lead.Address,
    PlotArea: lead.PlotArea,
    BuiltupArea: lead.BuiltupArea,
    AreaUnit: lead.AreaUnit,
    Description: lead.Description || "Owner submitted property. Verify details before publishing.",
    Highlights: "",
    Amenities: "",
    Featured: "No",
    Verified: "No",
    Status: "Available",
    Published: "No",
    MainImage: firstImage,
    VideoURL: "",
    AssignedAgent: lead.AssignedTo,
    ContactPhone: lead.Phone,
    InternalNotes: `Converted from ${lead.OwnerLeadID}. Owner: ${lead.OwnerName}, ${lead.Phone}, ${lead.Email}`
  };
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  const { createProperty } = await import("@/services/propertyService");
  const property = await createProperty(form, createdBy);
  await updateOwnerLead({ OwnerLeadID: ownerLeadId, Status: "Listed", AssignedTo: lead.AssignedTo, Notes: `${lead.Notes || ""} Converted to ${property.PropertyID}`.trim() });
  return property;
}
