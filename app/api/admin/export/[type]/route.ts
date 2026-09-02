import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { PROPERTY_HEADERS } from "@/lib/constants";
import { rowsToCsv } from "@/services/importExportService";
import { getAdminProperties } from "@/services/propertyService";
import { getEnquiries } from "@/services/enquiryService";
import { getSiteVisits } from "@/services/siteVisitService";
import { getRequirements } from "@/services/requirementService";
import { getOwnerLeads } from "@/services/ownerLeadService";

export async function GET(_request: Request, { params }: { params: Promise<{ type: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { type } = await params;
  const rows =
    type === "properties" ? await getAdminProperties() :
    type === "enquiries" ? await getEnquiries() :
    type === "site-visits" ? await getSiteVisits() :
    type === "requirements" ? await getRequirements() :
    type === "owner-leads" ? await getOwnerLeads() :
    null;
  if (!rows) return NextResponse.json({ error: "Unknown export type." }, { status: 404 });
  const csv = rowsToCsv(rows as unknown as Record<string, unknown>[], type === "properties" ? PROPERTY_HEADERS : undefined);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename=kalpavruksha-${type}.csv`
    }
  });
}
