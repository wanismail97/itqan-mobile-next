// ─── Checkout Page — /checkout ────────────────────────────────────────────
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Lengkapkan maklumat untuk pesanan anda.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
