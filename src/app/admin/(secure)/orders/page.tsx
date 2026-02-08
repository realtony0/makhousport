import { deleteOrderAction, updateOrderStatusAction } from "@/app/admin/actions";
import { formatXof } from "@/lib/currency";
import { getOrders } from "@/lib/data-store";
import type { OrderStatus } from "@/lib/types";

type Props = {
  searchParams: Promise<{ ok?: string; error?: string }>;
};

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmee" },
  { value: "paid", label: "Payee" },
  { value: "shipped", label: "Expediee" },
  { value: "completed", label: "Terminee" },
  { value: "canceled", label: "Annulee" }
];

function paymentLabel(value: string): string {
  if (value === "orange-money") {
    return "Orange Money";
  }
  if (value === "wave") {
    return "Wave";
  }
  return "Paiement a la livraison";
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const [params, orders] = await Promise.all([searchParams, getOrders()]);
  const hasError = Boolean(params.error);
  const message = params.error
    ? `Erreur: ${params.error}`
    : params.ok === "status"
      ? "Statut commande mis a jour."
      : params.ok === "delete"
        ? "Commande supprimee."
      : null;

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Suivi des ventes</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Gestion commandes</h1>
        <p className="mt-2 text-sm font-semibold text-ink-700">
          Mets a jour les statuts et controle chaque ligne de commande.
        </p>
      </section>

      {message ? (
        <section
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            hasError
              ? "border-rose-300 bg-rose-100 text-rose-900"
              : "border-lime-300 bg-lime-100 text-ink-900"
          }`}
        >
          {message}
        </section>
      ) : null}

      {orders.length === 0 ? (
        <section className="ms-card p-8 text-center text-sm font-bold text-ink-700">Aucune commande enregistree.</section>
      ) : (
        <section className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="ms-card p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-ink-950">{order.id}</h2>
                  <p className="mt-1 text-sm font-semibold text-ink-700">
                    {order.customerName} | {order.customerPhone} | {order.city}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-600">
                    {paymentLabel(order.paymentMethod)} | {formatXof(order.totalXof)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <form action={updateOrderStatusAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select name="status" defaultValue={order.status} className="ms-select min-w-44">
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="ms-btn-primary">
                      Mettre a jour
                    </button>
                  </form>

                  <form action={deleteOrderAction}>
                    <input type="hidden" name="id" value={order.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-black text-rose-900 transition hover:bg-rose-100"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <article
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white/90 p-4"
                  >
                    <div>
                      <p className="font-black text-ink-950">{item.productName}</p>
                      <p className="text-sm font-semibold text-ink-600">
                        {item.quantity} x {formatXof(item.unitPriceXof)}
                      </p>
                    </div>
                    <p className="text-sm font-black text-ink-900">{formatXof(item.lineTotalXof)}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
