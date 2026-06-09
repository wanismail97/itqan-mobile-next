// ─── Payment Failed Page ───────────────────────────────────────────────────
// /payment/failed?orderId=ITQ-20260608-001

import type { Metadata } from "next";
import PaymentFailedClient from "./PaymentFailedClient";

export const metadata: Metadata = {
  title: "Pembayaran Gagal",
  description: "Pembayaran tidak dapat diproses.",
};

export default function PaymentFailedPage() {
  return <PaymentFailedClient />;
}
