"use client";

import { useState } from "react";

type PreviewRow = { rowNumber: number; valid: boolean; errors: string[]; data: Record<string, unknown> };

export function ImportTool() {
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function preview(formData: FormData) {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/import/properties/preview", { method: "POST", body: formData });
    const data = await response.json();
    setRows(data.rows || []);
    setMessage(data.error || "");
    setBusy(false);
  }

  async function importValid() {
    setBusy(true);
    const response = await fetch("/api/admin/import/properties/commit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rows: rows.filter((row) => row.valid).map((row) => row.data) })
    });
    const data = await response.json();
    setMessage(data.message || data.error || "");
    setBusy(false);
  }

  return (
    <div className="grid gap-4">
      <form action={preview} className="card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]">
        <input className="input" type="file" name="file" accept=".csv,.xlsx,.xls" required />
        <button className="btn btn-secondary" type="submit" disabled={busy}>Preview</button>
        <button className="btn btn-primary" type="button" disabled={busy || !rows.some((row) => row.valid)} onClick={importValid}>Import Valid Rows</button>
      </form>
      {message ? <p className="card p-3 font-bold">{message}</p> : null}
      {rows.length ? (
        <div className="table-wrap">
          <table><thead><tr><th>Row</th><th>Valid</th><th>Errors</th><th>Title</th><th>PropertyID</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.rowNumber}><td>{row.rowNumber}</td><td>{row.valid ? "Yes" : "No"}</td><td>{row.errors.join("; ")}</td><td>{String(row.data.Title || "")}</td><td>{String(row.data.PropertyID || "")}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
