import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const STATUSES = ["PENDING", "PAID", "SHIPPED"] as const;

const unauthorized = () => Response.json({ error: "Neautorizat" }, { status: 401 });

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ orders });
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  const { orderId, status } = await req.json().catch(() => ({}));
  if (typeof orderId !== "string" || !STATUSES.includes(status)) {
    return Response.json({ error: "Date invalide" }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id: orderId }, data: { status } }).catch(() => null);
  if (!order) return Response.json({ error: "Comanda nu există" }, { status: 404 });
  return Response.json({ order });
}
