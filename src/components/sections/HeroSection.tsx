// ─── Hero Section — Two-column premium commercial hero ─────────────────────

import Link from "next/link";
import { siteConfig } from "@/lib/config";

const trustBadges = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: "Waranti Rasmi",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.078.879 4.249 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Harga Mampu Milik",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 013 0m-3 0a1.5 1.5 0 003 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    label: "Penghantaran Seluruh Malaysia",
  },
];

function ProductShowcase() {
  return (
    <div className="relative flex items-center justify-center w-full">
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-white/5 rounded-full blur-xl" />

      {/* Pedestal / Stage */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-transparent via-accent/20 to-transparent rounded-full" />

      {/* ─── Phone Visual ────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* Phone body */}
        <svg width="140" height="260" viewBox="0 0 140 260" className="drop-shadow-2xl">
          {/* Phone frame */}
          <rect x="16" y="8" width="108" height="244" rx="22" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
          {/* Screen */}
          <rect x="22" y="18" width="96" height="220" rx="14" fill="#0f172a" />
          {/* Screen content — app grid simulation */}
          <rect x="30" y="28" width="80" height="14" rx="3" fill="#1e293b" />
          <rect x="30" y="50" width="36" height="36" rx="8" fill="#1e40af" />
          <rect x="74" y="50" width="36" height="36" rx="8" fill="#065f46" />
          <rect x="30" y="94" width="36" height="36" rx="8" fill="#7c3aed" />
          <rect x="74" y="94" width="36" height="36" rx="8" fill="#b45309" />
          <rect x="30" y="138" width="80" height="10" rx="3" fill="#1e293b" />
          <rect x="30" y="154" width="60" height="6" rx="2" fill="#1e293b" />
          <circle cx="70" cy="222" r="12" fill="none" stroke="#334155" strokeWidth="2" />
          {/* Dynamic island / notch */}
          <rect x="52" y="11" width="36" height="6" rx="3" fill="#0f172a" />
        </svg>

        {/* Gold accent ring behind phone */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[260px] rounded-[24px] border-2 border-accent/15 -z-10" />

        {/* ─── SIM Card floating ──────────────────────────────────────── */}
        <div className="absolute -right-4 top-10 animate-bounce" style={{ animationDuration: "4s" }}>
          <svg width="40" height="32" viewBox="0 0 40 32" className="drop-shadow-lg">
            <rect x="2" y="1" width="36" height="30" rx="3" fill="#d4a853" opacity="0.9" />
            <rect x="6" y="5" width="28" height="8" rx="1.5" fill="#c49b3f" />
            <rect x="8" y="7" width="8" height="4" rx="1" fill="#b08830" />
            <line x1="6" y1="17" x2="28" y2="17" stroke="#b08830" strokeWidth="1.5" rx="1" />
            <line x1="6" y1="21" x2="22" y2="21" stroke="#b08830" strokeWidth="1.5" />
            <rect x="6" y="24" width="16" height="1.5" rx="0.75" fill="#b08830" />
          </svg>
        </div>

        {/* ─── Prepaid Card floating ───────────────────────────────────── */}
        <div className="absolute -left-6 bottom-8 animate-bounce" style={{ animationDuration: "5s", animationDelay: "0.5s" }}>
          <svg width="44" height="28" viewBox="0 0 44 28" className="drop-shadow-lg">
            <rect x="2" y="2" width="40" height="24" rx="4" fill="#1e40af" />
            <circle cx="10" cy="14" r="6" fill="none" stroke="white" strokeWidth="1.5" />
            <path d="M10 8v12M4 14h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="22" y="8" width="16" height="4" rx="2" fill="white" opacity="0.6" />
            <rect x="22" y="16" width="10" height="3" rx="1.5" fill="white" opacity="0.3" />
          </svg>
        </div>

        {/* ─── Signal waves ────────────────────────────────────────────── */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 space-y-1.5">
          {[0.3, 0.55, 0.8, 1].map((opacity, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full bg-accent"
              style={{ width: `${12 + i * 8}px`, opacity }}
            />
          ))}
        </div>

        {/* 5G Badge */}
        <div className="absolute right-8 top-14 bg-accent text-[10px] font-bold text-primary px-1.5 py-0.5 rounded tracking-wider">
          5G
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const waLink = `https://wa.me/${siteConfig.contact.phoneRaw}`;

  return (
    <section className="relative flex items-center bg-gradient-to-br from-primary via-[#0d1f33] to-[#05101a] px-4 md:px-8 lg:px-12 overflow-hidden min-h-[560px] md:min-h-[600px]">
      {/* Decorative ambient — top left accent glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      {/* Decorative ambient — right side glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/4" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ─── Two-Column Layout ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-20 sm:pt-24 md:pt-20 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ─── Left Column: Marketing Content ────────────────────────── */}
          <div className="max-w-xl lg:max-w-2xl">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[53px] lg:leading-[1.12] font-extrabold text-white leading-tight mb-5 font-nunito tracking-normal">
              Telefon, SIM Kad & Reload
              <br className="lg:hidden" />
              <span className="text-accent lg:block lg:-mt-1">Semua Dalam Satu Tempat</span>
            </h1>

            {/* Subheadline */}
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-3 sm:mb-5 max-w-lg">
              Harga berpatutan. Produk original. Penghantaran pantas ke seluruh Malaysia.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3 mb-5 sm:mb-8">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-[1.02]"
                >
                  <span className="text-accent">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-semibold text-sm shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 min-h-[48px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                Lihat Produk
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white hover:text-primary hover:border-white transition-all duration-300 hover:-translate-y-0.5 min-h-[48px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Kami
              </a>
            </div>
          </div>

          {/* ─── Right Column: Product Showcase ────────────────────────── */}
          <div className="hidden lg:block">
            <ProductShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}