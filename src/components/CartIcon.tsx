"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartIcon() {
  const { count } = useCart();

  return (
    <Link
      href="/cos"
      aria-label={`Coșul meu, ${count} produse`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-brand-tint hover:text-brand"
    >
      <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
