import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { parsePropertyImport } from "@/services/importExportService";

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Upload a CSV or XLSX file." }, { status: 400 });
  try {
    const rows = await parsePropertyImport(file);
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import preview failed." }, { status: 400 });
  }
}
