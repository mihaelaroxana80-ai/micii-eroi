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

type StockRow = {
  productId: string;
  productName: string;
  size: string;
  cm: number | null;
  initial: number;
  sold: number;
  markedSoldOut: boolean;
  available: number;
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
  const [stock, setStock] = useState<StockRow[]>([]);
  const [tab, setTab] = useState<"orders" | "stock">("orders");
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // The password is kept only in memory: refreshing the page asks for it again.
  async function loadAll(pw: string) {
    setLoading(true);
    const headers = { "x-admin-password": pw };
    const [ordersRes, stockRes] = await Promise.all([
      fetch("/api/admin/orders", { headers }),
      fetch("/api/admin/stock", { headers }),
    ]);
    setLoading(false);
    if (ordersRes.status === 401 || stockRes.status === 401) {
      setPassword(null);
      return;
    }
    setOrders((await ordersRes.json()).orders ?? []);
    setStock((await stockRes.json()).stock ?? []);
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
    loadAll(input);
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

  async function toggleSoldOut(row: StockRow) {
    if (!password) return;
    const key = `${row.productId}::${row.size}`;
    setSavingKey(key);
    const res = await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ productId: row.productId, size: row.size, soldOut: !row.markedSoldOut }),
    });
    setSavingKey(null);
    if (res.ok) setStock((await res.json()).stock ?? []);
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
        <button type="button" onClick={() => loadAll(password)} className="btn-primary">
          {loading ? "Se încarcă..." : "↻ Reîncarcă"}
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total comenzi" value={String(orders.length)} />
        <Stat label="Comenzi plătite" value={String(paid.length)} />
        <Stat label="Venit total" value={formatPrice(revenue)} />
      </div>

      <div className="mb-4 flex gap-2" role="tablist">
        {(
          [
            ["orders", "Comenzi"],
            ["stock", "Stoc"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-11 rounded-full border-2 px-5 font-bold transition duration-300 ${
              tab === id ? "border-brand bg-brand-tint text-brand" : "border-line bg-white text-ink hover:border-brand-light"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "stock" ? (
        <StockTable rows={stock} loading={loading} savingKey={savingKey} onToggle={toggleSoldOut} />
      ) : (
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
      )}
    </main>
  );
}

function StockTable({
  rows,
  loading,
  savingKey,
  onToggle,
}: {
  rows: StockRow[];
  loading: boolean;
  savingKey: string | null;
  onToggle: (row: StockRow) => void;
}) {
  return (
    <div className="card overflow-x-auto">
      <p className="border-b border-line px-4 py-3 text-base text-stone-600">
        Marchează o mărime ca epuizată când se vinde în afara site-ului (ex. OLX). Clienții nu o vor mai putea adăuga în coș.
      </p>
      <table className="w-full min-w-[720px] text-left text-base">
        <thead className="bg-cream text-ink">
          <tr>
            {["Produs", "Mărime", "Stoc inițial", "Vândut pe site", "Disponibil", "Acțiune"].map((h) => (
              <th key={h} className="px-4 py-3 font-extrabold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-stone-500">
                {loading ? "Se încarcă..." : "Niciun produs."}
              </td>
            </tr>
          )}
          {rows.map((r) => {
            const key = `${r.productId}::${r.size}`;
            return (
              <tr key={key} className={r.markedSoldOut ? "bg-stone-50" : undefined}>
                <td className="px-4 py-3 font-bold">{r.productName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.size}
                  {r.cm && <span className="text-sm text-stone-500"> · {r.cm} cm</span>}
                </td>
                <td className="px-4 py-3">{r.initial}</td>
                <td className="px-4 py-3">{r.sold}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.markedSoldOut ? (
                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-800">
                      Epuizat (manual)
                    </span>
                  ) : r.available === 0 ? (
                    <span className="inline-block rounded-full bg-stone-200 px-3 py-1 text-sm font-bold text-stone-700">
                      Epuizat
                    </span>
                  ) : (
                    <span className="font-bold">{r.available} buc</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggle(r)}
                    disabled={savingKey === key}
                    className={`text-sm whitespace-nowrap disabled:opacity-50 ${
                      r.markedSoldOut
                        ? "inline-flex min-h-11 items-center rounded-full border-2 border-brand px-4 font-bold text-brand transition duration-300 hover:bg-brand-tint"
                        : "btn-primary"
                    }`}
                  >
                    {savingKey === key ? "Se salvează..." : r.markedSoldOut ? "Repune în stoc" : "Marchează epuizat"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
