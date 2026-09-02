import { CalendarDays, Send } from "lucide-react";
import { submitEnquiry, submitOwnerLead, submitRequirement, submitSiteVisit } from "@/app/actions";
import type { Property } from "@/types";

export function EnquiryForm({ property, url }: { property: Property; url: string }) {
  return (
    <form action={submitEnquiry} className="card grid gap-3 p-4">
      <h2 className="text-xl font-black">Enquire About This Property</h2>
      <input type="hidden" name="PropertyID" value={property.PropertyID} />
      <input type="hidden" name="PropertyTitle" value={property.Title} />
      <input type="hidden" name="PropertyURL" value={url} />
      <input type="hidden" name="Source" value="Property Page" />
      <input className="input" name="Name" placeholder="Name" required />
      <input className="input" name="Phone" placeholder="Phone" required />
      <input className="input" name="Email" placeholder="Email" type="email" />
      <textarea className="textarea" name="Message" placeholder="Message" />
      <button className="btn btn-primary" type="submit"><Send size={17} /> Send Enquiry</button>
    </form>
  );
}

export function SiteVisitForm({ property }: { property: Property }) {
  return (
    <form action={submitSiteVisit} className="card grid gap-3 p-4">
      <h2 className="flex items-center gap-2 text-xl font-black"><CalendarDays size={20} /> Schedule Site Visit</h2>
      <input type="hidden" name="PropertyID" value={property.PropertyID} />
      <input type="hidden" name="PropertyTitle" value={property.Title} />
      <input className="input" name="Name" placeholder="Name" required />
      <input className="input" name="Phone" placeholder="Phone" required />
      <input className="input" name="Email" placeholder="Email" type="email" />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" name="PreferredDate" type="date" required />
        <input className="input" name="PreferredTime" type="time" required />
      </div>
      <button className="btn btn-accent" type="submit">Request Visit</button>
    </form>
  );
}

export function RequirementForm() {
  return (
    <form action={submitRequirement} className="card grid gap-3 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Select name="LookingTo" options={["Sale", "Rent"]} label="Looking To" />
        <Select name="Category" options={["Residential", "Commercial", "Land"]} label="Category" />
        <input className="input" name="PropertyType" placeholder="Property Type" />
        <input className="input" name="PreferredCity" placeholder="Preferred City" required />
        <input className="input" name="PreferredLocality" placeholder="Preferred Locality" />
        <input className="input" name="Bedrooms" placeholder="Bedrooms" />
        <input className="input" name="MinimumBudget" placeholder="Minimum Budget" />
        <input className="input" name="MaximumBudget" placeholder="Maximum Budget" />
        <input className="input" name="MinimumArea" placeholder="Minimum Area" />
        <input className="input" name="AreaUnit" defaultValue="sq ft" placeholder="Area Unit" />
      </div>
      <textarea className="textarea" name="AdditionalRequirements" placeholder="Additional Requirements" />
      <div className="grid gap-3 md:grid-cols-3">
        <input className="input" name="Name" placeholder="Name" required />
        <input className="input" name="Phone" placeholder="Phone" required />
        <input className="input" name="Email" placeholder="Email" type="email" />
      </div>
      <button className="btn btn-primary" type="submit">Submit Requirement</button>
    </form>
  );
}

export function OwnerLeadForm() {
  return (
    <form action={submitOwnerLead} className="card grid gap-3 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" name="OwnerName" placeholder="Owner Name" required />
        <input className="input" name="Phone" placeholder="Phone" required />
        <input className="input" name="Email" placeholder="Email" type="email" />
        <Select name="SellRent" options={["Sale", "Rent"]} label="Sell / Rent" />
        <Select name="Category" options={["Residential", "Commercial", "Land"]} label="Category" />
        <input className="input" name="PropertyType" placeholder="Property Type" />
        <input className="input" name="City" placeholder="City" required />
        <input className="input" name="Locality" placeholder="Locality" required />
        <input className="input" name="Address" placeholder="Address" />
        <input className="input" name="ExpectedPrice" placeholder="Expected Price" />
        <input className="input" name="PlotArea" placeholder="Plot Area" />
        <input className="input" name="BuiltupArea" placeholder="Built-up Area" />
        <input className="input" name="AreaUnit" defaultValue="sq ft" placeholder="Area Unit" />
      </div>
      <textarea className="textarea" name="Description" placeholder="Description" />
      <input className="input" type="file" name="Images" accept="image/jpeg,image/png,image/webp" multiple />
      <button className="btn btn-primary" type="submit">Submit Property</button>
    </form>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="select" name={name}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
