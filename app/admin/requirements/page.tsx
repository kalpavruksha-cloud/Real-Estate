import Link from "next/link";
import { RequirementTable } from "@/components/admin/LeadTables";
import { getRequirements } from "@/services/requirementService";

export default async function RequirementsPage() {
  const rows = await getRequirements();
  return <div className="grid gap-5"><div className="flex items-center justify-between"><h1 className="text-3xl font-black">Buyer Requirements</h1><Link className="btn btn-secondary" href="/admin/properties">Find Matching Properties</Link></div><RequirementTable rows={rows} /></div>;
}
