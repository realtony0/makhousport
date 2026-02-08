import "server-only";

import { formatXof } from "@/lib/currency";
import type { Order } from "@/lib/types";

function normalizePhoneNumber(raw: string): string | null {
  const digits = raw.replace(/\D+/g, "");
  if (!digits) {
    return null;
  }
  if (digits.length === 9 && digits.startsWith("7")) {
    return `221${digits}`;
  }
  if (digits.startsWith("00")) {
    return digits.slice(2);
  }
  if (digits.startsWith("0")) {
    return `221${digits.slice(1)}`;
  }
  return digits;
}

function paymentLabel(value: Order["paymentMethod"]): string {
  if (value === "orange-money") {
    return "Orange Money";
  }
  if (value === "wave") {
    return "Wave";
  }
  return "Paiement a la livraison";
}

export function getOrderChatNumber(): string | null {
  const configured = process.env.WHATSAPP_ORDER_NUMBER || "";
  return normalizePhoneNumber(configured);
}

export function buildOrderChatMessage(order: Order): string {
  const lines = order.items
    .map((item) => `- ${item.productName} x${item.quantity} (${formatXof(item.lineTotalXof)})`)
    .join("\n");

  return [
    "Bonjour Makhou Sport,",
    "Je confirme cette commande:",
    `Reference: ${order.id}`,
    `Client: ${order.customerName}`,
    `Telephone: ${order.customerPhone}`,
    `Adresse: ${order.address}, ${order.city}`,
    `Paiement: ${paymentLabel(order.paymentMethod)}`,
    "Articles:",
    lines,
    `Total: ${formatXof(order.totalXof)}`
  ].join("\n");
}

export function buildOrderChatUrl(order: Order): string | null {
  const number = getOrderChatNumber();
  if (!number) {
    return null;
  }

  const text = encodeURIComponent(buildOrderChatMessage(order));
  return `https://wa.me/${number}?text=${text}`;
}
