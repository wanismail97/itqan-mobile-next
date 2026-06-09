// ─── Cart Types ──────────────────────────────────────────────────────────────

/** A standard product item in the shopping cart */
export interface ProductCartItem {
  /** Discriminator — always "product" */
  type: "product";
  /** Airtable record ID */
  airtableId: string;
  /** Product SKU (used for product page links) */
  SKU: string;
  /** Product name */
  Nama: string;
  /** Product image URL */
  "Gambar URL"?: string;
  /** Jenama / brand name */
  Jenama: string;
  /** Unit price (takes promo price if available) */
  price: number;
  /** Original price (for display, before promo) */
  originalPrice: number;
  /** Quantity selected */
  quantity: number;
  /** Product variation selected by customer (e.g. "No Baru", "Port In") */
  variasi?: string;
}

/** A reload (top-up) item in the shopping cart */
export interface ReloadCartItem {
  /** Discriminator — always "reload" */
  type: "reload";
  /** Unique ID based on provider + phone for deduplication */
  id: string;
  /** Provider name (e.g. "Hotlink", "CelcomDigi") */
  provider: string;
  /** Customer phone number */
  phoneNumber: string;
  /** Reload amount in RM */
  amount: number;
  /** Always 1 for reloads */
  quantity: 1;
}

/** A service item in the shopping cart */
export interface ServiceCartItem {
  /** Discriminator — always "service" */
  type: "service";
  /** Unique ID based on service name + account/phone for deduplication */
  id: string;
  /** Service name (e.g. "Bil Elektrik", "SIM Registration") */
  serviceName: string;
  /** Account number (for bill payments) */
  accountNumber?: string;
  /** Customer name (for SIM services) */
  customerName?: string;
  /** Phone number (for SIM services) */
  phoneNumber?: string;
  /** Amount to pay (for bill payments) */
  amount?: number;
  /** Always 1 for services */
  quantity: 1;
}

/** Union type of all possible cart items */
export type CartItem = ProductCartItem | ReloadCartItem | ServiceCartItem;

/** The full cart stored in localStorage */
export interface Cart {
  items: CartItem[];
}
