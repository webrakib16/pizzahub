"use client";

import { useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  crust?: string;
  quantity: number;
}

const CART_STORAGE_KEY = "pizzahub_cart";
const CART_EVENT = "pizzahub_cart_updated";

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = [];

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedItems;
    }
    cachedRaw = raw;
    cachedItems = raw ? JSON.parse(raw) : [];
    return cachedItems;
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(items);
    cachedRaw = raw;
    cachedItems = items;
    localStorage.setItem(CART_STORAGE_KEY, raw);
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity: number = 1
): CartItem[] {
  const items = [...getCartItems()];
  const existingIdx = items.findIndex(
    (i) => i.id === item.id && i.size === item.size && i.crust === item.crust
  );
  if (existingIdx > -1) {
    items[existingIdx] = {
      ...items[existingIdx],
      quantity: items[existingIdx].quantity + quantity,
    };
  } else {
    items.push({ ...item, quantity });
  }
  saveCartItems(items);
  return items;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_ITEMS: CartItem[] = [];

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    getCartItems,
    () => EMPTY_ITEMS
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalCount,
    addToCart,
  };
}