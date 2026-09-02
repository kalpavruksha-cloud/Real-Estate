import { LookupManager } from "@/components/admin/LookupManager";
import { getAllLookup } from "@/services/lookupService";

export default async function LocationsPage() {
  return <LookupManager title="Locations" tab="LOCATIONS" rows={await getAllLookup("LOCATIONS")} />;
}
