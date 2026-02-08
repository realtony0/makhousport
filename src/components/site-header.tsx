import Image from "next/image";
import Link from "next/link";

import { countCartItems, getCartFromCookies } from "@/lib/cart";
import { getCategoriesNav } from "@/lib/shop/queries";

export const dynamic = "force-dynamic";

export async function SiteHeader() {
  const categories = await getCategoriesNav();
  const cartCount = countCartItems(await getCartFromCookies());

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="ms-container py-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-2xl border border-slate-200 shadow-soft">
              <Image src="/logo.jpeg" alt="Logo Makhou Sport" fill className="object-cover" sizes="40px" />
            </span>
            <span>
              <span className="block font-display text-lg font-black uppercase tracking-[0.03em] text-slate-950">
                Makhou Sport
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Dakar, Senegal</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-2 md:flex">
            <Link href="/" className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
              Accueil
            </Link>
            <Link
              href="/boutique"
              className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Boutique
            </Link>
          </nav>

          <Link href="/panier" className="ms-btn-primary px-4">
            Panier
            {cartCount > 0 ? (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <form action="/boutique" method="get">
            <label className="sr-only" htmlFor="q">
              Rechercher
            </label>
            <input id="q" name="q" placeholder="Rechercher un produit..." className="ms-input" />
          </form>

          <nav className="flex items-center gap-2 md:hidden">
            <Link href="/" className="ms-btn-secondary px-4">
              Accueil
            </Link>
            <Link href="/boutique" className="ms-btn-secondary px-4">
              Boutique
            </Link>
          </nav>
        </div>

        {categories.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 pb-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorie/${category.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-slate-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
