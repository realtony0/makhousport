"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCartLines } from "@/lib/cart";
import { createOrder } from "@/lib/data-store";
import type { CheckoutInput, PaymentMethod } from "@/lib/types";

const CART_COOKIE = "ms_cart";

const schema = z.object({
  customerName: z.string().trim().min(2, "Nom invalide").max(120),
  customerPhone: z.string().trim().min(6, "Telephone invalide").max(40),
  customerEmail: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  address: z.string().trim().min(3, "Adresse invalide").max(255),
  city: z.string().trim().min(2, "Ville invalide").max(120),
  paymentMethod: z.enum(["cash", "orange-money", "wave"]),
  notes: z.string().trim().max(1000).optional().or(z.literal(""))
});

export async function placeOrder(formData: FormData) {
  const { lines } = await getCartLines();
  if (lines.length === 0) redirect("/panier");

  const parsed = schema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    address: formData.get("address"),
    city: formData.get("city"),
    paymentMethod: formData.get("paymentMethod"),
    notes: formData.get("notes")
  });

  if (!parsed.success) {
    redirect("/commande?error=invalid");
  }

  const payload: CheckoutInput = {
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerEmail: parsed.data.customerEmail || undefined,
    address: parsed.data.address,
    city: parsed.data.city,
    notes: parsed.data.notes || undefined,
    paymentMethod: parsed.data.paymentMethod as PaymentMethod,
    lines: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity }))
  };

  try {
    const created = await createOrder(payload);

    const store = await cookies();
    store.set(CART_COOKIE, "{}", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0
    });

    redirect(`/commande/${created.id}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur commande";
    redirect(`/commande?error=${encodeURIComponent(message)}`);
  }
}
