"use client";

import { CartItem } from "@/components/myComponents/subs/cart";
import * as React from "react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface CheckoutData {
  cartId: string;
  tx_ref: string;
  amount: number;
  currency: string;
}

export interface CartContextType {
  // Cart
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  clearCart: () => void;
  itemCount: number;
  items: CartItem[];
  removeItem: (id: string) => void;
  subtotal: number;
  updateQuantity: (id: string, quantity: number) => void;

  // Checkout
  checkoutData: CheckoutData | null;
  setCheckoutData: (data: CheckoutData | null) => void;
  clearCheckoutData: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                Context                                     */
/* -------------------------------------------------------------------------- */

const CartContext = React.createContext<CartContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                         Local-storage helpers                              */
/* -------------------------------------------------------------------------- */

const CART_STORAGE_KEY = "cart";
const CHECKOUT_STORAGE_KEY = "checkout";
const DEBOUNCE_MS = 500;

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CartItem[];
  } catch (err) {
    console.error("Failed to load cart:", err);
  }
  return [];
};

const loadCheckoutFromStorage = (): CheckoutData | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutData;
  } catch (err) {
    console.error("Failed to load checkout:", err);
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                               Provider                                     */
/* -------------------------------------------------------------------------- */

export function CartProvider({ children }: React.PropsWithChildren) {
  /* ----------------------------- State ---------------------------------- */
  const [items, setItems] = React.useState<CartItem[]>(loadCartFromStorage);
  const [checkoutData, setCheckoutDataState] =
    React.useState<CheckoutData | null>(loadCheckoutFromStorage);

  /* -------------------- Persist Cart (debounced) ------------------------- */
  const saveTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error("Failed to save cart:", err);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [items]);

  /* -------------------- Persist Checkout (immediate) --------------------- */
  React.useEffect(() => {
    try {
      if (checkoutData) {
        localStorage.setItem(
          CHECKOUT_STORAGE_KEY,
          JSON.stringify(checkoutData)
        );
      } else {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save checkout:", err);
    }
  }, [checkoutData]);

  /* --------------------------- Checkout Actions -------------------------- */
  const setCheckoutData = React.useCallback(
    (data: CheckoutData | null) => {
      setCheckoutDataState(data);
    },
    []
  );

  const clearCheckoutData = React.useCallback(() => {
    setCheckoutDataState(null);
  }, []);

  /* ----------------------------- Cart Actions ---------------------------- */
  const addItem = React.useCallback(
    (newItem: Omit<CartItem, "quantity">, qty = 1) => {
      if (qty <= 0) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.id === newItem.id);
        if (existing) {
          return prev.map((i) =>
            i.id === newItem.id
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: qty }];
      });
      clearCheckoutData(); // clear checkout only when user edits cart
    },
    [clearCheckoutData]
  );

  const removeItem = React.useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      clearCheckoutData(); // clear checkout only when user edits cart
    },
    [clearCheckoutData]
  );

  const updateQuantity = React.useCallback(
    (id: string, qty: number) => {
      setItems((prev) =>
        prev.flatMap((i) => {
          if (i.id !== id) return i;
          if (qty <= 0) return [];
          if (qty === i.quantity) return i;
          return { ...i, quantity: qty };
        })
      );
      clearCheckoutData(); // clear checkout only when user edits cart
    },
    [clearCheckoutData]
  );

  const clearCart = React.useCallback(() => {
    setItems([]); // Clear all cart items
    clearCheckoutData(); // Also clear checkout data
  }, [clearCheckoutData]);

  /* --------------------------- Derived data ------------------------------ */
  const itemCount = React.useMemo(
    () => items.reduce((t, i) => t + i.quantity, 0),
    [items]
  );

  const subtotal = React.useMemo(
    () => items.reduce((t, i) => t + i.price * i.quantity, 0),
    [items]
  );

  /* ----------------------------- Context value --------------------------- */
  const value = React.useMemo<CartContextType>(
    () => ({
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      items,
      subtotal,
      checkoutData,
      setCheckoutData,
      clearCheckoutData,
    }),
    [
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      items,
      subtotal,
      checkoutData,
      setCheckoutData,
      clearCheckoutData,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* -------------------------------------------------------------------------- */
/*                                   Hook                                     */
/* -------------------------------------------------------------------------- */

export function useCart(): CartContextType {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
