// ─── Pre-Order Kitab Page — /preorder-ktb ─────────────────────────────────
// Halaman kutipan bayaran khas untuk pra-tempahan kitab.
// BUKAN flow produk: tiada ProductCard, tiada SKU, tiada cart, tiada checkout
// produk, tiada katalog. Borang kutipan sahaja (lihat PreorderKtbForm).
//
// Halaman ini di-embed sebagai iframe oleh:
//   https://dftrhadis.pondokgajahmati.com.my
// (CSP frame-ancestors dikonfigurasi untuk route ini sahaja di next.config.js)
import type { Metadata } from "next";
import PreorderKtbForm from "@/components/preorder/PreorderKtbForm";

export const metadata: Metadata = {
  title: "Pre-Order Kitab Sunan Abi Daud",
  description:
    "Kutipan bayaran pra-tempahan Kitab Sunan Abi Daud (2 Jilid) — Maktabah Dar Omar Mukhtar.",
  robots: { index: false, follow: false },
};

export default function PreorderKtbPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-inter antialiased">
      <div className="max-w-md mx-auto">
        <PreorderKtbForm />
      </div>
    </main>
  );
}
