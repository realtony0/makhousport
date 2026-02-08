"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { formatXof } from "@/lib/currency";
import type { CheckoutInput, PaymentMethod, Product } from "@/lib/types";

type CheckoutFormState = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

const initialForm: CheckoutFormState = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  address: "",
  city: "Dakar",
  notes: "",
  paymentMethod: "cash"
};

export function CartPageClient() {
  const router = useRouter();
  const { cart, setItemQuantity, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutFormState>(initialForm);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/products");
        const payload = (await response.json()) as { products: Product[] };
        if (active) {
          setProducts(payload.products || []);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const lines = useMemo(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = productMap.get(productId);
        if (!product) {
          return null;
        }
        const lineTotal = quantity * product.priceXof;
        return {
          product,
          quantity,
          lineTotal
        };
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number; lineTotal: number }>;
  }, [cart, productMap]);

  const totalXof = useMemo(
    () => lines.reduce((sum, line) => sum + line.lineTotal, 0),
    [lines]
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (lines.length === 0) {
      setErrorMessage("Votre panier est vide.");
      return;
    }

    if (!form.customerName || !form.customerPhone || !form.address || !form.city) {
      setErrorMessage("Merci de completer les champs obligatoires.");
      return;
    }

    const payload: CheckoutInput = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail || undefined,
      address: form.address,
      city: form.city,
      notes: form.notes || undefined,
      paymentMethod: form.paymentMethod,
      lines: lines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity
      }))
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { orderId?: string; error?: string };
      if (!response.ok || !data.orderId) {
        setErrorMessage(data.error || "Erreur lors de la commande.");
        return;
      }

      clearCart();
      setForm(initialForm);
      router.push(`/commande/${data.orderId}`);
    } catch {
      setErrorMessage("Impossible de valider la commande pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section className="section-head">
        <h1 style={{ fontSize: "2.2rem" }}>Panier</h1>
      </section>

      {isLoading ? <section className="empty-box">Chargement du panier...</section> : null}

      {!isLoading && lines.length === 0 ? (
        <section className="empty-box">Votre panier est vide.</section>
      ) : null}

      {!isLoading && lines.length > 0 ? (
        <section className="cart-layout">
          <div className="panel list-stack">
            {lines.map((line) => (
              <article key={line.product.id} className="line-item">
                <div className="line-item-info">
                  <Image
                    src={line.product.images[0] || "/products/chaussettes-pack-noir-blanc.jpeg"}
                    alt={line.product.name}
                    width={80}
                    height={80}
                    className="thumb"
                  />
                  <div>
                    <p style={{ fontWeight: 700 }}>{line.product.name}</p>
                    <p className="muted">{formatXof(line.product.priceXof)} / unite</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <input
                    type="number"
                    min={1}
                    max={line.product.stock}
                    value={line.quantity}
                    onChange={(event) =>
                      setItemQuantity(line.product.id, Number.parseInt(event.target.value, 10) || 1)
                    }
                    style={{ width: "74px", textAlign: "center" }}
                  />
                  <p style={{ minWidth: "98px", textAlign: "right", fontWeight: 700 }}>
                    {formatXof(line.lineTotal)}
                  </p>
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => removeItem(line.product.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>

          <form className="panel" onSubmit={onSubmit}>
            <h3 style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>Finaliser commande</h3>
            <p className="muted" style={{ marginBottom: "0.8rem" }}>
              Total: <strong>{formatXof(totalXof)}</strong>
            </p>
            <div className="form-grid">
              <div className="field full-span">
                <label htmlFor="customerName">Nom complet *</label>
                <input
                  id="customerName"
                  value={form.customerName}
                  onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="customerPhone">Telephone *</label>
                <input
                  id="customerPhone"
                  value={form.customerPhone}
                  onChange={(event) => setForm((current) => ({ ...current, customerPhone: event.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="customerEmail">Email</label>
                <input
                  id="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))}
                />
              </div>
              <div className="field full-span">
                <label htmlFor="address">Adresse *</label>
                <input
                  id="address"
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="city">Ville *</label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="paymentMethod">Paiement *</label>
                <select
                  id="paymentMethod"
                  value={form.paymentMethod}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: event.target.value as PaymentMethod
                    }))
                  }
                >
                  <option value="cash">Paiement a la livraison</option>
                  <option value="orange-money">Orange Money</option>
                  <option value="wave">Wave</option>
                </select>
              </div>
              <div className="field full-span">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                />
              </div>
            </div>

            {errorMessage ? (
              <p style={{ marginTop: "0.8rem", color: "var(--danger)", fontWeight: 700 }}>{errorMessage}</p>
            ) : null}

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
              {isSubmitting ? "Validation..." : "Confirmer la commande"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
