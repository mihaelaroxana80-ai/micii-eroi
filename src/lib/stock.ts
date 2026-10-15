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
  // Units in paid, shipped or completed orders on the site.
  sold: number;
  // Units the admin recorded as sold outside the site (OLX, in person).
  soldExternally: number;
  // Marked out of stock by the admin (e.g. sold outside the site).
  markedSoldOut: boolean;
  available: number;
};

// Order statuses whose items no longer count as available stock. CANCELLED orders give units back.
const SOLD_STATUSES = ["PAID", "SHIPPED", "COMPLETED"];

// External sales were added after launch; until their table exists in a database, count none
// rather than taking the shop down.
async function getExternalSales() {
  try {
    return await prisma.externalSale.findMany();
  } catch (err) {
    console.error("ExternalSale table unavailable — create it from prisma/schema.sql", err);
    return [];
  }
}

// One row per product size. Remaining stock = initial stock minus units sold on the site and
// units sold externally, or 0 when the admin marked the size as out of stock.
export async function getStockReport(): Promise<StockRow[]> {
  const [sold, external, marked] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productId", "size"],
      where: { order: { status: { in: SOLD_STATUSES } } },
      _sum: { quantity: true },
    }),
    getExternalSales(),
    prisma.soldOutVariant.findMany(),
  ]);
  const soldMap = new Map(
    sold.map((s) => [stockKey(s.productId, s.size), s._sum.quantity ?? 0]),
  );
  const externalMap = new Map(external.map((e) => [stockKey(e.productId, e.size), e.quantity]));
  const markedSet = new Set(marked.map((m) => stockKey(m.productId, m.size)));

  return PRODUCTS.flatMap((p) =>
    p.variants.map((v) => {
      const key = stockKey(p.id, v.size);
      const soldCount = soldMap.get(key) ?? 0;
      const soldExternally = externalMap.get(key) ?? 0;
      const markedSoldOut = markedSet.has(key);
      return {
        productId: p.id,
        productName: p.name,
        size: v.size,
        cm: v.cm,
        initial: v.stock,
        sold: soldCount,
        soldExternally,
        markedSoldOut,
        available: markedSoldOut ? 0 : Math.max(0, v.stock - soldCount - soldExternally),
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

// Adds units sold outside the site, or sets the total back to 0 when reset is true.
export async function recordExternalSale(productId: string, size: string, units: number, reset = false) {
  const where = { productId_size: { productId, size } };
  if (reset) {
    await prisma.externalSale.deleteMany({ where: { productId, size } });
  } else {
    await prisma.externalSale.upsert({
      where,
      create: { productId, size, quantity: units },
      update: { quantity: { increment: units } },
    });
  }
}
