// ─── Cart Page — /cart ─────────────────────────────────────────────────────
import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Bakul Beli-belah",
  description: "Lihat dan urus produk dalam bakul beli-belah anda.",
};

export default function CartPage() {
  return <CartClient />;
}
