"use client";

import { useState } from "react";
import { PRELAUNCH_MESSAGE, SHOP_UI_ENABLED } from "@/lib/config";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  priceFor,
  priceRange,
  type Party,
  type Product,
  type ProductCompliance,
} from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { SizePicker } from "./SizePicker";

type Props = {
  product: Product;
  stock: Record<string, number>;
};

// Right-hand column of the product page: title, price, sizes, add to cart, details.
export function ProductDetail({ product, stock }: Props) {
  const { addToCart } = useCart();
  const singleVariant = product.variants.length === 1 ? product.variants[0].size : null;
  const [size, setSize] = useState<string | null>(singleVariant);
  const [added, setAdded] = useState(false);
  const soldOut = product.variants.every((v) => (stock[v.size] ?? 0) === 0);
  const range = priceRange(product);

  function handleAdd() {
    if (!size) return;
    addToCart(product.id, product.name, size, priceFor(product, size));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <h1 className="text-3xl leading-tight font-extrabold text-ink sm:text-4xl">{product.name}</h1>
      <p className="text-2xl font-bold text-brand">
        {size ? formatPrice(priceFor(product, size)) : `${range.varies ? "de la " : ""}${formatPrice(range.min)}`}
      </p>
      <p className="text-lg text-stone-600">{product.shortDescription}</p>

      <div>
        <p className="mb-3 font-bold">Mărime</p>
        <SizePicker variants={product.variants} stock={stock} selected={size} onSelect={setSize} />
        {range.varies && <p className="mt-2 text-sm text-stone-500">Prețul diferă în funcție de mărime.</p>}
      </div>

      {SHOP_UI_ENABLED ? (
        <button type="button" onClick={handleAdd} disabled={!size || soldOut} className="btn-primary w-full text-lg">
          {soldOut ? "Stoc epuizat" : added ? "✓ Adăugat în coș!" : size ? "Adaugă în coș" : "Alege mărimea"}
        </button>
      ) : (
        <p role="status" className="rounded-2xl bg-brand-tint p-4 text-center text-base font-semibold text-brand">
          {PRELAUNCH_MESSAGE}
        </p>
      )}

      <section className="border-t border-line pt-5">
        <h2 className="mb-3 text-xl font-extrabold text-ink">Detalii produs</h2>
        <p className="text-base leading-relaxed text-stone-600">{product.details}</p>
        <ul className="mt-4 space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex gap-2 text-base">
              <span aria-hidden className="font-bold text-brand">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <ProductSafetyInfo compliance={product.compliance} />

      {/* Delivery terms are part of the shopping interface (local test mode or live ordering). */}
      {SHOP_UI_ENABLED && (
        <p className="rounded-2xl bg-white p-4 text-base text-stone-600 shadow-card">
          🚚 Livrare {SHIPPING_COST} lei · Gratuită peste {FREE_SHIPPING_THRESHOLD} lei
        </p>
      )}
    </div>
  );
}

// Shows only verified fields that have been filled in; renders nothing otherwise.
function ProductSafetyInfo({ compliance }: { compliance?: ProductCompliance }) {
  if (!compliance) return null;
  const { manufacturer, euResponsiblePerson, identifiers, safetyWarnings } = compliance;
  const ids = identifiers
    ? (
        [
          ["Marcă", identifiers.brand],
          ["Model", identifiers.model],
          ["Cod produs", identifiers.sku],
          ["EAN", identifiers.ean],
          ["Lot", identifiers.batch],
        ] as const
      ).filter(([, v]) => v)
    : [];
  if (!manufacturer && !euResponsiblePerson && ids.length === 0 && !safetyWarnings?.length) return null;

  return (
    <section className="border-t border-line pt-5 text-base">
      <h2 className="mb-3 text-xl font-extrabold text-ink">Informații despre siguranța produsului</h2>
      {safetyWarnings && safetyWarnings.length > 0 && (
        <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="mb-1 font-bold">Avertismente</p>
          <ul className="list-disc space-y-1 pl-5">
            {safetyWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <dl className="space-y-2 text-stone-600">
        {manufacturer && <PartyRow label="Producător" party={manufacturer} />}
        {euResponsiblePerson && <PartyRow label="Persoana responsabilă în UE" party={euResponsiblePerson} />}
        {ids.map(([label, value]) => (
          <div key={label}>
            <dt className="inline font-semibold text-ink">{label}: </dt>
            <dd className="inline">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function PartyRow({ label, party }: { label: string; party: Party }) {
  return (
    <div>
      <dt className="font-semibold text-ink">{label}</dt>
      <dd>
        {party.name}, {party.address}
        {party.contact ? `, ${party.contact}` : ""}
      </dd>
    </div>
  );
}
