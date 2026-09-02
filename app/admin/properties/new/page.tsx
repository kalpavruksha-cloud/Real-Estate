import { createPropertyAction } from "@/app/admin/actions";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getAmenities, getCategories, getLocations } from "@/services/lookupService";

export default async function NewPropertyPage() {
  const [categories, locations, amenities] = await Promise.all([getCategories(), getLocations(), getAmenities()]);
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-black">Add Property</h1>
      <PropertyForm action={createPropertyAction} categories={categories} locations={locations} amenities={amenities} />
    </div>
  );
}
