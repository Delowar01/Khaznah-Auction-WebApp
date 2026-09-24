"use client";

// Client-side state for the interactive prototype: a demo cart, the
// watchlist and toast notifications. Lives in the root layout so it persists
// while the client moves between pages and concepts.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const StoreContext = createContext(null);

let toastSeq = 0;

export function PreviewStore({ children }) {
  const [cart, setCart] = useState([]);
  const [watched, setWatched] = useState(() => new Set(["split-ac", "suede-tote"]));
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input) => {
      const id = ++toastSeq;
      const entry = { id, tone: "neutral", duration: 4200, ...input };
      setToasts((list) => [...list.slice(-3), entry]);
      timers.current.set(
        id,
        window.setTimeout(() => dismissToast(id), entry.duration),
      );
      return id;
    },
    [dismissToast],
  );

  const addToCart = useCallback((slug, qty = 1) => {
    setCart((items) => {
      const existing = items.find((item) => item.slug === slug);
      if (existing) return items.map((item) => (item.slug === slug ? { ...item, qty: item.qty + qty } : item));
      return [...items, { slug, qty }];
    });
  }, []);

  const removeFromCart = useCallback((slug) => {
    setCart((items) => items.filter((item) => item.slug !== slug));
  }, []);

  const isWatched = useCallback((slug) => watched.has(slug), [watched]);

  const toggleWatch = useCallback(
    (slug) => {
      const nowWatched = !watched.has(slug);
      setWatched((current) => {
        const next = new Set(current);
        if (nowWatched) next.add(slug);
        else next.delete(slug);
        return next;
      });
      return nowWatched;
    },
    [watched],
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((sum, item) => sum + item.qty, 0),
      addToCart,
      removeFromCart,
      watched,
      isWatched,
      toggleWatch,
      toasts,
      toast,
      dismissToast,
    }),
    [cart, addToCart, removeFromCart, watched, isWatched, toggleWatch, toasts, toast, dismissToast],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <PreviewStore>");
  return context;
}
