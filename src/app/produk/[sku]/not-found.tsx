// ─── Product Detail 404 Page ───────────────────────────────────────────────
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk Tidak Dijumpai",
};

export default function ProdukNotFound() {
  return (
    <div className="bg-primary min-h-screen flex items-center justify-center px-4">
      <div className="text-center text-white max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold mb-4">Produk Tidak Dijumpai</h1>
        <p className="text-gray-300 mb-6">
          Maaf, produk dengan SKU tersebut tiada dalam pangkalan data kami.
        </p>
        <Link
          href="/produk"
          className="inline-block bg-accent text-primary px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition"
        >
          Lihat Semua Produk
        </Link>
      </div>
    </div>
  );
}
