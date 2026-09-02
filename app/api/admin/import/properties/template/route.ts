import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { propertyTemplateWorkbook } from "@/services/importExportService";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const buffer = await propertyTemplateWorkbook();
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": "attachment; filename=kalpavruksha-property-import-template.xlsx"
    }
  });
}


