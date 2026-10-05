import { validateCart } from "@/lib/checkout";
import { TEST_MODE } from "@/lib/config";

// SIMULATED checkout for local testing. Validates the cart exactly like the real checkout,
// then returns a summary. It does NOT call Stripe, store an order, send e-mails,
// contact couriers or change stock. Unavailable in production and when real ordering is on.
export async function POST(req: Request) {
  if (!TEST_MODE) {
    return Response.json({ error: "Simularea este disponibilă doar în modul de test local." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Cerere invalidă." }, { status: 400 });

  const result = await validateCart(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  return Response.json({
    simulated: true,
    reference: `TEST-${Date.now().toString(36).toUpperCase()}`,
    ...result.cart,
  });
}
