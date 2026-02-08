import "server-only";

import { cookies } from "next/headers";

import { getAllProductsDetailed } from "@/lib/shop/queries";

export type CartMap = Record<string, number>;

const CART_COOKIE = "ms_cart";

export function parseCartCookie(raw: string | undefined): CartMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: CartMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const qty = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(qty) || qty <= 0) continue;
      out[key] = Math.floor(qty);
    }
    return out;
  } catch {
    return {};
  }
}

export async function getCartFromCookies(): Promise<CartMap> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  return parseCartCookie(raw);
}

export function countCartItems(cart: CartMap): number {
  return Object.values(cart).reduce((acc, qty) => acc + (Number.isFinite(qty) ? qty : 0), 0);
}

export async function getCartLines() {
  const cart = await getCartFromCookies();
  const products = await getAllProductsDetailed();
  const productById = new Map(products.map((p) => [p.id, p]));

  const lines = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = productById.get(productId);
      if (!product) return null;
      const qty = Math.max(1, Math.floor(quantity));
      const lineTotalXof = qty * product.priceXof;
      return { product, quantity: qty, lineTotalXof };
    })
    .filter(Boolean) as Array<{ product: (typeof products)[number]; quantity: number; lineTotalXof: number }>;

  const totalXof = lines.reduce((acc, l) => acc + l.lineTotalXof, 0);
  return { lines, totalXof };
}
