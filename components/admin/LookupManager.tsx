import { saveLookupAction } from "@/app/admin/actions";
import type { LookupOption } from "@/types";

export function LookupManager({ title, tab, rows }: { title: string; tab: "LOCATIONS" | "CATEGORIES" | "AMENITIES"; rows: LookupOption[] }) {
  const action = saveLookupAction.bind(null, tab);
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-black">{title}</h1>
      <form action={action} className="card grid gap-3 p-4 md:grid-cols-4">
        <input className="input" name="Name" placeholder="Name" required />
        <input className="input" name="Category" placeholder="Category" />
        <input className="input" name="City" placeholder="City" />
        <input className="input" name="Locality" placeholder="Locality" />
        <select className="select" name="Active"><option>Yes</option><option>No</option></select>
        <input className="input" name="DisplayOrder" defaultValue="100" placeholder="Display Order" />
        <input className="input" name="Notes" placeholder="Notes" />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr>{["ID", "Name", "Category", "City", "Locality", "Active", "Order", "Notes", "Save"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.ID}>
              <td>{row.ID}</td>
              <td colSpan={8}>
                <form action={action} className="grid min-w-[760px] grid-cols-8 gap-2">
                  <input type="hidden" name="ID" value={row.ID} />
                  <input className="input" name="Name" defaultValue={row.Name} />
                  <input className="input" name="Category" defaultValue={row.Category} />
                  <input className="input" name="City" defaultValue={row.City} />
                  <input className="input" name="Locality" defaultValue={row.Locality} />
                  <select className="select" name="Active" defaultValue={row.Active}><option>Yes</option><option>No</option></select>
                  <input className="input" name="DisplayOrder" defaultValue={row.DisplayOrder} />
                  <input className="input" name="Notes" defaultValue={row.Notes} />
                  <button className="btn btn-secondary" type="submit">Save</button>
                </form>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
