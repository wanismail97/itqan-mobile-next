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
    <section className="py-16 px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-center text-primary mt-12 mb-8">
          🎧 Aksesori Wajib Ada
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map((product) => (
            <ProductCard key={product.airtableId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
