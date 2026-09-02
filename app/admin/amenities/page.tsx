import { LookupManager } from "@/components/admin/LookupManager";
import { getAllLookup } from "@/services/lookupService";

export default async function AmenitiesPage() {
  return <LookupManager title="Amenities" tab="AMENITIES" rows={await getAllLookup("AMENITIES")} />;
}
