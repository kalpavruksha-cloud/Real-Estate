import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/services/settingsService";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <main className="section">
      <div className="container grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-black">Contact Kalpavruksha Real Estate</h1>
          <div className="mt-6 grid gap-4">
            <p className="flex gap-3"><Phone /> {settings.Phone || "Phone number configured in Settings"}</p>
            <p className="flex gap-3"><Mail /> {settings.Email || "Email configured in Settings"}</p>
            <p className="flex gap-3"><MapPin /> {settings.Address || "Address configured in Settings"}</p>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-2xl font-black">Need help finding a property?</h2>
          <p className="mt-3 text-[#68736d]">Use the requirement form and the team will follow up with matching listings.</p>
          <a className="btn btn-primary mt-6" href="/property-requirement">Submit Requirement</a>
        </div>
      </div>
    </main>
  );
}
