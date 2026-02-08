import Link from "next/link";

import { formatXof } from "@/lib/currency";
import { getDashboardStats, getOrders } from "@/lib/data-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmee",
    paid: "Payee",
    shipped: "Expediee",
    completed: "Terminee",
    canceled: "Annulee"
  };
  return labels[status] || status;
}

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getDashboardStats(), getOrders()]);
  const latestOrders = orders.slice(0, 6);
  const supabaseReady = isSupabaseConfigured();
  const environment = process.env.VERCEL ? "Vercel" : "Local";

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Tableau de bord</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Administration</h1>
        <p className="mt-2 text-sm font-semibold text-ink-700">
          Suivi des produits, commandes et ventes.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="ms-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-500">Produits actifs</p>
          <p className="mt-2 font-display text-4xl font-black text-ink-950">{stats.activeProducts}</p>
        </article>

        <article className="ms-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-500">Ruptures</p>
          <p className="mt-2 font-display text-4xl font-black text-ink-950">{stats.outOfStockProducts}</p>
        </article>

        <article className="ms-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-500">Commandes</p>
          <p className="mt-2 font-display text-4xl font-black text-ink-950">{stats.totalOrders}</p>
        </article>

        <article className="ms-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-500">A traiter</p>
          <p className="mt-2 font-display text-4xl font-black text-ink-950">{stats.pendingOrders}</p>
        </article>

        <article className="ms-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-500">Ventes</p>
          <p className="mt-2 font-display text-2xl font-black text-ink-950">{formatXof(stats.salesXof)}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="ms-card p-5 md:p-6">
          <p className="ms-kicker">Raccourcis</p>
          <h2 className="mt-1 font-display text-3xl font-black text-ink-950">Operations</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/categories" className="ms-btn-secondary">
              Gerer les categories
            </Link>
            <Link href="/admin/products" className="ms-btn-primary">
              Gerer les produits
            </Link>
            <Link href="/admin/orders" className="ms-btn-secondary">
              Gerer les commandes
            </Link>
            <Link href="/admin/settings" className="ms-btn-secondary">
              Ouvrir configuration
            </Link>
          </div>
        </article>

        <article className="ms-card p-5 md:p-6">
          <p className="ms-kicker">Etat systeme</p>
          <h2 className="mt-1 font-display text-3xl font-black text-ink-950">Configuration</h2>
          <div className="mt-4 space-y-2">
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-ink-800">
              Backend: {supabaseReady ? "Supabase actif" : "Supabase non configure"}
            </p>
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-ink-800">
              Environnement: {environment}
            </p>
            {!supabaseReady ? (
              <p className="rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">
                Supabase non configure. Ajoute les variables sur Vercel pour activer la base.
              </p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="ms-card p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="ms-kicker">Commandes recentes</p>
            <h2 className="mt-1 font-display text-3xl font-black text-ink-950">Dernieres commandes</h2>
          </div>
          <Link href="/admin/orders" className="ms-btn-primary">
            Gerer toutes les commandes
          </Link>
        </div>

        {latestOrders.length > 0 ? (
          <div className="mt-4 space-y-3">
            {latestOrders.map((order) => (
              <article
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white/90 p-4"
              >
                <div>
                  <p className="font-black text-ink-950">{order.id}</p>
                  <p className="text-sm font-semibold text-ink-700">
                    {order.customerName} | {order.customerPhone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-full bg-ink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-ink-700">
                    {statusLabel(order.status)}
                  </span>
                  <p className="mt-1 text-sm font-black text-ink-950">{formatXof(order.totalXof)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-ink-300/80 p-6 text-center text-sm font-bold text-ink-600">
            Aucune commande pour le moment.
          </p>
        )}
      </section>
    </div>
  );
}
