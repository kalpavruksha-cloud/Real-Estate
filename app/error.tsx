"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container section">
      <div className="card p-8">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-[#68736d]">Please try again. If Google services are temporarily unavailable, your credentials and sheet access may need attention.</p>
        <button className="btn btn-primary mt-6" onClick={() => reset()}>Try Again</button>
      </div>
    </main>
  );
}
