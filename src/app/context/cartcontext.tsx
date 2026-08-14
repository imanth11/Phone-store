"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product, StoreUser } from "@/types/store";
import { getDiscountedUnitPrice } from "@/lib/pricing";

type CartContextType = {
  cartitems: CartItem[];
  users: StoreUser | null;
  hydrated: boolean;
  cartCount: number;
  subtotal: number;
  addTocart: (product: Product) => void;
  Remove: (product: Product) => void;
  increase: (product: Product) => void;
  descrease: (product: Product) => void;
  totalprice: (code: string) => number;
  clearCart: () => void;
  realprice: () => number;
  login: (user: StoreUser) => void;
  logout: () => void;
};


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartitems, setCartItems] = useState<CartItem[]>([]);
  const [users, setUsers] = useState<StoreUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem("cartitems");
      if (storedCart) {
        const parsed = JSON.parse(storedCart) as CartItem[];
        if (Array.isArray(parsed)) {
          setCartItems(
            parsed
              .filter((item) => item && Number.isInteger(Number(item.id)))
              .map((item) => ({
                ...item,
                qty: Math.min(Math.max(Number(item.qty) || 1, 1), 20),
              })),
          );
        }
      }
    } catch {
      window.localStorage.removeItem("cartitems");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("cartitems", JSON.stringify(cartitems));
  }, [cartitems, hydrated]);

  useEffect(() => {
    let active = true;

    async function fetchUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!active) return;

        if (!response.ok) {
          setUsers(null);
          return;
        }

        const data = await response.json();
        setUsers(data.success && data.user ? data.user : null);
      } catch {
        if (active) setUsers(null);
      }
    }

    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  const addTocart = useCallback((product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + 1, 20) }
            : item,
        );
      }

      return [...current, { ...product, qty: 1 }];
    });
  }, []);

  const Remove = useCallback((product: Product) => {
    setCartItems((current) => current.filter((item) => item.id !== product.id));
  }, []);

  const increase = useCallback((product: Product) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, qty: Math.min(item.qty + 1, 20) }
          : item,
      ),
    );
  }, []);

  const descrease = useCallback((product: Product) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.id !== product.id) return [item];
        if (item.qty <= 1) return [];
        return [{ ...item, qty: item.qty - 1 }];
      }),
    );
  }, []);

  const subtotal = useMemo(
    () =>
      Number(
        cartitems
          .reduce(
            (sum, item) => sum + getDiscountedUnitPrice(item) * item.qty,
            0,
          )
          .toFixed(2),
      ),
    [cartitems],
  );

  const realprice = useCallback(() => subtotal, [subtotal]);

  const totalprice = useCallback(
    (_code: string) => subtotal,
    [subtotal],
  );

  const clearCart = useCallback(() => setCartItems([]), []);
  const login = useCallback((user: StoreUser) => setUsers(user), []);
  const logout = useCallback(() => setUsers(null), []);

  const cartCount = useMemo(
    () => cartitems.reduce((sum, item) => sum + item.qty, 0),
    [cartitems],
  );

  const value = useMemo(
    () => ({
      cartitems,
      users,
      hydrated,
      cartCount,
      subtotal,
      addTocart,
      Remove,
      increase,
      descrease,
      totalprice,
      clearCart,
      realprice,
      login,
      logout,
    }),
    [
      cartitems,
      users,
      hydrated,
      cartCount,
      subtotal,
      addTocart,
      Remove,
      increase,
      descrease,
      totalprice,
      clearCart,
      realprice,
      login,
      logout,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
