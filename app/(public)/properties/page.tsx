import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CheckCircle2, MapPin, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/public/PropertyCard";
import { PropertyFilters } from "@/components/public/PropertyFilters";
import { filterProperties, getPublishedProperties } from "@/services/propertyService";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse Kalpavruksha Real Estate properties by purpose, category, location, budget, area, and verified status."
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => typeof value === "string" && urlParams.set(key, value));
  const all = await getPublishedProperties();
  const properties = filterProperties(all, urlParams);
  const activeFilters = Array.from(urlParams.entries()).filter(([, value]) => value).length;
  return (
    <main className="portal-shell">
      <section className="bg-[#102f23] py-10 text-white">
        <div className="container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="motion-rise">
            <p className="badge badge-glass"><SlidersHorizontal size={14} /> Property Portal</p>
            <h1 className="mt-4 text-4xl font-black md:text-5xl">Explore Live Listings</h1>
            <p className="mt-3 max-w-2xl text-white/72">Filter active Kalpavruksha listings by purpose, city, category, price, area, and verified status.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 motion-rise-delay">
            <MiniStat icon={<Building2 size={18} />} label="Listings" value={all.length} />
            <MiniStat icon={<CheckCircle2 size={18} />} label="Matched" value={properties.length} />
            <MiniStat icon={<MapPin size={18} />} label="Filters" value={activeFilters} />
          </div>
        </div>
      </section>
      <section className="section portal-grid">
        <div className="container grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start"><PropertyFilters searchParams={params} /></aside>
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ded8ca] bg-white/80 p-4 shadow-sm backdrop-blur">
              <div><p className="text-sm font-black uppercase text-[#b9892f]">Search Results</p><p className="font-black text-[#123326]">{properties.length} matching listing{properties.length === 1 ? "" : "s"}</p></div>
              <div className="flex gap-2"><Link className="btn btn-secondary" href="/property-requirement">Post Requirement</Link><Link className="btn btn-primary" href="/list-property">List Property</Link></div>
            </div>
            {properties.length ? (
              <div className="grid gap-5 xl:grid-cols-2">{properties.map((property) => <PropertyCard key={property.PropertyID} property={property} />)}</div>
            ) : (
              <div className="card flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <p className="badge badge-gold">No match</p>
                <h2 className="mt-4 text-2xl font-black text-[#123326]">No properties match these filters</h2>
                <p className="mt-2 max-w-md text-[#68736d]">Submit a buyer requirement and the team can follow up when a suitable property is available.</p>
                <Link className="btn btn-primary mt-5" href="/property-requirement">Submit Requirement</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="portal-panel rounded-lg p-4 text-center"><div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-[#f1bd55]">{icon}</div><p className="text-2xl font-black">{value}</p><p className="text-xs font-black uppercase text-white/65">{label}</p></div>;
}