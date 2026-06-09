// ─── Reload Client — Provider grid + modal ────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServisFields } from "@/types/airtable";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";

interface Props {
  providers: ServisFields[];
}

const RELOAD_AMOUNTS = [5, 10, 20, 30, 50, 100];

export default function ReloadClient({ providers }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedProvider, setSelectedProvider] = useState<ServisFields | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reloadAmount, setReloadAmount] = useState(10);
  const [phoneError, setPhoneError] = useState("");

  const openModal = (provider: ServisFields) => {
    setSelectedProvider(provider);
    setPhoneNumber("");
    setReloadAmount(10);
    setPhoneError("");
  };

  const closeModal = () => {
    setSelectedProvider(null);
  };

  const validatePhone = (value: string): boolean => {
    const malaysianPhone = /^(\+?6?01[0-9]-?\d{7,8})$/;
    const cleaned = value.replace(/\s/g, "");
    return malaysianPhone.test(cleaned);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value && !validatePhone(value)) {
      setPhoneError("Sila masukkan nombor telefon Malaysia yang sah (cth: 0123456789)");
    } else {
      setPhoneError("");
    }
  };

  const validateForm = (): boolean => {
    if (!selectedProvider) return false;
    if (!phoneNumber.trim()) {
      setPhoneError("Sila masukkan nombor telefon");
      return false;
    }
    if (!validatePhone(phoneNumber)) {
      setPhoneError("Sila masukkan nombor telefon Malaysia yang sah");
      return false;
    }
    return true;
  };

  const buildReloadItem = () => {
    if (!selectedProvider) return null;
    return {
      type: "reload" as const,
      id: `reload:${selectedProvider["Nama Servis"]}:${phoneNumber}`,
      provider: selectedProvider["Nama Servis"],
      phoneNumber: phoneNumber.trim(),
      amount: reloadAmount,
      quantity: 1 as const,
    };
  };

  // ─── Tambah Ke Bakul — add to cart, keep user on page ───────────────
  const handleAddToCart = () => {
    if (!validateForm()) return;
    const item = buildReloadItem();
    if (!item) return;
    addItem(item);
    closeModal();
  };

  // ─── Reload Sekarang — add to cart then go to checkout ──────────────
  const handleReloadSekarang = () => {
    if (!validateForm()) return;
    const item = buildReloadItem();
    if (!item) return;
    addItem(item);
    closeModal();
    // Redirect to checkout with reload flag so the checkout
    // page reads it from the cart (via from=cart)
    router.push("/checkout?from=cart");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Reload & eWallet
          </h1>
          <p className="text-gray-500 mb-8">
          Top up prabayar dan e-wallet dengan mudah.
          </p>

          {providers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Tiada Provider Reload
              </h3>
              <p className="text-gray-500">
                Provider reload akan ditambah kemudian.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {providers.map((provider, index) => (
                <div
                  key={`${provider["Nama Servis"]}-${index}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-primary mb-1">
                    {provider["Nama Servis"]}
                  </h3>
                  {provider.Deskripsi && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {provider.Deskripsi}
                    </p>
                  )}
                  <button
                    onClick={() => openModal(provider)}
                    className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                  >
                    Tambah Reload
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ─── Modal ────────────────────────────────────────────────────── */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary">
                {selectedProvider["Nama Servis"]}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="0123456789"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>

              {/* Reload Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nilai Reload <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RELOAD_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setReloadAmount(amount)}
                      className={`py-2 rounded-lg text-sm font-medium border transition ${
                        reloadAmount === amount
                          ? "bg-accent text-primary border-accent"
                          : "bg-white text-gray-700 border-gray-300 hover:border-accent"
                      }`}
                    >
                      RM{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Dual CTA Buttons ────────────────────────────────── */}

              {/* Primary CTA — Reload Sekarang */}
              <button
                onClick={handleReloadSekarang}
                className="w-full bg-accent text-primary py-3 rounded-lg font-semibold text-lg hover:bg-accent/90 transition duration-300 shadow-md"
              >
                Reload Sekarang — RM{reloadAmount}
              </button>

              {/* Secondary CTA — Tambah Ke Bakul */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-gray-700 py-2.5 rounded-lg font-medium border-2 border-gray-300 hover:border-accent hover:text-accent transition duration-300"
              >
                Tambah Ke Bakul
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <StickyButtons />
    </>
  );
}
