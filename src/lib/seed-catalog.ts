import categoriesRaw from "../../data/categories.json";
import productsRaw from "../../data/products.json";

import type { Category, Product } from "@/lib/types";

type SeedCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

type SeedProduct = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string | null;
  priceXof: number;
  compareAtPriceXof?: number | null;
  stock: number;
  isActive: boolean;
  featured: boolean;
  images: string[];
};

const categories = (categoriesRaw as SeedCategory[]).map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description || ""
})) satisfies Category[];

const products = (productsRaw as SeedProduct[]).map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  categoryId: product.categoryId,
  description: product.description || "",
  priceXof: Math.max(0, Number(product.priceXof) || 0),
  compareAtPriceXof: product.compareAtPriceXof ? Math.max(0, Number(product.compareAtPriceXof)) : undefined,
  stock: Math.max(0, Number(product.stock) || 0),
  isActive: Boolean(product.isActive),
  featured: Boolean(product.featured),
  images: Array.isArray(product.images) ? product.images.filter(Boolean) : []
})) satisfies Product[];

export function getSeedCategories(): Category[] {
  return categories;
}

export function getSeedProducts(): Product[] {
  return products;
}
