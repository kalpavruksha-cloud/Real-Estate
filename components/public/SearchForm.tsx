import { Building2, IndianRupee, MapPin, Search } from "lucide-react";
import { getCategories, getLocations } from "@/services/lookupService";

export async function SearchForm({ compact = false }: { compact?: boolean }) {
  const [locations, categories] = await Promise.all([getLocations(), getCategories()]);
  return (
    <form action="/properties" className={`motion-rise grid gap-3 rounded-lg border border-white/20 bg-white/95 p-3 shadow-2xl ${compact ? "" : "lg:grid-cols-[1fr_1.1fr_1.1fr_1fr_auto]"}`}>
      <label className="field">
        <span>Mode</span>
        <select className="select" name="purpose">
          <option value="">Buy or Rent</option>
          <option value="Sale">Buy</option>
          <option value="Rent">Rent</option>
        </select>
      </label>
      <label className="field">
        <span className="flex items-center gap-1"><MapPin size={13} /> Location</span>
        <select className="select" name="city">
          <option value="">Any city</option>
          {locations.map((item) => <option key={item.ID} value={item.City || item.Name}>{item.City || item.Name}</option>)}
        </select>
      </label>
      <label className="field">
        <span className="flex items-center gap-1"><Building2 size={13} /> Property Type</span>
        <select className="select" name="type">
          <option value="">Any type</option>
          {categories.map((item) => <option key={item.ID} value={item.Name}>{item.Name}</option>)}
        </select>
      </label>
      <label className="field">
        <span className="flex items-center gap-1"><IndianRupee size={13} /> Budget</span>
        <input className="input" name="max" inputMode="numeric" placeholder="Max price" />
      </label>
      <button className="btn btn-accent self-end" type="submit"><Search size={18} /> Search</button>
    </form>
  );
}