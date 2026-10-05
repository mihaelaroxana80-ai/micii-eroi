import type Stripe from "stripe";
import { toBani, validateCart } from "@/lib/checkout";
import { ORDERING_ENABLED, PRELAUNCH_MESSAGE } from "@/lib/config";
import { nextOrderNumber } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// REAL checkout: creates an order and a Stripe session. Test carts use /api/checkout/simulate instead.
export async function POST(req: Request) {
  // Real transactions disabled: refuse before touching the database or Stripe.
  if (!ORDERING_ENABLED) {
    return Response.json({ error: PRELAUNCH_MESSAGE }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Cerere invalidă." }, { status: 400 });

  const result = await validateCart(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  const { lines, shippingCost, total } = result.cart;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((l) => ({
    quantity: l.quantity,
    price_data: {
      currency: "ron",
      unit_amount: toBani(l.price),
      product_data: { name: `${l.name} – ${l.size}` },
    },
  }));
  if (shippingCost > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: "ron", unit_amount: toBani(shippingCost), product_data: { name: "Livrare prin curier" } },
    });
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: await nextOrderNumber(),
      total,
      shippingCost,
      status: "PENDING",
      paymentMethod: "card",
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          productName: l.name,
          size: l.size,
          quantity: l.quantity,
          price: l.price,
        })),
      },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ro",
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["RO"] },
      phone_number_collection: { enabled: true },
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      success_url: `${baseUrl}/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cos`,
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    await prisma.order.delete({ where: { id: order.id } });
    return Response.json({ error: "Plata nu a putut fi inițiată. Încearcă din nou." }, { status: 502 });
  }
}
