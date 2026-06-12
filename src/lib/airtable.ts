// ─── Airtable API Client ────────────────────────────────────────────────────
// Thin wrapper around the Airtable REST API.
// Docs: https://airtable.com/developers/web/api/list-records

import { airtableConfig } from "./config";
import type {
  AirtableResponse,
  Produk,
  ProdukFields,
  ServisFields,
  PesananFields,
  ItemPesananFields,
  ReviewFields,
  Review,
  KodPromoFields,
  ShippingSettingsFields,
} from "@/types/airtable";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const { apiKey, baseId, tables } = airtableConfig;

const BASE_URL = `https://api.airtable.com/v0/${baseId}`;

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

/**
 * Fetch records from an Airtable table.
 * Generic over the fields type T (e.g. ProdukFields).
 */
async function fetchTable<T>(
  tableName: string,
  options?: {
    view?: string;
    maxRecords?: number;
    sort?: { field: string; direction: "asc" | "desc" }[];
    filterByFormula?: string;
  }
): Promise<AirtableResponse<T>> {
  const params = new URLSearchParams();

  if (options?.view) params.set("view", options.view);
  if (options?.maxRecords) params.set("maxRecords", String(options.maxRecords));
  if (options?.filterByFormula)
    params.set("filterByFormula", options.filterByFormula);
  if (options?.sort) {
    options.sort.forEach((s, i) => {
      params.set(`sort[${i}][field]`, s.field);
      params.set(`sort[${i}][direction]`, s.direction);
    });
  }

  const url = `${BASE_URL}/${encodeURIComponent(tableName)}?${params.toString()}`;

  // Cache for 5 minutes (ISR-compatible)
  const res = await fetch(url, { headers, next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error(
      `Airtable API error: ${res.status} ${res.statusText} — ${await res.text()}`
    );
  }

  return res.json();
}

/**
 * Map raw Airtable records to Produk objects.
 */
function mapRecords(records: { id: string; fields: ProdukFields }[]): Produk[] {
  return records.map((r) => ({ airtableId: r.id, ...r.fields }));
}

// ─── Public API Functions ────────────────────────────────────────────────────

/**
 * Fetch all active products from Airtable (Status = "Aktif").
 * Sorted by Nama A-Z.
 */
export async function getAllProducts(): Promise<Produk[]> {
  const data = await fetchTable<ProdukFields>(tables.produk, {
    filterByFormula: '{Status} = "Aktif"',
    sort: [{ field: "Nama", direction: "asc" }],
  });

  return mapRecords(data.records);
}

/**
 * Fetch a single product by its SKU field.
 * Returns null if not found.
 */
export async function getProductBySku(sku: string): Promise<Produk | null> {
  const data = await fetchTable<ProdukFields>(tables.produk, {
    filterByFormula: `{SKU} = "${sku.replace(/"/g, '\\"')}"`,
    maxRecords: 1,
  });

  if (data.records.length === 0) return null;
  const r = data.records[0];
  return { airtableId: r.id, ...r.fields };
}

/**
 * Fetch featured products for the homepage "Produk Terlaris" section.
 *
 * Rules:
 *   - Ditonjolkan = true (featured checkbox is ticked)
 *   - Status = "Aktif" (product is published)
 *   - Sorted by Nama A-Z
 */
export async function getFeaturedProducts(): Promise<Produk[]> {
  const data = await fetchTable<ProdukFields>(tables.produk, {
    filterByFormula:
      'AND({Ditonjolkan} = TRUE(), {Status} = "Aktif")',
    sort: [{ field: "Nama", direction: "asc" }],
    maxRecords: 8,
  });

  return mapRecords(data.records);
}

/**
 * Fetch accessories for the "Aksesori Wajib Ada" section.
 *
 * Rules:
 *   - Kategori = "Aksesori"
 *   - Status = "Aktif" (product is published)
 *   - Sorted by Nama A-Z
 */
export async function getAccessories(): Promise<Produk[]> {
  const data = await fetchTable<ProdukFields>(tables.produk, {
    filterByFormula:
      'AND({Kategori} = "Aksesori", {Status} = "Aktif")',
    sort: [{ field: "Nama", direction: "asc" }],
    maxRecords: 8,
  });

  return mapRecords(data.records);
}

/**
 * Fetch a single product by its Airtable record ID.
 */
export async function getProductById(id: string): Promise<Produk | null> {
  try {
    const url = `${BASE_URL}/${encodeURIComponent(tables.produk)}/${encodeURIComponent(id)}`;
    const res = await fetch(url, { headers, next: { revalidate: 300 } });

    if (!res.ok) return null;

    const data = await res.json();
    return { airtableId: data.id, ...data.fields };
  } catch {
    return null;
  }
}

/**
 * Fetch distinct brand names from active products.
 */
export async function getJenamaList(): Promise<string[]> {
  const data = await fetchTable<ProdukFields>(tables.produk, {
    filterByFormula: '{Status} = "Aktif"',
  });

  const jenamaSet = new Set<string>();
  for (const r of data.records) {
    if (r.fields.Jenama) jenamaSet.add(r.fields.Jenama);
  }

  return Array.from(jenamaSet).sort();
}

/**
 * Fetch reload / eWallet providers from Servis table.
 */
export async function getReloadProviders(): Promise<ServisFields[]> {
  const data = await fetchTable<ServisFields>(tables.servis, {
    filterByFormula:
      'OR({Kategori} = "Reload", {Kategori} = "eWallet")',
    sort: [{ field: "Nama Servis", direction: "asc" }],
  });
  return data.records.map((r) => r.fields);
}

/**
 * Fetch non-reload services from Servis table.
 */
export async function getServisList(): Promise<ServisFields[]> {
  const data = await fetchTable<ServisFields>(tables.servis, {
    filterByFormula:
      'AND({Kategori} != "Reload", {Kategori} != "eWallet")',
    sort: [{ field: "Nama Servis", direction: "asc" }],
  });
  return data.records.map((r) => r.fields);
}

// ─── Order Persistence ─────────────────────────────────────────────────────

/**
 * Generate a unique Order ID: ITQ-YYYYMMDD-XXX
 *
 * CRITICAL: Uses direct Airtable fetch with cache: "no-store"
 * because we MUST read the latest record every time to avoid
 * duplicate Order IDs. Next.js data cache (revalidate) is NOT used here.
 */
export async function generateOrderId(): Promise<string> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const prefix = `ITQ-${yyyy}${mm}${dd}-`;

  // Fetch existing orders today to determine the next sequence number.
  // Using direct fetch with cache: "no-store" — NEVER cache this call.
  const url = `${BASE_URL}/${encodeURIComponent(tables.pesanan)}?filterByFormula=${encodeURIComponent(`FIND("${prefix}", {Order ID}) = 1`)}&sort%5B0%5D%5Bfield%5D=Order%20ID&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=1`;

  const res = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Airtable generateOrderId error: ${res.status} ${res.statusText} — ${await res.text()}`
    );
  }

  const data: AirtableResponse<PesananFields> = await res.json();

  let seq = 1;
  if (data.records.length > 0) {
    const lastId = data.records[0].fields["Order ID"];
    const lastSeq = parseInt(lastId.slice(-3), 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }

  return `${prefix}${String(seq).padStart(3, "0")}`;
}

/**
 * Create a new order (Pesanan) in Airtable.
 */
export async function createOrder(order: PesananFields): Promise<string | null> {
  try {
    const url = `${BASE_URL}/${encodeURIComponent(tables.pesanan)}`;

    const payload = {
  records: [{
    fields: {
      ...order,
      Jumlah: Number(order.Jumlah),
    },
  }],
};

console.log(
  "JUMLAH DEBUG:",
  order.Jumlah,
  typeof order.Jumlah,
  Number(order.Jumlah)
);

    // 🐛 DEBUG: Log exact Airtable payload
    console.log("AIRTABLE CREATE ORDER");
    console.log(JSON.stringify(payload, null, 2));
    console.log("AIRTABLE FIELD TYPES IN PAYLOAD:");
    for (const [key, value] of Object.entries(order)) {
      console.log(`  ${key}: type=${typeof value}, value=${JSON.stringify(value)}`);
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Airtable createOrder error:", await res.text());
      return null;
    }

    const data = await res.json();
    return data.records?.[0]?.id || null;
  } catch (err) {
    console.error("Airtable createOrder exception:", err);
    return null;
  }
}

/**
 * Create multiple order items (Item Pesanan) in Airtable.
 */
export async function createOrderItems(
  items: ItemPesananFields[]
): Promise<boolean> {
  try {
    const url = `${BASE_URL}/${encodeURIComponent(tables.itemPesanan)}`;
    // Airtable allows up to 10 records per request; chunk if needed
    for (let i = 0; i < items.length; i += 10) {
      const chunk = items.slice(i, i + 10);
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          records: chunk.map((fields) => ({ fields })),
        }),
      });

      if (!res.ok) {
        console.error("Airtable createOrderItems error:", await res.text());
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("Airtable createOrderItems exception:", err);
    return false;
  }
}

/**
 * Fetch a single order by its Order ID field.
 * Returns null if not found.
 */
export async function getOrderByOrderId(orderId: string): Promise<PesananFields | null> {
  try {
    const data = await fetchTable<PesananFields>(tables.pesanan, {
      filterByFormula: `{Order ID} = "${orderId.replace(/"/g, '\\"')}"`,
      maxRecords: 1,
    });

    if (data.records.length === 0) return null;
    return data.records[0].fields;
  } catch (err) {
    console.error("Airtable getOrderByOrderId error:", err);
    return null;
  }
}

