"use client";

import { useSyncExternalStore, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  crust?: string;
  quantity: number;
}

const CART_EVENT = "pizzahub_cart_updated";

function storageKey(userId?: string | null): string {
  return userId ? `pizzahub_cart_v2_${userId}` : "pizzahub_cart_v2_guest";
}

const EMPTY_ITEMS: CartItem[] = [];

let activeCartUserId: string | null = null;
let cachedCartSnapshot: CartItem[] = EMPTY_ITEMS;
const listeners = new Set<() => void>();

function syncCartFromStorage(userId?: string | null) {
  if (typeof window === "undefined") {
    cachedCartSnapshot = EMPTY_ITEMS;
    return;
  }
  activeCartUserId = userId ?? null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      cachedCartSnapshot = EMPTY_ITEMS;
    } else {
      const parsed = JSON.parse(raw);
      cachedCartSnapshot = Array.isArray(parsed) ? parsed : EMPTY_ITEMS;
    }
  } catch {
    cachedCartSnapshot = EMPTY_ITEMS;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener(CART_EVENT, (e: Event) => {
    const detailUserId = (e as CustomEvent).detail;
    if (detailUserId === undefined || detailUserId === activeCartUserId) {
      syncCartFromStorage(activeCartUserId);
      notify();
    }
  });

  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === storageKey(activeCartUserId)) {
      syncCartFromStorage(activeCartUserId);
      notify();
    }
  });
}

export function getCartItems(userId?: string | null): CartItem[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  const targetId = userId !== undefined ? userId : activeCartUserId;
  if (targetId === activeCartUserId && cachedCartSnapshot.length > 0) {
    return cachedCartSnapshot;
  }
  try {
    const raw = localStorage.getItem(storageKey(targetId));
    if (!raw) return EMPTY_ITEMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY_ITEMS;
  } catch {
    return EMPTY_ITEMS;
  }
}

export function saveCartItems(items: CartItem[], userId?: string | null) {
  if (typeof window === "undefined") return;
  const targetId = userId !== undefined ? userId : activeCartUserId;
  try {
    const key = storageKey(targetId);
    localStorage.setItem(key, JSON.stringify(items));
    if (targetId === activeCartUserId) {
      cachedCartSnapshot = items;
      notify();
    }
    window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: targetId }));
  } catch {
    // Ignore storage errors
  }
}

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity: number = 1,
  userId?: string | null
): CartItem[] {
  const targetId = userId !== undefined ? userId : activeCartUserId;
  const items = [...getCartItems(targetId)];
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
  saveCartItems(items, targetId);
  return items;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): CartItem[] {
  return cachedCartSnapshot;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

export function useCart() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (userId !== activeCartUserId) {
      syncCartFromStorage(userId);
      notify();
    }
  }, [userId]);

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const add = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number = 1) =>
      addToCart(item, quantity, userId),
    [userId]
  );

  const save = useCallback(
    (newItems: CartItem[]) => saveCartItems(newItems, userId),
    [userId]
  );

  return {
    items,
    totalCount,
    addToCart: add,
    saveCartItems: save,
  };
}
