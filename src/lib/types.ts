export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  priceXof: number;
  compareAtPriceXof?: number;
  stock: number;
  isActive: boolean;
  featured: boolean;
  images: string[];
};

export type PaymentMethod = "cash" | "orange-money" | "wave";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "shipped"
  | "completed"
  | "canceled";

export type CartLineInput = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceXof: number;
  lineTotalXof: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  totalXof: number;
  items: OrderItem[];
  createdAt: string;
};

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  lines: CartLineInput[];
};

export type DashboardStats = {
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  salesXof: number;
};

export type SiteSettings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  footerLocation: string;
  footerContactLabel: string;
  footerDeliveryNote: string;
};