/**
 * Update the status and optional payment reference of an order in Airtable.
 * Uses the Order ID field to find the record.
 */
export async function updateOrderStatus(
  orderId: string,
  updates: {
    Status?: string;
    "Rujukan Bayaran"?: string;
    "Order Items"?: string;
  }
): Promise<boolean> {
  try {
    // First, find the Airtable record ID for this Order ID
    const findUrl = `${BASE_URL}/${encodeURIComponent(tables.pesanan)}?filterByFormula=${encodeURIComponent(`{Order ID} = "${orderId.replace(/"/g, '\\"')}"`)}`;
    const findRes = await fetch(findUrl, { headers });

    if (!findRes.ok) {
      console.error("Airtable updateOrderStatus find error:", await findRes.text());
      return false;
    }

    const findData = await findRes.json();
    if (!findData.records || findData.records.length === 0) {
      console.error("Airtable updateOrderStatus: order not found:", orderId);
      return false;
    }

    const recordId = findData.records[0].id;

    // Update the record
    const updateUrl = `${BASE_URL}/${encodeURIComponent(tables.pesanan)}`;
    const updateRes = await fetch(updateUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        records: [
          {
            id: recordId,
            fields: updates,
          },
        ],
      }),
    });

    if (!updateRes.ok) {
      console.error("Airtable updateOrderStatus error:", await updateRes.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("Airtable updateOrderStatus exception:", err);
    return false;
  }
}

