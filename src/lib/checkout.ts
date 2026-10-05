import "server-only";
import { getProduct, priceFor, shippingFor } from "./products";
import { getAvailableStock, stockKey } from "./stock";

export type CheckoutLine = { productId: string; name: string; size: string; price: number; quantity: number };

export type ValidatedCart = { lines: CheckoutLine[]; subtotal: number; shippingCost: number; total: number };

type IncomingItem = { productId?: unknown; size?: unknown; quantity?: unknown };

export const toBani = (lei: number) => Math.round(lei * 100);

// Validates a cart against the server-side catalog and current stock. Read-only: never writes.
// Prices (including per-size prices) come only from PRODUCTS, never from the client.
export async function validateCart(
  body: unknown,
): Promise<{ ok: true; cart: ValidatedCart } | { ok: false; error: string; status: number }> {
  const items = (body as { items?: unknown } | null)?.items;
  const incoming: IncomingItem[] = Array.isArray(items) ? items : [];
  if (incoming.length === 0 || incoming.length > 50) {
    return { ok: false, error: "Coșul este gol.", status: 400 };
  }

  // Merge duplicates and validate every line.
  const merged = new Map<string, CheckoutLine>();
  for (const item of incoming) {
    const product = typeof item.productId === "string" ? getProduct(item.productId) : undefined;
    const variant = product?.variants.find((v) => v.size === item.size);
    const qty = Number(item.quantity);
    if (!product || !variant || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return { ok: false, error: "Coșul conține un produs invalid. Reîncarcă pagina.", status: 400 };
    }
    const key = stockKey(product.id, variant.size);
    const existing = merged.get(key);
    if (existing) existing.quantity += qty;
    else
      merged.set(key, {
        productId: product.id,
        name: product.name,
        size: variant.size,
        price: priceFor(product, variant.size),
        quantity: qty,
      });
  }

  const available = await getAvailableStock();
  for (const [key, line] of merged) {
    const left = available.get(key) ?? 0;
    if (line.quantity > left) {
      return {
        ok: false,
        status: 409,
        error:
          left === 0
            ? `${line.name} (${line.size}) nu mai este în stoc.`
            : `Mai avem doar ${left} buc. din ${line.name} (${line.size}).`,
      };
    }
  }

  const lines = [...merged.values()];
  const subtotal = lines.reduce((s, l) => s + toBani(l.price) * l.quantity, 0) / 100;
  const shippingCost = shippingFor(subtotal);
  const total = Math.round((subtotal + shippingCost) * 100) / 100;
  return { ok: true, cart: { lines, subtotal, shippingCost, total } };
}
