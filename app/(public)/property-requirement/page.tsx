import { RequirementForm } from "@/components/public/LeadForms";

export default function PropertyRequirementPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="text-4xl font-black">Share Your Property Requirement</h1>
        <p className="mt-2 max-w-2xl text-[#68736d]">Tell the team what you need, and the request will be available in the admin dashboard for follow-up.</p>
        <div className="mt-6"><RequirementForm /></div>
      </div>
    </main>
  );
}
