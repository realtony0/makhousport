import Image from "next/image";
import Link from "next/link";

import { getCartLines } from "@/lib/cart";
import { formatXof } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const { lines, totalXof } = await getCartLines();

  return (
    <div className="space-y-6">
      <section className="ms-card p-5 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ms-kicker">Finalisation</p>
            <h1 className="mt-2 font-display text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">Panier</h1>
            <p className="mt-2 text-sm font-semibold text-slate-700">Verifiez vos articles avant de commander.</p>
          </div>
          <Link href="/boutique" className="ms-btn-secondary w-full sm:w-auto">
            Continuer mes achats
          </Link>
        </div>
      </section>

      {lines.length === 0 ? (
        <section className="ms-card p-10 text-center">
          <p className="text-base font-bold text-slate-800">Votre panier est vide.</p>
          <Link href="/boutique" className="ms-btn-primary mt-5">
            Aller a la boutique
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <aside className="ms-card-subtle order-1 p-5 sm:p-6 lg:order-2 lg:sticky lg:top-24 lg:h-fit">
            <p className="ms-kicker">Total panier</p>
            <p className="mt-2 font-display text-4xl font-black text-slate-950">{formatXof(totalXof)}</p>
            <p className="mt-3 text-sm font-semibold text-slate-700">Frais de livraison confirmes apres validation.</p>
            <Link href="/commande" className="ms-btn-accent mt-6 w-full">
              Passer commande
            </Link>
          </aside>

          <form action="/api/cart/update" method="post" className="order-2 lg:order-1">
            <section className="ms-card overflow-hidden p-0">
              <div className="divide-y divide-slate-200/80">
                {lines.map((line) => (
                  <article key={line.product.id} className="flex flex-wrap gap-3 p-3 sm:gap-4 sm:p-4 md:flex-nowrap md:p-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                      {line.product.mainImage ? (
                        <Image src={line.product.mainImage} alt={line.product.name} fill className="object-cover" sizes="96px" />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Link href={`/boutique/${line.product.slug}`} className="font-display text-lg font-black text-slate-950 sm:text-xl">
                            {line.product.name}
                          </Link>
                          <p className="mt-1 text-sm font-semibold text-slate-600">{formatXof(line.product.priceXof)} / unite</p>
                        </div>
                        <p className="text-lg font-black text-slate-950">{formatXof(line.lineTotalXof)}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <div className="w-full sm:w-auto">
                          <label className="ms-label" htmlFor={`qty_${line.product.id}`}>
                            Quantite
                          </label>
                          <input
                            id={`qty_${line.product.id}`}
                            name={`qty_${line.product.id}`}
                            type="number"
                            min={0}
                            defaultValue={line.quantity}
                            className="ms-input w-full sm:w-28"
                          />
                          <p className="mt-1 text-xs font-bold text-slate-500">0 pour supprimer</p>
                        </div>

                        <button
                          type="submit"
                          name="removeId"
                          value={line.product.id}
                          className="ms-btn-secondary w-full border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100 sm:w-auto"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 p-4 md:p-5">
                <p className="text-sm font-bold text-slate-700">Modifiez les quantites puis confirmez la mise a jour.</p>
                <button type="submit" className="ms-btn-primary w-full sm:w-auto">
                  Mettre a jour
                </button>
              </div>
            </section>
          </form>
        </div>
      )}
    </div>
  );
}
