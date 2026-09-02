import Link from "next/link";
import { ImportTool } from "@/components/admin/ImportTool";

export default function ImportExportPage() {
  const exports = ["properties", "enquiries", "site-visits", "requirements", "owner-leads"];
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black">Import / Export</h1>
        <p className="text-[#68736d]">Preview property imports before committing valid rows to Google Sheets.</p>
      </div>
      <section>
        <h2 className="mb-3 text-xl font-black">Property Import</h2>
        <div className="mb-3"><Link className="btn btn-secondary" href="/api/admin/import/properties/template">Download Template</Link></div>
        <ImportTool />
      </section>
      <section>
        <h2 className="mb-3 text-xl font-black">Export</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {exports.map((name) => <Link className="btn btn-primary" key={name} href={`/api/admin/export/${name}`}>{name}</Link>)}
        </div>
      </section>
    </div>
  );
}
