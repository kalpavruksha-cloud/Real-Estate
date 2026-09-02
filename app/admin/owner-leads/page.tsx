import { OwnerLeadTable } from "@/components/admin/LeadTables";
import { getOwnerLeads } from "@/services/ownerLeadService";

export default async function OwnerLeadsPage() {
  const rows = await getOwnerLeads();
  return <div className="grid gap-5"><h1 className="text-3xl font-black">Owner Leads</h1><OwnerLeadTable rows={rows} /></div>;
}
