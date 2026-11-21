"use client";

import { useSyncExternalStore, useMemo, useCallback } from "react";
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

// Build a per-user localStorage key so each user's wishlist is isolated.
function storageKey(userId: string): string {
  return `pizzahub_wishlist_v2_${userId}`;
}

// ── Stable empty reference — NEVER return a new [] from getSnapshot ───────────
const EMPTY_ITEMS: WishlistItem[] = [];

// ── Per-user cache to avoid redundant JSON.parse + unstable references ────────
const cache = new Map<string, { raw: string; items: WishlistItem[] }>();

export function getWishlistItems(userId: string): WishlistItem[] {
  if (typeof window === "undefined" || !userId) return EMPTY_ITEMS; // stable ref!
  try {
    const key = storageKey(userId);
    const raw = localStorage.getItem(key);
    if (raw === null) return EMPTY_ITEMS; // stable ref!
    const entry = cache.get(key);
    if (entry && entry.raw === raw) return entry.items; // cached stable ref
    const items = JSON.parse(raw) as WishlistItem[];
    cache.set(key, { raw, items });
    return items;
  } catch {
    return EMPTY_ITEMS;
  }
}

export function saveWishlistItems(userId: string, items: WishlistItem[]) {
  if (typeof window === "undefined" || !userId) return;
  try {
    const key = storageKey(userId);
    const raw = JSON.stringify(items);
    cache.set(key, { raw, items });
    localStorage.setItem(key, raw);
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

// ── Subscription factory ───────────────────────────────────────────────────────
function makeSubscribe(userId: string) {
  return (callback: () => void) => {
    if (typeof window === "undefined") return () => {};

    const onCustom = (e: Event) => {
      if ((e as CustomEvent).detail === userId) callback();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey(userId)) callback();
    };

    window.addEventListener(WISHLIST_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  };
}

// ── Main hook — user-scoped ────────────────────────────────────────────────────
export function useWishlist() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  // useMemo so subscribe and getSnapshot are stable references per userId.
  // useCallback(makeSubscribe(userId), [userId]) is WRONG — it calls makeSubscribe
  // eagerly on every render before useCallback can memoize the result.
  const subscribe = useMemo(() => makeSubscribe(userId), [userId]);
  const getSnapshot = useMemo(() => () => getWishlistItems(userId), [userId]);
  const getServerSnapshot = useMemo(() => () => EMPTY_ITEMS, []);

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
