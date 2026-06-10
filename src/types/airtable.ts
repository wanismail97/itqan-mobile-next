// ─── Types for Airtable Data ───────────────────────────────────────────────

// ─── Produk Table ────────────────────────────────────────────────────────────

/** Raw fields from the `Produk` Airtable table */
export interface ProdukFields {
  /** Product name (e.g. "iPhone 15 Pro Max 256GB") */
  Nama: string;
  /** Product category (e.g. "Telefon", "Aksesori", "SIM Kad") */
  Kategori: string;
  /** Brand name (e.g. "Apple", "Samsung") */
  Jenama: string;
  /** Stock keeping unit */
  SKU: string;
  /** Regular selling price in RM */
  "Harga RM": number;
  /** Promotional/sale price in RM (optional) */
  "Harga Promo RM"?: number;
  /** Current stock count */
  Stok: number;
  /** Warranty info text (e.g. "Waranti Rasmi 1 Tahun") */
  Waranti: string;
  /** Publication status (e.g. "Aktif", "Draf") */
  Status: string;
  /** Product description */
  Deskripsi?: string;
  /** Product image URL */
  "Gambar URL"?: string;
  /** Product variation options (e.g. "No Baru", "Port In") — defined in Airtable as Multiple Select.
   *  REST API returns this as a comma-separated string or array of strings depending on context. */
  Variasi?: string | string[];
  /** Whether this product is featured / highlighted */
  Ditonjolkan: boolean;
  /** Product highlights / key selling points — one per line (Long Text) */
  Highlights?: string;
}

/** A product record with its Airtable ID merged in */
export interface Produk extends ProdukFields {
  airtableId: string;
}

// ─── Servis Table (reserved for future use) ──────────────────────────────────

/** Raw fields from the `Servis` Airtable table */
export interface ServisFields {
  "Nama Servis": string;
  Kategori: string;
  "Harga RM"?: number;
  Deskripsi?: string;
  Ditonjolkan: boolean;
}

/** A service record with its Airtable ID merged in */
export interface Servis extends ServisFields {
  airtableId: string;
}

// ─── Generic Airtable API Types ──────────────────────────────────────────────

/** Raw Airtable API response shape */
export interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}

export interface AirtableResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// ─── Pesanan (Order) Table ───────────────────────────────────────────────────

export interface PesananFields {
  /** Unique order ID: ITQ-YYYYMMDD-XXX */
  "Order ID": string;
  /** Customer full name */
  Nama: string;
  /** Customer phone number */
  Telefon: string;
  /** Customer email (optional) */
  Email?: string;
  /** Total order amount in RM */
  Jumlah: number;
  /** Order status: Baru / Menunggu Bayaran / Dibayar / Diproses / Siap / Dibatalkan */
  Status: string;
  /** Type of items in order: Produk / Reload / Servis / Campuran */
  "Jenis Pesanan": string;
  /** Order date (ISO string) */
  Tarikh: string;
  /** ToyyibPay Bill Code for payment reference */
  "Rujukan Bayaran"?: string;
}

export interface Pesanan extends PesananFields {
  airtableId: string;
}

// ─── Item Pesanan (Order Item) Table ────────────────────────────────────────

export interface ItemPesananFields {
  /** Reference to Pesanan Order ID */
  "Order ID": string;
  /** Item name (product name / reload provider / service name) */
  "Nama Item": string;
  /** SKU or unique identifier */
  SKU: string;
  /** Quantity ordered */
  Kuantiti: number;
  /** Unit price or total price in RM */
  Harga: number;
  /** Product variation selected by customer (e.g. "No Baru", "Port In") — optional */
  "Variasi"?: string;
}

export interface ItemPesanan extends ItemPesananFields {
  airtableId: string;
}

// ─── Reviews Table ───────────────────────────────────────────────────────────

/** Raw fields from the `Reviews` Airtable table */
export interface ReviewFields {
  /** Product SKU this review belongs to */
  "Produk SKU": string;
  /** Customer name */
  Nama: string;
  /** Customer phone number */
  Telefon: string;
  /** Rating 1-5 */
  Rating: number;
  /** Review text */
  Review: string;
  /** Status: Pending / Approved */
  Status: string;
  /** Review date (ISO string) */
  Tarikh: string;
  /** Admin notes (optional) */
  "Admin Notes"?: string;
}

/** A review record with its Airtable ID merged in */
export interface Review extends ReviewFields {
  airtableId: string;
}



