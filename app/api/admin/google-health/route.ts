import { getSession } from "@/lib/auth/session";
import { checkGoogleSheetsConnection } from "@/lib/google/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const health = await checkGoogleSheetsConnection();
  return Response.json(health, { status: health.ok ? 200 : 503 });
}
