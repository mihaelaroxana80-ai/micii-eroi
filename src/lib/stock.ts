import "server-only";
import { prisma } from "./prisma";
import { PRODUCTS, type Product } from "./products";

export const stockKey = (productId: string, size: string) => `${productId}::${size}`;

export type StockRow = {
  productId: string;
  productName: string;
  size: string;
  cm: number | null;
  initial: number;
  // Units in paid or shipped orders on the site.
  sold: number;
  // Marked out of stock by the admin (e.g. sold outside the site).
  markedSoldOut: boolean;
  available: number;
};

// One row per product size. Remaining stock = initial stock minus units in paid or shipped orders,
// or 0 when the admin marked the size as out of stock.
export async function getStockReport(): Promise<StockRow[]> {
  const [sold, marked] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productId", "size"],
      where: { order: { status: { in: ["PAID", "SHIPPED"] } } },
      _sum: { quantity: true },
    }),
    prisma.soldOutVariant.findMany(),
  ]);
  const soldMap = new Map(
    sold.map((s) => [stockKey(s.productId, s.size), s._sum.quantity ?? 0]),
  );
  const markedSet = new Set(marked.map((m) => stockKey(m.productId, m.size)));

  return PRODUCTS.flatMap((p) =>
    p.variants.map((v) => {
      const key = stockKey(p.id, v.size);
      const soldCount = soldMap.get(key) ?? 0;
      const markedSoldOut = markedSet.has(key);
      return {
        productId: p.id,
        productName: p.name,
        size: v.size,
        cm: v.cm,
        initial: v.stock,
        sold: soldCount,
        markedSoldOut,
        available: markedSoldOut ? 0 : Math.max(0, v.stock - soldCount),
      };
    }),
  );
}

export async function getAvailableStock(): Promise<Map<string, number>> {
  const rows = await getStockReport();
  return new Map(rows.map((r) => [stockKey(r.productId, r.size), r.available]));
}

// Remaining stock for one product, keyed by size.
export function stockBySize(available: Map<string, number>, product: Product): Record<string, number> {
  return Object.fromEntries(
    product.variants.map((v) => [v.size, available.get(stockKey(product.id, v.size)) ?? 0]),
  );
}

export async function setSoldOut(productId: string, size: string, soldOut: boolean) {
  const where = { productId_size: { productId, size } };
  if (soldOut) {
    await prisma.soldOutVariant.upsert({ where, create: { productId, size }, update: {} });
  } else {
    await prisma.soldOutVariant.deleteMany({ where: { productId, size } });
  }
}
