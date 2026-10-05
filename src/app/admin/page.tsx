"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

type OrderItem = { id: string; productName: string; size: string; quantity: number; price: number };
type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
  total: number;
  shippingCost: number;
  status: "PENDING" | "PAID" | "SHIPPED";
  createdAt: string;
  items: OrderItem[];
};

const STATUS_STYLE: Record<Order["status"], string> = {
  PENDING: "bg-stone-200 text-stone-700",
  PAID: "bg-green-100 text-green-800",
  SHIPPED: "bg-blue-100 text-blue-800",
};


export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // The password is kept only in memory: refreshing the page asks for it again.
  async function loadOrders(pw: string) {
    setLoading(true);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-password": pw } });
    setLoading(false);
    if (res.status === 401) {
      setPassword(null);
      return;
    }
    const data = await res.json();
    setOrders(data.orders ?? []);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    const { ok } = await res.json();
    if (!ok) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    setPassword(input);
    loadOrders(input);
  }

  async function markShipped(orderId: string) {
    if (!password) return;
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ orderId, status: "SHIPPED" }),
    });
    if (res.ok) setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "SHIPPED" } : o)));
  }

  if (!password) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <form onSubmit={login} className="card w-full max-w-sm p-8">
          <h1 className="mb-6 text-center text-2xl font-extrabold">Admin MiciiEroi</h1>
          <label htmlFor="pw" className="mb-2 block text-base font-semibold">Parolă</label>
          <input
            id="pw"
            type="password"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-12 w-full rounded-xl border-2 border-line px-4 text-base outline-none focus:border-brand"
          />
          {authError && <p className="mt-2 text-base font-semibold text-red-700">Parolă greșită.</p>}
          <button type="submit" className="btn-primary mt-5 w-full">Intră</button>
        </form>
      </main>
    );
  }

  const paid = orders.filter((o) => o.status !== "PENDING");
  const revenue = paid.reduce((s, o) => s + o.total, 0);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Admin MiciiEroi</h1>
        <button type="button" onClick={() => loadOrders(password)} className="btn-primary">
          {loading ? "Se încarcă..." : "↻ Reîncarcă"}
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total comenzi" value={String(orders.length)} />
        <Stat label="Comenzi plătite" value={String(paid.length)} />
        <Stat label="Venit total" value={formatPrice(revenue)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-base">
          <thead className="bg-cream text-ink">
            <tr>
              {["Nr. Comandă", "Data", "Client", "Telefon", "Adresă livrare", "Produse comandate", "Total", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 font-extrabold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                  {loading ? "Se încarcă..." : "Nicio comandă încă."}
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="align-top">
                <td className="px-4 py-3 font-bold whitespace-nowrap">{o.orderNumber}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3">
                  {o.customerName || "—"}
                  {o.customerEmail && <div className="text-sm text-stone-500">{o.customerEmail}</div>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {o.customerPhone ? (
                    <a href={`tel:${o.customerPhone}`} className="text-brand underline">{o.customerPhone}</a>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  {o.address ? (
                    <>
                      {o.address}
                      <div className="text-sm text-stone-500">
                        {[o.city, o.county, o.postalCode].filter(Boolean).join(", ")}
                      </div>
                    </>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <ul>
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.productName} <span className="text-stone-500">({it.size})</span> × {it.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-bold whitespace-nowrap">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${STATUS_STYLE[o.status]}`}>
                    {o.status}
                  </span>
                  {o.status === "PAID" && (
                    <button type="button" onClick={() => markShipped(o.id)} className="btn-primary mt-2 text-sm whitespace-nowrap">
                      Marchează Expediat
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-base text-stone-600">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-brand">{value}</p>
    </div>
  );
}
