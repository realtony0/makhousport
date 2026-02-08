import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatXof } from "@/lib/format";
import { findProductBySlug } from "@/lib/shop/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const disabled = product.stock <= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-black uppercase tracking-[0.12em] text-slate-500 [scrollbar-width:none]">
        <Link href="/" className="hover:text-slate-900">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/boutique" className="hover:text-slate-900">
          Boutique
        </Link>
        {product.category ? (
          <>
            <span>/</span>
            <Link href={`/categorie/${product.category.slug}`} className="hover:text-slate-900">
              {product.category.name}
            </Link>
          </>
        ) : null}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="ms-card relative aspect-square overflow-hidden p-0">
            {product.mainImage ? (
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-bold text-slate-500">Image indisponible</div>
            )}
          </div>

          {product.images.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
              {product.images.map((src) => (
                <div key={src} className="ms-card relative aspect-square overflow-hidden p-0">
                  <Image src={src} alt={product.name} fill className="object-cover" sizes="15vw" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <section className="ms-card p-5 sm:p-6 md:p-8">
            <p className="ms-kicker">{product.category?.name ?? "Article"}</p>
            <h1 className="mt-2 font-display text-3xl font-black text-slate-950 sm:text-4xl">{product.name}</h1>

            <div className="mt-5 flex items-end gap-3">
              <p className="text-3xl font-black text-slate-950">{formatXof(product.priceXof)}</p>
              {product.compareAtPriceXof ? (
                <p className="text-sm font-bold text-slate-500 line-through">{formatXof(product.compareAtPriceXof)}</p>
              ) : null}
            </div>

            <div className="mt-2 text-sm font-bold">
              {product.stock > 0 ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">En stock ({product.stock})</span>
              ) : (
                <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-900">Rupture de stock</span>
              )}
            </div>

            <p className="mt-5 max-w-prose text-sm font-semibold leading-relaxed text-slate-700">
              {product.description ?? "Description bientot disponible."}
            </p>

            <ul className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
              <li>Livraison rapide sur Dakar</li>
              <li>Paiement a la livraison, Orange Money ou Wave</li>
              <li>Support client reactif</li>
            </ul>
          </section>

          <section className="ms-card p-5 sm:p-6">
            <form action="/api/cart/add" method="post" className="grid gap-3 sm:flex sm:flex-wrap sm:items-end">
              <input type="hidden" name="productId" value={product.id} />
              <div className="w-full sm:w-auto">
                <label className="ms-label" htmlFor="quantity">
                  Quantite
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  defaultValue={1}
                  disabled={disabled}
                  className="ms-input w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-28"
                />
              </div>

              <button
                type="submit"
                disabled={disabled}
                className="ms-btn-accent w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Ajouter au panier
              </button>

              <Link href="/panier" className="ms-btn-secondary w-full sm:w-auto">
                Voir panier
              </Link>
            </form>
          </section>
        </div>
      </section>
    </div>
  );
}
