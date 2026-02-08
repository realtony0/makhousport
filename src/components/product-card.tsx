import Image from "next/image";
import Link from "next/link";

import { formatXof } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/shop/queries";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <Link
      href={`/boutique/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:rounded-3xl"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 via-white to-orange-100/70">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">Image indisponible</div>
        )}

        <div className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-700 sm:left-3 sm:top-3 sm:px-3 sm:text-[11px]">
          {product.category?.name ?? "Article"}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-2 font-display text-sm font-black text-slate-950 sm:text-lg">{product.name}</h3>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-black text-slate-950 sm:text-lg">{formatXof(product.priceXof)}</p>
            {product.compareAtPriceXof ? (
              <p className="text-xs font-bold text-slate-500 line-through">{formatXof(product.compareAtPriceXof)}</p>
            ) : null}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-600 sm:text-xs sm:tracking-[0.1em]">
            {product.stock > 0 ? `${product.stock} stock` : "rupture"}
          </p>
        </div>
      </div>
    </Link>
  );
}
