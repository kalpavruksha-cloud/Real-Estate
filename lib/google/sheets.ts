import { google } from "googleapis";
import { env } from "@/lib/config";

type Row = Record<string, string>;

function hasGoogleConfig() {
  return Boolean(env.spreadsheetId && env.googleClientEmail && env.googlePrivateKey);
}

export async function checkGoogleSheetsConnection() {
  const configuration = {
    spreadsheetId: Boolean(env.spreadsheetId),
    clientEmail: Boolean(env.googleClientEmail),
    privateKey: Boolean(env.googlePrivateKey),
    privateKeyLooksValid:
      env.googlePrivateKey.trim().startsWith("-----BEGIN PRIVATE KEY-----") &&
      env.googlePrivateKey.trim().endsWith("-----END PRIVATE KEY-----")
  };

  const missing = Object.entries(configuration)
    .filter(([key, configured]) => key !== "privateKeyLooksValid" && !configured)
    .map(([key]) => key);

  if (missing.length) {
    return {
      ok: false,
      configuration,
      error: `Missing Google configuration: ${missing.join(", ")}`
    };
  }

  if (!configuration.privateKeyLooksValid) {
    return {
      ok: false,
      configuration,
      error: "GOOGLE_PRIVATE_KEY is not a PEM private key. Use the private_key value from the service-account JSON, not private_key_id."
    };
  }

  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: "PROPERTIES!A1:AS3"
    });
    return {
      ok: true,
      configuration,
      spreadsheetReachable: true,
      propertyRowsRead: Math.max((response.data.values?.length || 1) - 1, 0)
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Google Sheets error";
    return {
      ok: false,
      configuration,
      spreadsheetReachable: false,
      error: message.replace(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g, "[redacted]")
    };
  }
}

async function getSheets() {
  if (!hasGoogleConfig()) {
    throw new Error("Google Sheets environment variables are not configured.");
  }
  const auth = new google.auth.JWT({
    email: env.googleClientEmail,
    key: env.googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
  });
  return google.sheets({ version: "v4", auth });
}

function rowsToObjects(headers: string[], rows: string[][] = []): Row[] {
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))
  );
}

export async function readSheet(tab: string): Promise<Row[]> {
  if (!hasGoogleConfig()) return [];
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: env.spreadsheetId,
    range: `${tab}!A:ZZ`
  });
  const values = response.data.values || [];
  const [headers = [], ...rows] = values;
  return rowsToObjects(headers, rows);
}

export async function appendSheetRow(tab: string, headers: readonly string[], row: Record<string, unknown>) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.spreadsheetId,
    range: `${tab}!A:ZZ`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [headers.map((header) => String(row[header] ?? ""))]
    }
  });
}

export async function updateSheetRowById(
  tab: string,
  headers: readonly string[],
  idColumn: string,
  id: string,
  patch: Record<string, unknown>
) {
  const rows = await readSheet(tab);
  const rowIndex = rows.findIndex((row) => row[idColumn] === id);
  if (rowIndex < 0) throw new Error(`${tab} record ${id} was not found.`);
  const existing = rows[rowIndex];
  const updated = { ...existing, ...patch };
  const spreadsheetRow = rowIndex + 2;
  const sheets = await getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.spreadsheetId,
    range: `${tab}!A${spreadsheetRow}:${columnLetter(headers.length)}${spreadsheetRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [headers.map((header) => String(updated[header] ?? ""))]
    }
  });
}

export async function clearAndWriteSheet(tab: string, headers: readonly string[], rows: Record<string, unknown>[]) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: env.spreadsheetId,
    range: `${tab}!A2:${columnLetter(headers.length)}`
  });
  if (!rows.length) return;
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.spreadsheetId,
    range: `${tab}!A2:${columnLetter(headers.length)}${rows.length + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows.map((row) => headers.map((header) => String(row[header] ?? "")))
    }
  });
}

function columnLetter(column: number) {
  let letter = "";
  while (column > 0) {
    const mod = (column - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    column = Math.floor((column - mod) / 26);
  }
  return letter;
}
