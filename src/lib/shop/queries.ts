import "server-only";

import { attachCategory } from "@/lib/catalog";
import { getCategories, getProducts } from "@/lib/data-store";
import type { Category, Product } from "@/lib/types";

export type ProductWithCategory = Product & { category: Category | null; mainImage: string | null };

export async function getAllProductsDetailed(): Promise<ProductWithCategory[]> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const withCategory = attachCategory(products, categories);

  return withCategory.map((p) => ({
    ...p,
    category: p.category ?? null,
    mainImage: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
  }));
}

export async function getFeaturedProducts({ limit }: { limit: number }): Promise<ProductWithCategory[]> {
  const all = await getAllProductsDetailed();
  return all.filter((p) => p.isActive && p.featured).slice(0, limit);
}

export async function getCategoriesNav(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function findProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const all = await getAllProductsDetailed();
  return all.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function findProductById(productId: string): Promise<ProductWithCategory | null> {
  const all = await getAllProductsDetailed();
  return all.find((p) => p.id === productId) ?? null;
}
