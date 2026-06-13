// ─── Checkout Client — /checkout ──────────────────────────────────────────
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";

function usePromoValidation(cartTotal: number) {
  const { promoCode, discountAmount, applyPromo, removePromo } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    setPromoLoading(true);
    setPromoError("");

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: cartTotal }),
      });

      const data = await res.json();

      if (data.success) {
        applyPromo(code, data.discountType, data.discountValue, cartTotal);
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

  return { promoCode, discountAmount, promoInput, setPromoInput, promoError, promoLoading, handleApplyPromo, removePromo };
}

function useShippingCalculation(
  shippingItems: Array<{ shippingClass?: string; quantity: number }> | null
) {
  const { shippingFee, setShippingFee } = useCart();
  const serialized = shippingItems === null ? null : JSON.stringify(shippingItems);

  useEffect(() => {
    if (serialized === null) return;
    const items = JSON.parse(serialized) as Array<{ shippingClass?: string; quantity: number }>;
    async function fetchShipping() {
      try {
        const res = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        if (data.success) setShippingFee(data.shippingFee);
      } catch {
        // Keep current shippingFee
      }
    }
    fetchShipping();
  }, [serialized, setShippingFee]);

  return shippingFee;
}
import { formatRM } from "@/lib/utils";
import { lookupPostcode } from "@/data/malaysia-postcodes";
import Link from "next/link";
import type { Produk } from "@/types/airtable";
import type { CartItem, ProductCartItem } from "@/types/cart";

// ─── Local storage helpers ────────────────────────────────────────────────

const PROFILE_KEY = "itqan_checkout_profile";

interface SavedProfile {
  version: number;
  nama: string;
  telefon: string;
  email: string;
}

function loadProfile(): SavedProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.version === 1) {
      return data as SavedProfile;
    }
    return null;
  } catch {
    return null;
  }
}

function saveProfile(nama: string, telefon: string, email: string): void {
  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ version: 1, nama, telefon, email })
    );
  } catch {
    // localStorage unavailable — fail silently
  }
}

// ─── Type guards ────────────────────────────────────────────────────────────
function isProductItem(item: CartItem): item is CartItem & { type: "product"; SKU: string; Nama: string; "Gambar URL"?: string; Jenama: string; price: number; originalPrice: number; quantity: number; variasi?: string } {
  return item.type === "product";
}

function isReloadItem(item: CartItem): item is CartItem & { type: "reload"; id: string; provider: string; phoneNumber: string; amount: number; quantity: 1 } {
  return item.type === "reload";
}

function isServiceItem(item: CartItem): item is CartItem & { type: "service"; id: string; serviceName: string; accountNumber?: string; customerName?: string; phoneNumber?: string; amount?: number; quantity: 1 } {
  return item.type === "service";
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  nama: string;
  telepon: string;
  email: string;
  alamat: string;
  bandar: string;
  poskod: string;
  negeri: string;
}

/** A display-ready checkout line item */
interface CheckoutLine {
  id: string;
  type: "product" | "reload" | "service";
  label: string;
  detail: string;
  amount: number;
  quantity: number;
  variasi?: string;
}

