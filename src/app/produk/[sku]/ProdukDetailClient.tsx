// ─── Product Detail Client ─────────────────────────────────────────────────
"use client";

import { useState, useMemo } from "react";
import type { Produk } from "@/types/airtable";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";
import { waProductMessage } from "@/lib/utils";
import Link from "next/link";
import ProductPlaceholder from "@/components/sections/ProductPlaceholder";

interface Props {
  product: Produk;
  waPhone: string;
}

export default function ProdukDetailClient({ product, waPhone }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedVariasi, setSelectedVariasi] = useState("");

  const hasPromo = product["Harga Promo RM"] != null;
  const displayPrice = hasPromo ? product["Harga Promo RM"]! : product["Harga RM"];
  const inStock = product.Stok > 0;
  const waLink = waProductMessage(product.Nama, product.SKU, waPhone);

  // ─── Parse variations from Airtable's Multiple Select ─────────────────
  const variasiOptions: string[] = useMemo(() => {
    if (!product.Variasi) return [];
    // Airtable Multiple Select can return string (comma-separated) or array
    if (Array.isArray(product.Variasi)) return product.Variasi;
    return product.Variasi.split(",").map((v: string) => v.trim()).filter(Boolean);
  }, [product.Variasi]);

  const hasVariasi = variasiOptions.length > 0;
  const variasiValid = !hasVariasi || selectedVariasi !== "";

  const handleAddToCart = () => {
    addItem({
      type: "product",
      airtableId: product.airtableId,
      SKU: product.SKU,
      Nama: product.Nama,
      "Gambar URL": product["Gambar URL"],
      Jenama: product.Jenama,
      price: displayPrice,
      originalPrice: product["Harga RM"],
      quantity,
      ...(hasVariasi ? { variasi: selectedVariasi } : {}),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/produk" className="hover:text-accent">
              Produk
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.Nama}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
              {product["Gambar URL"] ? (
                <img
                  src={product["Gambar URL"]}
                  alt={product.Nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProductPlaceholder label={product.Nama} />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {product.Nama}
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
                <span>Jenama: <strong>{product.Jenama}</strong></span>
                <span>SKU: <strong>{product.SKU}</strong></span>
                <span>Kategori: <strong>{product.Kategori}</strong></span>
              </div>

              {/* Price */}
              <div className="mb-4">
                {hasPromo ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-accent">
                      RM{displayPrice.toLocaleString("ms-MY")}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      RM{product["Harga RM"].toLocaleString("ms-MY")}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                      Promo
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-accent">
                    RM{displayPrice.toLocaleString("ms-MY")}
                  </span>
                )}
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {product.Waranti && (
                  <span className="inline-block bg-accent/20 text-accent text-xs px-3 py-1 rounded-full">
                    {product.Waranti}
                  </span>
                )}
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full ${
                    inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {inStock ? `Stok: ${product.Stok}` : "Stok Habis"}
                </span>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {product.Status}
                </span>
              </div>

              {/* Description */}
              {product.Deskripsi && (
                <div className="mb-6">
                  <h3 className="font-semibold text-primary mb-2">Deskripsi</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                    {product.Deskripsi}
                  </p>
                </div>
              )}

              {/* ─── Variation Selector ─────────────────────────────── */}
              {hasVariasi && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Variasi <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {variasiOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariasi(opt)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition duration-200 ${
                          selectedVariasi === opt
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {!variasiValid && (
                    <p className="text-xs text-red-500 mt-1">
                      Sila pilih variasi
                    </p>
                  )}
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-gray-700">Kuantiti:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    aria-label="Kurang"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.Stok, quantity + 1))
                    }
                    disabled={quantity >= product.Stok}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition disabled:opacity-30"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || (hasVariasi && !variasiValid)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition duration-300 ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {added ? "✓ Ditambah ke Bakul" : "Tambah ke Bakul"}
                </button>

                {hasVariasi ? (
                  <Link
                    href={
                      variasiValid
                        ? `/checkout?sku=${product.SKU}&qty=${quantity}&variasi=${encodeURIComponent(selectedVariasi)}`
                        : "#"
                    }
                    className={`flex-1 text-center py-3 rounded-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-primary transition duration-300 ${
                      !inStock || !variasiValid
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    Beli Sekarang
                  </Link>
                ) : (
                  <Link
                    href={`/checkout?sku=${product.SKU}&qty=${quantity}`}
                    className={`flex-1 text-center py-3 rounded-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-primary transition duration-300 ${
                      !inStock ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Beli Sekarang
                  </Link>
                )}

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 rounded-lg font-semibold bg-[#25D366] text-white hover:bg-[#1da851] transition duration-300"
                >
                  Tanya Produk
                </a>
              </div>

              {/* Additional info */}
              <div className="border-t border-gray-200 pt-4 text-sm text-gray-500 space-y-1">
                <p>✅ Waranti rasmi termasuk</p>
                <p>🚚 Penghantaran ke seluruh Malaysia (1-3 hari bekerja)</p>
                <p>💳 Bayaran: Online transfer, DuitNow, bank transfer</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}
