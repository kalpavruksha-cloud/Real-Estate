import Image from "next/image";
import Link from "next/link";
import { Archive, Copy, Edit, Eye } from "lucide-react";
import { archivePropertyAction, duplicatePropertyAction } from "@/app/admin/actions";
import { getAdminProperties } from "@/services/propertyService";

export default async function AdminPropertiesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; published?: string }> }) {
  const params = await searchParams;
  let properties = await getAdminProperties();
  if (params.q) {
    const q = params.q.toLowerCase();
    properties = properties.filter((p) => [p.PropertyID, p.Title, p.City, p.Locality, p.PropertyType].join(" ").toLowerCase().includes(q));
  }
  if (params.status) properties = properties.filter((p) => p.Status === params.status);
  if (params.published) properties = properties.filter((p) => p.Published === params.published);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-black">Properties</h1><p className="text-[#68736d]">{properties.length} records</p></div>
        <div className="flex gap-2"><Link className="btn btn-secondary" href="/admin/import-export">Import/Export</Link><Link className="btn btn-primary" href="/admin/properties/new">Add Property</Link></div>
      </div>
      <form className="card grid gap-3 p-4 md:grid-cols-4">
        <input className="input" name="q" defaultValue={params.q} placeholder="Search properties" />
        <select className="select" name="status" defaultValue={params.status || ""}><option value="">All statuses</option>{["Available", "Under Negotiation", "Sold", "Rented", "Inactive"].map((s) => <option key={s}>{s}</option>)}</select>
        <select className="select" name="published" defaultValue={params.published || ""}><option value="">Published</option><option>Yes</option><option>No</option></select>
        <button className="btn btn-primary">Filter</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr>{["Property ID", "Image", "Title", "Purpose", "Category", "Type", "Location", "Price", "Status", "Published", "Featured", "Verified", "Date Added", "Actions"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.PropertyID}>
                <td>{p.PropertyID}</td>
                <td>{p.MainImage ? <Image src={p.MainImage} alt={p.Title} width={70} height={52} className="rounded object-cover" /> : "No image"}</td>
                <td className="font-bold">{p.Title}</td><td>{p.Purpose}</td><td>{p.Category}</td><td>{p.PropertyType}</td><td>{p.Locality}, {p.City}</td><td>{p.PriceDisplay}</td><td>{p.Status}</td><td>{p.Published}</td><td>{p.Featured}</td><td>{p.Verified}</td><td>{p.DateAdded?.slice(0, 10)}</td>
                <td>
                  <div className="flex gap-1">
                    <Link className="btn btn-secondary" href={`/property/${p.Slug}`}><Eye size={15} /></Link>
                    <Link className="btn btn-secondary" href={`/admin/properties/${p.PropertyID}/edit`}><Edit size={15} /></Link>
                    <form action={duplicatePropertyAction}><input type="hidden" name="PropertyID" value={p.PropertyID} /><button className="btn btn-secondary" type="submit"><Copy size={15} /></button></form>
                    <form action={archivePropertyAction}><input type="hidden" name="PropertyID" value={p.PropertyID} /><button className="btn btn-secondary" type="submit"><Archive size={15} /></button></form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
