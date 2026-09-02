import Link from "next/link";
import { Building2, CalendarDays, ClipboardList, Database, Home, Image, LayoutDashboard, LogOut, MapPin, Settings, Tag, Users } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import type { AdminSession } from "@/lib/auth/session";

const nav = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Properties", "/admin/properties", Building2],
  ["Add Property", "/admin/properties/new", Home],
  ["Enquiries", "/admin/enquiries", Users],
  ["Site Visits", "/admin/site-visits", CalendarDays],
  ["Buyer Requirements", "/admin/requirements", ClipboardList],
  ["Owner Leads", "/admin/owner-leads", Users],
  ["Locations", "/admin/locations", MapPin],
  ["Categories", "/admin/categories", Tag],
  ["Amenities", "/admin/amenities", Image],
  ["Import/Export", "/admin/import-export", Database],
  ["Settings", "/admin/settings", Settings]
] as const;

export function AdminShell({ session, children }: { session: AdminSession; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2efe7] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="border-r border-[#ded8ca] bg-[#123326] p-4 text-white">
        <Link href="/admin" className="text-xl font-black">Kalpavruksha CRM</Link>
        <nav className="mt-8 grid gap-1">
          {nav.map(([label, href, Icon]) => (
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white" key={href} href={href}>
              <Icon size={17} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-[#ded8ca] bg-white px-4">
          <div>
            <p className="text-sm font-bold text-[#68736d]">{session.role}</p>
            <p className="font-black">{session.name}</p>
          </div>
          <form action={logoutAction}>
            <button className="btn btn-secondary" type="submit"><LogOut size={17} /> Logout</button>
          </form>
        </header>
        <main className="p-4 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
