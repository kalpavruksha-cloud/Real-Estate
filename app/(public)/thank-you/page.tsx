import Link from "next/link";

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return (
    <main className="section">
      <div className="container">
        <div className="card p-8 text-center">
          <p className="badge badge-gold">Received</p>
          <h1 className="mt-4 text-3xl font-black">Thank you</h1>
          <p className="mt-2 text-[#68736d]">Your {type || "submission"} has been saved. The Kalpavruksha team can now follow up from the admin portal.</p>
          <Link className="btn btn-primary mt-6" href="/properties">Browse Properties</Link>
        </div>
      </div>
    </main>
  );
}
