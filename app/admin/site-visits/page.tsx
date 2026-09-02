import { VisitTable } from "@/components/admin/LeadTables";
import { getSiteVisits } from "@/services/siteVisitService";

export default async function SiteVisitsPage() {
  const rows = await getSiteVisits();
  return <div className="grid gap-5"><h1 className="text-3xl font-black">Site Visits</h1><VisitTable rows={rows} /></div>;
}
