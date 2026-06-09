// ─── Payment Success Page ──────────────────────────────────────────────────
// /payment/success?orderId=ITQ-20260608-001
// Verifies payment status with ToyyibPay before showing success.

import type { Metadata } from "next";
import PaymentSuccessClient from "./PaymentSuccessClient";

export const metadata: Metadata = {
  title: "Pembayaran Berjaya",
  description: "Pembayaran anda telah berjaya diproses.",
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessClient />;
}
