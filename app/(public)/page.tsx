import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, CheckCircle2, ClipboardList, Home, MapPin, MessageCircle, Search, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { PropertyCard } from "@/components/public/PropertyCard";
import { SearchForm } from "@/components/public/SearchForm";
import { getPublishedProperties } from "@/services/propertyService";

export default async function HomePage() {
  const properties = await getPublishedProperties();
  const featured = properties.filter((item) => item.Featured === "Yes").slice(0, 6);
  const latest = [...properties].sort((a, b) => Date.parse(b.DateAdded || "") - Date.parse(a.DateAdded || "")).slice(0, 6);
  const saleCount = properties.filter((item) => item.Purpose === "Sale").length;
  const rentCount = properties.filter((item) => item.Purpose === "Rent").length;
  const verifiedCount = properties.filter((item) => item.Verified === "Yes").length;
  const locations = Array.from(new Set(properties.map((item) => item.City).filter(Boolean))).slice(0, 8);

  return (
    <main className="portal-shell">
      <section className="relative overflow-hidden bg-[#102f23] text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(11,36,26,.96)_0%,rgba(18,51,38,.86)_46%,rgba(11,36,26,.55)_100%)]" />
        <div className="container relative grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1.08fr_.92fr]">
          <div className="motion-rise">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="badge badge-glass"><Sparkles size={14} /> Live Property Portal</span>
              <span className="badge badge-glass"><ShieldCheck size={14} /> Verified workflow</span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Search, shortlist, enquire, and schedule visits from one premium property portal.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">A faster public gateway for Kalpavruksha Real Estate customers, powered by the same live property data your admin team manages.</p>
            <div className="mt-8 max-w-5xl">
              <SearchForm />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <QuickLink icon={<Home size={17} />} label="Buy Homes" href="/properties?purpose=Sale&category=Residential" />
              <QuickLink icon={<Building2 size={17} />} label="Commercial" href="/properties?category=Commercial" />
              <QuickLink icon={<MapPin size={17} />} label="Land" href="/properties?category=Land" />
              <QuickLink icon={<ClipboardList size={17} />} label="Post Requirement" href="/property-requirement" />
            </div>
          </div>

          <div className="motion-rise-delay grid gap-4">
            <div className="portal-panel rounded-lg p-5 motion-float">
              <div className="flex items-center justify-between">
                <p className="font-black text-[#f1bd55]">Portal Snapshot</p>
                <Search size={20} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric label="For Sale" value={saleCount} />
                <Metric label="For Rent" value={rentCount} />
                <Metric label="Verified" value={verifiedCount} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ActionCard icon={<SlidersHorizontal />} title="Smart Filters" text="Purpose, budget, city, locality, type, area, furnishing, and verified status." href="/properties" />
              <ActionCard icon={<CalendarDays />} title="Site Visits" text="Customers request visits from property pages and admins follow up from CRM." href="/properties" />
              <ActionCard icon={<MessageCircle />} title="WhatsApp Ready" text="Every listing creates a property-specific WhatsApp enquiry message." href="/properties" />
              <ActionCard icon={<ClipboardList />} title="Buyer Matching" text="Customers can submit requirements when a perfect match is not listed yet." href="/property-requirement" />
            </div>
          </div>
        </div>
      </section>

      <section className="section portal-grid">
        <div className="container">
          <SectionTitle eyebrow="Curated" title="Featured Properties" href="/properties?sort=featured" />
          {featured.length ? <PropertyGrid properties={featured} /> : <EmptyState text="Featured properties will appear here after they are marked Featured and Published in the admin portal." />}
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <SectionTitle eyebrow="Explore" title="Property Categories" href="/properties" />
          <div className="grid gap-4 md:grid-cols-3">
            <CategoryLink icon={<Home />} title="Residential" count={properties.filter((p) => p.Category === "Residential").length} href="/properties?category=Residential" />
            <CategoryLink icon={<Building2 />} title="Commercial" count={properties.filter((p) => p.Category === "Commercial").length} href="/properties?category=Commercial" />
            <CategoryLink icon={<MapPin />} title="Plots and Land" count={properties.filter((p) => p.Category === "Land").length} href="/properties?category=Land" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Newest" title="Latest Properties" href="/properties" />
          {latest.length ? <PropertyGrid properties={latest} /> : <EmptyState text="Published properties from Google Sheets will appear here." />}
        </div>
      </section>

      <section className="section bg-[#0b241a] text-white">
        <div className="container grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="motion-rise">
            <p className="badge badge-glass">Location Index</p>
            <h2 className="mt-4 text-3xl font-black">Browse properties by city</h2>
            <p className="mt-3 text-white/70">Location chips are generated only from live published property records.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {locations.length ? locations.map((city) => <Link className="btn btn-secondary motion-fade" key={city} href={`/properties?city=${encodeURIComponent(city)}`}>{city}</Link>) : <p className="text-white/70">Locations populate from published property data.</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-4 lg:grid-cols-3">
          {[
            ["List Your Property", "Submit sale or rent details for admin verification.", "/list-property"],
            ["Tell Us Your Requirement", "Share your desired budget, city, and property type.", "/property-requirement"],
            ["Talk To The Team", "Call or message Kalpavruksha for property guidance.", "/contact"]
          ].map(([title, text, href]) => (
            <Link className="card interactive-card p-6" href={href} key={href}>
              <h2 className="text-2xl font-black text-[#123326]">{title}</h2>
              <p className="mt-2 text-[#68736d]">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-black text-[#b9892f]">Open <ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function QuickLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return <Link className="btn border border-white/18 bg-white/12 text-white backdrop-blur hover:bg-white/20" href={href}>{icon}{label}</Link>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-white/15 bg-white/12 p-4 text-center"><p className="text-3xl font-black text-[#f1bd55]">{value}</p><p className="mt-1 text-xs font-black uppercase text-white/70">{label}</p></div>;
}

function ActionCard({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return <Link href={href} className="portal-panel interactive-card rounded-lg p-4"><div className="text-[#f1bd55]">{icon}</div><h3 className="mt-3 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-white/72">{text}</p></Link>;
}

function SectionTitle({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 motion-rise">
      <div><p className="text-sm font-black uppercase text-[#b9892f]">{eyebrow}</p><h2 className="text-3xl font-black text-[#123326]">{title}</h2></div>
      <Link className="btn btn-secondary" href={href}>View All <ArrowRight size={16} /></Link>
    </div>
  );
}

function PropertyGrid({ properties }: { properties: Awaited<ReturnType<typeof getPublishedProperties>> }) {
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property.PropertyID} property={property} />)}</div>;
}

function CategoryLink({ icon, title, count, href }: { icon: React.ReactNode; title: string; count: number; href: string }) {
  return <Link className="card interactive-card flex items-center justify-between gap-4 p-6" href={href}><span className="flex items-center gap-4 text-xl font-black text-[#123326]"><span className="rounded-lg bg-[#fff2d3] p-3 text-[#b9892f]">{icon}</span>{title}</span><span className="text-3xl font-black text-[#b9892f]">{count}</span></Link>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="card p-8 text-center text-[#68736d]">{text}</div>;
}