// ─── Stock Validation & Deduction ──────────────────────────────────────────

/**
 * Get the Airtable record ID and fields for a product by its SKU.
 * Uses no-store cache to always read the latest stock value.
 */
async function getProductRecordBySku(sku: string): Promise<{ recordId: string; fields: ProdukFields } | null> {
  try {
    const url = `${BASE_URL}/${encodeURIComponent(tables.produk)}?filterByFormula=${encodeURIComponent(`{SKU} = "${sku.replace(/"/g, '\\"')}"`)}&maxRecords=1`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.records || data.records.length === 0) return null;
    return { recordId: data.records[0].id, fields: data.records[0].fields as ProdukFields };
  } catch {
    return null;
  }
}

/**
 * Deduct stock for a product identified by SKU.
 * Updates the Stok field in Airtable.
 * Returns the new stock value, or null on failure.
 */
export async function deductProductStock(sku: string, quantity: number): Promise<number | null> {
  try {
    const product = await getProductRecordBySku(sku);
    if (!product) {
      console.error(`deductProductStock: Product not found for SKU "${sku}"`);
      return null;
    }

    const currentStock = typeof product.fields.Stok === "number" ? product.fields.Stok : 0;
    const newStock = currentStock - quantity;

    if (newStock < 0) {
      console.error(`deductProductStock: Insufficient stock for SKU "${sku}". Current: ${currentStock}, requested: ${quantity}`);
      return null;
    }

    const updateUrl = `${BASE_URL}/${encodeURIComponent(tables.produk)}`;
    const res = await fetch(updateUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        records: [{ id: product.recordId, fields: { Stok: newStock } }],
      }),
    });

    if (!res.ok) {
      console.error(`deductProductStock: Airtable update error for SKU "${sku}": ${await res.text()}`);
      return null;
    }

    console.log(`deductProductStock: SKU "${sku}" stock reduced from ${currentStock} to ${newStock}`);
    return newStock;
  } catch (err) {
    console.error(`deductProductStock exception for SKU "${sku}":`, err);
    return null;
  }
}

