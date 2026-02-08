"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";

export function CartBadge() {
  const { cartCount } = useCart();

  return (
    <Link href="/panier" className="ms-btn-primary px-4">
      Panier
      {cartCount > 0 ? (
        <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-black text-white">
          {cartCount}
        </span>
      ) : null}
    </Link>
  );
}
