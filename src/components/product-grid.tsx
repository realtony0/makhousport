import type { ProductWithCategory } from "@/lib/shop/queries";

import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  if (products.length === 0) {
    return (
      <div className="ms-card p-10 text-center text-sm font-bold text-slate-700">
        Aucun produit pour le moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
