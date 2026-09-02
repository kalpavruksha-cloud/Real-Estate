import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle, Phone, Search } from "lucide-react";
import { getSettings } from "@/services/settingsService";
import { whatsappLink } from "@/lib/utils";

export async function SiteHeader() {
  const settings = await getSettings();
  const wa = settings.WhatsApp ? whatsappLink(settings.WhatsApp, "Hello Kalpavruksha Real Estate, I would like help finding a property.") : "/contact";
  return (
    <header className="sticky top-0 z-40 border-b border-[#ded8ca]/80 bg-[#fbfaf6]/92 shadow-[0_10px_30px_rgba(18,51,38,.07)] backdrop-blur-xl">
      <div className="container flex min-h-24 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Kalpavruksha Real Estate home">
          <span className="relative h-[4.5rem] w-56 overflow-hidden sm:h-20 sm:w-72 lg:h-[5.5rem] lg:w-80">
            <Image src="/brand/kalpavruksha-logo.png" alt="Kalpavruksha Real Estate" fill sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 320px" className="object-contain object-left" priority />
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-[#ded8ca] bg-white/80 p-1 text-sm font-black text-[#354238] shadow-sm lg:flex">
          <Link className="rounded-full px-4 py-2 transition hover:bg-[#f7f0df] hover:text-[#123326]" href="/properties?purpose=Sale">Buy</Link>
          <Link className="rounded-full px-4 py-2 transition hover:bg-[#f7f0df] hover:text-[#123326]" href="/properties?purpose=Rent">Rent</Link>
          <Link className="rounded-full px-4 py-2 transition hover:bg-[#f7f0df] hover:text-[#123326]" href="/properties">Properties</Link>
          <Link className="rounded-full px-4 py-2 transition hover:bg-[#f7f0df] hover:text-[#123326]" href="/list-property">List Property</Link>
          <Link className="rounded-full px-4 py-2 transition hover:bg-[#f7f0df] hover:text-[#123326]" href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="btn btn-secondary icon-btn hidden md:inline-flex" href="/properties" aria-label="Search properties"><Search size={18} /></Link>
          {settings.Phone ? <a className="btn btn-secondary hidden xl:inline-flex" href={`tel:${settings.Phone}`}><Phone size={17} /> Call</a> : null}
          <a className="btn btn-primary hidden md:inline-flex" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
          <details className="lg:hidden">
            <summary className="btn btn-secondary icon-btn list-none" aria-label="Open menu"><Menu size={20} /></summary>
            <div className="absolute left-3 right-3 top-20 grid gap-3 rounded-lg border border-[#ded8ca] bg-white p-4 shadow-xl">
              <Link href="/properties?purpose=Sale">Buy</Link>
              <Link href="/properties?purpose=Rent">Rent</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/list-property">List Your Property</Link>
              <Link href="/property-requirement">Requirement</Link>
              <Link href="/contact">Contact</Link>
              <a href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}