import Link from "next/link";

import { ProductGrid } from "@/components/product-grid";
import { getAllProductsDetailed } from "@/lib/shop/queries";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; tri?: string };

export default async function BoutiquePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const tri = sp.tri ?? "recent";

  let products = (await getAllProductsDetailed()).filter((product) => product.isActive);

  if (q) {
    const needle = q.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        (product.description ?? "").toLowerCase().includes(needle)
    );
  }

  if (tri === "prix_asc") {
    products.sort((a, b) => a.priceXof - b.priceXof);
  } else if (tri === "prix_desc") {
    products.sort((a, b) => b.priceXof - a.priceXof);
  } else if (tri === "nom") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ms-kicker">Catalogue complet</p>
            <h1 className="mt-2 font-display text-4xl font-black text-slate-950 md:text-5xl">Boutique</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-700 md:text-base">
              Tous nos produits de sport: performance, maintien et confort pour vos entrainements.
            </p>
          </div>
          <Link href="/" className="ms-btn-secondary">
            Retour accueil
          </Link>
        </div>
      </section>

      <section className="ms-card p-5">
        <form method="get" className="grid gap-3 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Rechercher un produit" className="ms-input md:col-span-2" />

          <select name="tri" defaultValue={tri} className="ms-select">
            <option value="recent">Par defaut</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix decroissant</option>
            <option value="nom">Nom A-Z</option>
          </select>

          <button type="submit" className="ms-btn-primary">
            Filtrer
          </button>
        </form>

        {q ? (
          <div className="mt-4 rounded-2xl border border-orange-300/70 bg-orange-100/70 px-4 py-3 text-sm font-bold text-slate-800">
            Resultats pour: <span className="text-slate-950">{q}</span>.{" "}
            <Link href="/boutique" className="underline underline-offset-2 hover:text-slate-950">
              Reinitialiser
            </Link>
          </div>
        ) : null}
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
