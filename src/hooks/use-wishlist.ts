"use client";

import { useSyncExternalStore, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  category?: string;
}

const WISHLIST_EVENT = "pizzahub_wishlist_updated";

function storageKey(userId: string): string {
  return `pizzahub_wishlist_v2_${userId}`;
}

const EMPTY_ITEMS: WishlistItem[] = [];

// ── Global stable store state ──────────────────────────────────────────────────
let activeUserId = "";
let cachedSnapshot: WishlistItem[] = EMPTY_ITEMS;
const listeners = new Set<() => void>();

function syncFromStorage(userId: string) {
  if (typeof window === "undefined" || !userId) {
    activeUserId = "";
    cachedSnapshot = EMPTY_ITEMS;
    return;
  }
  activeUserId = userId;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      cachedSnapshot = EMPTY_ITEMS;
    } else {
      const parsed = JSON.parse(raw);
      cachedSnapshot = Array.isArray(parsed) ? parsed : EMPTY_ITEMS;
    }
  } catch {
    cachedSnapshot = EMPTY_ITEMS;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener(WISHLIST_EVENT, (e: Event) => {
    const detailUserId = (e as CustomEvent).detail;
    if (detailUserId && detailUserId === activeUserId) {
      syncFromStorage(activeUserId);
      notify();
    }
  });

  window.addEventListener("storage", (e: StorageEvent) => {
    if (activeUserId && e.key === storageKey(activeUserId)) {
      syncFromStorage(activeUserId);
      notify();
    }
  });
}

export function getWishlistItems(userId: string): WishlistItem[] {
  if (typeof window === "undefined" || !userId) return EMPTY_ITEMS;
  if (userId === activeUserId) return cachedSnapshot;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return EMPTY_ITEMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY_ITEMS;
  } catch {
    return EMPTY_ITEMS;
  }
}

export function saveWishlistItems(userId: string, items: WishlistItem[]) {
  if (typeof window === "undefined" || !userId) return;
  try {
    const key = storageKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
    if (userId === activeUserId) {
      cachedSnapshot = items;
      notify();
    }
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: userId }));
  } catch {
    // Ignore storage errors
  }
}

export function toggleWishlistItem(userId: string, item: WishlistItem): boolean {
  const current = getWishlistItems(userId);
  const exists = current.some((i) => i.id === item.id);
  const updated = exists
    ? current.filter((i) => i.id !== item.id)
    : [item, ...current];
  saveWishlistItems(userId, updated);
  return !exists;
}

export function removeFromWishlist(userId: string, id: string) {
  const updated = getWishlistItems(userId).filter((i) => i.id !== id);
  saveWishlistItems(userId, updated);
}

export function clearWishlist(userId: string) {
  saveWishlistItems(userId, []);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): WishlistItem[] {
  return cachedSnapshot;
}

function getServerSnapshot(): WishlistItem[] {
  return EMPTY_ITEMS;
}

export function useWishlist() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  useEffect(() => {
    if (userId !== activeUserId) {
      syncFromStorage(userId);
      notify();
    }
  }, [userId]);

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const totalCount = items.length;

  const isInWishlist = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback(
    (item: WishlistItem) => toggleWishlistItem(userId, item),
    [userId]
  );

  const remove = useCallback(
    (id: string) => removeFromWishlist(userId, id),
    [userId]
  );

  const clear = useCallback(() => clearWishlist(userId), [userId]);

  return {
    items,
    totalCount,
    isInWishlist,
    toggleWishlistItem: toggle,
    removeFromWishlist: remove,
    clearWishlist: clear,
  };
}
