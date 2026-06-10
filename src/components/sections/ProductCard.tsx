// ─── Product Card — Reusable single product card with cart integration ─────
// Displays product image, name, brand, SKU, price, promo price (if any),
// stock status, "Tambah ke Bakul" button, and "Beli Sekarang" link.
"use client";

import { useState, useMemo } from "react";
import type { Produk } from "@/types/airtable";
import ProductPlaceholder from "./ProductPlaceholder";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

interface Props {
  product: Produk;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"cart" | "buy">("cart");
  const [selectedVariasi, setSelectedVariasi] = useState("");
  const [modalQty, setModalQty] = useState(1);

  const hasPromo = product["Harga Promo RM"] != null;
  const displayPrice = hasPromo
    ? (product["Harga Promo RM"] as number)
    : product["Harga RM"];
  const inStock = product.Stok > 0;
  const productUrl = `/produk/${product.SKU}`;
  const modalTotal = displayPrice * modalQty;

  // ─── Parse variations (same logic as ProdukDetailClient) ──────────────
  const variasiOptions: string[] = useMemo(() => {
    if (!product.Variasi) return [];
    if (Array.isArray(product.Variasi)) return product.Variasi;
    return product.Variasi.split(",").map((v: string) => v.trim()).filter(Boolean);
  }, [product.Variasi]);

  const hasVariasi = variasiOptions.length > 0;

  const openModal = (mode: "cart" | "buy") => {
    setSelectedVariasi("");
    setModalQty(1);
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleModalQtyChange = (raw: string) => {
    const val = parseInt(raw, 10);
    if (isNaN(val) || val < 1) setModalQty(1);
    else if (val > product.Stok) setModalQty(product.Stok);
    else setModalQty(val);
  };

  const handleModalAddToCart = () => {
    addItem({
      type: "product",
      airtableId: product.airtableId,
      SKU: product.SKU,
      Nama: product.Nama,
      "Gambar URL": product["Gambar URL"],
      Jenama: product.Jenama,
      price: displayPrice,
      originalPrice: product["Harga RM"],
      quantity: modalQty,
      variasi: selectedVariasi,
    });
    setModalOpen(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddToCart = () => {
    if (hasVariasi) {
      openModal("cart");
      return;
    }
    addItem({
      type: "product",
      airtableId: product.airtableId,
      SKU: product.SKU,
      Nama: product.Nama,
      "Gambar URL": product["Gambar URL"],
      Jenama: product.Jenama,
      price: displayPrice,
      originalPrice: product["Harga RM"],
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    if (hasVariasi) {
      e.preventDefault();
      openModal("buy");
    }
  };

  const handleModalBuyNow = () => {
    setModalOpen(false);
    window.location.href = `/checkout?sku=${product.SKU}&qty=${modalQty}&variasi=${encodeURIComponent(selectedVariasi)}`;
  };

  return (
    <>
      <div className="card-premium card-hover border border-gray-100 rounded-2xl flex flex-col group">
        {/* Image Container — clickable to product detail */}
        <Link href={productUrl} className="block h-52 relative bg-gray-100 overflow-hidden rounded-t-2xl">
          {product["Gambar URL"] ? (
            <img
              src={product["Gambar URL"]}
              alt={product.Nama}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <ProductPlaceholder label={product.Nama} />
          )}
          {/* Kategori badge */}
          {product.Kategori && (
            <span className="badge-kategori absolute top-3 left-3">
              {product.Kategori}
            </span>
          )}
          {/* Promo badge */}
          {hasPromo && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Promo
            </span>
          )}
          {/* Stock indicator dot */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs font-medium text-white drop-shadow-md">
              {inStock ? `Stok: ${product.Stok}` : "Stok Habis"}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Product Name — clickable */}
          <Link href={productUrl}>
            <h3 className="font-semibold text-primary mb-1.5 hover:text-accent transition line-clamp-2 text-sm leading-snug">
              {product.Nama}
            </h3>
          </Link>

          {/* Brand and SKU */}
          <p className="text-xs text-gray-400 mb-2">
            {product.Jenama} &middot; {product.SKU}
          </p>

          {/* Price Section */}
          <div className="mb-2">
            {hasPromo ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-accent">
                  RM{displayPrice.toLocaleString("ms-MY")}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  RM{product["Harga RM"].toLocaleString("ms-MY")}
                </span>
              </div>
            ) : (
              <p className="text-lg font-bold text-accent">
                RM{displayPrice.toLocaleString("ms-MY")}
              </p>
            )}
          </div>

          {/* Waranti badge (if available) */}
          {product.Waranti && (
            <span className="inline-block bg-accent/10 text-accent text-[11px] px-2.5 py-1 rounded-full mb-3 self-start font-medium">
              {product.Waranti}
            </span>
          )}

          {/* Action Buttons */}
          <div className="mt-auto space-y-2.5">
            {/* Tambah ke Bakul */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`btn-premium w-full py-2.5 rounded-xl font-semibold text-sm min-h-[44px] ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-primary text-white hover:bg-primary/90"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? "✓ Ditambah" : "Tambah ke Bakul"}
            </button>

            {/* Beli Sekarang — goes directly to checkout */}
            <Link
              href={`/checkout?sku=${product.SKU}&qty=1`}
              onClick={handleBuyNowClick}
              className={`btn-premium block w-full text-center py-2.5 rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-primary text-sm min-h-[44px] ${
                !inStock ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Beli Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Variation Modal ──────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-semibold text-primary mb-1">
              Pilih Variasi
            </h3>
            <p className="text-sm text-gray-500 mb-4">{product.Nama}</p>

            {/* Variation options */}
            <div className="flex flex-wrap gap-2 mb-4">
              {variasiOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedVariasi(opt)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 min-h-[44px] ${
                    selectedVariasi === opt
                      ? "border-accent bg-accent/10 text-accent shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Kuantiti</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                  disabled={modalQty <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition text-lg font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Kurang"
                >
                  &minus;
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.Stok}
                  value={modalQty}
                  onChange={(e) => handleModalQtyChange(e.target.value)}
                  className="w-16 h-10 text-center rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm font-medium [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setModalQty(Math.min(product.Stok, modalQty + 1))}
                  disabled={modalQty >= product.Stok}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition text-lg font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Tambah"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Stok Tersedia: {product.Stok}
              </p>
            </div>

            {/* Price display */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">Harga:</p>
              <p className="text-lg font-bold text-accent">
                RM{displayPrice.toLocaleString("ms-MY")}
                {hasPromo && (
                  <span className="ml-2 text-sm text-gray-400 line-through font-normal">
                    RM{product["Harga RM"].toLocaleString("ms-MY")}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Jumlah: RM{modalTotal.toLocaleString("ms-MY")}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition min-h-[44px]"
              >
                Batal
              </button>
              <button
                onClick={modalMode === "cart" ? handleModalAddToCart : handleModalBuyNow}
                disabled={!selectedVariasi || !inStock}
                className="btn-premium flex-1 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {modalMode === "cart" ? "Tambah ke Bakul" : "Beli Sekarang"} &bull; RM{modalTotal.toLocaleString("ms-MY")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
