import { LEAD_STATUSES, OWNER_STATUSES, VISIT_STATUSES } from "@/lib/constants";
import { convertOwnerLeadAction, updateEnquiryAction, updateOwnerLeadAction, updateRequirementAction, updateSiteVisitAction } from "@/app/admin/actions";
import type { Enquiry, OwnerLead, Requirement, SiteVisit } from "@/types";

type RowMap = Record<string, string | undefined>;

export function EnquiryTable({ rows }: { rows: Enquiry[] }) {
  return <LeadTable rows={rows as unknown as RowMap[]} idKey="EnquiryID" action={updateEnquiryAction} statuses={[...LEAD_STATUSES]} columns={["DateTime", "PropertyTitle", "Name", "Phone", "Source"]} />;
}

export function VisitTable({ rows }: { rows: SiteVisit[] }) {
  return <LeadTable rows={rows as unknown as RowMap[]} idKey="VisitID" action={updateSiteVisitAction} statuses={[...VISIT_STATUSES]} columns={["DateTime", "PropertyTitle", "Name", "Phone", "PreferredDate", "PreferredTime"]} />;
}

export function RequirementTable({ rows }: { rows: Requirement[] }) {
  return <LeadTable rows={rows as unknown as RowMap[]} idKey="RequirementID" action={updateRequirementAction} statuses={[...LEAD_STATUSES]} columns={["DateTime", "LookingTo", "Category", "PreferredCity", "Name", "Phone"]} />;
}

export function OwnerLeadTable({ rows }: { rows: OwnerLead[] }) {
  return <LeadTable rows={rows as unknown as RowMap[]} idKey="OwnerLeadID" action={updateOwnerLeadAction} statuses={[...OWNER_STATUSES]} columns={["DateTime", "OwnerName", "SellRent", "Category", "City", "Phone"]} />;
}

function LeadTable({ rows, idKey, action, statuses, columns }: { rows: RowMap[]; idKey: string; action: (form: FormData) => Promise<void>; statuses: string[]; columns: string[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>ID</th>{columns.map((column) => <th key={column}>{column}</th>)}<th>Status</th><th>Assigned</th><th>Next / Actual</th><th>Notes</th><th>Contact</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map((row) => {
            const id = row[idKey] || "";
            return (
              <tr key={id}>
                <td className="font-bold">{id}</td>
                {columns.map((column) => <td key={column}>{row[column]}</td>)}
                <td colSpan={4}>
                  <form action={action} className="grid min-w-[520px] grid-cols-4 gap-2">
                    <input type="hidden" name={idKey} value={id} />
                    <select className="select" name="Status" defaultValue={row.Status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
                    <input className="input" name="AssignedTo" defaultValue={row.AssignedTo || ""} placeholder="Assigned to" />
                    <input className="input" name={idKey === "VisitID" ? "ActualVisitDate" : "NextFollowUp"} type={idKey === "VisitID" ? "date" : "datetime-local"} defaultValue={row.NextFollowUp || row.ActualVisitDate || ""} />
                    <input className="input" name="Notes" defaultValue={row.Notes || ""} placeholder="Notes" />
                    <button className="btn btn-primary col-span-4" type="submit">Save</button>
                  </form>
                </td>
                <td>
                  <div className="grid gap-1">
                    <a className="font-bold text-[#123326]" href={`tel:${row.Phone || ""}`}>Call</a>
                    <a className="font-bold text-[#123326]" href={`https://wa.me/${String(row.Phone || "").replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a>
                  </div>
                </td>
                <td>{idKey === "OwnerLeadID" ? <form action={convertOwnerLeadAction}><input type="hidden" name="OwnerLeadID" value={id} /><button className="btn btn-secondary" type="submit">Convert</button></form> : null}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
