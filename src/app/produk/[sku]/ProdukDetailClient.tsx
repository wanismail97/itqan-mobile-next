// ─── Product Detail Client ─────────────────────────────────────────────────
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Produk, Review } from "@/types/airtable";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";
import { waProductMessage } from "@/lib/utils";
import Link from "next/link";
import ProductPlaceholder from "@/components/sections/ProductPlaceholder";

import RelatedProducts from "@/components/sections/RelatedProducts";

interface Props {
  product: Produk;
  allProducts: Produk[];
  waPhone: string;
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

function StarRating({ rating, interactive, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onChange?.(star) : undefined}
          disabled={!interactive}
          className={`text-xl ${
            star <= rating ? "text-accent" : "text-gray-200"
          } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          aria-label={interactive ? `${star} bintang` : undefined}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProdukDetailClient({ product, allProducts, waPhone }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedVariasi, setSelectedVariasi] = useState("");

  // ─── Reviews state ──────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // ─── Review form state ──────────────────────────────────────────────
  const [formNama, setFormNama] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formReview, setFormReview] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [stickyVariasiOpen, setStickyVariasiOpen] = useState(false);
  const [stickyAction, setStickyAction] = useState<"cart" | "buy">("cart");

  // ─── Sticky Purchase Bar ────────────────────────────────────────────
  const [showSticky, setShowSticky] = useState(false);
  const purchaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = purchaseRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasPromo = product["Harga Promo RM"] != null;
  const displayPrice = hasPromo ? product["Harga Promo RM"]! : product["Harga RM"];
  const inStock = product.Stok > 0;
  const waLink = waProductMessage(product.Nama, product.SKU, waPhone);

  // ─── Parse variations from Airtable's Multiple Select ─────────────────
  const variasiOptions: string[] = useMemo(() => {
    if (!product.Variasi) return [];
    // Airtable Multiple Select can return string (comma-separated) or array
    if (Array.isArray(product.Variasi)) return product.Variasi;
    return product.Variasi.split(",").map((v: string) => v.trim()).filter(Boolean);
  }, [product.Variasi]);

  const hasVariasi = variasiOptions.length > 0;
  const variasiValid = !hasVariasi || selectedVariasi !== "";

  // ─── Fetch approved reviews on mount ─────────────────────────────────
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/review/list?sku=${encodeURIComponent(product.SKU)}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setAvgRating(data.averageRating || 0);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [product.SKU]);

  const handleAddToCart = () => {
    addItem({
      type: "product",
      airtableId: product.airtableId,
      SKU: product.SKU,
      Nama: product.Nama,
      "Gambar URL": product["Gambar URL"],
      Jenama: product.Jenama,
      price: displayPrice,
      originalPrice: product["Harga RM"],
      quantity,
      ...(hasVariasi ? { variasi: selectedVariasi } : {}),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleStickyAddToCart = () => {
    if (hasVariasi && !variasiValid) {
      setStickyAction("cart");
      setStickyVariasiOpen(true);
      return;
    }
    handleAddToCart();
  };

  const handleStickyBuyNow = () => {
    if (hasVariasi && !variasiValid) {
      setStickyAction("buy");
      setStickyVariasiOpen(true);
      return;
    }
    window.location.href = hasVariasi
      ? `/checkout?sku=${product.SKU}&qty=${quantity}&variasi=${encodeURIComponent(selectedVariasi)}`
      : `/checkout?sku=${product.SKU}&qty=${quantity}`;
  };

  // ─── Submit review ────────────────────────────────────────────────────
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validation
    if (!formNama.trim()) {
      setFormError("Sila masukkan nama");
      return;
    }
    if (formRating < 1) {
      setFormError("Sila pilih rating");
      return;
    }
    if (!formReview.trim()) {
      setFormError("Sila masukkan ulasan");
      return;
    }

    setFormSubmitting(true);

    try {
      const res = await fetch("/api/review/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: product.SKU,
          nama: formNama.trim(),
          telefon: "",
          rating: formRating,
          review: formReview.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormSuccess("Terima kasih. Ulasan anda sedang menunggu kelulusan.");
        setFormNama("");
        setFormRating(0);
        setFormReview("");
        setShowReviewModal(false);
      } else {
        setFormError(data.error || "Gagal menghantar ulasan. Sila cuba lagi.");
      }
    } catch {
      setFormError("Ralat rangkaian. Sila cuba lagi.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/produk" className="hover:text-accent transition-colors">
              Produk
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{product.Nama}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Image with hover zoom — 40% on desktop, full on mobile */}
            <div className="lg:col-span-2">
              <div className="aspect-square md:aspect-square lg:aspect-auto lg:h-[480px] rounded-2xl overflow-hidden bg-gray-50 relative img-zoom group flex items-center justify-center">
                {product["Gambar URL"] ? (
                  <img
                    src={product["Gambar URL"]}
                    alt={product.Nama}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                ) : (
                  <ProductPlaceholder label={product.Nama} />
                )}
                {hasPromo && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                  Promo
                </span>
                )}
              </div>
            </div>

            {/* Info — 60% on desktop */}
            <div className="flex flex-col lg:col-span-3">
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {product.Nama}
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-4">
                <span>Jenama: <strong className="text-gray-700">{product.Jenama}</strong></span>
                <span>SKU: <strong className="text-gray-700">{product.SKU}</strong></span>
                <span>Kategori: <strong className="text-gray-700">{product.Kategori}</strong></span>
              </div>

              {/* Price */}
              <div className="mb-4">
                {hasPromo ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-accent">
                      RM{displayPrice.toLocaleString("ms-MY")}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      RM{product["Harga RM"].toLocaleString("ms-MY")}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full font-semibold">
                      Promo
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-accent">
                    RM{displayPrice.toLocaleString("ms-MY")}
                  </span>
                )}
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {product.Waranti && (
                  <span className="inline-block bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-full font-medium">
                    {product.Waranti}
                  </span>
                )}
                <span
                  className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium ${
                    inStock
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {inStock ? `Stok: ${product.Stok}` : "Stok Habis"}
                </span>
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {product.Status}
                </span>
              </div>

              {/* Description */}
              {product.Deskripsi && (
                <div className="mb-6">
                  <h3 className="font-semibold text-primary mb-2">Deskripsi</h3>
                  <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">
                    {product.Deskripsi}
                  </p>
                </div>
              )}

              {/* ─── Variation Selector (pill style) ───────────────── */}
              {hasVariasi && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Variasi <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
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
                  {!variasiValid && (
                    <p className="text-xs text-red-500 mt-2">
                      Sila pilih variasi
                    </p>
                  )}
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Kuantiti:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Kurang"
                  >
                    -
                  </button>
                  <span className="px-5 py-2.5 font-medium min-w-[3rem] text-center border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.Stok, quantity + 1))
                    }
                    disabled={quantity >= product.Stok}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition disabled:opacity-30 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons — observed for sticky bar trigger */}
              <div
                ref={purchaseRef}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || (hasVariasi && !variasiValid)}
                  className={`btn-premium flex-1 py-3.5 rounded-xl font-semibold min-h-[48px] ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {added ? "✓ Ditambah ke Bakul" : "Tambah ke Bakul"}
                </button>

                {hasVariasi ? (
                  <Link
                    href={
                      variasiValid
                        ? `/checkout?sku=${product.SKU}&qty=${quantity}&variasi=${encodeURIComponent(selectedVariasi)}`
                        : "#"
                    }
                    className={`btn-premium flex-1 text-center py-3.5 rounded-xl font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-primary min-h-[48px] ${
                      !inStock || !variasiValid
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    Beli Sekarang
                  </Link>
                ) : (
                  <Link
                    href={`/checkout?sku=${product.SKU}&qty=${quantity}`}
                    className={`btn-premium flex-1 text-center py-3.5 rounded-xl font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-primary min-h-[48px] ${
                      !inStock ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Beli Sekarang
                  </Link>
                )}

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium flex-1 text-center py-3.5 rounded-xl font-semibold bg-[#25D366] text-white hover:bg-[#1da851] min-h-[48px]"
                >
                  Tanya Produk
                </a>
              </div>

              {/* Highlights — dinamik dari Airtable */}
              <div className="border-t border-gray-100 pt-5 text-sm text-gray-500 space-y-2">
                {(product.Highlights
                  ? product.Highlights.split("\n").filter(Boolean)
                  : [
                      "Produk berkualiti",
                      "Penghantaran seluruh Malaysia",
                      "Pembayaran selamat",
                    ]
                ).map((item, i) => (
                  <p key={i} className="flex items-center gap-2">
                    <span>✅</span>
                    <span>{item.trim()}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
             ULASAN PELANGGAN
             ═══════════════════════════════════════════════════════════════ */}
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              ⭐ Ulasan Pelanggan
            </h2>

            {/* ─── Average Rating ─────────────────────────────────────── */}
            {!reviewsLoading && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-2xl font-bold text-primary ml-2">
                    {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  ({reviews.length} ulasan)
                </span>
              </div>
            )}

            {/* ─── Review Cards ───────────────────────────────────────── */}
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="card-premium p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {reviews.map((review) => (
                  <div
                    key={review.airtableId}
                    className="card-premium border border-gray-100 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <StarRating rating={review.Rating} />
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {formatDate(review.Tarikh)}
                      </span>
                    </div>
                    <p className="font-semibold text-primary text-sm mb-1">
                      {review.Nama}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      &ldquo;{review.Review}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 mb-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-500 mb-6">
                  Belum ada ulasan untuk produk ini. Jadilah yang pertama!
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setShowReviewModal(true);
                      setFormError("");
                      setFormSuccess("");
                    }}
                    className="btn-premium bg-accent text-primary px-8 py-3.5 rounded-2xl font-semibold hover:bg-accent/90 transition-all duration-200 min-h-[48px] shadow-md hover:shadow-lg"
                  >
                    ✏️ Tulis Ulasan
                  </button>
                </div>
              </div>
            )}

            {/* ─── Success + Button for non-empty reviews ──────────────── */}
            {reviews.length > 0 && (
              <div className="mt-8 space-y-6">
                {formSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4 flex items-start gap-3">
                    <span className="text-lg mt-0.5">✅</span>
                    <div>
                      <p className="font-semibold text-green-800 mb-0.5">
                        Ulasan berjaya dihantar untuk kelulusan.
                      </p>
                      <p className="text-green-600">{formSuccess}</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setShowReviewModal(true);
                      setFormError("");
                      setFormSuccess("");
                    }}
                    className="btn-premium bg-accent text-primary px-8 py-3.5 rounded-2xl font-semibold hover:bg-accent/90 transition-all duration-200 min-h-[48px] shadow-md hover:shadow-lg"
                  >
                    ✏️ Tulis Ulasan
                  </button>
                </div>
              </div>
            )}

              {/* ════════════════════════════════════════════════════════════
                 REVIEW MODAL
                 ════════════════════════════════════════════════════════════ */}
              {showReviewModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center px-4"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Tulis Ulasan"
                >
                  {/* ─── Overlay ──────────────────────────────────────────── */}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => {
                      setShowReviewModal(false);
                      setFormError("");
                      setFormSuccess("");
                    }}
                  />

                  {/* ─── Modal Panel ──────────────────────────────────────── */}
                  <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                        <span className="text-xl">⭐</span> Tulis Ulasan
                      </h3>
                        <button
                        onClick={() => {
                          setShowReviewModal(false);
                          setFormError("");
                          setFormSuccess("");
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Tutup modal"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Body */}
                    <form
                      onSubmit={async (e) => {
                        await handleSubmitReview(e);
                        // If submit was successful, formSuccess will be set
                      }}
                      className="px-6 py-5 space-y-5"
                    >
                      {/* Nama */}
                      <div>
                        <label
                          htmlFor="review-nama-modal"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Nama Anda <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="review-nama-modal"
                          type="text"
                          value={formNama}
                          onChange={(e) => setFormNama(e.target.value)}
                          placeholder="Nama anda"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating <span className="text-red-500">*</span>
                        </label>
                        <StarRating
                          rating={formRating}
                          interactive
                          onChange={setFormRating}
                        />
                      </div>

                      {/* Ulasan */}
                      <div>
                        <label
                          htmlFor="review-text-modal"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Ulasan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="review-text-modal"
                          rows={4}
                          value={formReview}
                          onChange={(e) => setFormReview(e.target.value)}
                          placeholder="Kongsi pengalaman anda dengan produk ini..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-vertical"
                        />
                      </div>

                      {/* Error */}
                      {formError && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                          {formError}
                        </p>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewModal(false);
                            setFormError("");
                            setFormSuccess("");
                          }}
                          className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors min-h-[48px]"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={formSubmitting}
                          className="flex-1 py-3 rounded-xl font-semibold bg-accent text-primary hover:bg-accent/90 transition-colors min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {formSubmitting ? "Menghantar..." : "Hantar Ulasan"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
          </section>

          {/* ═══════════════════════════════════════════════════════════════
             PRODUK BERKAITAN / PRODUK LAIN — Tab Section
             ═══════════════════════════════════════════════════════════════ */}
          <RelatedProducts currentSku={product.SKU} allProducts={allProducts} />
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
         STICKY PURCHASE BAR
         Shows when original buttons scroll out of viewport.
         ═══════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Desktop layout */}
            <div className="hidden sm:flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {product["Gambar URL"] && (
                  <img
                    src={product["Gambar URL"]}
                    alt={product.Nama}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-primary truncate block">
                    {product.Nama}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-accent whitespace-nowrap">
                      RM{displayPrice.toLocaleString("ms-MY")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {inStock ? `${product.Stok} unit tersedia` : "Stok habis"}
                    </span>
                  </div>
                </div>
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                    aria-label="Kurang"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 font-semibold text-sm border-x border-gray-200 bg-gray-50 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.Stok, quantity + 1))}
                    disabled={quantity >= product.Stok}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition text-sm font-medium disabled:opacity-30"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleStickyAddToCart}
                  disabled={!inStock}
                  className={`btn-premium px-6 py-2.5 rounded-xl font-semibold text-sm min-h-[44px] ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {added ? "✓ Ditambah" : "Tambah ke Bakul"}
                </button>
                <button
                  onClick={handleStickyBuyNow}
                  disabled={!inStock}
                  className="btn-premium px-6 py-2.5 rounded-xl text-sm font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-primary min-h-[44px] text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center gap-2">
                {product["Gambar URL"] && (
                  <img
                    src={product["Gambar URL"]}
                    alt={product.Nama}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-primary truncate block leading-tight">
                    {product.Nama}
                  </span>
                  <span className="text-xs text-gray-400">
                    RM{displayPrice.toLocaleString("ms-MY")}
                    {inStock ? ` · ${product.Stok} unit` : " · Stok habis"}
                  </span>
                </div>
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 transition text-sm"
                    aria-label="Kurang"
                  >
                    −
                  </button>
                  <span className="px-2.5 py-1 font-semibold text-xs border-x border-gray-200 bg-gray-50 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.Stok, quantity + 1))}
                    disabled={quantity >= product.Stok}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 transition text-sm disabled:opacity-30"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStickyAddToCart}
                  disabled={!inStock}
                  className={`btn-premium flex-1 py-2.5 rounded-xl font-semibold text-xs min-h-[40px] ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {added ? "✓ Ditambah" : "Tambah ke Bakul"}
                </button>
                <button
                  onClick={handleStickyBuyNow}
                  disabled={!inStock}
                  className="btn-premium flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-primary min-h-[40px] text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         STICKY VARIASI MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {stickyVariasiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setStickyVariasiOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-modal-in z-10">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Pilih Variasi
            </h3>

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

            {!variasiValid && selectedVariasi === "" && (
              <p className="text-xs text-red-500 mb-3">Sila pilih variasi</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-gray-500">Kuantiti:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition"
                >
                  −
                </button>
                <span className="px-4 py-1.5 font-semibold text-sm border-x border-gray-200 bg-gray-50 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.Stok, quantity + 1))}
                  disabled={quantity >= product.Stok}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition disabled:opacity-30"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400 ml-auto">
                Stok: {product.Stok}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStickyVariasiOpen(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition min-h-[44px]"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setStickyVariasiOpen(false);
                  if (stickyAction === "cart") {
                    handleAddToCart();
                  } else {
                    window.location.href = `/checkout?sku=${product.SKU}&qty=${quantity}&variasi=${encodeURIComponent(selectedVariasi)}`;
                  }
                }}
                disabled={!variasiValid || !inStock}
                className="flex-1 py-3 rounded-xl font-semibold bg-accent text-primary hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {stickyAction === "cart" ? "Tambah ke Bakul" : "Beli Sekarang"}
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