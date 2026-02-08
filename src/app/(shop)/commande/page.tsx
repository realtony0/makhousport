import Link from "next/link";

import { getCartLines } from "@/lib/cart";
import { formatXof } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = { error?: string };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { lines, totalXof } = await getCartLines();

  if (lines.length === 0) {
    return (
      <section className="ms-card p-10 text-center">
        <p className="text-base font-bold text-slate-800">
          Votre panier est vide. {" "}
          <Link href="/boutique" className="underline underline-offset-2">
            Aller a la boutique
          </Link>
          .
        </p>
      </section>
    );
  }

  const error =
    sp.error === "invalid"
      ? "Informations invalides. Verifiez le formulaire."
      : sp.error
        ? sp.error
        : null;

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ms-kicker">Validation commande</p>
            <h1 className="mt-2 font-display text-4xl font-black text-slate-950 md:text-5xl">Passer commande</h1>
            <p className="mt-2 text-sm font-semibold text-slate-700">Renseignez vos informations puis validez.</p>
          </div>
          <Link href="/panier" className="ms-btn-secondary">
            Retour panier
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-100 px-4 py-3 text-sm font-bold text-rose-900">{error}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <form action="/api/checkout" method="post" className="ms-card p-5 md:p-6 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="ms-label" htmlFor="customerName">
                Nom complet
              </label>
              <input id="customerName" name="customerName" required className="ms-input" />
            </div>

            <div>
              <label className="ms-label" htmlFor="customerPhone">
                Telephone
              </label>
              <input id="customerPhone" name="customerPhone" required className="ms-input" />
            </div>

            <div className="md:col-span-2">
              <label className="ms-label" htmlFor="customerEmail">
                Email (optionnel)
              </label>
              <input id="customerEmail" name="customerEmail" type="email" className="ms-input" />
            </div>

            <div className="md:col-span-2">
              <label className="ms-label" htmlFor="address">
                Adresse
              </label>
              <input id="address" name="address" required className="ms-input" />
            </div>

            <div>
              <label className="ms-label" htmlFor="city">
                Ville
              </label>
              <input id="city" name="city" defaultValue="Dakar" required className="ms-input" />
            </div>

            <div>
              <label className="ms-label" htmlFor="paymentMethod">
                Mode de paiement
              </label>
              <select id="paymentMethod" name="paymentMethod" defaultValue="cash" className="ms-select">
                <option value="cash">Paiement a la livraison</option>
                <option value="orange-money">Orange Money</option>
                <option value="wave">Wave</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="ms-label" htmlFor="notes">
                Notes (optionnel)
              </label>
              <textarea id="notes" name="notes" rows={4} className="ms-textarea" />
            </div>
          </div>

          <button type="submit" className="ms-btn-accent mt-6 w-full">
            Confirmer la commande
          </button>
        </form>

        <aside className="ms-card-subtle p-5 md:p-6">
          <p className="ms-kicker">Resume</p>
          <p className="mt-2 font-display text-4xl font-black text-slate-950">{formatXof(totalXof)}</p>

          <div className="mt-5 space-y-3">
            {lines.map((line) => (
              <div key={line.product.id} className="flex items-start justify-between gap-3 border-b border-slate-200/80 pb-3 text-sm">
                <div>
                  <p className="font-black text-slate-950">{line.product.name}</p>
                  <p className="text-xs font-semibold text-slate-600">x {line.quantity}</p>
                </div>
                <p className="font-black text-slate-900">{formatXof(line.lineTotalXof)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-white p-3 text-xs font-bold text-slate-700">
            Apres validation, un message WhatsApp s ouvre avec le recapitulatif de commande.
          </div>
        </aside>
      </div>
    </div>
  );
}
