import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { createOwnerLead } from "@/services/ownerLeadService";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "api";
  if (!rateLimit(ip)) return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
  try {
    const row = await createOwnerLead(await request.json());
    return NextResponse.json({ ok: true, id: row.OwnerLeadID });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Submission failed." }, { status: 400 });
  }
}
