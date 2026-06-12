// ─── Receipt Client — Professional receipt display with print support ──────
"use client";

import Image from "next/image";
import Link from "next/link";
import type { PesananFields, ItemPesananFields } from "@/types/airtable";
import { siteConfig } from "@/lib/config";

interface Props {
  order: PesananFields;
  items: ItemPesananFields[];
  receiptNo: string;
}

function formatRM(amount: number): string {
  return `RM${amount.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ReceiptClient({ order, items, receiptNo }: Props) {
  const paymentRef = order["Rujukan Bayaran"];
  const isPaid = order.Status === "Dibayar";
  const itemsTotal = items.reduce(
    (sum, i) => sum + (i.Harga || 0) * (i.Kuantiti || 1),
    0
  );

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-card, #receipt-card * { visibility: visible; }
          #receipt-card { 
            position: absolute; 
            left: 0; top: 0; 
            width: 100%; 
            max-width: 100%;
            box-shadow: none;
            border: none;
            padding: 20px;
          }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen bg-[#f8fafc] py-10 md:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* ─── Print Button ─────────────────────────────────────────── */}
          <div className="flex justify-end mb-4 no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 12H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Cetak Resit
            </button>
          </div>

          {/* ─── Receipt Card ──────────────────────────────────────────── */}
          <div
            id="receipt-card"
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12"
          >
            {/* Header */}
            <div className="text-center mb-8 pb-8 border-b border-gray-100">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logo.png"
                  alt="iTQAN Mobile"
                  width={140}
                  height={44}
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-gray-500 text-sm">Digital Solutions</p>
              <p className="text-gray-400 text-xs mt-0.5">itqanmobile.my</p>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-primary tracking-wide uppercase">
                Resit Pembayaran
              </h1>
              {isPaid && (
                <span className="inline-block mt-2 px-4 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  DIBAYAR
                </span>
              )}
              {!isPaid && (
                <span className="inline-block mt-2 px-4 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
                  {order.Status}
                </span>
              )}
            </div>

            {/* ─── Receipt Info ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8 text-sm">
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wider">No Resit</span>
                <p className="font-mono font-semibold text-primary mt-0.5 text-xs sm:text-sm break-all">
                  {receiptNo}
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs uppercase tracking-wider">No Pesanan</span>
                <p className="font-mono font-semibold text-primary mt-0.5 text-xs sm:text-sm">
                  {order["Order ID"]}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wider">Tarikh</span>
                <p className="font-medium text-primary mt-0.5 text-xs sm:text-sm">
                  {formatDate(order.Tarikh)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Status</span>
                <p className="font-medium text-primary mt-0.5 text-xs sm:text-sm">
                  {order.Status}
                </p>
              </div>
            </div>

            {/* ─── Items Table ──────────────────────────────────────────── */}
            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Butiran Pesanan
              </div>
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const total = (item.Harga || 0) * (item.Kuantiti || 1);
                  return (
                    <div
                      key={idx}
                      className="flex items-start justify-between pb-4 border-b border-gray-50 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="font-semibold text-primary text-sm leading-snug">
                          {item["Nama Item"] || item.SKU}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          SKU: {item.SKU}
                          {item.Variasi && ` · ${item.Variasi}`}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Qty: {item.Kuantiti} × {formatRM(item.Harga || 0)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary text-sm">
                          {formatRM(total)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Total ────────────────────────────────────────────────── */}
            <div className="border-t border-gray-200 pt-5 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">
                  Jumlah Bayaran
                </span>
                <span className="text-xl md:text-2xl font-bold" style={{ color: "#D4AF37" }}>
                  {formatRM(order.Jumlah)}
                </span>
              </div>
            </div>

            {/* ─── Payment Reference ─────────────────────────────────────── */}
            {paymentRef && (
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Rujukan Bayaran</span>
                  <span className="font-mono text-primary font-medium text-xs">
                    {paymentRef}
                  </span>
                </div>
              </div>
            )}

            {/* ─── Footer ────────────────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Terima kasih kerana membeli di iTQAN Mobile.
              </p>
              <p className="text-gray-500 text-sm font-medium mb-3">
                Ada masalah dengan pesanan anda?
              </p>
              <div className="no-print">
                <a
                  href={`https://wa.me/${siteConfig.contact.phoneRaw}?text=${encodeURIComponent(`Saya perlukan bantuan untuk pesanan saya (Order ID: ${order["Order ID"]})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1da851] transition-colors shadow-sm sm:w-auto w-full"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Kami
                </a>
              </div>
            </div>
          </div>

          {/* ─── Back link ──────────────────────────────────────────────── */}
          <div className="text-center mt-6 no-print">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              ← Kembali ke Laman Utama
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}