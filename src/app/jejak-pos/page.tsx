// ─── Jejak Pos — Semak Penghantaran ─────────────────────────────────────────
// Halaman untuk pelanggan menyemak status penghantaran menggunakan Order ID.

"use client";

import { useState, type FormEvent } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";

interface TrackingEvent {
  status?: string;
  date?: string;
  location?: string;
  description?: string;
  [key: string]: unknown;
}

interface ShipmentResult {
  success: true;
  orderId: string;
  awb: string;
  kurier: string;
  status: string;
  tarikhDihantar: string;
  tracking?: {
    data?: {
      tracking_events?: TrackingEvent[];
    };
    [key: string]: unknown;
  };
}

interface ErrorResult {
  success: false;
  message: string;
}

type TrackResult = ShipmentResult | ErrorResult;

export default function JejakPosPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const trimmed = orderId.trim();
    if (!trimmed) {
      setError("Sila masukkan Order ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/easyparcel/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: trimmed }),
      });

      const data: TrackResult = await res.json();

      if (!data.success) {
        const msg = data.message || "Ralat tidak diketahui.";
        setError(msg);
      } else {
        setResult(data);
      }
    } catch {
      setError("Ralat rangkaian. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* ─── Hero Section ──────────────────────────────────────────── */}
        <section className="bg-primary text-white pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Jejak Pos
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Masukkan Order ID anda untuk menyemak status penghantaran.
            </p>
          </div>
        </section>

        {/* ─── Form Section ───────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="orderId"
                  className="block text-sm font-semibold text-primary mb-2"
                >
                  Order ID
                </label>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="ITQ-20260613-015"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-800"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Menyemak..." : "Semak Penghantaran"}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
                  {error}
                </div>
              )}
            </form>

            {/* ─── Result Section ─────────────────────────────────── */}
            {result && "orderId" in result && (
              <div className="mt-8 bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-primary">
                  Maklumat Penghantaran
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Order ID</span>
                    <p className="font-semibold text-gray-800">{result.orderId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Kurier</span>
                    <p className="font-semibold text-gray-800">{result.kurier || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">AWB</span>
                    <p className="font-semibold text-gray-800">{result.awb || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tarikh Dihantar</span>
                    <p className="font-semibold text-gray-800">
                      {result.tarikhDihantar || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-sm text-gray-500">Status</span>
                    <p className="font-semibold text-gray-800">{result.status || "-"}</p>
                  </div>
                </div>

                {/* ─── Tracking Events ─────────────────────────────── */}
                {result.tracking?.data?.tracking_events &&
                  Array.isArray(result.tracking.data.tracking_events) &&
                  result.tracking.data.tracking_events.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-primary mb-3">
                        Tracking Events
                      </h3>
                      <div className="space-y-3">
                        {result.tracking.data.tracking_events.map(
                          (event: TrackingEvent, idx: number) => (
                            <div
                              key={idx}
                              className="border border-gray-200 rounded-lg p-3"
                            >
                              <p className="font-medium text-gray-800">
                                {event.status || event.description || "Tiada maklumat"}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {event.date && `${event.date}`}
                                {event.location && ` — ${event.location}`}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}