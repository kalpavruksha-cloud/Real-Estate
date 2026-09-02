import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, MessageCircle, Phone, Ruler } from "lucide-react";
import { EnquiryForm, SiteVisitForm } from "@/components/public/LeadForms";
import { PropertyCard } from "@/components/public/PropertyCard";
import { env } from "@/lib/config";
import { parseList, whatsappLink } from "@/lib/utils";
import { getPropertyBySlug, getPublishedProperties } from "@/services/propertyService";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Unavailable", robots: { index: false, follow: false } };
  return {
    title: property.SEO_Title || property.Title,
    description: property.SEO_Description,
    alternates: { canonical: `/property/${property.Slug}` },
    openGraph: {
      title: property.SEO_Title || property.Title,
      description: property.SEO_Description,
      images: property.MainImage ? [property.MainImage] : []
    }
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const url = `${env.siteUrl}/property/${property.Slug}`;
  const message = `Hello Kalpavruksha Real Estate,\n\nI am interested in this property:\n\nProperty ID: ${property.PropertyID}\nProperty: ${property.Title}\nLocation: ${property.Locality}, ${property.City}\nPrice: ${property.PriceDisplay}\n\nProperty Link: ${url}\n\nPlease share more details.`;
  const similar = (await getPublishedProperties()).filter((item) => item.PropertyID !== property.PropertyID && item.City === property.City).slice(0, 3);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "RealEstateListing", name: property.Title, url, address: `${property.Locality}, ${property.City}`, image: property.MainImage }) }} />
      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#e4ded0] md:col-span-4">
                {property.MainImage ? <Image src={property.MainImage} alt={property.Title} fill sizes="(max-width: 1024px) 100vw, 760px" className="object-cover" priority /> : <div className="flex h-full items-center justify-center font-bold text-[#68736d]">No image available</div>}
              </div>
              {property.Images.slice(0, 4).map((image) => (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e4ded0]" key={image.ImageID}>
                  <Image src={image.ImageURL} alt={image.AltText || property.Title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-dark">{property.Purpose}</span>
                <span className="badge badge-gold">{property.Status}</span>
                {property.Verified === "Yes" ? <span className="badge badge-dark"><CheckCircle2 size={13} /> Verified</span> : null}
              </div>
              <h1 className="mt-4 text-4xl font-black">{property.Title}</h1>
              <p className="mt-3 flex items-center gap-2 text-[#68736d]"><MapPin size={18} /> {property.Locality}, {property.City}</p>
              <p className="mt-4 text-3xl font-black text-[#123326]">{property.PriceDisplay}</p>
            </div>

            <SpecGrid property={property} />
            <Content title="Description" text={property.Description} />
            <Content title="Highlights" text={property.Highlights} list />
            <Content title="Amenities" text={property.Amenities} list />
            {property.VideoURL ? <div className="mt-8 card p-5"><h2 className="text-2xl font-black">Video</h2><a className="mt-3 inline-flex font-bold text-[#123326]" href={property.VideoURL} target="_blank" rel="noreferrer">Open property video</a></div> : null}
            {property.Latitude && property.Longitude ? <div className="mt-8 card p-5"><h2 className="text-2xl font-black">Location Map</h2><iframe className="mt-4 h-72 w-full rounded-lg border-0" src={`https://maps.google.com/maps?q=${property.Latitude},${property.Longitude}&z=14&output=embed`} title="Property map" /></div> : null}
          </div>

          <aside className="grid content-start gap-4">
            <div className="card grid gap-3 p-4">
              <a className="btn btn-primary" href={whatsappLink(env.whatsappNumber || property.ContactPhone, message)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
              <a className="btn btn-secondary" href={`tel:${env.businessPhone || property.ContactPhone}`}><Phone size={18} /> Call</a>
            </div>
            <EnquiryForm property={property} url={url} />
            <SiteVisitForm property={property} />
          </aside>
        </div>
      </section>

      {similar.length ? (
        <section className="section bg-white">
          <div className="container">
            <h2 className="mb-6 text-3xl font-black">Similar Properties</h2>
            <div className="grid gap-5 md:grid-cols-3">{similar.map((item) => <PropertyCard key={item.PropertyID} property={item} />)}</div>
          </div>
        </section>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 border-t border-[#ded8ca] bg-white p-2 md:hidden">
        <a className="btn btn-secondary" href={`tel:${env.businessPhone || property.ContactPhone}`}>Call</a>
        <a className="btn btn-primary" href={whatsappLink(env.whatsappNumber || property.ContactPhone, message)}>WhatsApp</a>
        <a className="btn btn-accent" href="#enquire">Enquire</a>
      </div>
    </main>
  );
}

function SpecGrid({ property }: { property: NonNullable<Awaited<ReturnType<typeof getPropertyBySlug>>> }) {
  const specs = [
    ["Property ID", property.PropertyID],
    ["Type", property.PropertyType],
    ["Category", property.Category],
    ["Area", [property.BuiltupArea || property.PlotArea, property.AreaUnit].filter(Boolean).join(" ")],
    ["Bedrooms", property.Category === "Residential" ? property.Bedrooms : ""],
    ["Bathrooms", property.Category === "Residential" ? property.Bathrooms : ""],
    ["Facing", property.Facing],
    ["Furnishing", property.Furnishing],
    ["Possession", property.PossessionStatus],
    ["Ownership", property.OwnershipType]
  ].filter(([, value]) => value);
  return (
    <div className="mt-8 grid gap-3 md:grid-cols-2">
      {specs.map(([label, value]) => <div className="card flex items-center gap-3 p-4" key={label}><Ruler size={18} className="text-[#b9892f]" /><div><p className="text-xs font-bold uppercase text-[#68736d]">{label}</p><p className="font-black">{value}</p></div></div>)}
    </div>
  );
}

function Content({ title, text, list = false }: { title: string; text: string; list?: boolean }) {
  if (!text) return null;
  return (
    <section className="mt-8 card p-5">
      <h2 className="text-2xl font-black">{title}</h2>
      {list ? <ul className="mt-3 grid gap-2">{parseList(text).map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 text-[#b9892f]" /> {item}</li>)}</ul> : <p className="mt-3 leading-7 text-[#48534d]">{text}</p>}
    </section>
  );
}
