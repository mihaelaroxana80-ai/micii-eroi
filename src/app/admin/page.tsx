"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
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
  status: OrderStatus;
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
  soldExternally: number;
  markedSoldOut: boolean;
  available: number;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "În așteptare",
  PAID: "Plătită",
  SHIPPED: "Expediată",
  COMPLETED: "Finalizată",
  CANCELLED: "Anulată",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-stone-200 text-stone-700",
  PAID: "bg-green-100 text-green-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const rowKey = (r: StockRow) => `${r.productId}::${r.size}`;

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState<StockRow[]>([]);
  const [tab, setTab] = useState<"orders" | "stock">("orders");
  const [loading, setLoading] = useState(false);
  // Order id or stock row key currently being saved.
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

  // Sends an admin request; shows the server's error and returns null when it fails.
  async function adminFetch(url: string, method: "POST" | "DELETE", key: string, body: object) {
    if (!password) return null;
    setSavingKey(key);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(body),
    });
    setSavingKey(null);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error ?? "A apărut o eroare.");
      return null;
    }
    return data;
  }

  async function changeStatus(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    const data = await adminFetch("/api/admin/orders", "POST", order.id, { orderId: order.id, status });
    if (!data) return;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    // Cancelling or restoring an order changes the units it holds.
    if (password) loadAll(password);
  }

  async function deleteOrder(order: Order) {
    if (!confirm(`Ștergi definitiv comanda ${order.orderNumber}? Acțiunea nu poate fi anulată.`)) return;
    const data = await adminFetch("/api/admin/orders", "DELETE", order.id, { orderId: order.id });
    if (!data) return;
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    if (password) loadAll(password);
  }

  async function updateStock(row: StockRow, change: object) {
    const data = await adminFetch("/api/admin/stock", "POST", rowKey(row), {
      productId: row.productId,
      size: row.size,
      ...change,
    });
    if (data) setStock(data.stock ?? []);
    return Boolean(data);
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

  const paid = orders.filter((o) => o.status !== "PENDING" && o.status !== "CANCELLED");
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
        <StockTable rows={stock} loading={loading} savingKey={savingKey} onUpdate={updateStock} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-base">
            <thead className="bg-cream text-ink">
              <tr>
                {["Nr. Comandă", "Data", "Client", "Telefon", "Adresă livrare", "Produse comandate", "Total", "Status", ""].map(
                  (h, i) => (
                    <th key={i} className="px-4 py-3 font-extrabold">{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-stone-500">
                    {loading ? "Se încarcă..." : "Nicio comandă încă."}
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className={`align-top ${o.status === "CANCELLED" ? "bg-stone-50 text-stone-500" : ""}`}>
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
                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                    <label className="mt-2 block">
                      <span className="sr-only">Schimbă statusul comenzii {o.orderNumber}</span>
                      <select
                        value={o.status}
                        disabled={savingKey === o.id}
                        onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                        className="min-h-11 rounded-xl border-2 border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand disabled:opacity-50"
                      >
                        {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => deleteOrder(o)}
                      disabled={savingKey === o.id}
                      className="inline-flex min-h-11 items-center rounded-full border-2 border-red-200 px-4 text-sm font-bold text-red-700 transition duration-300 hover:bg-red-50 disabled:opacity-50"
                    >
                      Șterge
                    </button>
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
  onUpdate,
}: {
  rows: StockRow[];
  loading: boolean;
  savingKey: string | null;
  onUpdate: (row: StockRow, change: object) => Promise<boolean>;
}) {
  // Row whose "sold externally" form is open, and the units typed into it.
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [units, setUnits] = useState("1");

  async function submitExternal(e: React.FormEvent, row: StockRow) {
    e.preventDefault();
    const n = Number(units);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      alert("Introdu un număr întreg între 1 și 100.");
      return;
    }
    if (await onUpdate(row, { soldExternally: n })) setEditingKey(null);
  }

  return (
    <div className="card overflow-x-auto">
      <p className="border-b border-line px-4 py-3 text-base text-stone-600">
        Când vinzi în afara site-ului (OLX, personal), apasă „Vândut extern” și introdu numărul de bucăți — stocul disponibil
        scade. „Marchează epuizat” scoate complet mărimea de la vânzare.
      </p>
      <table className="w-full min-w-[900px] text-left text-base">
        <thead className="bg-cream text-ink">
          <tr>
            {["Produs", "Mărime", "Stoc inițial", "Vândut pe site", "Vândut extern", "Disponibil", "Acțiuni"].map((h) => (
              <th key={h} className="px-4 py-3 font-extrabold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-stone-500">
                {loading ? "Se încarcă..." : "Niciun produs."}
              </td>
            </tr>
          )}
          {rows.map((r) => {
            const key = rowKey(r);
            const saving = savingKey === key;
            return (
              <tr key={key} className={`align-top ${r.markedSoldOut ? "bg-stone-50" : ""}`}>
                <td className="px-4 py-3 font-bold">{r.productName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.size}
                  {r.cm && <span className="text-sm text-stone-500"> · {r.cm} cm</span>}
                </td>
                <td className="px-4 py-3">{r.initial}</td>
                <td className="px-4 py-3">{r.sold}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.soldExternally}
                  {r.soldExternally > 0 && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        if (confirm(`Resetezi la 0 vânzările externe pentru ${r.productName} (${r.size})?`)) {
                          onUpdate(r, { resetExternal: true });
                        }
                      }}
                      className="ml-2 min-h-11 text-sm text-stone-500 underline hover:text-brand disabled:opacity-50"
                    >
                      resetează
                    </button>
                  )}
                </td>
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
                  {editingKey === key ? (
                    <form onSubmit={(e) => submitExternal(e, r)} className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        Bucăți
                        <input
                          type="number"
                          min={1}
                          max={100}
                          autoFocus
                          value={units}
                          onChange={(e) => setUnits(e.target.value)}
                          className="min-h-11 w-20 rounded-xl border-2 border-line px-3 text-base outline-none focus:border-brand"
                        />
                      </label>
                      <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                        {saving ? "Se salvează..." : "Salvează"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingKey(null)}
                        className="min-h-11 px-2 text-sm text-stone-500 underline"
                      >
                        Renunță
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                          setUnits("1");
                          setEditingKey(key);
                        }}
                        className="btn-primary text-sm whitespace-nowrap disabled:opacity-50"
                      >
                        Vândut extern
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdate(r, { soldOut: !r.markedSoldOut })}
                        disabled={saving}
                        className="inline-flex min-h-11 items-center rounded-full border-2 border-brand px-4 text-sm font-bold whitespace-nowrap text-brand transition duration-300 hover:bg-brand-tint disabled:opacity-50"
                      >
                        {saving ? "Se salvează..." : r.markedSoldOut ? "Repune în stoc" : "Marchează epuizat"}
                      </button>
                    </div>
                  )}
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
