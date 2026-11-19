"use client";

import { useSyncExternalStore } from "react";

// Kono subscription lagbe na — only "client e mount hoyeche kina" jante chai
const subscribe = () => () => {};

/**
 * Hydration complete hoyeche kina bole dey.
 * - Server render + hydration er somoy: false
 * - Hydration er por: true
 *
 * Kano lage: client component er form hydrate howar age user click korle
 * browser form ta native GET hisebe submit kore fele (password URL e chole jay).
 * Ei hook diye hydration er age submit button disable rakha hoy.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
