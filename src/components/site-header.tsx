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
      <div className="ms-container py-3 md:py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex min-w-0 items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-2xl border border-slate-200 shadow-soft">
              <Image src="/logo.jpeg" alt="Logo Makhou Sport" fill className="object-cover" sizes="40px" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-black uppercase tracking-[0.03em] text-slate-950 sm:text-lg">
                Makhou Sport
              </span>
              <span className="block truncate text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 sm:text-[11px]">
                Dakar, Senegal
              </span>
            </span>
          </Link>

          <Link href="/panier" className="ms-btn-primary ml-auto px-3 sm:px-4">
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

          <nav className="grid grid-cols-2 gap-2 md:flex md:items-center">
            <Link href="/" className="ms-btn-secondary">
              Accueil
            </Link>
            <Link href="/boutique" className="ms-btn-secondary">
              Boutique
            </Link>
          </nav>
        </div>

        {categories.length > 0 ? (
          <div className="mt-3 -mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
            <div className="flex min-w-max snap-x items-center gap-2 pb-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorie/${category.slug}`}
                  className="snap-start whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-slate-900"
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
