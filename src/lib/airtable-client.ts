// ─── Airtable Client — Preorder KTB ONLY (ISOLATED) ───────────────────────
// A self-contained Airtable REST client used EXCLUSIVELY by the /preorder-ktb
// Curlec payment feature. It intentionally does NOT import or share anything
// with the existing src/lib/airtable.ts used by cart/checkout/ToyyibPay.
//
// Table: "Preorder-ktb"
// Fields: Name, Telefon, Email, Status, Kuantiti, Jumlah Bayaran,
//         Reference No, Tarikh Bayaran
//
// Env (isolated):
//   AIRTABLE_TOKEN           (falls back to AIRTABLE_API_KEY if unset)
//   AIRTABLE_BASE_ID
//   AIRTABLE_TABLE_PREORDER  (table id, e.g. tblFqB6PdZvi8Ys9p)

import type { PreorderRecord, PreorderStatus } from "@/types/preorder";

const AIRTABLE_API = "https://api.airtable.com/v0";

function getConfig() {
  const token = process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY || "";
  const baseId = process.env.AIRTABLE_BASE_ID || "";
  const table = process.env.AIRTABLE_TABLE_PREORDER || "Preorder-ktb";
  return { token, baseId, table };
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

// ─── Number-field sanitizer ─────────────────────────────────────────────────
// Airtable Number columns reject strings (HTTP 422 INVALID_VALUE_FOR_COLUMN).
// This guarantees every numeric field is sent as a real JS number, never a
// string and never NaN.
const NUMBER_FIELDS = ["Kuantiti", "Sumbangan", "Jumlah Bayaran"];

function sanitizeAirtableFields(
  fields: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (NUMBER_FIELDS.includes(key)) {
      const n = Number(value);
      sanitized[key] = Number.isFinite(n) ? n : 0; // FORCE NUMBER
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function mapRecord(rec: AirtableRecord): PreorderRecord {
  const f = rec.fields;
  return {
    id: rec.id,
    referenceNo: (f["Reference No"] as string) || "",
    name: (f["Name"] as string) || "",
    phone: (f["Telefon"] as string) || "",
    email: (f["Email"] as string) || "",
    status: ((f["Status"] as string) || "Pending") as PreorderStatus,
    quantity: typeof f["Kuantiti"] === "number" ? (f["Kuantiti"] as number) : 0,
    donation:
      typeof f["Sumbangan"] === "number" ? (f["Sumbangan"] as number) : 0,
    amount:
      typeof f["Jumlah Bayaran"] === "number"
        ? (f["Jumlah Bayaran"] as number)
        : 0,
    tarikhBayaran: (f["Tarikh Bayaran"] as string) || undefined,
  };
}

/** Create a new Preorder record (Status defaults to "Pending"). */
export async function createPreorderRecord(input: {
  name: string;
  phone: string;
  email?: string;
  quantity: number;
  donation?: number;
  amount: number;
  referenceNo: string;
  status?: PreorderStatus;
}): Promise<PreorderRecord | null> {
  const { token, baseId, table } = getConfig();
  if (!token || !baseId) {
    console.error("[airtable-preorder] Missing AIRTABLE_TOKEN/AIRTABLE_BASE_ID");
    return null;
  }

  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}`;

  // ─── Build fields with EXPLICIT type coercion ─────────────────────────────
  // Text fields → String(), Number fields → Number() (via sanitizer below).
  const rawFields: Record<string, unknown> = {
    Name: String(input.name || ""),
    Telefon: String(input.phone || ""),
    Status: String(input.status || "Pending"),
    Kuantiti: Number(input.quantity) || 0, // FORCE NUMBER
    Sumbangan: Number(input.donation) || 0, // FORCE NUMBER
    "Jumlah Bayaran": Number(input.amount) || 0, // FORCE NUMBER
    "Reference No": String(input.referenceNo || ""),
  };
  // Only include Email when provided (avoid sending "" to an Email column).
  if (input.email && input.email.trim()) {
    rawFields["Email"] = String(input.email).trim();
  }

  const fields = sanitizeAirtableFields(rawFields);
  console.log("📝 Airtable create fields:", JSON.stringify(fields, null, 2));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields, typecast: true }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `[airtable-preorder] create failed: ${res.status} ${errText}`
      );
      return null;
    }
    const data = (await res.json()) as AirtableRecord;
    console.log(`✅ Airtable record created: ${data.id}`);
    return mapRecord(data);
  } catch (err) {
    console.error("[airtable-preorder] create exception:", err);
    return null;
  }
}

/** Find a single record id by Reference No. */
async function findRecordIdByRef(referenceNo: string): Promise<string | null> {
  const { token, baseId, table } = getConfig();
  if (!token || !baseId) return null;

  const formula = `{Reference No} = "${referenceNo.replace(/"/g, '\\"')}"`;
  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(
    table
  )}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("[airtable-preorder] find failed:", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as { records: AirtableRecord[] };
    return data.records?.[0]?.id ?? null;
  } catch (err) {
    console.error("[airtable-preorder] find exception:", err);
    return null;
  }
}

/** Fetch a full record by Reference No (used by the success page). */
export async function getPreorderByRef(
  referenceNo: string
): Promise<PreorderRecord | null> {
  const { token, baseId, table } = getConfig();
  if (!token || !baseId) return null;

  const formula = `{Reference No} = "${referenceNo.replace(/"/g, '\\"')}"`;
  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(
    table
  )}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      // Always fetch fresh status for the success page
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { records: AirtableRecord[] };
    const rec = data.records?.[0];
    return rec ? mapRecord(rec) : null;
  } catch (err) {
    console.error("[airtable-preorder] get exception:", err);
    return null;
  }
}

/** Update Status (and optionally Tarikh Bayaran) by Reference No. */
export async function updatePreorderStatusByRef(
  referenceNo: string,
  status: PreorderStatus,
  tarikhBayaran?: string
): Promise<boolean> {
  const { token, baseId, table } = getConfig();
  if (!token || !baseId) return false;

  const recordId = await findRecordIdByRef(referenceNo);
  if (!recordId) {
    console.error("[airtable-preorder] update: record not found for", referenceNo);
    return false;
  }

  const fields: Record<string, unknown> = { Status: status };
  if (tarikhBayaran) fields["Tarikh Bayaran"] = tarikhBayaran;

  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}/${recordId}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields, typecast: true }),
    });
    if (!res.ok) {
      console.error("[airtable-preorder] update failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[airtable-preorder] update exception:", err);
    return false;
  }
}

/** Malaysia (Asia/Kuala_Lumpur) date in YYYY-MM-DD. */
export function malaysiaDate(): string {
  return new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Kuala_Lumpur" })
    .split(" ")[0];
}
