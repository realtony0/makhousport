import type { Category, Product } from "@/lib/types";

export type ProductWithCategory = Product & {
  category?: Category;
};

export function attachCategory(
  products: Product[],
  categories: Category[]
): ProductWithCategory[] {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  return products.map((product) => ({
    ...product,
    category: categoryMap.get(product.categoryId)
  }));
}

