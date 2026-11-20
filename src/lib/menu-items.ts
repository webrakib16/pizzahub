import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { MenuItem, MenuItemStatus, NewMenuItemInput } from "@/types/menu-item";

interface MenuItemDocument {
  _id: ObjectId;
  vendorId: string;
  vendorName: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: string;
  status: MenuItemStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function getCollection() {
  return getDb().collection<MenuItemDocument>("menuItems");
}

function serialize(doc: MenuItemDocument): MenuItem {
  const formatTime = (val: unknown) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "string") return val;
    return new Date().toISOString();
  };

  return {
    id: doc._id.toString(),
    vendorId: doc.vendorId,
    vendorName: doc.vendorName,
    name: doc.name,
    category: doc.category,
    description: doc.description,
    price: doc.price,
    location: doc.location,
    image: doc.image,
    status: doc.status,
    isActive: doc.isActive ?? true,
    createdAt: formatTime(doc.createdAt),
    updatedAt: formatTime(doc.updatedAt),
  };
}

export async function getVendorMenuItems(vendorId: string): Promise<MenuItem[]> {
  try {
    const docs = await getCollection()
      .find({ vendorId })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(serialize);
  } catch {
    return [];
  }
}

export async function getActiveVendorCount(vendorId: string): Promise<number> {
  try {
    return await getCollection().countDocuments({
      vendorId,
      isActive: true,
    });
  } catch {
    return 0;
  }
}

export async function createMenuItem(
  vendorId: string,
  vendorName: string,
  input: NewMenuItemInput,
  isPremium: boolean = false
): Promise<{ ok: true; item: MenuItem } | { ok: false; error: string }> {
  try {
    if (!isPremium) {
      const activeCount = await getActiveVendorCount(vendorId);
      if (activeCount >= 3) {
        return {
          ok: false,
          error: "Free plan limit reached (max 3 active items). Upgrade to Premium to publish unlimited items.",
        };
      }
    }

    const now = new Date();
    const doc: MenuItemDocument = {
      _id: new ObjectId(),
      vendorId,
      vendorName,
      name: input.name,
      category: input.category,
      description: input.description,
      price: input.price,
      location: input.location,
      image: input.image,
      status: "pending", // Default status is Pending until Admin approves
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await getCollection().insertOne(doc);
    return { ok: true, item: serialize(doc) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create menu item.";
    return { ok: false, error: message };
  }
}

export async function updateMenuItem(
  id: string,
  vendorId: string,
  input: Partial<NewMenuItemInput & { isActive: boolean }>
): Promise<{ ok: true; item?: MenuItem } | { ok: false; error: string }> {
  try {
    if (!ObjectId.isValid(id)) {
      return { ok: false, error: "Invalid item ID." };
    }

    const updateFields: Record<string, unknown> = {
      ...input,
      updatedAt: new Date(),
    };

    const res = await getCollection().findOneAndUpdate(
      { _id: new ObjectId(id), vendorId },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!res) {
      return { ok: false, error: "Menu item not found or unauthorized." };
    }

    return { ok: true, item: serialize(res) };
  } catch {
    return { ok: false, error: "Failed to update menu item." };
  }
}

export async function deleteMenuItem(
  id: string,
  vendorId?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(id)) {
      return { ok: false, error: "Invalid item ID." };
    }

    const query: Record<string, unknown> = { _id: new ObjectId(id) };
    if (vendorId) {
      query.vendorId = vendorId;
    }

    const res = await getCollection().deleteOne(query);
    return { ok: res.deletedCount > 0 };
  } catch {
    return { ok: false, error: "Failed to delete item." };
  }
}

export async function getAllMenuItemsForAdmin(): Promise<MenuItem[]> {
  try {
    const docs = await getCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(serialize);
  } catch {
    return [];
  }
}

export async function updateMenuItemStatusByAdmin(
  id: string,
  status: MenuItemStatus
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(id)) {
      return { ok: false, error: "Invalid item ID." };
    }

    const res = await getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return { ok: res.matchedCount > 0 };
  } catch {
    return { ok: false, error: "Failed to update item status." };
  }
}
