// ─── Accessories Grid — "Aksesori Wajib Ada" ──────────────────────────────

import type { Produk } from "@/types/airtable";
import ProductCard from "./ProductCard";

interface Props {
  accessories: Produk[];
}

export default function AccessoriesGrid({ accessories }: Props) {
  if (!accessories || accessories.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center text-primary mb-10">
          🎧 Aksesori Wajib Ada
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map((product) => (
            <ProductCard key={product.airtableId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
