import { EnquiryTable } from "@/components/admin/LeadTables";
import { getEnquiries } from "@/services/enquiryService";

export default async function EnquiriesPage() {
  const rows = await getEnquiries();
  return <div className="grid gap-5"><h1 className="text-3xl font-black">Enquiries</h1><EnquiryTable rows={rows} /></div>;
}
