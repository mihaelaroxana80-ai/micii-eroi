"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { PRELAUNCH_MESSAGE, SHOP_UI_ENABLED, TEST_MODE } from "@/lib/config";
import { FREE_SHIPPING_THRESHOLD, getProduct, shippingFor } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

type SimulatedOrder = {
  reference: string;
  lines: { productId: string; name: string; size: string; price: number; quantity: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

export default function CartPage() {
  const { items, ready, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulated, setSimulated] = useState<SimulatedOrder | null>(null);

  const shipping = items.length ? shippingFor(subtotal) : 0;
  const total = subtotal + shipping;

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      // Test mode never touches the real checkout (Stripe / stored orders).
      const res = await fetch(TEST_MODE ? "/api/checkout/simulate" : "/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nu am putut iniția plata.");
      if (TEST_MODE) {
        setSimulated(data);
        setLoading(false);
        return;
      }
      if (!data.url) throw new Error("Nu am putut iniția plata.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "A apărut o eroare. Încearcă din nou.");
      setLoading(false);
    }
  }

  if (simulated) {
    return (
      <SimulatedConfirmation
        order={simulated}
        onBack={() => setSimulated(null)}
        onClear={() => {
          clearCart();
          setSimulated(null);
        }}
      />
    );
  }

  if (!SHOP_UI_ENABLED) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <div className="card p-10 text-center">
          <h1 className="text-2xl font-extrabold text-ink">{PRELAUNCH_MESSAGE}</h1>
          <p className="mt-3 text-base text-stone-500">Între timp poți răsfoi catalogul de costume.</p>
          <Link href="/#catalog" className="btn-primary mt-6">
            Vezi costumele
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <Link href="/#catalog" className="inline-flex min-h-11 items-center font-semibold text-stone-500 hover:text-brand">
        ← Înapoi la cumpărături
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold text-ink sm:text-4xl">Coșul tău</h1>

      {!ready ? (
        <div className="card h-40 animate-pulse" aria-busy />
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-lg text-stone-500">Coșul este gol.</p>
          <Link href="/#catalog" className="btn-primary mt-6">
            Vezi costumele
          </Link>
        </div>
      ) : (
        <>
          <ul className="card divide-y divide-line">
            {items.map((it, i) => {
              const image = getProduct(it.productId)?.images[0];
              return (
                <li key={`${it.productId}-${it.size}`} className="flex flex-wrap items-center gap-4 p-4">
                  <Link
                    href={`/produse/${it.productId}`}
                    className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl border border-line bg-white"
                  >
                    {image && <Image src={image} alt={it.productName} fill sizes="60px" className="object-contain" />}
                  </Link>

                  <div className="min-w-36 flex-1">
                    <p className="font-bold text-ink">{it.productName}</p>
                    <p className="text-sm text-stone-500">Mărime: {it.size}</p>
                    <p className="text-sm font-semibold text-brand">{formatPrice(it.price)}</p>
                  </div>

                  <div className="flex items-center rounded-full border border-line" aria-label="Cantitate">
                    <button
                      type="button"
                      onClick={() => updateQuantity(i, it.quantity - 1)}
                      disabled={it.quantity <= 1}
                      aria-label="Scade cantitatea"
                      className="h-11 w-11 rounded-full text-xl font-bold text-ink hover:bg-cream disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold">{it.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(i, it.quantity + 1)}
                      aria-label="Crește cantitatea"
                      className="h-11 w-11 rounded-full text-xl font-bold text-ink hover:bg-cream"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-24 text-right font-bold">{formatPrice(it.price * it.quantity)}</p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(i)}
                    aria-label={`Șterge ${it.productName}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <section className="card mt-6 p-5 sm:p-6">
            <div className="flex justify-between py-1.5 text-base">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-base">
              <span className="text-stone-600">Livrare</span>
              <span className="font-semibold">
                {shipping === 0 ? <span className="text-green-700">GRATUITĂ</span> : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="py-1 text-sm text-stone-500">
                Mai adaugă {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} pentru livrare gratuită.
              </p>
            )}
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-extrabold text-ink">{formatPrice(total)}</span>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-base font-semibold text-red-700">
                {error}
              </p>
            )}

            {TEST_MODE ? (
              <>
                <button type="button" onClick={checkout} disabled={loading} className="btn-primary mt-6 w-full text-lg">
                  {loading ? "Se simulează..." : "Simulează comanda"}
                </button>
                <p className="mt-3 text-center text-sm text-stone-500">
                  Test local: nu se trimite nicio comandă și nu se încasează nicio plată.
                </p>
              </>
            ) : (
              <>
                <button type="button" onClick={checkout} disabled={loading} className="btn-primary mt-6 w-full text-lg">
                  {loading ? "Se pregătește plata..." : "Finalizează comanda"}
                </button>
                <p className="mt-3 text-center text-sm text-stone-500">Plată securizată prin Stripe</p>
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function SimulatedConfirmation({
  order,
  onBack,
  onClear,
}: {
  order: SimulatedOrder;
  onBack: () => void;
  onClear: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12">
      <div className="card overflow-hidden border-2 border-dashed border-orange-400">
        <div className="bg-orange-50 px-6 py-5 text-center">
          <p className="inline-block rounded-full bg-orange-500 px-3 py-1 text-sm font-extrabold tracking-wide text-white">
            SIMULARE
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-ink">Comandă simulată — nu a fost trimisă</h1>
          <p className="mt-2 text-sm text-orange-900">
            Nu s-a încasat nicio plată, nu s-a salvat nicio comandă și stocul nu s-a modificat.
          </p>
          <p className="mt-2 font-mono text-sm text-stone-600">Referință test: {order.reference}</p>
        </div>

        <div className="p-6">
          <h2 className="mb-2 text-lg font-extrabold">Rezumat (calculat pe server)</h2>
          <ul className="divide-y divide-line">
            {order.lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-3 py-2 text-base">
                <span>
                  {l.name} <span className="text-stone-500">({l.size})</span> × {l.quantity}
                  <span className="block text-sm text-stone-500">{formatPrice(l.price)} / buc</span>
                </span>
                <span className="font-bold whitespace-nowrap">{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-line pt-3 text-base">
            <p className="flex justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-600">Livrare</span>
              <span>{order.shippingCost === 0 ? "GRATUITĂ" : formatPrice(order.shippingCost)}</span>
            </p>
            <p className="flex justify-between pt-2 text-xl font-extrabold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={onBack} className="btn-primary w-full">
              Înapoi la coș
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-line font-bold text-ink hover:border-brand-light"
            >
              Golește coșul de test
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
