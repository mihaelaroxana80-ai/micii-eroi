import { isAdminRequest } from "@/lib/admin-auth";
import { getProduct } from "@/lib/products";
import { getStockReport, recordExternalSale, setSoldOut } from "@/lib/stock";

const unauthorized = () => Response.json({ error: "Neautorizat" }, { status: 401 });
const invalid = () => Response.json({ error: "Date invalide" }, { status: 400 });

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  return Response.json({ stock: await getStockReport() });
}

// One action per request:
// - { soldOut: boolean } marks a size out of stock / back on sale;
// - { soldExternally: number } adds units sold outside the site;
// - { resetExternal: true } sets the externally sold count back to 0.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  const { productId, size, soldOut, soldExternally, resetExternal } = await req.json().catch(() => ({}));
  const product = typeof productId === "string" ? getProduct(productId) : undefined;
  if (!product || !product.variants.some((v) => v.size === size)) return invalid();

  try {
    if (typeof soldOut === "boolean") {
      await setSoldOut(product.id, size, soldOut);
    } else if (resetExternal === true) {
      await recordExternalSale(product.id, size, 0, true);
    } else if (Number.isInteger(soldExternally) && soldExternally >= 1 && soldExternally <= 100) {
      await recordExternalSale(product.id, size, soldExternally);
    } else {
      return invalid();
    }
  } catch (err) {
    console.error("Stock update failed", err);
    return Response.json({ error: "Nu s-a putut salva. Verifică baza de date." }, { status: 500 });
  }

  return Response.json({ stock: await getStockReport() });
}
