import { OwnerLeadForm } from "@/components/public/LeadForms";

export default function ListPropertyPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="text-4xl font-black">List Your Property</h1>
        <p className="mt-2 max-w-2xl text-[#68736d]">Owner submissions are saved for admin review and are never published automatically.</p>
        <div className="mt-6"><OwnerLeadForm /></div>
      </div>
    </main>
  );
}
