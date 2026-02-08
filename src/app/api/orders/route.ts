import { NextResponse } from "next/server";

import { createOrder } from "@/lib/data-store";
import type { CheckoutInput, PaymentMethod } from "@/lib/types";

const allowedPayments = new Set<PaymentMethod>(["cash", "orange-money", "wave"]);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const data = payload as Partial<CheckoutInput>;
  if (!data.customerName || !data.customerPhone || !data.address || !data.city) {
    return NextResponse.json({ error: "Informations client incompletes" }, { status: 400 });
  }
  if (!data.paymentMethod || !allowedPayments.has(data.paymentMethod)) {
    return NextResponse.json({ error: "Mode de paiement invalide" }, { status: 400 });
  }
  if (!Array.isArray(data.lines) || data.lines.length === 0) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  try {
    const order = await createOrder({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      address: data.address,
      city: data.city,
      notes: data.notes,
      paymentMethod: data.paymentMethod,
      lines: data.lines
    });
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de commande";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

