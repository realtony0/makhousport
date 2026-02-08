import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/product-grid";
import { findCategoryBySlug, getAllProductsDetailed } from "@/lib/shop/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };
type SearchParams = { q?: string; tri?: string };

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const tri = sp.tri ?? "recent";

  const category = await findCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  let products = (await getAllProductsDetailed()).filter(
    (product) => product.isActive && product.categoryId === category.id
  );

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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="ms-kicker">Categorie</p>
            <h1 className="mt-2 font-display text-4xl font-black text-slate-950">{category.name}</h1>
            {category.description ? (
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
                {category.description}
              </p>
            ) : null}
          </div>
          <Link href="/boutique" className="ms-btn-secondary">
            Toute la boutique
          </Link>
        </div>
      </section>

      <section className="ms-card p-5">
        <form method="get" className="grid gap-3 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Rechercher dans cette categorie" className="ms-input md:col-span-2" />

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
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
