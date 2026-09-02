import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container section">
      <div className="card p-8">
        <p className="badge badge-gold">404</p>
        <h1 className="mt-4 text-3xl font-bold">This page is not available</h1>
        <p className="mt-2 text-[#68736d]">The property or page may have moved, been archived, or is no longer public.</p>
        <Link className="btn btn-primary mt-6" href="/properties">Browse Properties</Link>
      </div>
    </main>
  );
}
