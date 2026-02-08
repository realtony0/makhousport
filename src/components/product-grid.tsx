import type { ProductWithCategory } from "@/lib/shop/queries";

import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  if (products.length === 0) {
    return (
      <div className="ms-card p-8 text-center text-sm font-bold text-slate-700 sm:p-10">
        Aucun produit pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
