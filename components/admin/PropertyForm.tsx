import { PROPERTY_STATUSES } from "@/lib/constants";
import type { Property, LookupOption } from "@/types";

export function PropertyForm({
  property,
  action,
  categories,
  locations,
  amenities
}: {
  property?: Property | null;
  action: (form: FormData) => Promise<void>;
  categories: LookupOption[];
  locations: LookupOption[];
  amenities: LookupOption[];
}) {
  const p = property;
  return (
    <form action={action} className="grid gap-6">
      {p?.PropertyID ? <input type="hidden" name="PropertyID" value={p.PropertyID} /> : null}
      <Section title="Basic Information">
        <Input name="Title" label="Title" value={p?.Title} required />
        <Select name="Purpose" label="Purpose" value={p?.Purpose} options={["Sale", "Rent"]} />
        <Select name="Category" label="Category" value={p?.Category} options={["Residential", "Commercial", "Land"]} />
        <Select name="PropertyType" label="Property Type" value={p?.PropertyType} options={["", ...categories.map((item) => item.Name)]} />
        <Input name="Price" label="Price" value={String(p?.Price ?? "")} type="number" required />
        <Select name="Negotiable" label="Negotiable" value={p?.Negotiable} options={["No", "Yes"]} />
      </Section>
      <Section title="Location">
        <Select name="City" label="City" value={p?.City} options={["", ...Array.from(new Set(locations.map((item) => item.City || item.Name).filter(Boolean)))]} />
        <Input name="Locality" label="Locality" value={p?.Locality} required />
        <Input name="Address" label="Address" value={p?.Address} />
        <Input name="Latitude" label="Latitude" value={p?.Latitude} />
        <Input name="Longitude" label="Longitude" value={p?.Longitude} />
      </Section>
      <Section title="Area and Configuration">
        <Input name="PlotArea" label="Plot Area" value={p?.PlotArea} />
        <Input name="BuiltupArea" label="Built-up Area" value={p?.BuiltupArea} />
        <Input name="AreaUnit" label="Area Unit" value={p?.AreaUnit || "sq ft"} />
        <Input name="Bedrooms" label="Bedrooms" value={p?.Bedrooms} />
        <Input name="Bathrooms" label="Bathrooms" value={p?.Bathrooms} />
        <Input name="Balconies" label="Balconies" value={p?.Balconies} />
        <Input name="Floors" label="Floors" value={p?.Floors} />
        <Input name="FloorNumber" label="Floor Number" value={p?.FloorNumber} />
      </Section>
      <Section title="Property Information">
        <Input name="Facing" label="Facing" value={p?.Facing} />
        <Input name="Furnishing" label="Furnishing" value={p?.Furnishing} />
        <Input name="Parking" label="Parking" value={p?.Parking} />
        <Input name="PropertyAge" label="Property Age" value={p?.PropertyAge} />
        <Input name="PossessionStatus" label="Possession Status" value={p?.PossessionStatus} />
        <Input name="OwnershipType" label="Ownership Type" value={p?.OwnershipType} />
      </Section>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="field"><span>Description</span><textarea className="textarea" name="Description" defaultValue={p?.Description} required /></label>
        <label className="field"><span>Highlights</span><textarea className="textarea" name="Highlights" defaultValue={p?.Highlights} /></label>
      </div>
      <div className="card p-5">
        <h2 className="mb-4 text-xl font-black">Amenities</h2>
        <div className="grid gap-2 md:grid-cols-3">
          {amenities.map((item) => (
            <label className="flex items-center gap-2 text-sm" key={item.ID}>
              <input type="checkbox" name="amenity-box" defaultChecked={p?.Amenities?.includes(item.Name)} value={item.Name} /> {item.Name}
            </label>
          ))}
        </div>
        <input className="input mt-4" name="Amenities" defaultValue={p?.Amenities} placeholder="Comma separated amenities" />
      </div>
      <Section title="Marketing, SEO, and Internal">
        <Input name="Slug" label="URL Slug" value={p?.Slug} />
        <Select name="Featured" label="Featured" value={p?.Featured} options={["No", "Yes"]} />
        <Select name="Verified" label="Verified" value={p?.Verified} options={["No", "Yes"]} />
        <Select name="Status" label="Status" value={p?.Status} options={[...PROPERTY_STATUSES]} />
        <Select name="Published" label="Published" value={p?.Published} options={["No", "Yes"]} />
        <Input name="MainImage" label="Main Image URL" value={p?.MainImage} />
        <Input name="VideoURL" label="Video URL" value={p?.VideoURL} />
        <Input name="SEO_Title" label="SEO Title" value={p?.SEO_Title} />
        <Input name="SEO_Description" label="SEO Description" value={p?.SEO_Description} />
        <Input name="AssignedAgent" label="Assigned Agent" value={p?.AssignedAgent} />
        <Input name="ContactPhone" label="Contact Phone" value={p?.ContactPhone} />
        <Input name="InternalNotes" label="Internal Notes" value={p?.InternalNotes} />
      </Section>
      <button className="btn btn-primary justify-self-start" type="submit">Save Property</button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-5"><h2 className="mb-4 text-xl font-black">{title}</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div></section>;
}

function Input({ name, label, value = "", type = "text", required = false }: { name: string; label: string; value?: string; type?: string; required?: boolean }) {
  return <label className="field"><span>{label}</span><input className="input" name={name} defaultValue={value} type={type} required={required} /></label>;
}

function Select({ name, label, value = "", options }: { name: string; label: string; value?: string; options: readonly string[] }) {
  return <label className="field"><span>{label}</span><select className="select" name={name} defaultValue={value}>{options.map((option) => <option key={option} value={option}>{option || "Select"}</option>)}</select></label>;
}
