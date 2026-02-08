import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  Category,
  CheckoutInput,
  DashboardStats,
  Order,
  OrderItem,
  OrderStatus,
  Product
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile(filePath: string, fallback: unknown): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(filePath: string, payload: T): Promise<void> {
  const tmpFile = `${filePath}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(payload, null, 2), "utf-8");
  await fs.rename(tmpFile, filePath);
}

export async function getCategories(): Promise<Category[]> {
  const categories = await readJson<Category[]>(CATEGORIES_FILE, []);
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((category) => category.id === categoryId) ?? null;
}

export async function saveCategory(category: Category): Promise<Category> {
  const categories = await getCategories();
  const index = categories.findIndex((entry) => entry.id === category.id);
  if (index === -1) {
    categories.push(category);
  } else {
    categories[index] = category;
  }
  await writeJson(CATEGORIES_FILE, categories);
  return category;
}

export async function removeCategory(categoryId: string): Promise<void> {
  const products = await getProducts();
  const linkedProducts = products.filter((product) => product.categoryId === categoryId).length;
  if (linkedProducts > 0) {
    throw new Error("Categorie utilisee par des produits");
  }

  const categories = await getCategories();
  const filtered = categories.filter((entry) => entry.id !== categoryId);
  await writeJson(CATEGORIES_FILE, filtered);
}

export async function getProducts(): Promise<Product[]> {
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  return products.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.isActive);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(productId: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.id === productId) ?? null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  const index = products.findIndex((entry) => entry.id === product.id);
  if (index === -1) {
    products.push(product);
  } else {
    products[index] = product;
  }
  await writeJson(PRODUCTS_FILE, products);
  return product;
}

export async function removeProduct(productId: string): Promise<void> {
  const products = await getProducts();
  const filtered = products.filter((entry) => entry.id !== productId);
  await writeJson(PRODUCTS_FILE, filtered);
}

export async function getOrders(): Promise<Order[]> {
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  return orders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function removeOrder(orderId: string): Promise<void> {
  const orders = await getOrders();
  const filtered = orders.filter((order) => order.id !== orderId);
  await writeJson(ORDERS_FILE, filtered);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const orders = await getOrders();
  const target = orders.find((order) => order.id === orderId);
  if (!target) {
    throw new Error("Order not found");
  }
  target.status = status;
  await writeJson(ORDERS_FILE, orders);
}

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const products = await getProducts();
  const orders = await getOrders();
  const lines = input.lines.filter((line) => line.quantity > 0);

  if (lines.length === 0) {
    throw new Error("Panier vide");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const items: OrderItem[] = [];

  for (const line of lines) {
    const product = productMap.get(line.productId);
    if (!product || !product.isActive) {
      throw new Error("Produit introuvable");
    }
    if (product.stock < line.quantity) {
      throw new Error(`Stock insuffisant pour ${product.name}`);
    }

    const lineTotalXof = line.quantity * product.priceXof;
    items.push({
      productId: product.id,
      productName: product.name,
      quantity: line.quantity,
      unitPriceXof: product.priceXof,
      lineTotalXof
    });
  }

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      continue;
    }
    product.stock -= item.quantity;
  }

  const totalXof = items.reduce((sum, item) => sum + item.lineTotalXof, 0);
  const order: Order = {
    id: `ORD-${Math.floor(Date.now() / 1000)}-${randomUUID().slice(0, 6)}`,
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    customerEmail: input.customerEmail?.trim() || undefined,
    address: input.address.trim(),
    city: input.city.trim() || "Dakar",
    notes: input.notes?.trim() || undefined,
    paymentMethod: input.paymentMethod,
    status: "pending",
    totalXof,
    items,
    createdAt: new Date().toISOString()
  };

  await writeJson(PRODUCTS_FILE, [...productMap.values()]);
  await writeJson(ORDERS_FILE, [order, ...orders]);
  return order;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  const activeProducts = products.filter((product) => product.isActive).length;
  const outOfStockProducts = products.filter((product) => product.stock <= 0).length;
  const pendingOrders = orders.filter((order) =>
    ["pending", "confirmed"].includes(order.status)
  ).length;
  const salesXof = orders
    .filter((order) => order.status !== "canceled")
    .reduce((sum, order) => sum + order.totalXof, 0);

  return {
    activeProducts,
    outOfStockProducts,
    totalOrders: orders.length,
    pendingOrders,
    salesXof
  };
}
