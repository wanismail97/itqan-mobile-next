// ─── Pre-Order Kitab Form — kutipan bayaran pra-tempahan ──────────────────
// Halaman kutipan bayaran khas (BUKAN flow produk/cart/checkout).
// Tiada payment gateway lagi — butang "Bayar Sekarang" hanya console.log data.
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import PreorderSubmitButton from "./PreorderSubmitButton";

const BASE_PRICE = 100; // RM100 — Harga Asas pra-tempahan kitab

export default function PreorderKtbForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [quantityInput, setQuantityInput] = useState("1");
  const [wantDonate, setWantDonate] = useState(false);
  const [donationInput, setDonationInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Kuantiti parsing (minimum 1) ────────────────────────────────────────
  const quantity = useMemo(() => {
    const val = parseInt(quantityInput, 10);
    if (isNaN(val) || val < 1) return 1;
    return val;
  }, [quantityInput]);

  // ─── Sumbangan (donation) parsing ────────────────────────────────────────
  const donation = useMemo(() => {
    if (!wantDonate) return 0;
    const val = parseFloat(donationInput);
    if (isNaN(val) || val < 0) return 0;
    return val;
  }, [wantDonate, donationInput]);

  // ─── Jumlah realtime ─────────────────────────────────────────────────────
  const bookSubtotal = BASE_PRICE * quantity;
  const total = bookSubtotal + donation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Sila isi Nama Penuh.");
      return;
    }
    if (!phone.trim()) {
      setError("Sila isi No Telefon.");
      return;
    }
    if (quantity < 1) {
      setError("Kuantiti minimum 1.");
      return;
    }
    if (wantDonate) {
      const val = parseFloat(donationInput);
      if (isNaN(val) || val < 1) {
        setError("Jumlah sumbangan minimum RM1.");
        return;
      }
    }

    setLoading(true);
    try {
      // Send numeric fields explicitly as numbers (Airtable Number columns).
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        quantity: Number(quantity) || 1,
        donation: Number(donation) || 0,
      };
      console.log("📤 Submitting payload:", payload);

      const res = await fetch("/api/curlec-payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentUrl) {
        setError(data.error || "Gagal memproses pembayaran. Sila cuba lagi.");
        setLoading(false);
        return;
      }

      // Redirect to the Curlec hosted payment page.
      window.location.href = data.paymentUrl;
    } catch {
      setError("Ralat sambungan. Sila semak internet anda dan cuba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ─── Header / Maklumat Produk ────────────────────────────────────── */}
      <div className="bg-primary px-6 py-6 text-center">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
          Pre-Order
        </p>
        <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito">
          Kitab Sunan Abi Daud
        </h1>
      </div>

      <div className="p-6">
        {/* ─── Gambar kitab ──────────────────────────────────────────────── */}
        <Image
          src="/images/preorder/sunan-abi-daud.webp"
          alt="Kitab Sunan Abi Daud"
          width={220}
          height={220}
          className="mx-auto mb-4 h-auto w-full max-w-[220px] rounded-lg object-contain"
        />

        {/* ─── Maklumat kitab ────────────────────────────────────────────── */}
        <dl className="bg-gray-50 rounded-lg p-3 mb-4 text-xs divide-y divide-gray-100">
          <div className="flex justify-between py-1">
            <dt className="text-gray-500">Kitab</dt>
            <dd className="font-medium text-primary text-right">Sunan Abi Daud</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-gray-500">Jilid</dt>
            <dd className="font-medium text-primary text-right">2 Jilid</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-gray-500">Penerbit</dt>
            <dd className="font-medium text-primary text-right">
              Maktabah Dar Omar Mukhtar
            </dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-gray-500">Harga Asas</dt>
            <dd className="font-bold text-accent text-right">
              RM{BASE_PRICE.toLocaleString("ms-MY")}
            </dd>
          </div>
        </dl>

        {/* ─── Borang ────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Penuh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-400">(pilihan)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* ─── Kuantiti ──────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kuantiti (set) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              step="1"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              onBlur={() => setQuantityInput(String(quantity))}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 1 set.</p>
          </div>

          {/* ─── Sumbangan Majlis ────────────────────────────────────────── */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={wantDonate}
                onChange={(e) => {
                  setWantDonate(e.target.checked);
                  if (!e.target.checked) setDonationInput("");
                }}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-gray-700">
                Saya ingin menyumbang untuk majlis
              </span>
            </label>

            {wantDonate && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Sumbangan (RM) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="1"
                  value={donationInput}
                  onChange={(e) => setDonationInput(e.target.value)}
                  placeholder="Contoh: 20"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <p className="text-xs text-gray-400 mt-1">Minimum RM1.</p>
              </div>
            )}
          </div>

          {/* ─── Jumlah (realtime) ───────────────────────────────────────── */}
          <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Harga Seunit</span>
              <span className="font-medium text-primary">
                RM{BASE_PRICE.toLocaleString("ms-MY")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Kuantiti</span>
              <span className="font-medium text-primary">{quantity}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Subtotal Kitab</span>
              <span className="font-medium text-primary">
                RM{BASE_PRICE.toLocaleString("ms-MY")} &times; {quantity} = RM
                {bookSubtotal.toLocaleString("ms-MY")}
              </span>
            </div>
            {donation > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Sumbangan Majlis</span>
                <span className="font-medium text-primary">
                  RM{donation.toLocaleString("ms-MY")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-600">Jumlah</span>
              <span className="text-2xl font-bold text-accent">
                RM{total.toLocaleString("ms-MY")}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <PreorderSubmitButton loading={loading} />
        </form>
      </div>
    </div>
  );
}
