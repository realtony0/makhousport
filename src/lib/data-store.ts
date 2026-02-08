import "server-only";

import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Category,
  CheckoutInput,
  DashboardStats,
  Order,
  OrderStatus,
  Product
} from "@/lib/types";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  price_xof: number;
  compare_at_price_xof: number | null;
  stock: number;
  is_active: boolean;
  featured: boolean;
  images: string[] | null;
};

type OrderItemRow = {
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_xof: number;
  line_total_xof: number;
};

type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  city: string;
  notes: string | null;
  payment_method: Order["paymentMethod"];
  status: OrderStatus;
  total_xof: number;
  created_at: string;
  order_items?: OrderItemRow[] | null;
};

function getSupabaseClient(): SupabaseClient {
  return createSupabaseServerClient();
}

function throwIfSupabaseError(
  error: { message?: string; details?: string } | null,
  context: string
) {
  if (!error) {
    return;
  }
  const details = error.details ? ` (${error.details})` : "";
  throw new Error(`${context}: ${error.message || "Erreur Supabase"}${details}`);
}

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || ""
  };
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryId: row.category_id,
    description: row.description || "",
    priceXof: Number(row.price_xof) || 0,
    compareAtPriceXof: row.compare_at_price_xof ?? undefined,
    stock: Number(row.stock) || 0,
    isActive: Boolean(row.is_active),
    featured: Boolean(row.featured),
    images: Array.isArray(row.images) ? row.images : []
  };
}

function toCategoryRow(category: Category): CategoryRow {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description
  };
}

function toProductRow(product: Product): ProductRow {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category_id: product.categoryId,
    description: product.description,
    price_xof: product.priceXof,
    compare_at_price_xof: product.compareAtPriceXof ?? null,
    stock: product.stock,
    is_active: product.isActive,
    featured: product.featured,
    images: product.images
  };
}

function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || undefined,
    address: row.address,
    city: row.city,
    notes: row.notes || undefined,
    paymentMethod: row.payment_method,
    status: row.status,
    totalXof: Number(row.total_xof) || 0,
    items: (row.order_items || []).map((item) => ({
      productId: item.product_id,
      productName: item.product_name,
      quantity: Number(item.quantity) || 0,
      unitPriceXof: Number(item.unit_price_xof) || 0,
      lineTotalXof: Number(item.line_total_xof) || 0
    })),
    createdAt: row.created_at
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description")
    .order("name", { ascending: true });

  throwIfSupabaseError(error, "Impossible de charger les categories");
  return (data as CategoryRow[] | null)?.map(mapCategoryRow) ?? [];
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description")
    .eq("id", categoryId)
    .maybeSingle();

  throwIfSupabaseError(error, "Categorie introuvable");
  return data ? mapCategoryRow(data as CategoryRow) : null;
}

export async function saveCategory(category: Category): Promise<Category> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .upsert(toCategoryRow(category), { onConflict: "id" })
    .select("id,name,slug,description")
    .single();

  throwIfSupabaseError(error, "Impossible d'enregistrer la categorie");
  return data ? mapCategoryRow(data as CategoryRow) : category;
}

export async function removeCategory(categoryId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  throwIfSupabaseError(countError, "Impossible de verifier les produits de la categorie");
  if ((count || 0) > 0) {
    throw new Error("Categorie utilisee par des produits");
  }

  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  throwIfSupabaseError(error, "Impossible de supprimer la categorie");
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,category_id,description,price_xof,compare_at_price_xof,stock,is_active,featured,images"
    )
    .order("name", { ascending: true });

  throwIfSupabaseError(error, "Impossible de charger les produits");
  return (data as ProductRow[] | null)?.map(mapProductRow) ?? [];
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,category_id,description,price_xof,compare_at_price_xof,stock,is_active,featured,images"
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  throwIfSupabaseError(error, "Impossible de charger les produits actifs");
  return (data as ProductRow[] | null)?.map(mapProductRow) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,category_id,description,price_xof,compare_at_price_xof,stock,is_active,featured,images"
    )
    .eq("slug", slug)
    .maybeSingle();

  throwIfSupabaseError(error, "Produit introuvable");
  return data ? mapProductRow(data as ProductRow) : null;
}

