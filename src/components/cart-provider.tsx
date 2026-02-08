"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type CartMap = Record<string, number>;

type CartContextValue = {
  cart: CartMap;
  cartCount: number;
  addItem: (productId: string, quantity?: number) => void;
  setItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CART_KEY = "makhou_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);
const defaultCartContext: CartContextValue = {
  cart: {},
  cartCount: 0,
  addItem: () => {},
  setItemQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {}
};

function sanitizeCart(payload: unknown): CartMap {
  if (!payload || typeof payload !== "object") {
    return {};
  }
  const result: CartMap = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    const quantity = Number.parseInt(String(value), 10);
    if (!Number.isNaN(quantity) && quantity > 0) {
      result[key] = quantity;
    }
  }
  return result;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartMap>({});

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) {
      return;
    }
    try {
      setCart(sanitizeCart(JSON.parse(raw)));
    } catch {
      setCart({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setCart((current) => {
      const next = { ...current };
      next[productId] = (next[productId] || 0) + Math.max(1, quantity);
      return next;
    });
  }, []);

  const setItemQuantity = useCallback((productId: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart]
  );

  const value = useMemo<CartContextValue>(
    () => ({ cart, cartCount, addItem, setItemQuantity, removeItem, clearCart }),
    [cart, cartCount, addItem, setItemQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  return context ?? defaultCartContext;
}
