import Link from "next/link";
import { notFound } from "next/navigation";

import { formatXof } from "@/lib/currency";
import { getOrderById } from "@/lib/data-store";
import { buildOrderChatUrl } from "@/lib/order-chat";

type Props = {
  params: Promise<{ id: string }>;
};

function paymentLabel(value: string): string {
  if (value === "orange-money") {
    return "Orange Money";
  }
  if (value === "wave") {
    return "Wave";
  }
  return "Paiement a la livraison";
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }
  const chatUrl = buildOrderChatUrl(order);

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Commande enregistree</p>
        <h1 className="mt-2 font-display text-4xl font-black text-slate-950">Merci {order.customerName}</h1>
        <p className="mt-3 text-sm font-semibold text-slate-700">
          Reference: <span className="font-black text-slate-950">{order.id}</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          Paiement: {paymentLabel(order.paymentMethod)} | Total: {formatXof(order.totalXof)}
        </p>
        {chatUrl ? (
          <p className="mt-2 text-sm font-semibold text-slate-700">
            Etape suivante: envoyer cette commande sur WhatsApp.
          </p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-rose-700">
            Numero WhatsApp non configure. Contactez l administrateur.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {chatUrl ? (
            <Link href={chatUrl} className="ms-btn-accent" target="_blank" rel="noreferrer">
              Envoyer sur WhatsApp
            </Link>
          ) : null}
          <Link href="/boutique" className="ms-btn-secondary">
            Retour boutique
          </Link>
          <Link href="/" className="ms-btn-secondary">
            Accueil
          </Link>
        </div>
      </section>

      <section className="ms-card p-5 md:p-6">
        <h2 className="font-display text-3xl font-black text-slate-950">Details de la commande</h2>

        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <article
              key={`${order.id}-${item.productId}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4"
            >
              <div>
                <p className="font-black text-slate-950">{item.productName}</p>
                <p className="text-sm font-semibold text-slate-600">
                  {item.quantity} x {formatXof(item.unitPriceXof)}
                </p>
              </div>
              <p className="text-sm font-black text-slate-900">{formatXof(item.lineTotalXof)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
