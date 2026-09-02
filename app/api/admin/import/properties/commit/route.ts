import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createProperty } from "@/services/propertyService";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const rows = Array.isArray(body.rows) ? body.rows : [];
  let count = 0;
  try {
    for (const row of rows) {
      const form = new FormData();
      Object.entries({ ...row, Published: row.Published === "Yes" ? "Yes" : "No" }).forEach(([key, value]) => form.set(key, String(value ?? "")));
      await createProperty(form, session.email);
      count += 1;
    }
    return NextResponse.json({ message: `${count} valid properties imported.` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import failed." }, { status: 400 });
  }
}
