import { NextResponse } from "next/server";

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

function readCartFromRequest(request: Request): CartMap {
  const rawCookie = request.headers.get("cookie") || "";
  const cartCookie = rawCookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CART_COOKIE}=`));
  const cartRawValue = cartCookie ? decodeURIComponent(cartCookie.slice(CART_COOKIE.length + 1)) : undefined;
  return parseCartCookie(cartRawValue);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const cart = readCartFromRequest(request);

  const removeId = String(formData.get("removeId") || "").trim();
  if (removeId) {
    delete cart[removeId];
    const response = NextResponse.redirect(new URL("/panier", request.url));
    setCartCookie(response, cart);
    return response;
  }

  for (const key of Object.keys(cart)) {
    const rawQty = formData.get(`qty_${key}`);
    const nextQty = Math.floor(Number(rawQty ?? 0));
    if (!Number.isFinite(nextQty) || nextQty <= 0) {
      delete cart[key];
      continue;
    }
    cart[key] = Math.min(99, nextQty);
  }

  const response = NextResponse.redirect(new URL("/panier", request.url));
  setCartCookie(response, cart);
  return response;
}
