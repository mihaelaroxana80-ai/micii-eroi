import "server-only";
import { prisma } from "./prisma";
import { PRODUCTS, type Product } from "./products";

export const stockKey = (productId: string, size: string) => `${productId}::${size}`;

// Remaining stock = initial stock minus units in paid or shipped orders.
export async function getAvailableStock(): Promise<Map<string, number>> {
  const sold = await prisma.orderItem.groupBy({
    by: ["productId", "size"],
    where: { order: { status: { in: ["PAID", "SHIPPED"] } } },
    _sum: { quantity: true },
  });
  const soldMap = new Map(
    sold.map((s) => [stockKey(s.productId, s.size), s._sum.quantity ?? 0]),
  );

  const available = new Map<string, number>();
  for (const p of PRODUCTS) {
    for (const v of p.variants) {
      const key = stockKey(p.id, v.size);
      available.set(key, Math.max(0, v.stock - (soldMap.get(key) ?? 0)));
    }
  }
  return available;
}

// Remaining stock for one product, keyed by size.
export function stockBySize(available: Map<string, number>, product: Product): Record<string, number> {
  return Object.fromEntries(
    product.variants.map((v) => [v.size, available.get(stockKey(product.id, v.size)) ?? 0]),
  );
}
