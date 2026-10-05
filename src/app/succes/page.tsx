import Link from "next/link";
import { notFound } from "next/navigation";
import { ORDERING_ENABLED } from "@/lib/config";
import { ClearCart } from "@/components/ClearCart";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { markOrderPaid } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

async function loadOrder(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Also confirms payment here, so orders get marked PAID even if the webhook is not set up yet.
    await markOrderPaid(session);
    return prisma.order.findUnique({ where: { stripeSessionId: session.id }, include: { items: true } });
  } catch (err) {
    console.error("Could not load checkout session:", err);
    return null;
  }
}

export default async function SuccessPage({ searchParams }: PageProps<"/succes">) {
  // No orders exist in pre-launch mode; don't query Stripe.
  if (!ORDERING_ENABLED) notFound();

  const { session_id } = await searchParams;
  const order = typeof session_id === "string" ? await loadOrder(session_id) : null;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="card relative w-full max-w-xl overflow-hidden text-center">
        <div className="bg-brand px-6 py-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Comanda ta a fost plasată! 🎉</h1>
          {order && (
            <p className="mt-3 inline-block rounded-full bg-white/25 px-4 py-1.5 text-lg font-bold text-white">
              Nr. comandă: {order.orderNumber}
            </p>
          )}
        </div>

        <div className="p-6 text-left">
          {order ? (
            <>
              <h2 className="mb-3 text-xl font-extrabold">Ce ai comandat</h2>
              <ul className="divide-y divide-line">
                {order.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-3 py-2 text-base">
                    <span>
                      {it.productName} <span className="text-stone-500">({it.size})</span> × {it.quantity}
                    </span>
                    <span className="font-bold whitespace-nowrap">{formatPrice(it.price * it.quantity)}</span>
                  </li>
                ))}
                <li className="flex justify-between py-2 text-base">
                  <span>Livrare</span>
                  <span className="font-bold">{order.shippingCost === 0 ? "GRATUITĂ" : formatPrice(order.shippingCost)}</span>
                </li>
              </ul>
              <p className="mt-3 flex justify-between border-t-2 border-line pt-3 text-xl font-extrabold text-ink">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </p>
            </>
          ) : (
            <p className="text-base text-stone-600">
              Nu am putut încărca detaliile comenzii, dar nu-ți face griji — dacă plata a fost efectuată, comanda este
              înregistrată.
            </p>
          )}

          <p className="mt-6 rounded-xl bg-cream p-4 text-center text-lg font-semibold text-ink">
            Vei fi contactat în curând pentru confirmare livrare
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <WhatsAppButton
              text={order ? `Bună! Am o întrebare despre comanda ${order.orderNumber}.` : undefined}
              label="Contactează-ne pe WhatsApp"
            />
            <Link href="/" className="inline-flex min-h-11 items-center font-bold text-brand hover:text-ink">
              ← Înapoi la magazin
            </Link>
          </div>
        </div>
      </div>
      {order && <ClearCart />}
    </main>
  );
}
