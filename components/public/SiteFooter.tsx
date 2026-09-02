import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/services/settingsService";

export async function SiteFooter() {
  const settings = await getSettings();
  return (
    <footer className="border-t border-[#ded8ca] bg-[#0b241a] py-12 text-white">
      <div className="container grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="relative h-20 w-64 rounded-lg bg-white/95 p-2">
            <Image src="/brand/kalpavruksha-logo.png" alt="Kalpavruksha Real Estate" fill sizes="256px" className="object-contain p-2" />
          </div>
          <div className="mt-5 grid gap-3 text-sm text-white/75">
            {settings.Phone ? <p className="flex gap-3"><Phone size={17} /> {settings.Phone}</p> : null}
            {settings.Email ? <p className="flex gap-3"><Mail size={17} /> {settings.Email}</p> : null}
            <p className="flex gap-3"><MapPin size={17} /> {settings.Address || "Trusted property advisory for sale, rent, residential, commercial, and land listings."}</p>
          </div>
        </div>
        <FooterLinks title="Properties" links={[["For Sale", "/properties?purpose=Sale"], ["For Rent", "/properties?purpose=Rent"], ["Residential", "/properties?category=Residential"], ["Commercial", "/properties?category=Commercial"], ["Plots/Land", "/properties?category=Land"]]} />
        <FooterLinks title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["List Property", "/list-property"], ["Requirement", "/property-requirement"]]} />
        <FooterLinks title="Legal" links={[["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Disclaimer", "/disclaimer"]]} />
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-black text-[#f1bd55]">{title}</h3>
      <div className="mt-3 grid gap-2 text-sm text-white/75">
        {links.map(([label, href]) => <Link className="transition hover:text-white" key={href} href={href}>{label}</Link>)}
      </div>
    </div>
  );
}