export async function getProductById(productId: string): Promise<Product | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,category_id,description,price_xof,compare_at_price_xof,stock,is_active,featured,images"
    )
    .eq("id", productId)
    .maybeSingle();

  throwIfSupabaseError(error, "Produit introuvable");
  return data ? mapProductRow(data as ProductRow) : null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .upsert(toProductRow(product), { onConflict: "id" })
    .select(
      "id,name,slug,category_id,description,price_xof,compare_at_price_xof,stock,is_active,featured,images"
    )
    .single();

  throwIfSupabaseError(error, "Impossible d'enregistrer le produit");
  return data ? mapProductRow(data as ProductRow) : product;
}

export async function removeProduct(productId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);
  throwIfSupabaseError(error, "Impossible de supprimer le produit");
}

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,customer_name,customer_phone,customer_email,address,city,notes,payment_method,status,total_xof,created_at,order_items(order_id,product_id,product_name,quantity,unit_price_xof,line_total_xof)"
    )
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error, "Impossible de charger les commandes");
  return (data as OrderRow[] | null)?.map(mapOrderRow) ?? [];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,customer_name,customer_phone,customer_email,address,city,notes,payment_method,status,total_xof,created_at,order_items(order_id,product_id,product_name,quantity,unit_price_xof,line_total_xof)"
    )
    .eq("id", orderId)
    .maybeSingle();

  throwIfSupabaseError(error, "Commande introuvable");
  return data ? mapOrderRow(data as OrderRow) : null;
}

export async function removeOrder(orderId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  throwIfSupabaseError(error, "Impossible de supprimer la commande");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  throwIfSupabaseError(error, "Impossible de mettre a jour la commande");
}

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const supabase = getSupabaseClient();

  const requestedLines = input.lines.filter((line) => line.quantity > 0);
  if (requestedLines.length === 0) {
    throw new Error("Panier vide");
  }

  const quantityByProduct = new Map<string, number>();
  for (const line of requestedLines) {
    quantityByProduct.set(line.productId, (quantityByProduct.get(line.productId) || 0) + line.quantity);
  }

  const productIds = Array.from(quantityByProduct.keys());
  const { data: productRows, error: productError } = await supabase
    .from("products")
    .select(
      "id,name,slug,category_id,description,price_xof,compare_at_price_xof,stock,is_active,featured,images"
    )
    .in("id", productIds);

  throwIfSupabaseError(productError, "Impossible de verifier le stock");
  const productMap = new Map(
    ((productRows as ProductRow[] | null) || []).map((row) => {
      const product = mapProductRow(row);
      return [product.id, product] as const;
    })
  );

  const items: Order["items"] = [];
  for (const [productId, quantity] of quantityByProduct.entries()) {
    const product = productMap.get(productId);
    if (!product || !product.isActive) {
      throw new Error("Produit introuvable");
    }
    if (product.stock < quantity) {
      throw new Error(`Stock insuffisant pour ${product.name}`);
    }

    items.push({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPriceXof: product.priceXof,
      lineTotalXof: quantity * product.priceXof
    });
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

  let orderInserted = false;
  try {
    const { error: orderError } = await supabase.from("orders").insert({
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail || null,
      address: order.address,
      city: order.city,
      notes: order.notes || null,
      payment_method: order.paymentMethod,
      status: order.status,
      total_xof: order.totalXof,
      created_at: order.createdAt
    });
    throwIfSupabaseError(orderError, "Impossible de creer la commande");
    orderInserted = true;

    if (items.length > 0) {
      const { error: orderItemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price_xof: item.unitPriceXof,
          line_total_xof: item.lineTotalXof
        }))
      );
      throwIfSupabaseError(orderItemsError, "Impossible d'enregistrer les lignes de commande");
    }

    for (const item of items) {
      const { data: updatedRows, error: stockError } = await supabase
        .from("products")
        .update({ stock: (productMap.get(item.productId)?.stock || 0) - item.quantity })
        .eq("id", item.productId)
        .gte("stock", item.quantity)
        .select("id");

      throwIfSupabaseError(stockError, "Impossible de mettre a jour le stock");
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error(`Stock insuffisant pour ${item.productName}`);
      }
    }
  } catch (error) {
    if (orderInserted) {
      await supabase.from("order_items").delete().eq("order_id", order.id);
      await supabase.from("orders").delete().eq("id", order.id);
    }
    throw error;
  }

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
