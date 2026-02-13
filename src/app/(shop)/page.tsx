import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/product-grid";
import { getSiteSettings } from "@/lib/data-store";
import { getAllProductsDetailed, getCategoriesNav, getFeaturedProducts } from "@/lib/shop/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, categories, featured, allProducts] = await Promise.all([
    getSiteSettings(),
    getCategoriesNav(),
    getFeaturedProducts({ limit: 8 }),
    getAllProductsDetailed()
  ]);

  const activeCount = allProducts.filter((product) => product.isActive).length;
  const heroProduct = featured[0] ?? null;
  const categoryStats = categories.map((category) => ({
    ...category,
    count: allProducts.filter((product) => product.isActive && product.categoryId === category.id).length
  }));

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="grid gap-4 lg:grid-cols-5 lg:gap-5">
        <article className="ms-card-dark relative overflow-hidden p-5 sm:p-7 lg:col-span-3 lg:p-10">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative">
            <p className="ms-kicker text-orange-300">{settings.heroBadge}</p>
            <h1 className="mt-3 max-w-2xl font-display text-3xl font-black uppercase leading-[0.95] text-white sm:text-4xl md:text-6xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white/80 md:text-base">
              {settings.heroSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={settings.heroPrimaryCtaHref} className="ms-btn-accent w-full sm:w-auto">
                {settings.heroPrimaryCtaLabel}
              </Link>
              <Link
                href={settings.heroSecondaryCtaHref}
                className="ms-btn-secondary w-full border-white/25 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                {settings.heroSecondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="ms-chip border-white/20 bg-white/10 text-white">{activeCount} produits</span>
              <span className="ms-chip border-white/20 bg-white/10 text-white">Paiement a la livraison</span>
              <span className="ms-chip border-white/20 bg-white/10 text-white">Orange Money et Wave</span>
            </div>
          </div>
        </article>

        <article className="ms-card overflow-hidden p-0 lg:col-span-2">
          {heroProduct?.mainImage ? (
            <div className="relative h-full min-h-64 sm:min-h-80">
              <Image
                src={heroProduct.mainImage}
                alt={heroProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent p-5 text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-orange-300">Produit recommande</p>
                <p className="mt-1 font-display text-2xl font-black leading-tight">{heroProduct.name}</p>
                <Link href={`/boutique/${heroProduct.slug}`} className="mt-3 inline-flex text-sm font-black uppercase tracking-[0.12em] text-white/90 hover:text-white">
                  Voir le produit
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-80 place-items-center p-6 text-center text-sm font-bold text-slate-600">
              Aucun produit mis en avant pour le moment.
            </div>
          )}
        </article>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="ms-kicker">Rayons</p>
            <h2 className="mt-1 font-display text-3xl font-black text-slate-950">Par categorie</h2>
          </div>
          <Link href="/boutique" className="ms-btn-secondary w-full sm:w-auto">
            Voir tout le catalogue
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryStats.map((category, index) => (
            <Link
              key={category.id}
              href={`/categorie/${category.slug}`}
              className="ms-card group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div
                className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${
                  index % 3 === 0
                    ? "bg-orange-200/80"
                    : index % 3 === 1
                      ? "bg-cyan-200/70"
                      : "bg-blue-200/75"
                }`}
              />
              <div className="relative">
                <span className="ms-chip">{category.count} produits</span>
                <h3 className="mt-4 font-display text-2xl font-black text-slate-950">{category.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-700">{category.description}</p>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-slate-600 group-hover:text-slate-950">
                  Explorer
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="ms-kicker">Produits</p>
            <h2 className="mt-1 font-display text-3xl font-black text-slate-950">Produits en avant</h2>
          </div>
          <Link href="/boutique" className="text-sm font-black uppercase tracking-[0.12em] text-slate-700 hover:text-slate-950">
            Tout voir
          </Link>
        </div>

        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