/**
 * Fetch order items (Item Pesanan) for a given Order ID.
 */
export async function getOrderItemsByOrderId(orderId: string): Promise<ItemPesananFields[]> {
  try {
    const data = await fetchTable<ItemPesananFields>(tables.itemPesanan, {
      filterByFormula: `{Order ID} = "${orderId.replace(/"/g, '\\"')}"`,
    });
    return data.records.map((r) => r.fields);
  } catch (err) {
    console.error("Airtable getOrderItemsByOrderId error:", err);
    return [];
  }
}

/**
 * Extract product SKU from an order item.
 * Handles both plain SKU and "SKU: XXX x5" format.
 */
function extractSku(sku: string): string {
  const trimmed = sku.trim();
  if (trimmed.startsWith("SKU: ")) {
    return trimmed.replace(/^SKU: /, "").split(" x")[0].trim();
  }
  return trimmed;
}

/**
 * Validate stock availability for a list of order items before checkout.
 * Each item MUST have fields: SKU (or detail containing SKU) and Kuantiti.
 * Returns an array of error messages (empty array if stock is sufficient).
 */
export async function validateStockForItems(
  items: { SKU: string; Kuantiti: number }[]
): Promise<string[]> {
  const errors: string[] = [];

  for (const item of items) {
    const sku = extractSku(item.SKU);

    const product = await getProductRecordBySku(sku);
    if (!product) {
      errors.push(`Produk "${sku}" tidak dijumpai`);
      continue;
    }

    const availableStock = typeof product.fields.Stok === "number" ? product.fields.Stok : 0;
    if (item.Kuantiti > availableStock) {
      errors.push(
        `Stok "${product.fields.Nama || sku}" tidak mencukupi. Stok semasa: ${availableStock}, diperlukan: ${item.Kuantiti}`
      );
    }
  }

  return errors;
}

/**
 * Deduct stock for all product items in an order.
 * Used after payment is confirmed (Status → Dibayar).
 * Only deducts for product-type items (SKU field contains a product SKU).
 */
export async function deductStockForOrderItems(items: ItemPesananFields[]): Promise<boolean> {
  let allSucceeded = true;

  for (const item of items) {
    const sku = extractSku(item.SKU);
    const result = await deductProductStock(sku, item.Kuantiti);
    if (result === null) {
      allSucceeded = false;
    }
  }

  return allSucceeded;
}

// ─── Promo Code ────────────────────────────────────────────────────────────

/**
 * Fetch a single promo code by its Code field.
 * Only returns active, non-expired codes with remaining usage.
 * Returns null if not found, inactive, expired, or usage limit reached.
 */
