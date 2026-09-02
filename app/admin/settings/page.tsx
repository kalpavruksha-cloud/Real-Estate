import { updateSettingsAction } from "@/app/admin/actions";
import { getSettings } from "@/services/settingsService";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-black">Settings</h1>
      <form action={updateSettingsAction} className="card grid gap-4 p-5 md:grid-cols-2">
        {Object.entries(settings).map(([key, value]) => (
          <label className="field" key={key}>
            <span>{key}</span>
            {key.startsWith("Show") ? (
              <select className="select" name={key} defaultValue={String(value)}><option>Yes</option><option>No</option></select>
            ) : (
              <input className="input" name={key} defaultValue={String(value ?? "")} />
            )}
          </label>
        ))}
        <button className="btn btn-primary justify-self-start md:col-span-2" type="submit">Save Settings</button>
      </form>
    </div>
  );
}
