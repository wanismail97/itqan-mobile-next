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
    <section className="py-16 px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-primary mb-10">
          🔥 Produk Terlaris Minggu Ini
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.airtableId} product={product} />
          ))}
        </div>

        {/* Lihat Semua button */}
        <div className="text-center mt-10">
          <Link
            href="/produk"
            className="inline-block bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition duration-300 transform hover:scale-105"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  );
}
