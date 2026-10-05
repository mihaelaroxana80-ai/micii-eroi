"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BLUR_DATA_URL, SHOP_UI_ENABLED } from "@/lib/config";
import { priceFor, priceRange, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { SizePicker } from "./SizePicker";

type Props = {
  product: Product;
  // Remaining stock per size, computed on the server.
  stock: Record<string, number>;
};

export function ProductCard({ product, stock }: Props) {
  const { addToCart } = useCart();
  const singleVariant = product.variants.length === 1 ? product.variants[0].size : null;
  const [size, setSize] = useState<string | null>(singleVariant);
  const [added, setAdded] = useState(false);

  const totalStock = product.variants.reduce((n, v) => n + (stock[v.size] ?? 0), 0);
  const soldOut = totalStock === 0;
  const limited = !soldOut && totalStock <= 4;
  const glowInDark = product.id === "peruca-electra";
  const range = priceRange(product);
  const href = `/produse/${product.id}`;

  function handleAdd() {
    if (!size) return;
    addToCart(product.id, product.name, size, priceFor(product, size));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-cream">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-contain object-center"
        />
        {glowInDark && (
          <span className="absolute top-3 left-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
            Glow in the Dark ✨
          </span>
        )}
        {limited && (
          <span className="absolute top-3 right-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            Stoc limitat!
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={href} className="text-base font-bold text-ink hover:text-brand">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.shortDescription}</p>
        </div>

        <p className="font-bold text-brand">
          {size
            ? formatPrice(priceFor(product, size))
            : `${range.varies ? "de la " : ""}${formatPrice(range.min)}`}
        </p>

        <SizePicker variants={product.variants} stock={stock} selected={size} onSelect={setSize} compact />

        {SHOP_UI_ENABLED ? (
          <button type="button" onClick={handleAdd} disabled={!size || soldOut} className="btn-primary mt-auto w-full">
            {soldOut ? "Stoc epuizat" : added ? "✓ Adăugat în coș!" : "Adaugă în coș"}
          </button>
        ) : (
          <Link href={href} className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-brand px-6 py-3 font-bold text-brand transition duration-300 hover:bg-brand-tint">
            Vezi detalii
          </Link>
        )}
      </div>
    </article>
  );
}