export async function getPromoCode(code: string): Promise<KodPromoFields | null> {
  try {
    const data = await fetchTable<KodPromoFields>(tables.kodPromo, {
      filterByFormula: `AND({Code} = "${code.replace(/"/g, '\\"')}", {Active} = TRUE())`,
      maxRecords: 1,
    });

    if (data.records.length === 0) return null;

    const promo = data.records[0].fields;

    // Check expiry
    if (promo["Expiry Date"]) {
      const now = new Date().toISOString().split("T")[0];
      if (promo["Expiry Date"] < now) return null;
    }

    // Check usage limit
    if (promo["Usage Limit"] != null && promo["Usage Count"] != null) {
      if (promo["Usage Count"] >= promo["Usage Limit"]) return null;
    }

    return promo;
  } catch (err) {
    console.error("Airtable getPromoCode error:", err);
    return null;
  }
}

/**
 * Increment the usage count for a promo code.
 * Called after successful payment callback.
 */
export async function incrementPromoUsage(code: string): Promise<boolean> {
  try {
    const data = await fetchTable<KodPromoFields>(tables.kodPromo, {
      filterByFormula: `{Code} = "${code.replace(/"/g, '\\"')}"`,
      maxRecords: 1,
    });

    if (data.records.length === 0) return false;

    const record = data.records[0];
    const currentCount = record.fields["Usage Count"] || 0;

    const updateUrl = `${BASE_URL}/${encodeURIComponent(tables.kodPromo)}`;
    const res = await fetch(updateUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        records: [{ id: record.id, fields: { "Usage Count": currentCount + 1 } }],
      }),
    });

    if (!res.ok) {
      console.error("Airtable incrementPromoUsage error:", await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("Airtable incrementPromoUsage exception:", err);
    return false;
  }
}

// ─── Shipping ──────────────────────────────────────────────────────────────

/**
 * Fetch all shipping rates from Shipping Settings table.
 */
export async function getShippingRates(): Promise<ShippingSettingsFields[]> {
  try {
    const data = await fetchTable<ShippingSettingsFields>(tables.shippingSettings);
    return data.records.map((r) => r.fields);
  } catch (err) {
    console.error("Airtable getShippingRates error:", err);
    return [];
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

/**
 * Create a new review in Airtable Reviews table.
 * Status is automatically set to "Pending".
 * Automatically fetches the product name from the Produk table using the SKU.
 */
export async function createReview(
  sku: string,
  nama: string,
  telefon: string,
  rating: number,
  review: string
): Promise<boolean> {
  try {
    // ─── Fetch product name for reference ────────────────────────────
    let productNama = "";
    try {
      const product = await getProductBySku(sku);
      if (product) productNama = product.Nama;
    } catch {
      // If product lookup fails, still proceed without the name
    }

    const url = `${BASE_URL}/${encodeURIComponent(tables.reviews)}`;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Produk SKU": sku,
              "Produk Nama": productNama,
              Nama: nama,
              Telefon: telefon,
              Rating: rating,
              Review: review,
              Status: "Pending",
              Tarikh: today,
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Airtable createReview error:", await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("Airtable createReview exception:", err);
    return false;
  }
}

/**
 * Fetch approved reviews for a given product SKU.
 * Only returns reviews with Status = "Approved".
 * Sorted by Tarikh descending (newest first).
 */
export async function getApprovedReviewsBySku(sku: string): Promise<Review[]> {
  try {
    const data = await fetchTable<ReviewFields>(tables.reviews, {
      filterByFormula: `AND({Status} = "Approved", {Produk SKU} = "${sku.replace(/"/g, '\\"')}")`,
      sort: [{ field: "Tarikh", direction: "desc" }],
    });

    return data.records.map((r) => ({
      airtableId: r.id,
      ...r.fields,
    }));
  } catch (err) {
    console.error("Airtable getApprovedReviewsBySku error:", err);
    return [];
  }
}
