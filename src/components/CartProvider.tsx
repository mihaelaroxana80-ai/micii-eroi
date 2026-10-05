"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { getProduct, priceFor } from "@/lib/products";

export type CartItem = {
  productId: string;
  productName: string;
  size: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  // False during server render / hydration, before the saved cart is read.
  ready: boolean;
  count: number;
  subtotal: number;
  addToCart: (productId: string, productName: string, size: string, price: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "miciieroi-cart";
const MAX_QTY = 10;
const EMPTY: CartItem[] = [];

// localStorage-backed store, read through useSyncExternalStore.
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function readCart(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {}
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : EMPTY;
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function writeCart(update: (prev: CartItem[]) => CartItem[]) {
  const next = update(readCart());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: keep the cart in memory for this page view.
    cachedRaw = JSON.stringify(next);
    cachedItems = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const noopSubscribe = () => () => {};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, readCart, () => EMPTY);
  // Show current catalog prices, so a cart saved before a price change matches what checkout charges.
  const items = useMemo(
    () =>
      stored.map((it) => {
        const product = getProduct(it.productId);
        return product ? { ...it, price: priceFor(product, it.size) } : it;
      }),
    [stored],
  );
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const addToCart = useCallback(
    (productId: string, productName: string, size: string, price: number) => {
      writeCart((prev) => {
        const i = prev.findIndex((it) => it.productId === productId && it.size === size);
        if (i === -1) return [...prev, { productId, productName, size, price, quantity: 1 }];
        return prev.map((it, j) =>
          j === i ? { ...it, quantity: Math.min(MAX_QTY, it.quantity + 1) } : it,
        );
      });
    },
    [],
  );

  const removeFromCart = useCallback((index: number) => {
    writeCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, qty: number) => {
    const q = Math.max(1, Math.min(MAX_QTY, Math.floor(qty)));
    writeCart((prev) => prev.map((it, i) => (i === index ? { ...it, quantity: q } : it)));
  }, []);

  const clearCart = useCallback(() => writeCart(() => []), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((n, it) => n + it.quantity, 0),
      subtotal: items.reduce((s, it) => s + it.price * it.quantity, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, ready, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
