import "server-only";
import type Stripe from "stripe";
import { prisma } from "./prisma";

// Generates MH-<year>-<NNN>, e.g. MH-2026-001.
export async function nextOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `MH-${year}-`;
  const last = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  const next = last ? parseInt(last.orderNumber.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

// Marks the order PAID and copies the customer details Stripe collected.
// Safe to call more than once (webhook + success page).
export async function markOrderPaid(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;

  const shipping = session.collected_information?.shipping_details;
  const customer = session.customer_details;
  const addr = shipping?.address ?? customer?.address;

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (!order) return null;
  if (order.status !== "PENDING") return order;

  return prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      customerName: shipping?.name ?? customer?.name ?? "",
      customerPhone: customer?.phone ?? "",
      customerEmail: customer?.email ?? "",
      address: [addr?.line1, addr?.line2].filter(Boolean).join(", "),
      city: addr?.city ?? "",
      county: addr?.state ?? "",
      postalCode: addr?.postal_code ?? "",
    },
  });
}
