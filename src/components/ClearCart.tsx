"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

export function ClearCart() {
  const { ready, clearCart } = useCart();
  useEffect(() => {
    if (ready) clearCart();
  }, [ready, clearCart]);
  return null;
}
