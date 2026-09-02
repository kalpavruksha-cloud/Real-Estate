import Image from "next/image";
import { notFound } from "next/navigation";
import { deleteImageAction, updateImageAction, updatePropertyAction, uploadImagesAction } from "@/app/admin/actions";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getImagesForProperty } from "@/services/imageService";
import { getAmenities, getCategories, getLocations } from "@/services/lookupService";
import { getPropertyById } from "@/services/propertyService";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();
  const [categories, locations, amenities, images] = await Promise.all([getCategories(), getLocations(), getAmenities(), getImagesForProperty(id)]);
  return (
    <div className="grid gap-6">
      <div><h1 className="text-3xl font-black">Edit {property.PropertyID}</h1><p className="text-[#68736d]">Property ID remains permanent when edited.</p></div>
      <PropertyForm property={property} action={updatePropertyAction} categories={categories} locations={locations} amenities={amenities} />
      <section className="card p-5">
        <h2 className="text-2xl font-black">Property Image Manager</h2>
        <form action={uploadImagesAction} className="mt-4 grid gap-3 md:grid-cols-4" encType="multipart/form-data">
          <input type="hidden" name="PropertyID" value={property.PropertyID} />
          <input className="input md:col-span-2" type="file" name="Images" multiple accept="image/jpeg,image/png,image/webp" required />
          <input className="input" name="AltText" placeholder="Alt text" />
          <select className="select" name="ImageType"><option>Gallery</option><option>Main</option></select>
          <button className="btn btn-primary md:col-span-4" type="submit">Upload Images</button>
        </form>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <div className="card overflow-hidden" key={image.ImageID}>
              <div className="relative aspect-[4/3]"><Image src={image.ImageURL} alt={image.AltText} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>
              <form action={updateImageAction} className="grid gap-2 p-3">
                <input type="hidden" name="PropertyID" value={property.PropertyID} />
                <input type="hidden" name="ImageID" value={image.ImageID} />
                <input className="input" name="AltText" defaultValue={image.AltText} placeholder="Alt text" />
                <input className="input" name="ImageOrder" defaultValue={image.ImageOrder} type="number" />
                <select className="select" name="ImageType" defaultValue={image.ImageType}><option>Main</option><option>Gallery</option></select>
                <button className="btn btn-secondary" type="submit">Save Image</button>
              </form>
              <form action={deleteImageAction} className="p-3 pt-0">
                <input type="hidden" name="PropertyID" value={property.PropertyID} />
                <input type="hidden" name="ImageID" value={image.ImageID} />
                <button className="btn btn-secondary w-full" type="submit">Delete Image</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
