import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle, Ruler, ShieldCheck } from "lucide-react";
import { env } from "@/lib/config";
import { whatsappLink } from "@/lib/utils";
import type { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  const message = `Hello Kalpavruksha Real Estate,\n\nI am interested in this property:\n\nProperty ID: ${property.PropertyID}\nProperty: ${property.Title}\nLocation: ${property.Locality}, ${property.City}\nPrice: ${property.PriceDisplay}\n\nProperty Link: ${env.siteUrl}/property/${property.Slug}\n\nPlease share more details.`;
  return (
    <article className="card interactive-card group overflow-hidden">
      <Link href={`/property/${property.Slug}`} className="block">
        <div className="relative aspect-[4/3] bg-[#e4ded0]">
          {property.MainImage ? (
            <Image src={property.MainImage} alt={property.Title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="portal-grid flex h-full items-center justify-center text-sm font-black text-[#68736d]">Image pending</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {property.Featured === "Yes" ? <span className="badge badge-gold motion-shimmer">Featured</span> : null}
            {property.Verified === "Yes" ? <span className="badge badge-dark"><ShieldCheck size={13} /> Verified</span> : null}
          </div>
          <span className="absolute bottom-3 left-3 badge badge-glass">{property.Purpose}</span>
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#123326] transition group-hover:rotate-12"><ArrowUpRight size={17} /></span>
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="badge badge-gold">{property.Status}</span>
          <span className="text-xs font-black uppercase tracking-wide text-[#68736d]">{property.PropertyID}</span>
        </div>
        <h3 className="min-h-14 text-lg font-black leading-tight text-[#123326]">{property.Title}</h3>
        <p className="flex items-center gap-2 text-sm text-[#68736d]"><MapPin size={16} /> {property.Locality}, {property.City}</p>
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-black text-[#123326]">{property.PriceDisplay}</p>
          {(property.BuiltupArea || property.PlotArea) ? <span className="flex items-center gap-1 rounded-full bg-[#f7f0df] px-3 py-1 text-xs font-black text-[#7a5517]"><Ruler size={14} /> {property.BuiltupArea || property.PlotArea} {property.AreaUnit}</span> : null}
        </div>
        {property.Category === "Residential" && property.Bedrooms ? <p className="text-sm font-bold text-[#48534d]">{property.Bedrooms} BHK residential listing</p> : null}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link className="btn btn-secondary" href={`/property/${property.Slug}`}>View Details</Link>
          <a className="btn btn-primary" href={whatsappLink(env.whatsappNumber || property.ContactPhone, message)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
        </div>
      </div>
    </article>
  );
}