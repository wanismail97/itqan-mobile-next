// ─── Related Products — Auto-scrolling carousel with tabs ──────────────────
// Tab 1: Produk Berkaitan. Tab 2: Produk Lain. Auto-scroll infinite carousel.
"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type { Produk } from "@/types/airtable";
import ProductCard from "./ProductCard";

interface Props {
  currentSku: string;
  allProducts: Produk[];
}

export default function RelatedProducts({ currentSku, allProducts }: Props) {
  const [activeTab, setActiveTab] = useState<"related" | "other">("related");
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { related, other } = useMemo(() => {
    const current = allProducts.find((p) => p.SKU === currentSku);
    const exclude = (p: Produk) => p.SKU !== currentSku;
    const active = allProducts.filter((p) => p.Status === "Aktif" && exclude(p));

    // ─── Tab 1: Produk Berkaitan ─────────────────────────────────────
    const related: Produk[] = [];
    const used = new Set<string>();

    if (current) {
      const sameKategori = active.filter(
        (p) => p.Kategori === current.Kategori && !used.has(p.SKU)
      );
      for (const p of sameKategori) {
        if (related.length >= 8) break;
        related.push(p);
        used.add(p.SKU);
      }

      const sameJenama = active.filter(
        (p) => p.Jenama === current.Jenama && !used.has(p.SKU)
      );
      for (const p of sameJenama) {
        if (related.length >= 8) break;
        related.push(p);
        used.add(p.SKU);
      }
    }

    for (const p of active) {
      if (related.length >= 8) break;
      if (!used.has(p.SKU)) {
        related.push(p);
        used.add(p.SKU);
      }
    }

    // ─── Tab 2: Produk Lain ──────────────────────────────────────────
    const other: Produk[] = [];
    const otherUsed = new Set<string>();

    const featured = active.filter((p) => p.Ditonjolkan && !otherUsed.has(p.SKU));
    for (const p of featured) {
      if (other.length >= 8) break;
      other.push(p);
      otherUsed.add(p.SKU);
    }

    for (const p of active) {
      if (other.length >= 8) break;
      if (!otherUsed.has(p.SKU)) {
        other.push(p);
        otherUsed.add(p.SKU);
      }
    }

    return { related, other };
  }, [allProducts, currentSku]);

  const products = activeTab === "related" ? related : other;

  // Duplicate array for seamless infinite scroll
  const duplicated = useMemo(
    () => [...products, ...products],
    [products]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isPaused) {
      el.style.animationPlayState = "paused";
    } else {
      el.style.animationPlayState = "running";
    }
  }, [isPaused]);

  // Restart animation when tab changes
  const switchTab = useCallback((tab: "related" | "other") => {
    setActiveTab(tab);
    const el = scrollRef.current;
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight; // force reflow
      el.style.animation = "";
    }
  }, []);

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
      <div className="flex justify-center gap-1 mb-10 border-b border-gray-200">
        <button
          onClick={() => switchTab("related")}
          className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out min-h-[44px] rounded-t-sm
            ${
              activeTab === "related"
                ? "bg-primary text-white -translate-y-0.5 shadow-md shadow-primary/15 z-10"
                : "bg-transparent text-gray-400 hover:text-primary hover:bg-gray-50"
            }`}
        >
          Produk Berkaitan
        </button>
        <button
          onClick={() => switchTab("other")}
          className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out min-h-[44px] rounded-t-sm
            ${
              activeTab === "other"
                ? "bg-primary text-white -translate-y-0.5 shadow-md shadow-primary/15 z-10"
                : "bg-transparent text-gray-400 hover:text-primary hover:bg-gray-50"
            }`}
        >
          Produk Lain
        </button>
      </div>

      {/* ─── Auto-scrolling Carousel ─────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className="flex animate-scroll gap-6"
          style={{ width: "max-content" }}
        >
          {duplicated.map((p, idx) => (
            <div
              key={`${p.airtableId}-${idx}`}
              className="min-w-[180px] max-w-[200px] sm:min-w-[190px] sm:max-w-[220px] md:min-w-[180px] md:max-w-[210px] flex-shrink-0"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}