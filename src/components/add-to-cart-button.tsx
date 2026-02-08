"use client";

import { useState } from "react";

import { useCart } from "@/components/cart-provider";

type Props = {
  productId: string;
  disabled?: boolean;
  quantity?: number;
  compact?: boolean;
};

export function AddToCartButton({ productId, disabled, quantity = 1, compact = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function onClick() {
    addItem(productId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  const className = compact
    ? "ms-btn-primary px-3 py-2 text-xs"
    : "ms-btn-primary";

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
      {disabled ? "Rupture de stock" : added ? "Ajoute" : "Ajouter au panier"}
    </button>
  );
}
