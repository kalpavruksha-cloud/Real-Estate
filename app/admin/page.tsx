import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Star, Users } from "lucide-react";
import { getAdminProperties } from "@/services/propertyService";
import { getEnquiries } from "@/services/enquiryService";
import { getSiteVisits } from "@/services/siteVisitService";
import { getRequirements } from "@/services/requirementService";
import { getOwnerLeads } from "@/services/ownerLeadService";

export default async function AdminDashboard() {
  const [properties, enquiries, visits, requirements, ownerLeads] = await Promise.all([
    getAdminProperties(),
    getEnquiries(),
    getSiteVisits(),
    getRequirements(),
    getOwnerLeads()
  ]);
  const now = Number((await headers()).get("x-request-time") || 0);
  const cards = [
    ["Total Properties", properties.length, Building2],
    ["Available Properties", properties.filter((p) => p.Status === "Available").length, Building2],
    ["Published Properties", properties.filter((p) => p.Published === "Yes").length, Building2],
    ["Featured Properties", properties.filter((p) => p.Featured === "Yes").length, Star],
    ["Under Negotiation", properties.filter((p) => p.Status === "Under Negotiation").length, Building2],
    ["Sold Properties", properties.filter((p) => p.Status === "Sold").length, Building2],
    ["Rented Properties", properties.filter((p) => p.Status === "Rented").length, Building2],
    ["New Enquiries", enquiries.filter((e) => e.Status === "New").length, Users],
    ["Follow-Ups Due", enquiries.filter((e) => e.NextFollowUp && Date.parse(e.NextFollowUp) <= now).length, Users],
    ["Upcoming Visits", visits.filter((v) => ["Requested", "Confirmed"].includes(v.Status)).length, CalendarDays],
    ["Buyer Requirements", requirements.length, Users],
    ["Owner Leads", ownerLeads.length, Users]
  ] as const;

  return (
    <div className="grid gap-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-[#68736d]">Live CRM metrics from Google Sheets.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/properties/new">Add Property</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, Icon]) => <div className="card p-4" key={label}><Icon className="text-[#b9892f]" /><p className="mt-3 text-3xl font-black">{value}</p><p className="text-sm font-bold text-[#68736d]">{label}</p></div>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Recent Properties" href="/admin/properties" rows={properties.slice(-5).reverse().map((p) => [p.PropertyID, p.Title, p.Status])} />
        <Panel title="Recent Enquiries" href="/admin/enquiries" rows={enquiries.slice(-5).reverse().map((e) => [e.EnquiryID, e.Name, e.Status])} />
        <Panel title="Upcoming Visits" href="/admin/site-visits" rows={visits.slice(-5).reverse().map((v) => [v.VisitID, v.Name, v.Status])} />
      </div>
    </div>
  );
}

function Panel({ title, href, rows }: { title: string; href: string; rows: string[][] }) {
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black">{title}</h2>
        <Link href={href}><ArrowRight size={18} /></Link>
      </div>
      <div className="mt-4 grid gap-2">
        {rows.length ? rows.map((row) => <div className="rounded-lg bg-[#f7f5ef] p-3 text-sm" key={row[0]}><b>{row[0]}</b><p>{row[1]}</p><span className="text-[#68736d]">{row[2]}</span></div>) : <p className="text-sm text-[#68736d]">No records yet.</p>}
      </div>
    </section>
  );
}






