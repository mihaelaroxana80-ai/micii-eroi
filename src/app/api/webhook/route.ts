import type Stripe from "stripe";
import { markOrderPaid } from "@/lib/orders";
import { stripe } from "@/lib/stripe";

// App Router route handlers have no body parser: req.text() gives the raw body
// that Stripe's signature check needs.
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    await markOrderPaid(event.data.object);
  }

  return Response.json({ received: true });
}
