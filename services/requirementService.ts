import { revalidateTag } from "next/cache";
import { REQUIREMENT_HEADERS, SHEETS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { nextId, todayIso } from "@/lib/utils";
import { requirementSchema, requirementUpdateSchema } from "@/schemas/leads";
import type { Requirement } from "@/types";

export async function getRequirements() {
  return (await readSheet(SHEETS.requirements)) as unknown as Requirement[];
}

export async function createRequirement(input: unknown) {
  const rows = await getRequirements();
  const parsed = requirementSchema.parse(input);
  const row: Requirement = {
    RequirementID: nextId(rows.map((item) => item.RequirementID), "REQ", 6),
    DateTime: todayIso(),
    ...parsed,
    Status: "New",
    AssignedTo: "",
    Notes: ""
  };
  await appendSheetRow(SHEETS.requirements, REQUIREMENT_HEADERS, row as unknown as Record<string, unknown>);
  revalidateTag("leads", "max");
  return row;
}

export async function updateRequirement(input: unknown) {
  const parsed = requirementUpdateSchema.parse(input);
  await updateSheetRowById(SHEETS.requirements, REQUIREMENT_HEADERS, "RequirementID", parsed.RequirementID, parsed);
  revalidateTag("leads", "max");
}


