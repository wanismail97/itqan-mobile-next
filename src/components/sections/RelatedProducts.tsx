// ─── Related Products — Tabbed section below reviews ──────────────────────
// Tab 1: Produk Berkaitan (same kategori → same jenama → other active)
// Tab 2: Produk Lain (featured → random active, excluding already-shown)
"use client";

import { useMemo, useState } from "react";
import type { Produk } from "@/types/airtable";
import ProductCard from "./ProductCard";

interface Props {
  currentSku: string;
  allProducts: Produk[];
}

export default function RelatedProducts({ currentSku, allProducts }: Props) {
  const [activeTab, setActiveTab] = useState<"related" | "other">("related");

  const { related, other } = useMemo(() => {
    const current = allProducts.find((p) => p.SKU === currentSku);
    const exclude = (p: Produk) => p.SKU !== currentSku;
    const active = allProducts.filter((p) => p.Status === "Aktif" && exclude(p));

    // ─── Tab 1: Produk Berkaitan ─────────────────────────────────────
    const related: Produk[] = [];
    const used = new Set<string>();

    if (current) {
      // Priority 1: Same kategori
      const sameKategori = active.filter(
        (p) => p.Kategori === current.Kategori && !used.has(p.SKU)
      );
      for (const p of sameKategori) {
        if (related.length >= 4) break;
        related.push(p);
        used.add(p.SKU);
      }

      // Priority 2: Same jenama
      const sameJenama = active.filter(
        (p) => p.Jenama === current.Jenama && !used.has(p.SKU)
      );
      for (const p of sameJenama) {
        if (related.length >= 4) break;
        related.push(p);
        used.add(p.SKU);
      }
    }

    // Priority 3: Any remaining active (fill to 4)
    for (const p of active) {
      if (related.length >= 4) break;
      if (!used.has(p.SKU)) {
        related.push(p);
        used.add(p.SKU);
      }
    }

    // ─── Tab 2: Produk Lain ──────────────────────────────────────────
    const other: Produk[] = [];
    const otherUsed = new Set<string>();

    // First: featured products
    const featured = active.filter((p) => p.Ditonjolkan && !otherUsed.has(p.SKU));
    for (const p of featured) {
      if (other.length >= 4) break;
      other.push(p);
      otherUsed.add(p.SKU);
    }

    // Then: fill remaining with active products not in related
    for (const p of active) {
      if (other.length >= 4) break;
      if (!otherUsed.has(p.SKU)) {
        other.push(p);
        otherUsed.add(p.SKU);
      }
    }

    return { related, other };
  }, [allProducts, currentSku]);

  const products = activeTab === "related" ? related : other;

  if (products.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-100 pt-10">
      {/* ─── Section Header ──────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          ✨ Terokai Produk Lain
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          SIM, telefon, aksesori dan perkhidmatan digital pilihan
        </p>
      </div>

      {/* ─── Tab Headers ─────────────────────────────────────────────── */}
      <div className="flex justify-center border-b border-gray-200 mb-10">
        <button
          onClick={() => setActiveTab("related")}
          className={`px-5 py-3.5 text-sm font-semibold rounded-t-xl transition-colors min-h-[48px] ${
            activeTab === "related"
              ? "bg-primary text-white"
              : "bg-transparent text-gray-500 hover:text-primary border border-b-0 border-gray-200"
          }`}
        >
          Produk Berkaitan
        </button>
        <button
          onClick={() => setActiveTab("other")}
          className={`px-5 py-3.5 text-sm font-semibold rounded-t-xl transition-colors min-h-[48px] ${
            activeTab === "other"
              ? "bg-primary text-white"
              : "bg-transparent text-gray-500 hover:text-primary border border-b-0 border-gray-200"
          }`}
        >
          Produk Lain
        </button>
      </div>

      {/* ─── Mobile: Horizontal scroll ───────────────────────────────── */}
      <div className="md:hidden -mx-1 px-1">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {products.map((p) => (
            <div
              key={p.airtableId}
              className="min-w-[220px] max-w-[260px] flex-shrink-0 snap-start"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Desktop: Responsive grid ────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.airtableId} product={p} />
        ))}
      </div>
    </section>
  );
}