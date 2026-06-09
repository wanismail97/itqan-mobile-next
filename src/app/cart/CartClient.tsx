// ─── Cart Client — Client-side cart management ────────────────────────────
"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";
import { formatRM } from "@/lib/utils";
import Link from "next/link";

// ─── Helper: extract a unique key from any cart item ────────────────────────
function itemKey(item: { SKU?: string; type: string; id?: string; provider?: string; phoneNumber?: string; serviceName?: string; accountNumber?: string; customerName?: string }): string {
  if (item.type === "product" && item.SKU) return item.SKU;
  if (item.type === "reload") return `reload:${item.provider}:${item.phoneNumber}`;
  if (item.type === "service") return `service:${item.serviceName}:${item.accountNumber || item.phoneNumber || item.customerName || ""}`;
  return item.id || "";
}

export default function CartClient() {
  const { items, itemCount, total, removeItem, clearCart } =
    useCart();

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
                            <span className="text-sm text-gray-600">x{item.quantity}</span>
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

              {/* ─── Summary ─────────────────────────────────────────────── */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">
                    Jumlah Item ({itemCount})
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatRM(total)}
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
