import { NextResponse } from "next/server";

import { findProductById } from "@/lib/shop/queries";
import { parseCartCookie, type CartMap } from "@/lib/cart";

const CART_COOKIE = "ms_cart";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30
  };
}

function setCartCookie(response: NextResponse, cart: CartMap) {
  response.cookies.set(CART_COOKIE, JSON.stringify(cart), cookieOptions());
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") || "").trim();

  if (!productId) {
    return NextResponse.redirect(new URL("/boutique", request.url));
  }

  const product = await findProductById(productId);
  if (!product || !product.isActive) {
    return NextResponse.redirect(new URL("/boutique", request.url));
  }

  const rawQty = Number(formData.get("quantity") ?? 1);
  const desired = Number.isFinite(rawQty) ? Math.floor(rawQty) : 1;
  const qty = Math.max(1, Math.min(product.stock > 0 ? product.stock : 99, desired));

  const rawCart = request.headers.get("cookie") || "";
  const cartCookie = rawCart
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CART_COOKIE}=`));
  const cartRawValue = cartCookie ? decodeURIComponent(cartCookie.slice(CART_COOKIE.length + 1)) : undefined;

  const cart = parseCartCookie(cartRawValue);
  cart[productId] = Math.min((cart[productId] ?? 0) + qty, 99);

  const response = NextResponse.redirect(new URL("/panier", request.url));
  setCartCookie(response, cart);
  return response;
}
