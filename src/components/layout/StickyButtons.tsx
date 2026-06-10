// ─── WhatsApp Floating Button + Back to Top ────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";

export default function StickyButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${siteConfig.contact.phoneRaw}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-5 bottom-24 z-50 w-14 h-14 bg-[#25D366] rounded-2xl shadow-lg flex items-center justify-center wa-pulse hover:opacity-90 transition-all duration-300 ease-out hover:scale-110"
        aria-label="WhatsApp Kami"
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-5 bottom-8 z-50 w-11 h-11 bg-accent rounded-2xl shadow-md flex items-center justify-center text-white font-bold transition-all duration-300 ease-out hover:shadow-lg hover:scale-110 ${
          showBackToTop
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
        aria-label="Kembali ke atas"
      >
        ↑
      </button>
    </>
  );
}
