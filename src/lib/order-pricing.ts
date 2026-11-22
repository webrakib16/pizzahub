import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { MENU_ITEMS } from "@/data/menu-data";
import type { DeliveryLocation, OrderItem } from "@/types/order";

export const DELIVERY_CHARGES: Record<DeliveryLocation, number> = {
  "inside-dhaka": 100,
  "outside-dhaka": 150,
};

const SIZE_OFFSETS: Record<string, number> = {
  'Regular (8")': 0,
  'Medium (10")': 150,
  'Large (12")': 300,
};

const CRUST_OFFSETS: Record<string, number> = {
  "Classic Crust": 0,
  "Thin Crust": 30,
  "Cheese Burst": 100,
  "Stuffed Crust": 120,
};

const DEFAULT_SIZES = ['Regular (8")', 'Medium (10")', 'Large (12")'];
const DEFAULT_CRUSTS = ["Classic Crust", "Thin Crust", "Cheese Burst", "Stuffed Crust"];

/** The menu detail page labels plain crust as "Classic". */
function normalizeCrust(value: string): string {
  return value === "Classic" ? "Classic Crust" : value;
}

export interface PricedOrder {
  items: OrderItem[];
  subtotal: number;
}

export type PriceResult =
  | { ok: true; priced: PricedOrder }
  | { ok: false; error: string };

interface RawOrderItem {
  menuItemId?: unknown;
  quantity?: unknown;
  size?: unknown;
  crust?: unknown;
}

/**
 * Rebuilds the cart on the server so prices, vendor names, and options can
 * never be supplied by the client.
 */
export async function priceOrderItems(rawItems: unknown): Promise<PriceResult> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  if (rawItems.length > 50) {
    return { ok: false, error: "Too many different items in one order." };
  }

  const items: OrderItem[] = [];

  for (const raw of rawItems as RawOrderItem[]) {
    if (typeof raw?.menuItemId !== "string") {
      return { ok: false, error: "One of the cart items is invalid." };
    }

    const menuItem = MENU_ITEMS.find((item) => item.id === raw.menuItemId);
    const allowedSizes: string[] = menuItem?.sizes ? [...menuItem.sizes] : DEFAULT_SIZES;
    const allowedCrusts: string[] = menuItem?.crusts ? [...menuItem.crusts] : DEFAULT_CRUSTS;
    let resolvedItem = menuItem
      ? {
          id: menuItem.id,
          name: menuItem.name,
          image: menuItem.image,
          price: menuItem.price,
          vendorName: menuItem.restaurantName,
        }
      : null;

    if (!resolvedItem && ObjectId.isValid(raw.menuItemId)) {
      try {
        const db = getDb();
        const doc = await db
          .collection("menuItems")
          .findOne({ _id: new ObjectId(raw.menuItemId) });
        if (doc) {
          resolvedItem = {
            id: doc._id.toString(),
            name: doc.name,
            image: doc.primaryImage || doc.image || "",
            price: Number(doc.price) || 0,
            vendorName: doc.vendorName || "PizzaHub Partner",
          };
        }
      } catch {
        // DB error or collection unavailable
      }
    }

    if (!resolvedItem) {
      return { ok: false, error: "One of the cart items is no longer available." };
    }

    const quantity = Number(raw.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { ok: false, error: "Item quantities must be between 1 and 20." };
    }

    let sizeOffset = 0;
    const size = typeof raw.size === "string" && raw.size ? raw.size : undefined;

    if (size) {
      if (allowedSizes.length > 0 && !allowedSizes.includes(size)) {
        return { ok: false, error: `Invalid size for ${resolvedItem.name}.` };
      }
      sizeOffset = SIZE_OFFSETS[size] ?? 0;
    }

    let crustOffset = 0;
    const rawCrust =
      typeof raw.crust === "string" && raw.crust ? raw.crust : undefined;
    const crust = rawCrust ? normalizeCrust(rawCrust) : undefined;

    if (crust) {
      if (allowedCrusts.length > 0 && !allowedCrusts.includes(crust)) {
        return { ok: false, error: `Invalid crust for ${resolvedItem.name}.` };
      }
      crustOffset = CRUST_OFFSETS[crust] ?? 0;
    }

    items.push({
      menuItemId: resolvedItem.id,
      name: resolvedItem.name,
      image: resolvedItem.image,
      vendorName: resolvedItem.vendorName,
      unitPrice: resolvedItem.price + sizeOffset + crustOffset,
      quantity,
      size,
      crust,
    });
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return { ok: true, priced: { items, subtotal } };
}

export function getDeliveryCharge(location: DeliveryLocation): number {
  return DELIVERY_CHARGES[location];
}
