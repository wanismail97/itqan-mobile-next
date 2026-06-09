// ─── Cart Context & Provider ────────────────────────────────────────────────
// Manages cart state in localStorage with React Context.
// Persists across page navigations and browser sessions.
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
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Storage Key ────────────────────────────────────────────────────────────

const STORAGE_KEY = "itqan_cart";

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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore corrupt data — start with empty cart
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (only after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  // ─── Derived values ────────────────────────────────────────────────────

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const total = items.reduce((sum, i) => {
    if (i.type === "product") return sum + i.price * i.quantity;
    if (i.type === "reload") return sum + i.amount;
    if (i.type === "service") return sum + (i.amount || 0);
    return sum;
  }, 0);

  const hasProducts = items.some((i) => i.type === "product");

  // ─── Actions ───────────────────────────────────────────────────────────

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
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, i) => {
      if (i.type === "product") return sum + i.price * i.quantity;
      if (i.type === "reload") return sum + i.amount;
      if (i.type === "service") return sum + (i.amount || 0);
      return sum;
    }, 0);
  }, [items]);

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
