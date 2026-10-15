import { isAdminRequest } from "@/lib/admin-auth";
import { getProduct } from "@/lib/products";
import { getStockReport, setSoldOut } from "@/lib/stock";

const unauthorized = () => Response.json({ error: "Neautorizat" }, { status: 401 });

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  return Response.json({ stock: await getStockReport() });
}

// Marks a product size as out of stock (soldOut: true) or back on sale (soldOut: false).
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  const { productId, size, soldOut } = await req.json().catch(() => ({}));
  const product = typeof productId === "string" ? getProduct(productId) : undefined;
  if (!product || !product.variants.some((v) => v.size === size) || typeof soldOut !== "boolean") {
    return Response.json({ error: "Date invalide" }, { status: 400 });
  }

  await setSoldOut(product.id, size, soldOut);
  return Response.json({ stock: await getStockReport() });
}
