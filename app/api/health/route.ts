import { checkGoogleSheetsConnection } from "@/lib/google/sheets";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "health-check";
  if (!rateLimit(`health:${client}`)) return Response.json({ ok: false, error: "Too many checks. Try again shortly." }, { status: 429 });

  const health = await checkGoogleSheetsConnection();
  return Response.json({
    ok: health.ok,
    spreadsheetReachable: health.spreadsheetReachable || false,
    propertyRowsRead: "propertyRowsRead" in health ? health.propertyRowsRead : 0,
    tabs: "sheetChecks" in health ? health.sheetChecks.map(({ tab, ok }) => ({ tab, ok })) : [],
    error: health.configuration?.privateKey ? health.error || null : "Google Sheets configuration is incomplete."
  }, { status: health.ok ? 200 : 503 });
}
