// ─── Cart Client — Client-side cart management ────────────────────────────
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";
import { formatRM } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "@/components/sections/ProductCard";
import type { Produk } from "@/types/airtable";

// ─── Helper: extract a unique key from any cart item ────────────────────────
function itemKey(item: { SKU?: string; type: string; id?: string; provider?: string; phoneNumber?: string; serviceName?: string; accountNumber?: string; customerName?: string }): string {
  if (item.type === "product" && item.SKU) return item.SKU;
  if (item.type === "reload") return `reload:${item.provider}:${item.phoneNumber}`;
  if (item.type === "service") return `service:${item.serviceName}:${item.accountNumber || item.phoneNumber || item.customerName || ""}`;
  return item.id || "";
}

export default function CartClient() {
  const {
    items,
    itemCount,
    total,
    removeItem,
    updateQuantity,
    clearCart,
    promoCode,
    discountAmount,
    applyPromo,
    removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Produk[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itqan_recently_viewed");
      if (raw) setRecentlyViewed(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    setPromoLoading(true);
    setPromoError("");

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: total }),
      });

      const data = await res.json();

      console.log("DEBUG CART PROMO API RESPONSE:", JSON.stringify(data));

      if (data.success) {
        console.log("DEBUG CART discountType:", data.discountType, typeof data.discountType);
        console.log("DEBUG CART discountValue:", data.discountValue, typeof data.discountValue);
        applyPromo(code, data.discountType, data.discountValue);
        setPromoInput("");
      } else {
        setPromoError(data.error || "Kod promo tidak sah");
      }
    } catch {
      setPromoError("Ralat menyemak kod promo");
    } finally {
      setPromoLoading(false);
    }
  };

  // ─── Separate items by type for display ──────────────────────────────
  const productItems = items.filter((i) => i.type === "product");
  const reloadItems = items.filter((i) => i.type === "reload");
  const serviceItems = items.filter((i) => i.type === "service");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-8">
            Bakul Beli-belah
          </h1>

          {items.length === 0 ? (
            /* ─── Empty Cart ─────────────────────────────────────────────── */
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Bakul Kosong
              </h2>
              <p className="text-gray-500 mb-6">
                Anda belum tambah sebarang item.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/produk"
                  className="inline-block bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition"
                >
                  Lihat Produk
                </Link>
                <Link
                  href="/reload"
                  className="inline-block bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition"
                >
                  Beli Reload
                </Link>
                <Link
                  href="/servis"
                  className="inline-block bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition"
                >
                  Servis
                </Link>
              </div>
              {/* ─── Recently Viewed ──────────────────────────────────── */}
              {recentlyViewed.length > 0 && (
                <div className="mt-12 text-left">
                  <h3 className="text-lg font-semibold text-primary mb-4">Baru Dilihat</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {recentlyViewed.map((p) => (
                      <ProductCard key={p.SKU} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ─── Cart Items ──────────────────────────────────────────── */}

              {/* Products */}
              {productItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-primary mb-3">Produk</h2>
                  <div className="space-y-4">
                    {productItems.map((item) => (
                      <div
                        key={itemKey(item)}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <Link
                          href={`/produk/${item.SKU}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0"
                        >
                          {item["Gambar URL"] ? (
                            <img
                              src={item["Gambar URL"]}
                              alt={item.Nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/produk/${item.SKU}`}
                            className="font-semibold text-primary hover:text-accent transition line-clamp-1"
                          >
                            {item.Nama}
                          </Link>
                          <p className="text-xs text-gray-500 mb-1">{item.SKU}</p>
                          {item.variasi && (
                            <p className="text-xs text-accent font-medium mb-1">
                              Variasi: {item.variasi}
                            </p>
                          )}
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="font-bold text-accent">
                              {formatRM(item.price)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatRM(item.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(itemKey(item), item.quantity - 1)}
                                className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 transition text-sm font-medium min-w-[28px]"
                                aria-label="Kurang"
                              >
                                −
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={editingKey === itemKey(item) ? editingValue : String(item.quantity)}
                                onFocus={() => { setEditingKey(itemKey(item)); setEditingValue(String(item.quantity)); }}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={() => {
                                  const parsed = parseInt(editingValue, 10);
                                  const max = item.maxStock;
                                  if (!editingValue.trim() || isNaN(parsed) || parsed < 1) {
                                    updateQuantity(itemKey(item), 1);
                                  } else if (max != null && parsed > max) {
                                    updateQuantity(itemKey(item), max);
                                  } else {
                                    updateQuantity(itemKey(item), parsed);
                                  }
                                  setEditingKey(null);
                                  setEditingValue("");
                                }}
                                className="w-10 py-1 text-sm font-medium border-x border-gray-200 bg-gray-50 text-center focus:outline-none focus:bg-white"
                                aria-label="Kuantiti"
                              />
                              <button
                                onClick={() => updateQuantity(itemKey(item), item.quantity + 1)}
                                disabled={item.maxStock != null && item.quantity >= item.maxStock}
                                title={item.maxStock != null && item.quantity >= item.maxStock ? "Stok maksimum dicapai" : undefined}
                                className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 transition text-sm font-medium min-w-[28px] disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Tambah"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(itemKey(item))}
                              className="text-red-500 text-sm hover:text-red-700 transition"
                            >
                              Buang
                            </button>
                            <span className="ml-auto text-sm font-semibold text-gray-700">
                              {formatRM(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reloads */}
              {reloadItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-primary mb-3">Reload</h2>
                  <div className="space-y-4">
                    {reloadItems.map((item) => (
                      <div
                        key={itemKey(item)}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-blue-100 flex items-center justify-center text-accent text-2xl flex-shrink-0">
                          📱
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-primary">
                            Reload {item.provider}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {item.phoneNumber}
                          </p>
                          <p className="font-bold text-accent">
                            {formatRM(item.amount)}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => removeItem(itemKey(item))}
                              className="text-red-500 text-sm hover:text-red-700 transition"
                            >
                              Buang
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {serviceItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-primary mb-3">Servis</h2>
                  <div className="space-y-4">
                    {serviceItems.map((item) => (
                      <div
                        key={itemKey(item)}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-2xl flex-shrink-0">
                          🛠️
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-primary">
                            {item.serviceName}
                          </p>
                          {item.accountNumber && (
                            <p className="text-xs text-gray-500">
                              Akaun: {item.accountNumber}
                            </p>
                          )}
                          {item.customerName && (
                            <p className="text-xs text-gray-500">
                              Nama: {item.customerName}
                            </p>
                          )}
                          {item.phoneNumber && (
                            <p className="text-xs text-gray-500">
                              Telefon: {item.phoneNumber}
                            </p>
                          )}
                          {item.amount != null && (
                            <p className="font-bold text-accent">
                              {formatRM(item.amount)}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => removeItem(itemKey(item))}
                              className="text-red-500 text-sm hover:text-red-700 transition"
                            >
                              Buang
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
              )}

              {/* ─── Promo Code ──────────────────────────────────────────── */}
              {promoCode ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        Kod Promo: {promoCode}
                      </p>
                      <p className="text-xs text-green-600">
                        Diskaun -{formatRM(discountAmount)}
                      </p>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Buang
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Kod Promo
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Masukkan kod"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition min-w-[60px]"
                    >
                      {promoLoading ? "..." : "Guna"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
                  )}
                </div>
              )}

              {/* ─── Summary ─────────────────────────────────────────────── */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="font-semibold text-primary">
                    {formatRM(total)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600 text-sm">Diskaun</span>
                    <span className="font-semibold text-green-600">
                      -{formatRM(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-200">
                  <span className="text-gray-600">
                    Jumlah ({itemCount} item)
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatRM(total - discountAmount)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Link
                    href="/checkout?from=cart"
                    className="block w-full text-center bg-accent text-primary py-3 rounded-lg font-semibold hover:bg-accent/90 transition"
                  >
                    Checkout Sekarang
                  </Link>

                  <Link
                    href="/produk"
                    className="block w-full text-center text-gray-600 py-2 hover:text-accent transition text-sm"
                  >
                    Terus Belanja
                  </Link>

                  <button
                    onClick={clearCart}
                    className="block w-full text-center text-red-500 py-2 hover:text-red-700 transition text-sm"
                  >
                    Kosongkan Bakul
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}
