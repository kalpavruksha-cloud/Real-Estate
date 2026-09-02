import { LookupManager } from "@/components/admin/LookupManager";
import { getAllLookup } from "@/services/lookupService";

export default async function CategoriesPage() {
  return <LookupManager title="Categories and Property Types" tab="CATEGORIES" rows={await getAllLookup("CATEGORIES")} />;
}
