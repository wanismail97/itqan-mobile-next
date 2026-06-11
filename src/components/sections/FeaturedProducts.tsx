// ─── Featured Products Grid — "Produk Terlaris Minggu Ini" ────────────────

import type { Produk } from "@/types/airtable";
import ProductCard from "./ProductCard";
import Link from "next/link";

interface Props {
  products: Produk[];
}

export default function FeaturedProducts({ products }: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Produk Popular
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Pilihan terbaik untuk anda — berkualiti, original dan harga berpatutan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.airtableId} product={product} />
          ))}
        </div>

        {/* Lihat Semua button */}
        <div className="text-center mt-10">
          <Link
            href="/produk"
            className="btn-premium inline-block bg-accent text-primary px-10 py-3.5 rounded-full font-semibold hover:bg-accent/90 shadow-md hover:shadow-accent/20 min-h-[44px]"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  );
}