// ─── Badge styling per item type ────────────────────────────────────────────
const typeBadge: Record<CheckoutLine["type"], { label: string; classes: string }> = {
  product: { label: "PRODUK", classes: "bg-blue-100 text-blue-700" },
  reload: { label: "RELOAD", classes: "bg-purple-100 text-purple-700" },
  service: { label: "SERVIS", classes: "bg-green-100 text-green-700" },
};

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clearCart } = useCart();

  const [hasPrefillData, setHasPrefillData] = useState(false);

  const [form, setForm] = useState<FormData>(() => {
    const profile = loadProfile();
    if (profile) {
      setHasPrefillData(true);
      return {
        nama: profile.nama || "",
        telepon: profile.telefon || "",
        email: profile.email || "",
        alamat: "",
        bandar: "",
        poskod: "",
        negeri: "",
      };
    }
    return { nama: "", telepon: "", email: "", alamat: "", bandar: "", poskod: "", negeri: "" };
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Server-fetched product (for Buy Now when not in cart) ─────────────
  const [directProduct, setDirectProduct] = useState<Produk | null>(null);
  const [directLoading, setDirectLoading] = useState(true);

  // ─── Parse URL params ──────────────────────────────────────────────────
  const fromCart = searchParams.get("from") === "cart";
  const skuParam = searchParams.get("sku");
  const qtyParam = parseInt(searchParams.get("qty") || "1", 10);
  const variasiParam = searchParams.get("variasi") || undefined;

  // ─── Determine if cart has physical products (needs shipping) ──────────
  const hasProducts = useMemo(() => {
    if (fromCart) return items.some((i) => i.type === "product");
    if (skuParam) return true;
    return items.some((i) => i.type === "product");
  }, [fromCart, skuParam, items]);

  // ─── Shipping items for rate calculation ───────────────────────────────
  const shippingItems = useMemo(() => {
    if (skuParam) {
      const cartItem = items.find((i): i is ProductCartItem => i.type === "product" && i.SKU === skuParam);
      if (cartItem) return [{ shippingClass: cartItem.shippingClass, quantity: qtyParam }];
      if (directProduct) return [{ shippingClass: directProduct["Shipping Class"], quantity: qtyParam }];
      return null; // directProduct not yet loaded — defer calculation
    }
    return items
      .filter((i): i is ProductCartItem => i.type === "product")
      .map((i) => ({ shippingClass: i.shippingClass, quantity: i.quantity }));
  }, [skuParam, items, directProduct, qtyParam]);

  // ─── Fetch product from Airtable if needed ─────────────────────────────
  useEffect(() => {
    if (fromCart) {
      setDirectLoading(false);
      return;
    }

    if (!skuParam) {
      setDirectLoading(false);
      return;
    }

    const inCart = items.find((i) => i.type === "product" && i.SKU === skuParam);
    if (inCart) {
      setDirectLoading(false);
      return;
    }

    let cancelled = false;
    setDirectLoading(true);

    fetch(`/api/produk/${encodeURIComponent(skuParam)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Produk) => {
        if (!cancelled) {
          setDirectProduct(data);
          setDirectLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDirectProduct(null);
          setDirectLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [skuParam, fromCart, items]);

  // ─── Build checkout lines ──────────────────────────────────────────────
  const checkoutLines: CheckoutLine[] = useMemo(() => {
    const lines: CheckoutLine[] = [];

    if (fromCart) {
      for (const item of items) {
        if (isProductItem(item)) {
          lines.push({
            id: item.SKU,
            type: "product",
            label: item.Nama,
            detail: `SKU: ${item.SKU} x${item.quantity}`,
            amount: item.price * item.quantity,
            quantity: item.quantity,
            variasi: item.variasi,
          });
        } else if (isReloadItem(item)) {
          lines.push({
            id: `reload:${item.provider}:${item.phoneNumber}`,
            type: "reload",
            label: `Reload ${item.provider}`,
            detail: `Telefon: ${item.phoneNumber}`,
            amount: item.amount,
            quantity: 1,
          });
        } else if (isServiceItem(item)) {
          const detail = item.accountNumber
            ? `Akaun: ${item.accountNumber}`
            : item.customerName
              ? `Nama: ${item.customerName}`
              : item.phoneNumber
                ? `Telefon: ${item.phoneNumber}`
                : "";
          lines.push({
            id: item.id,
            type: "service",
            label: item.serviceName,
            detail,
            amount: item.amount || 0,
            quantity: 1,
          });
        }
      }
      return lines;
    }

    if (skuParam) {
      const cartItem = items.find((i): i is CartItem & { type: "product"; SKU: string; Nama: string; "Gambar URL"?: string; Jenama: string; price: number; originalPrice: number; quantity: number; variasi?: string } => i.type === "product" && i.SKU === skuParam);
      if (cartItem) {
        lines.push({
          id: cartItem.SKU,
          type: "product",
          label: cartItem.Nama,
          detail: `SKU: ${cartItem.SKU} x${qtyParam}`,
          amount: cartItem.price * qtyParam,
          quantity: qtyParam,
          variasi: cartItem.variasi,
        });
        return lines;
      }

      if (directProduct) {
        const hasPromo = directProduct["Harga Promo RM"] != null;
        const displayPrice = hasPromo
          ? (directProduct["Harga Promo RM"] as number)
          : directProduct["Harga RM"];
        lines.push({
          id: directProduct.SKU,
          type: "product",
          label: directProduct.Nama,
          detail: `SKU: ${directProduct.SKU} x${qtyParam}`,
          amount: displayPrice * qtyParam,
          quantity: qtyParam,
          variasi: variasiParam,
        });
        return lines;
      }

      return [];
    }

    for (const item of items) {
      if (isProductItem(item)) {
        lines.push({
          id: item.SKU,
          type: "product",
          label: item.Nama,
          detail: `SKU: ${item.SKU} x${item.quantity}`,
          amount: item.price * item.quantity,
          quantity: item.quantity,
          variasi: item.variasi,
        });
      } else if (isReloadItem(item)) {
        lines.push({
          id: `reload:${item.provider}:${item.phoneNumber}`,
          type: "reload",
          label: `Reload ${item.provider}`,
          detail: `Telefon: ${item.phoneNumber}`,
          amount: item.amount,
          quantity: 1,
        });
      } else if (isServiceItem(item)) {
        const detail = item.accountNumber
          ? `Akaun: ${item.accountNumber}`
          : item.customerName
            ? `Nama: ${item.customerName}`
            : item.phoneNumber
              ? `Telefon: ${item.phoneNumber}`
              : "";
        lines.push({
          id: item.id,
          type: "service",
          label: item.serviceName,
          detail,
          amount: item.amount || 0,
          quantity: 1,
        });
      }
    }
    return lines;
  }, [fromCart, skuParam, qtyParam, items, directProduct]);

  const checkoutTotal = useMemo(
    () => checkoutLines.reduce((sum, i) => sum + i.amount, 0),
    [checkoutLines]
  );

  const checkoutCount = useMemo(
    () => checkoutLines.reduce((sum, i) => sum + i.quantity, 0),
    [checkoutLines]
  );

  // ─── Determine order type for Jenis Pesanan field ──────────────────────
  const orderType = useMemo(() => {
    const types = new Set(checkoutLines.map((l) => l.type));
    if (types.size === 0) return "";
    if (types.size === 1) {
      const t = [...types][0];
      if (t === "product") return "Produk";
      if (t === "reload") return "Reload";
      if (t === "service") return "Servis";
    }
    return "Campuran";
  }, [checkoutLines]);

  // ─── Promo & Shipping calculations ─────────────────────────────────────
  const promo = usePromoValidation(checkoutTotal);
  const shippingFee = useShippingCalculation(shippingItems);
  const grandTotal = Math.max(0, checkoutTotal + shippingFee - promo.discountAmount);

  // ─── Redirect only when truly empty and not loading ────────────────────
  useEffect(() => {
    if (!submitted && !directLoading && checkoutLines.length === 0 && !skuParam) {
      router.push("/cart");
    }
  }, [checkoutLines, directLoading, skuParam, router, submitted]);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePoskodChange = (value: string) => {
    // Always update the poskod field
    updateField("poskod", value);

    // Only auto-fill when 5 digits are entered
    if (value.length !== 5) return;

    const result = lookupPostcode(value);
    if (result) {
      setForm((prev) => ({
        ...prev,
        poskod: value,
        bandar: result.bandar,
        negeri: result.negeri,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nama.trim() || !form.telepon.trim()) {
      alert("Sila isi Nama dan Telefon.");
      return;
    }

    if (hasProducts && (!form.alamat.trim() || !form.bandar.trim() || !form.poskod.trim() || !form.negeri.trim())) {
      alert("Sila isi alamat penghantaran lengkap.");
      return;
    }

    // ─── Save customer profile to localStorage ─────────────────────────
    saveProfile(form.nama.trim(), form.telepon.trim(), form.email.trim());

    setSubmitting(true);
    setErrorMsg("");

    // ─── Build the description for ToyyibPay ────────────────────────────
    const description = checkoutLines
      .slice(0, 3)
      .map((l) => l.label)
      .join(", ") + (checkoutLines.length > 3 ? ` + ${checkoutLines.length - 3} lagi` : "");

    // ─── Build the shipping address (if applicable) ─────────────────────
    const shippingAddress = hasProducts
      ? {
          alamat: form.alamat.trim(),
          bandar: form.bandar.trim(),
          poskod: form.poskod.trim(),
          negeri: form.negeri.trim(),
        }
      : undefined;

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            nama: form.nama.trim(),
            telepon: form.telepon.trim(),
            email: form.email.trim(),
            ...shippingAddress,
          },
          items: checkoutLines.map((line) => ({
            label: line.label,
            detail: line.detail,
            quantity: line.quantity,
            amount: line.amount,
            ...(line.variasi ? { variasi: line.variasi } : {}),
          })),
          total: grandTotal,
          orderType,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses pesanan");
      }

      setOrderId(data.orderId);

      // ─── Save pending cart for recovery if payment cancelled ─────────
      try {
        localStorage.setItem("itqan_pending_cart", JSON.stringify({
          items,
          promoCode: promo.promoCode,
          discountAmount: promo.discountAmount,
          shippingFee,
          createdAt: Date.now(),
        }));
      } catch {
        // localStorage unavailable — fail silently
      }

      // ─── Clear cart & redirect to ToyyibPay ──────────────────────────
      clearCart();
      setSubmitted(true);
      setSubmitting(false);

      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("Checkout: Error creating order:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyambung ke sistem pembayaran"
      );
      setSubmitting(false);
    }
  };

  const isValid = form.nama.trim() && form.telepon.trim();

  // ─── Loading state ─────────────────────────────────────────────────────
  if (directLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="text-center">
            <div className="skeleton h-8 w-48 mx-auto mb-4" />
            <div className="skeleton h-4 w-64 mx-auto" />
          </div>
        </div>
        <Footer />
        <StickyButtons />
      </>
    );
  }

  // ─── Empty / not found ─────────────────────────────────────────────────
  if (checkoutLines.length === 0 && !submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Bakul Kosong
            </h2>
            <p className="text-gray-500 mb-8">
              Anda belum tambah sebarang item untuk checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/produk"
                className="inline-block bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition"
              >
                Lihat Produk
              </Link>
              <Link
                href="/reload"
                className="inline-block bg-white text-primary px-8 py-3 rounded-full font-semibold border-2 border-primary hover:bg-gray-50 transition"
              >
                Beli Reload
              </Link>
              <Link
                href="/servis"
                className="inline-block bg-white text-primary px-8 py-3 rounded-full font-semibold border-2 border-primary hover:bg-gray-50 transition"
              >
                Servis
              </Link>
            </div>
          </div>
        </div>
        <Footer />
        <StickyButtons />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-8">
            Checkout
          </h1>

          {submitted ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔁</div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Sedang Dialihkan ke Pembayaran...
              </h2>
              {orderId && (
                <p className="text-accent font-mono font-bold text-lg mb-2">
                  {orderId}
                </p>
              )}
              <p className="text-gray-500">
                Anda akan dialihkan ke ToyyibPay untuk pembayaran.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Jika tidak dialihkan secara automatik,
                sila klik butang di bawah.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* ─── Form ──────────────────────────────────────────────── */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">
                    Maklumat Pelanggan
                  </h2>
                  {hasPrefillData && (
                    <p className="text-xs text-gray-400 -mt-3 mb-4">
                      Maklumat anda diisi secara automatik.
                    </p>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Penuh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nama}
                        onChange={(e) => updateField("nama", e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.telepon}
                        onChange={(e) => updateField("telepon", e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    {/* ─── Shipping Address (only if cart has products) ─── */}
                    {hasProducts && (
                      <>
                        <hr className="border-gray-200" />
                        <h3 className="text-md font-semibold text-primary">
                          Alamat Penghantaran
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={form.alamat}
                            onChange={(e) => updateField("alamat", e.target.value)}
                            required
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Poskod <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.poskod}
                              onChange={(e) => handlePoskodChange(e.target.value)}
                              maxLength={5}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bandar <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.bandar}
                              onChange={(e) => updateField("bandar", e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Negeri <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.negeri}
                            onChange={(e) => updateField("negeri", e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {errorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isValid || submitting}
                      className="w-full bg-accent text-primary py-3 rounded-lg font-semibold hover:bg-accent/90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        `Bayar RM${grandTotal.toLocaleString("ms-MY")}`
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      Bayaran diproses melalui ToyyibPay.
                      Anda akan diredirect ke laman pembayaran selepas menekan butang.
                    </p>
                  </form>
                </div>
              </div>

              {/* ─── Order Summary ─────────────────────────────────────── */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-primary mb-4">
                    Ringkasan Pesanan
                  </h2>

                  <div className="space-y-3 mb-4">
                    {checkoutLines.map((line) => {
                      const badge = typeBadge[line.type];
                      return (
                        <div
                          key={line.id}
                          className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${badge.classes}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-primary">
                            {line.label}
                          </p>
                          {line.variasi && (
                            <p className="text-xs text-accent font-medium">
                              Variasi: {line.variasi}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {line.detail}
                          </p>
                          <p className="text-sm font-bold text-accent mt-1">
                            {formatRM(line.amount)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ─── Promo Code ──────────────────────────────────────── */}
                  {promo.promoCode ? (
                    <div className="border-t border-gray-200 pt-3 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Kod Promo</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-700">{promo.promoCode}</span>
                          <button onClick={promo.removePromo} className="text-xs text-red-500 hover:text-red-700">Buang</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-gray-200 pt-3 mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Kod Promo</p>
                      <div className="flex gap-2">
                        <input type="text" value={promo.promoInput} onChange={(e) => promo.setPromoInput(e.target.value.toUpperCase())} placeholder="Masukkan kod" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" />
                        <button onClick={promo.handleApplyPromo} disabled={promo.promoLoading || !promo.promoInput.trim()} className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 min-w-[50px]">{promo.promoLoading ? "..." : "Guna"}</button>
                      </div>
                      {promo.promoError && <p className="text-xs text-red-500 mt-1">{promo.promoError}</p>}
                    </div>
                  )}

                  {/* ─── Pricing Breakdown ──────────────────────────────── */}
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-primary">
                        {formatRM(checkoutTotal)}
                      </span>
                    </div>

                    {shippingFee > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Caj Penghantaran</span>
                        <span className="font-medium text-primary">
                          {formatRM(shippingFee)}
                        </span>
                      </div>
                    )}

                    {promo.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600">Diskaun Kod Promo</span>
                        <span className="font-medium text-green-600">
                          -{formatRM(promo.discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-600 text-sm">
                        Jumlah Bayaran
                      </span>
                      <span className="text-xl font-bold text-accent">
                        {formatRM(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}