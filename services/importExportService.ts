import ExcelJS from "exceljs";
import { PROPERTY_HEADERS } from "@/lib/constants";
import { getAdminProperties } from "@/services/propertyService";
import { propertySchema } from "@/schemas/property";

export interface ImportPreviewRow {
  rowNumber: number;
  data: Record<string, unknown>;
  valid: boolean;
  errors: string[];
}

export async function propertyTemplateWorkbook() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("PROPERTIES");
  worksheet.addRow([...PROPERTY_HEADERS]);
  worksheet.addRow(PROPERTY_HEADERS.map(() => ""));
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach((column) => { column.width = 22; });
  const output = await workbook.xlsx.writeBuffer();
  return Buffer.from(output);
}

export async function parsePropertyImport(file: File): Promise<ImportPreviewRow[]> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv" ? parseCsv(buffer.toString("utf8")) : await parseWorkbook(buffer);
  const existing = await getAdminProperties();
  const existingIds = new Set(existing.map((property) => property.PropertyID));
  const seen = new Set<string>();
  return rows.map((row, index) => {
    const parsed = propertySchema.safeParse(row);
    const errors = parsed.success ? [] : parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    const id = String(row.PropertyID || "");
    if (id && existingIds.has(id)) errors.push(`Duplicate existing PropertyID ${id}`);
    if (id && seen.has(id)) errors.push(`Duplicate file PropertyID ${id}`);
    if (id) seen.add(id);
    return { rowNumber: index + 2, data: row, valid: errors.length === 0, errors };
  });
}

async function parseWorkbook(buffer: Buffer<ArrayBufferLike>) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];
  const headers = rowValues(worksheet.getRow(1));
  const rows: Record<string, unknown>[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const values = rowValues(row);
    if (values.every((value) => !value)) return;
    rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
  });
  return rows;
}

function rowValues(row: ExcelJS.Row) {
  const values = row.values as ExcelJS.CellValue[];
  return values.slice(1).map((value) => {
    if (value == null) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object" && "text" in value) return String(value.text ?? "");
    if (typeof value === "object" && "result" in value) return String(value.result ?? "");
    return String(value);
  });
}

function parseCsv(text: string) {
  const lines: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      lines.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    lines.push(row);
  }
  const [headers = [], ...records] = lines.filter((line) => line.some(Boolean));
  return records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])));
}

export function rowsToCsv(rows: Record<string, unknown>[], headers?: readonly string[]) {
  const keys = headers?.length ? [...headers] : Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [keys.join(","), ...rows.map((row) => keys.map((key) => escape(row[key])).join(","))].join("\n");
}
