"use client";

import { useSyncExternalStore } from "react";

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

const WISHLIST_STORAGE_KEY = "pizzahub_wishlist_v2";
const WISHLIST_EVENT = "pizzahub_wishlist_updated";

const INITIAL_WISHLIST: WishlistItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: WishlistItem[] = [];

export function getWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw === null) {
      return INITIAL_WISHLIST;
    }
    if (raw === cachedRaw) {
      return cachedItems;
    }
    cachedRaw = raw;
    cachedItems = JSON.parse(raw);
    return cachedItems;
  } catch {
    return [];
  }
}

export function saveWishlistItems(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(items);
    cachedRaw = raw;
    cachedItems = items;
    localStorage.setItem(WISHLIST_STORAGE_KEY, raw);
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  const current = getWishlistItems();
  const exists = current.some((i) => i.id === item.id);
  let updated: WishlistItem[];
  if (exists) {
    updated = current.filter((i) => i.id !== item.id);
  } else {
    updated = [item, ...current];
  }
  saveWishlistItems(updated);
  return !exists;
}

export function removeFromWishlist(id: string) {
  const current = getWishlistItems();
  const updated = current.filter((i) => i.id !== id);
  saveWishlistItems(updated);
}

export function clearWishlist() {
  saveWishlistItems([]);
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(WISHLIST_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(WISHLIST_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_ITEMS: WishlistItem[] = [];

export function useWishlist() {
  const items = useSyncExternalStore(
    subscribe,
    getWishlistItems,
    () => EMPTY_ITEMS
  );

  const totalCount = items.length;
  const isInWishlist = (id: string) => items.some((i) => i.id === id);

  return {
    items,
    totalCount,
    isInWishlist,
    toggleWishlistItem,
    removeFromWishlist,
    clearWishlist,
  };
}
