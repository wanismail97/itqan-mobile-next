// ─── Preorder KTB — Type Definitions (ISOLATED FEATURE) ───────────────────
// Used ONLY by the /preorder-ktb Curlec payment flow.
// Safe to delete together with the rest of the preorder-ktb feature.

export type PreorderStatus = "Pending" | "Paid" | "Cancelled";

/** Raw input accepted from the client form. Amount is recomputed server-side. */
export interface PreorderInput {
  name: string;
  phone: string;
  email?: string;
  quantity: number; // MUST BE NUMBER
  donation: number; // MUST BE NUMBER
}

/** A normalized preorder record (after Airtable mapping). */
export interface PreorderRecord {
  id: string;
  referenceNo: string;
  name: string;
  phone: string;
  email: string;
  status: PreorderStatus;
  quantity: number; // MUST BE NUMBER
  donation: number; // MUST BE NUMBER (maps to Airtable "Sumbangan")
  amount: number; // MUST BE NUMBER (maps to Airtable "Jumlah Bayaran")
  tarikhBayaran?: string;
}

/** Response returned by POST /api/curlec-payment/create */
export interface CreatePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  referenceNo?: string;
  orderId?: string;
  error?: string;
}

/** Base price per set (RM) — single source of truth for the server. */
export const PREORDER_BASE_PRICE = 100;
