import { revalidateTag } from "next/cache";
import { ENQUIRY_HEADERS, SHEETS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { nextId, todayIso } from "@/lib/utils";
import { enquirySchema, enquiryUpdateSchema } from "@/schemas/leads";
import type { Enquiry } from "@/types";

export async function getEnquiries() {
  return (await readSheet(SHEETS.enquiries)) as unknown as Enquiry[];
}

export async function createEnquiry(input: unknown) {
  const rows = await getEnquiries();
  const parsed = enquirySchema.parse(input);
  const row: Enquiry = {
    EnquiryID: nextId(rows.map((item) => item.EnquiryID), "ENQ", 6),
    DateTime: todayIso(),
    ...parsed,
    Status: "New",
    AssignedTo: "",
    NextFollowUp: "",
    Notes: ""
  };
  await appendSheetRow(SHEETS.enquiries, ENQUIRY_HEADERS, row as unknown as Record<string, unknown>);
  revalidateTag("leads", "max");
  return row;
}

export async function updateEnquiry(input: unknown) {
  const parsed = enquiryUpdateSchema.parse(input);
  await updateSheetRowById(SHEETS.enquiries, ENQUIRY_HEADERS, "EnquiryID", parsed.EnquiryID, parsed);
  revalidateTag("leads", "max");
}


