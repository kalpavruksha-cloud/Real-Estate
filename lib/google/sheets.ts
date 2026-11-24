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
    const tabs = ["PROPERTIES", "PROPERTY_IMAGES", "ENQUIRIES", "SITE_VISITS", "REQUIREMENTS", "OWNER_LEADS", "LOCATIONS", "CATEGORIES", "AMENITIES", "SETTINGS"];
    const sheetChecks = await Promise.all(tabs.map(async (tab) => {
      try {
        const response = await sheets.spreadsheets.values.get({ spreadsheetId: env.spreadsheetId, range: `${tab}!A1:ZZ2` });
        const [headers = [], ...rows] = response.data.values || [];
        return { tab, ok: true, headers, sampleRowsRead: rows.length };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Google Sheets error";
        return { tab, ok: false, error: message.replace(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g, "[redacted]") };
      }
    }));
    const properties = sheetChecks.find((check) => check.tab === "PROPERTIES");
    const failures = sheetChecks.filter((check) => !check.ok);
    return {
      ok: failures.length === 0,
      configuration,
      spreadsheetReachable: true,
      propertyRowsRead: properties?.ok ? properties.sampleRowsRead : 0,
      sheetChecks,
      ...(failures.length ? { error: `Could not read spreadsheet tabs: ${failures.map((check) => check.tab).join(", ")}` } : {})
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

export async function saveSettingsValues(tab: string, settings: Record<string, string>) {
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({ spreadsheetId: env.spreadsheetId, range: `${tab}!A:ZZ` });
  const [headers = [], ...rows] = response.data.values || [];
  if (!headers.length) throw new Error(`The ${tab} sheet has no header row.`);
  const keyColumn = headers.indexOf("SettingKey") >= 0 ? headers.indexOf("SettingKey") : headers.indexOf("Key");
  const valueColumn = headers.indexOf("SettingValue") >= 0 ? headers.indexOf("SettingValue") : headers.indexOf("Value");
  if (keyColumn < 0 || valueColumn < 0) throw new Error(`The ${tab} sheet needs SettingKey/SettingValue or Key/Value columns.`);
  const activeColumn = headers.indexOf("Active");
  const descriptionColumn = headers.indexOf("Description") >= 0 ? headers.indexOf("Description") : headers.indexOf("Notes");
  const updates: { range: string; values: string[][] }[] = [];
  const appends: string[][] = [];
  for (const [key, value] of Object.entries(settings)) {
    const index = rows.findIndex((row) => row[keyColumn] === key);
    if (index >= 0) {
      const rowNumber = index + 2;
      updates.push({ range: `${tab}!${columnLetter(valueColumn + 1)}${rowNumber}`, values: [[value]] });
    } else {
      const newRow = headers.map(() => "");
      if (headers.includes("SettingGroup")) newRow[headers.indexOf("SettingGroup")] = "General";
      newRow[keyColumn] = key;
      newRow[valueColumn] = value;
      if (activeColumn >= 0) newRow[activeColumn] = "Yes";
      if (descriptionColumn >= 0) newRow[descriptionColumn] = "Managed from portal settings";
      appends.push(newRow);
    }
  }
  for (const update of updates) {
    await sheets.spreadsheets.values.update({ spreadsheetId: env.spreadsheetId, range: update.range, valueInputOption: "RAW", requestBody: { values: update.values } });
  }
  if (appends.length) {
    await sheets.spreadsheets.values.append({ spreadsheetId: env.spreadsheetId, range: `${tab}!A:ZZ`, valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: appends } });
  }
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
