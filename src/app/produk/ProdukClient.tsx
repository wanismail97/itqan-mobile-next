// ─── Produk Client — Client-side search, filter, and grid ─────────────────
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Produk } from "@/types/airtable";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import ProductCard from "@/components/sections/ProductCard";

// ─── Kategori tetap (berdasarkan requirement) ────────────────────────────────
const KATEGORI_LIST = [
  "Semua",
  "Telefon",
  "Modem WiFi",
  "SIM Kad",
  "Aksesori",
] as const;

interface Props {
  products: Produk[];
  jenamaList: string[];
}

export default function ProdukClient({ products, jenamaList }: Props) {
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get("kategori");

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState(
    kategoriParam && KATEGORI_LIST.includes(kategoriParam as any)
      ? kategoriParam
      : "Semua"
  );
  const [jenama, setJenama] = useState("Semua");

  // Sync kategori state when the URL param changes (e.g. user navigates back)
  useEffect(() => {
    if (kategoriParam && KATEGORI_LIST.includes(kategoriParam as any)) {
      setKategori(kategoriParam);
    } else {
      setKategori("Semua");
    }
  }, [kategoriParam]);

  // ─── Filter logic ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Search: Nama, SKU, Jenama
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNama = p.Nama.toLowerCase().includes(q);
        const matchSKU = p.SKU.toLowerCase().includes(q);
        const matchJenama = p.Jenama.toLowerCase().includes(q);
        if (!matchNama && !matchSKU && !matchJenama) return false;
      }

      // Filter kategori
      if (kategori !== "Semua" && p.Kategori !== kategori) return false;

      // Filter jenama
      if (jenama !== "Semua" && p.Jenama !== jenama) return false;

      return true;
    });
  }, [products, search, kategori, jenama]);

  // ─── Reset filters ─────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearch("");
    setKategori("Semua");
    setJenama("Semua");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            {kategori !== "Semua" ? kategori : "Semua Produk"}
          </h1>

          {/* ─── Search & Filters ──────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk, SKU, atau jenama..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 bg-white shadow-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* ─── Filter Chips ─────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            {/* Kategori filter */}
            <div className="flex flex-wrap gap-2">
              {KATEGORI_LIST.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategori(kat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out min-h-[40px] ${
                    kategori === kat
                      ? "bg-accent text-primary shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent shadow-sm"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Jenama filter */}
            <select
              value={jenama}
              onChange={(e) => setJenama(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent shadow-sm transition-all duration-200 min-h-[40px]"
            >
              <option value="Semua">Semua Jenama</option>
              {jenamaList.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>

            {/* Reset */}
            {(search || kategori !== "Semua" || jenama !== "Semua") && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-400 hover:text-accent transition-colors underline ml-1"
              >
                Reset
              </button>
            )}
          </div>

          {/* ─── Results count ────────────────────────────────────────── */}
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} produk ditemui
          </p>

          {/* ─── Product Grid ─────────────────────────────────────────── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.airtableId} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Tiada Produk Dijumpai
              </h3>
              <p className="text-gray-500 mb-4">
                Cuba tukar carian atau filter anda.
              </p>
              <button
                onClick={resetFilters}
                className="bg-accent text-primary px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}
