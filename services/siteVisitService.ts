import { revalidateTag } from "next/cache";
import { SHEETS, VISIT_HEADERS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { nextId, todayIso } from "@/lib/utils";
import { siteVisitSchema, siteVisitUpdateSchema } from "@/schemas/leads";
import type { SiteVisit } from "@/types";

export async function getSiteVisits() {
  const rows = await readSheet(SHEETS.visits);
  return rows.filter((row) => row.VisitID).map((row) => ({
    ...row,
    DateTime: row.RequestedAt || row.DateTime || "",
    Name: row.CustomerName || row.Name || "",
    ActualVisitDate: row.ConfirmedDate || row.ActualVisitDate || ""
  })) as unknown as SiteVisit[];
}

export async function createSiteVisit(input: unknown) {
  const rows = await getSiteVisits();
  const parsed = siteVisitSchema.parse(input);
  const row: SiteVisit = {
    VisitID: nextId(rows.map((item) => item.VisitID), "VIS", 6),
    DateTime: todayIso(),
    ...parsed,
    Status: "Requested",
    AssignedTo: "",
    ActualVisitDate: "",
    Notes: ""
  };
  await appendSheetRow(SHEETS.visits, VISIT_HEADERS, {
    ...row,
    RequestedAt: row.DateTime,
    CustomerName: row.Name,
    ConfirmedDate: row.ActualVisitDate,
    ConfirmedTime: "",
    Outcome: "",
    Source: "Website"
  });
  revalidateTag("leads", "max");
  return row;
}

export async function updateSiteVisit(input: unknown) {
  const parsed = siteVisitUpdateSchema.parse(input);
  await updateSheetRowById(SHEETS.visits, VISIT_HEADERS, "VisitID", parsed.VisitID, {
    ...parsed,
    ConfirmedDate: parsed.ActualVisitDate
  });
  revalidateTag("leads", "max");
}


