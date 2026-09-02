import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { createEnquiry } from "@/services/enquiryService";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "api";
  if (!rateLimit(ip)) return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
  try {
    const row = await createEnquiry(await request.json());
    return NextResponse.json({ ok: true, id: row.EnquiryID });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Submission failed." }, { status: 400 });
  }
}
