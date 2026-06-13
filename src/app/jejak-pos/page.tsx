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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("dalam perjalanan") || s.includes("in transit")) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (s.includes("diposkan") || s.includes("dihantar") || s.includes("shipped")) return "bg-blue-100 text-blue-800 border-blue-300";
  if (s.includes("sampai") || s.includes("delivered") || s.includes("selesai")) return "bg-green-100 text-green-800 border-green-300";
  if (s.includes("gagal") || s.includes("failed") || s.includes("returned")) return "bg-red-100 text-red-800 border-red-300";
  if (s.includes("menunggu") || s.includes("pending") || s.includes("processing")) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-gray-100 text-gray-700 border-gray-300";
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

// ─── SVG Illustrations ───────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-sm mx-auto">
      {/* Background circle */}
      <circle cx="200" cy="150" r="140" fill="#F4B942" opacity="0.08" />
      {/* Parcel box left */}
      <rect x="60" y="160" width="70" height="70" rx="10" fill="#0B1F4D" />
      <rect x="70" y="170" width="24" height="24" rx="2" fill="#F4B942" opacity="0.3" />
      <rect x="96" y="170" width="24" height="24" rx="2" fill="#F4B942" opacity="0.3" />
      <line x1="82" y1="200" x2="108" y2="200" stroke="#F4B942" strokeWidth="2" strokeOpacity="0.4" />
      {/* Location pin */}
      <path d="M175 130C175 113.33 188.333 100 205 100C221.667 100 235 113.33 235 130C235 155 205 175 205 175C205 175 175 155 175 130Z" fill="#F4B942" />
      <circle cx="205" cy="130" r="14" fill="white" />
      <circle cx="205" cy="130" r="6" fill="#0B1F4D" />
      {/* Delivery truck */}
      <rect x="230" y="210" width="120" height="50" rx="6" fill="#F4B942" />
      <rect x="245" y="220" width="55" height="20" rx="3" fill="white" opacity="0.9" />
      <text x="252" y="235" fontSize="10" fill="#0B1F4D" fontWeight="600" fontFamily="sans-serif">iTQAN</text>
      <circle cx="260" cy="264" r="10" fill="#0B1F4D" />
      <circle cx="260" cy="264" r="4" fill="white" />
      <circle cx="320" cy="264" r="10" fill="#0B1F4D" />
      <circle cx="320" cy="264" r="4" fill="white" />
      {/* Small parcel in truck bed */}
      <rect x="290" y="215" width="40" height="25" rx="4" fill="#0B1F4D" />
      <rect x="296" y="220" width="12" height="12" rx="1" fill="#F4B942" opacity="0.4" />
      <rect x="312" y="220" width="12" height="12" rx="1" fill="#F4B942" opacity="0.4" />
      {/* Courier person */}
      <circle cx="145" cy="115" r="14" fill="#0B1F4D" />
      <path d="M125 170C125 150 145 140 145 140C145 140 165 150 165 170V185H125V170Z" fill="#F4B942" />
      {/* Arm waving */}
      <path d="M165 148C175 140 180 130 178 125" stroke="#0B1F4D" strokeWidth="4" strokeLinecap="round" />
      {/* Smile on courier */}
      <path d="M140 118C142 121 148 121 150 118" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="140" cy="113" r="2" fill="white" />
      <circle cx="150" cy="113" r="2" fill="white" />
      {/* Parcel in hand */}
      <rect x="170" y="138" width="28" height="22" rx="3" fill="#0B1F4D" />
      <rect x="176" y="143" width="8" height="8" rx="1" fill="#F4B942" opacity="0.4" />
      <rect x="186" y="143" width="8" height="8" rx="1" fill="#F4B942" opacity="0.4" />
      {/* Motion lines */}
      <path d="M350 235L365 235" stroke="#F4B942" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M355 225L370 225" stroke="#F4B942" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  );
}

function EmptyStateIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 mx-auto">
      <rect x="90" y="60" width="100" height="80" rx="8" fill="#F4B942" opacity="0.15" />
      <rect x="100" y="70" width="80" height="35" rx="4" fill="#0B1F4D" opacity="0.1" />
      <circle cx="140" cy="155" r="25" fill="#0B1F4D" opacity="0.08" />
      <path d="M130 160L137 167L153 149" stroke="#F4B942" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="140" cy="50" r="18" fill="#0B1F4D" opacity="0.06" />
      <path d="M134 45L140 39L146 45" stroke="#F4B942" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto">
      <circle cx="60" cy="60" r="50" fill="#FEF2F2" />
      <circle cx="60" cy="60" r="48" stroke="#FEE2E2" strokeWidth="3" />
      <path d="M60 35V65" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="78" r="3" fill="#EF4444" />
    </svg>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icons = {
  box: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  truck: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  hash: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  checkmark: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  help: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
    </svg>
  ),
};

// ─── Progress Steps ──────────────────────────────────────────────────────────

const PROGRESS_STEPS = [
  { label: "Pesanan Diterima", icon: "check" },
  { label: "Pakej Dihantar", icon: "check" },
  { label: "Dalam Perjalanan", icon: "current" },
  { label: "Sampai Destinasi", icon: "pending" },
  { label: "Selesai", icon: "pending" },
];

function getProgressIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("selesai") || s.includes("delivered") && s.includes("sampai")) return 4;
  if (s.includes("sampai") || s.includes("delivered")) return 3;
  if (s.includes("dalam perjalanan") || s.includes("in transit")) return 2;
  if (s.includes("diposkan") || s.includes("dihantar") || s.includes("shipped")) return 1;
  return 0;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function JejakPosPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

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
    setHasSearched(true);

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

  const hasResult = result && "orderId" in result;
  const progressIdx = hasResult ? getProgressIndex(result.status) : -1;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f6fa]">
        {/* ═══ Hero Section ═══════════════════════════════════════════ */}
        <section className="relative bg-[#0B1F4D] overflow-hidden">
          {/* Decorative dots pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #F4B942 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#F4B942]/15 text-[#F4B942] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  Penghantaran Pantas & Selamat
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Jejak{" "}
                  <span className="text-[#F4B942]">Pos</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  Semak status penghantaran pesanan anda dengan mudah dan pantas.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {[
                    "Semakan Mudah",
                    "Maklumat Terkini",
                    "Selamat & Dipercayai",
                  ].map((text) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-200"
                    >
                      <svg className="w-4 h-4 text-[#F4B942] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="flex justify-center lg:justify-end">
                <HeroIllustration />
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 md:h-16">
              <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 0 1440 20V60H0Z" fill="#f5f6fa" />
            </svg>
          </div>
        </section>

        {/* ═══ Search Card ════════════════════════════════════════════ */}
        <section className="relative z-10 -mt-8 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-[#0B1F4D]/5 border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#0B1F4D] text-center mb-2">
                Masukkan Order ID Anda
              </h2>
              <p className="text-gray-500 text-center mb-6 text-sm">
                Contoh: ITQ-20260613-001
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input
                    id="orderId"
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="ITQ-20260613-005"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f5f6fa] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] focus:border-transparent text-gray-800 placeholder-gray-400 font-medium text-lg transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1F4D] text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-[#0B1F4D]/90 hover:shadow-lg hover:shadow-[#0B1F4D]/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyemak...
                    </>
                  ) : (
                    "Semak Penghantaran"
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <ErrorIllustration />
                    <div>
                      <p className="font-semibold text-red-800 text-sm">Order ID tidak dijumpai</p>
                      <p className="text-red-600 text-sm mt-0.5">{error}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* ═══ Empty State (before first search) ═════════════════════ */}
        {!hasSearched && !result && !error && (
          <section className="pb-20">
            <div className="max-w-xl mx-auto px-4 text-center">
              <EmptyStateIllustration />
              <p className="text-gray-500 mt-4 text-lg">
                Masukkan Order ID untuk menyemak status penghantaran.
              </p>
            </div>
          </section>
        )}

        {/* ═══ Result Card ═══════════════════════════════════════════ */}
        {hasResult && (
          <section className="pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl shadow-[#0B1F4D]/5 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-[#0B1F4D] px-6 py-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F4B942]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {Icons.box}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Maklumat Penghantaran</h2>
                    <p className="text-gray-300 text-xs">{result.orderId}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Order ID */}
                    <div className="flex items-start gap-3 bg-[#f5f6fa] rounded-xl p-4">
                      <div className="w-9 h-9 bg-[#0B1F4D]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#0B1F4D]">
                        {Icons.hash}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Order ID</p>
                        <p className="font-semibold text-[#0B1F4D] truncate">{result.orderId}</p>
                      </div>
                    </div>

                    {/* Kurier */}
                    <div className="flex items-start gap-3 bg-[#f5f6fa] rounded-xl p-4">
                      <div className="w-9 h-9 bg-[#0B1F4D]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#0B1F4D]">
                        {Icons.truck}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Kurier</p>
                        <p className="font-semibold text-[#0B1F4D] truncate">{result.kurier || "-"}</p>
                      </div>
                    </div>

                    {/* AWB */}
                    <div className="flex items-start gap-3 bg-[#f5f6fa] rounded-xl p-4">
                      <div className="w-9 h-9 bg-[#0B1F4D]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#0B1F4D]">
                        {Icons.hash}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">No Tracking</p>
                        <p className="font-semibold text-[#0B1F4D] truncate font-mono">{result.awb || "-"}</p>
                      </div>
                    </div>

                    {/* Tarikh Dihantar */}
                    <div className="flex items-start gap-3 bg-[#f5f6fa] rounded-xl p-4">
                      <div className="w-9 h-9 bg-[#0B1F4D]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#0B1F4D]">
                        {Icons.calendar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Tarikh Dihantar</p>
                        <p className="font-semibold text-[#0B1F4D]">{formatDate(result.tarikhDihantar)}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2 flex items-start gap-3 bg-[#f5f6fa] rounded-xl p-4">
                      <div className="w-9 h-9 bg-[#0B1F4D]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#0B1F4D]">
                        {Icons.checkmark}
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="text-xs text-gray-500 font-medium mb-1.5">Status</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(result.status)}`}
                        >
                          {result.status || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─── Progress Timeline ──────────────────────────── */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-[#0B1F4D] mb-5 flex items-center gap-2">
                      {Icons.clock}
                      Perkembangan Penghantaran
                    </h3>

                    {/* Desktop: Horizontal timeline */}
                    <div className="hidden sm:flex items-start justify-between">
                      {PROGRESS_STEPS.map((step, idx) => {
                        const isCompleted = idx < progressIdx;
                        const isCurrent = idx === progressIdx;
                        const isPending = idx > progressIdx;

                        return (
                          <div key={step.label} className="flex flex-col items-center flex-1 relative">
                            {/* Connector line */}
                            {idx < PROGRESS_STEPS.length - 1 && (
                              <div className="absolute top-5 left-[calc(50%+16px)] right-0 h-0.5 -translate-y-1/2">
                                <div className={`h-full ${idx < progressIdx ? "bg-[#F4B942]" : "bg-gray-200"}`} />
                              </div>
                            )}
                            {/* Circle */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all ${
                                isCompleted
                                  ? "bg-[#F4B942] border-[#F4B942] text-white"
                                  : isCurrent
                                  ? "bg-white border-[#F4B942] text-[#F4B942] ring-4 ring-[#F4B942]/20"
                                  : "bg-white border-gray-200 text-gray-300"
                              }`}
                            >
                              {isCompleted ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : isCurrent ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </div>
                            {/* Label */}
                            <p
                              className={`mt-2 text-xs font-medium text-center leading-tight ${
                                isCompleted
                                  ? "text-[#F4B942]"
                                  : isCurrent
                                  ? "text-[#0B1F4D] font-bold"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile: Vertical timeline */}
                    <div className="sm:hidden space-y-0">
                      {PROGRESS_STEPS.map((step, idx) => {
                        const isCompleted = idx < progressIdx;
                        const isCurrent = idx === progressIdx;
                        const isLast = idx === PROGRESS_STEPS.length - 1;

                        return (
                          <div key={step.label} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                                  isCompleted
                                    ? "bg-[#F4B942] border-[#F4B942] text-white"
                                    : isCurrent
                                    ? "bg-white border-[#F4B942] text-[#F4B942] ring-4 ring-[#F4B942]/20"
                                    : "bg-white border-gray-200 text-gray-300"
                                }`}
                              >
                                {isCompleted ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                )}
                              </div>
                              {!isLast && (
                                <div className={`w-0.5 h-8 ${idx < progressIdx ? "bg-[#F4B942]" : "bg-gray-200"}`} />
                              )}
                            </div>
                            <div className="pb-8">
                              <p
                                className={`text-sm font-medium ${
                                  isCompleted
                                    ? "text-[#F4B942]"
                                    : isCurrent
                                    ? "text-[#0B1F4D] font-bold"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ─── Tracking Events ─────────────────────────────── */}
                  {result.tracking?.data?.tracking_events &&
                    Array.isArray(result.tracking.data.tracking_events) &&
                    result.tracking.data.tracking_events.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-[#0B1F4D] mb-4 flex items-center gap-2">
                          {Icons.arrow}
                          Butiran Tracking
                        </h3>
                        <div className="space-y-3">
                          {result.tracking.data.tracking_events.map(
                            (event: TrackingEvent, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-3 items-start bg-[#f5f6fa] rounded-xl p-4 border border-gray-100"
                              >
                                <div className="w-8 h-8 bg-[#F4B942]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-[#F4B942] rounded-full" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-[#0B1F4D] text-sm">
                                    {event.status || event.description || "Tiada maklumat"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {event.date && `${event.date}`}
                                    {event.location && ` — ${event.location}`}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ Footer Info Cards ══════════════════════════════════════ */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="w-14 h-14 bg-[#F4B942]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#F4B942]">
                  {Icons.clock}
                </div>
                <h3 className="font-bold text-[#0B1F4D] mb-2">Berapa Lama Penghantaran?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Penghantaran mengambil masa 1-5 hari bekerja bergantung kepada lokasi anda di Semenanjung atau Sabah/Sarawak.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="w-14 h-14 bg-[#0B1F4D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0B1F4D]">
                  {Icons.help}
                </div>
                <h3 className="font-bold text-[#0B1F4D] mb-2">Perlukan Bantuan?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Hubungi kami di{" "}
                  <a href="https://wa.me/60123340972" className="text-[#F4B942] font-semibold hover:underline">
                    WhatsApp
                  </a>{" "}
                  atau emel{" "}
                  <a href="mailto:hello@itqanmobile.my" className="text-[#F4B942] font-semibold hover:underline">
                    hello@itqanmobile.my
                  </a>
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="w-14 h-14 bg-[#F4B942]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#F4B942]">
                  {Icons.shield}
                </div>
                <h3 className="font-bold text-[#0B1F4D] mb-2">100% Dijamin</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Semua penghantaran dijamin selamat dan dilindungi. Anda boleh menyemak status bila-bila masa.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}