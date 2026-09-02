import { SlidersHorizontal } from "lucide-react";
import { getCategories, getLocations } from "@/services/lookupService";

export async function PropertyFilters({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const [locations, categories] = await Promise.all([getLocations(), getCategories()]);
  const getValue = (key: string) => typeof searchParams[key] === "string" ? searchParams[key] : "";
  return (
    <details className="card p-4 md:open:block" open>
      <summary className="mb-4 flex cursor-pointer items-center gap-2 font-black md:pointer-events-none"><SlidersHorizontal size={18} /> Filters</summary>
      <form className="grid gap-3" action="/properties">
        <Select name="purpose" label="Buy / Rent" value={getValue("purpose")} options={["", "Sale", "Rent"]} />
        <Select name="category" label="Category" value={getValue("category")} options={["", "Residential", "Commercial", "Land"]} />
        <Select name="type" label="Property Type" value={getValue("type")} options={["", ...categories.map((item) => item.Name)]} />
        <Select name="city" label="City" value={getValue("city")} options={["", ...Array.from(new Set(locations.map((item) => item.City || item.Name).filter(Boolean)))]} />
        <input className="input" name="locality" defaultValue={getValue("locality")} placeholder="Locality" />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" name="min" defaultValue={getValue("min")} placeholder="Min price" />
          <input className="input" name="max" defaultValue={getValue("max")} placeholder="Max price" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" name="bedrooms" defaultValue={getValue("bedrooms")} placeholder="Bedrooms" />
          <input className="input" name="areaMin" defaultValue={getValue("areaMin")} placeholder="Area min" />
        </div>
        <input className="input" name="facing" defaultValue={getValue("facing")} placeholder="Facing" />
        <input className="input" name="furnishing" defaultValue={getValue("furnishing")} placeholder="Furnishing" />
        <input className="input" name="possession" defaultValue={getValue("possession")} placeholder="Possession status" />
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" name="verified" value="yes" defaultChecked={getValue("verified") === "yes"} /> Verified only
        </label>
        <Select name="sort" label="Sort" value={getValue("sort") || "newest"} options={["newest", "price-asc", "price-desc", "area", "featured"]} />
        <button className="btn btn-primary" type="submit">Apply Filters</button>
      </form>
    </details>
  );
}

function Select({ name, label, value, options }: { name: string; label: string; value: string; options: string[] }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="select" name={name} defaultValue={value}>
        {options.map((option) => <option key={option || "any"} value={option}>{option || "Any"}</option>)}
      </select>
    </label>
  );
}
