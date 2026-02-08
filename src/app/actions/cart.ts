"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { CartMap } from "@/lib/cart";
import { parseCartCookie } from "@/lib/cart";
import { findProductById } from "@/lib/shop/queries";

const CART_COOKIE = "ms_cart";

async function getCart(): Promise<CartMap> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  return parseCartCookie(raw);
}

async function setCart(cart: CartMap) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function addToCart(productId: string, formData: FormData) {
  const product = await findProductById(productId);
  if (!product || !product.isActive) redirect("/boutique");

  const rawQty = Number(formData.get("quantity") ?? 1);
  const desired = Number.isFinite(rawQty) ? Math.floor(rawQty) : 1;
  const qty = Math.max(1, Math.min(product.stock > 0 ? product.stock : 99, desired));

  const cart = await getCart();
  cart[productId] = Math.min((cart[productId] ?? 0) + qty, 99);
  await setCart(cart);

  redirect("/panier");
}

export async function removeFromCart(productId: string) {
  const cart = await getCart();
  delete cart[productId];
  await setCart(cart);
  redirect("/panier");
}

export async function updateCart(formData: FormData) {
  const cart = await getCart();
  for (const key of Object.keys(cart)) {
    const rawQty = formData.get(`qty_${key}`);
    const nextQty = Math.floor(Number(rawQty ?? 0));
    if (!Number.isFinite(nextQty) || nextQty <= 0) {
      delete cart[key];
      continue;
    }
    cart[key] = Math.min(99, nextQty);
  }

  await setCart(cart);
  redirect("/panier");
}

export async function clearCart() {
  await setCart({});
  redirect("/panier");
}
