// ─── Cart Context & Provider ────────────────────────────────────────────────
// Manages cart state in localStorage with React Context.
// Persists across page navigations and browser sessions.
// Extended with promo code and shipping support.
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";

// ─── Context Shape ──────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  /** True if cart contains at least one product (not just reload/service) */
  hasProducts: boolean;
  // ─── Promo & Shipping ────────────────────────────────────────────────
  promoCode: string;
  discountAmount: number;
  shippingFee: number;
  applyPromo: (code: string, type: "Flat" | "Percent", value: number, subtotal?: number) => void;
  removePromo: () => void;
  setShippingFee: (fee: number) => void;
  getGrandTotal: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Storage Keys ───────────────────────────────────────────────────────────

const CART_STORAGE_KEY = "itqan_cart";
const PROMO_STORAGE_KEY = "itqan_promo";

/**
 * Extract a stable unique key from any cart item for deduplication.
 * For products: SKU
 * For reload: "reload:{provider}:{phone}"
 * For service: "service:{serviceName}:{account or phone}"
 */
function itemKey(item: CartItem): string {
  switch (item.type) {
    case "product":
      return item.SKU;
    case "reload":
      return `reload:${item.provider}:${item.phoneNumber}`;
    case "service":
      return `service:${item.serviceName}:${item.accountNumber || item.phoneNumber || item.customerName || ""}`;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // ─── Promo & Shipping state ──────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore corrupt data — start with empty cart
    }

    // ─── Load saved promo code + discount ──────────────────────────────
    try {
      const storedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
      if (storedPromo) {
        const parsed = JSON.parse(storedPromo);
        if (parsed.code && typeof parsed.code === "string") {
          setPromoCode(parsed.code);
          if (typeof parsed.discountAmount === "number") {
            setDiscountAmount(parsed.discountAmount);
          }
        }
      }
    } catch {
      // Ignore
    }

    setHydrated(true);
  }, []);

  // Persist cart to localStorage whenever items change (only after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  // Persist promo code + discount amount
  useEffect(() => {
    if (hydrated && promoCode) {
      localStorage.setItem(
        PROMO_STORAGE_KEY,
        JSON.stringify({ code: promoCode, discountAmount })
      );
    } else if (hydrated && !promoCode) {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoCode, discountAmount, hydrated]);

  // ─── Derived values ────────────────────────────────────────────────────

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const total = items.reduce((sum, i) => {
    if (i.type === "product") return sum + i.price * i.quantity;
    if (i.type === "reload") return sum + i.amount;
    if (i.type === "service") return sum + (i.amount || 0);
    return sum;
  }, 0);

  const hasProducts = items.some((i) => i.type === "product");

  // ─── Cart Actions ───────────────────────────────────────────────────────

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const key = itemKey(newItem);
      const existingIndex = prev.findIndex((i) => itemKey(i) === key);
      if (existingIndex >= 0) {
        // Item already exists — increment quantity (for products only)
        const existing = prev[existingIndex];
        if (existing.type === "product" && newItem.type === "product") {
          const updated = [...prev];
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + newItem.quantity,
          };
          return updated;
        }
        // For reload/service, replace (only one reload per provider+phone)
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      }
      // New item — append
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => itemKey(i) !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (itemKey(i) !== id) return i;
        if (i.type === "product") {
          return { ...i, quantity };
        }
        // Reload and service items always have quantity 1
        return i;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode("");
    setDiscountAmount(0);
    setShippingFee(0);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return total;
  }, [total]);

  // ─── Promo & Shipping Actions ────────────────────────────────────────────

  const applyPromo = useCallback((code: string, type: "Flat" | "Percent", value: number, subtotal?: number) => {
    setPromoCode(code);
    const base = typeof subtotal === "number" ? subtotal : total;
    const normalized = type.trim().toLowerCase();
    if (normalized === "flat") {
      setDiscountAmount(value);
    } else if (normalized === "percent") {
      // Use parseFloat to preserve decimal precision (e.g., RM0.30 for 10% of RM3)
      setDiscountAmount(parseFloat(((base * value) / 100).toFixed(2)));
    }
  }, [total]);

  const removePromo = useCallback(() => {
    setPromoCode("");
    setDiscountAmount(0);
  }, []);

  const getGrandTotal = useCallback(() => {
    const subtotal = getTotalPrice();
    return Math.max(0, subtotal + shippingFee - discountAmount);
  }, [getTotalPrice, shippingFee, discountAmount]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        hasProducts,
        promoCode,
        discountAmount,
        shippingFee,
        applyPromo,
        removePromo,
        setShippingFee,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}