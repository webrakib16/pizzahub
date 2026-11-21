import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { VendorShop, VendorShopInput } from "@/types/vendor-shop";

export interface VendorShopDocument {
  _id: ObjectId;
  vendorId: string;
  shopName: string;
  shopBio: string;
  shopLogo?: string;
  shopLocation: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function getShopCollection() {
  return getDb().collection<VendorShopDocument>("vendorShops");
}

function serializeShop(doc: VendorShopDocument): VendorShop {
  const formatTime = (val: unknown) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "string") return val;
    return new Date().toISOString();
  };

  return {
    id: doc._id.toString(),
    vendorId: doc.vendorId,
    shopName: doc.shopName,
    shopBio: doc.shopBio,
    shopLogo: doc.shopLogo || "",
    shopLocation: doc.shopLocation,
    isProfileComplete: doc.isProfileComplete ?? Boolean(doc.shopName && doc.shopBio && doc.shopLocation),
    createdAt: formatTime(doc.createdAt),
    updatedAt: formatTime(doc.updatedAt),
  };
}

export async function getVendorShop(vendorId: string): Promise<VendorShop | null> {
  try {
    const doc = await getShopCollection().findOne({ vendorId: String(vendorId) });
    if (!doc) return null;
    return serializeShop(doc);
  } catch {
    return null;
  }
}

export async function isShopProfileComplete(vendorId: string): Promise<boolean> {
  try {
    const shop = await getVendorShop(vendorId);
    if (!shop) return false;
    return Boolean(shop.isProfileComplete && shop.shopName?.trim() && shop.shopBio?.trim() && shop.shopLocation?.trim());
  } catch {
    return false;
  }
}

export async function createVendorShop(
  vendorId: string,
  input: VendorShopInput
): Promise<{ ok: true; shop: VendorShop } | { ok: false; error: string }> {
  try {
    const shopName = input.shopName?.trim();
    const shopBio = input.shopBio?.trim();
    const shopLocation = input.shopLocation?.trim();
    const shopLogo = (input.shopLogo || "").trim();

    if (!shopName || !shopBio || !shopLocation) {
      return {
        ok: false,
        error: "Shop Name, Shop Bio, and Shop Location are required.",
      };
    }

    const existing = await getShopCollection().findOne({ vendorId: String(vendorId) });
    if (existing) {
      return { ok: false, error: "Shop profile already exists for this vendor." };
    }

    const now = new Date();
    const doc: VendorShopDocument = {
      _id: new ObjectId(),
      vendorId: String(vendorId),
      shopName,
      shopBio,
      shopLogo,
      shopLocation,
      isProfileComplete: true,
      createdAt: now,
      updatedAt: now,
    };

    await getShopCollection().insertOne(doc);
    return { ok: true, shop: serializeShop(doc) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create shop profile.";
    return { ok: false, error: message };
  }
}

export async function updateVendorShop(
  vendorId: string,
  input: Partial<VendorShopInput>
): Promise<{ ok: true; shop: VendorShop } | { ok: false; error: string }> {
  try {
    const existing = await getShopCollection().findOne({ vendorId: String(vendorId) });

    const shopName = input.shopName !== undefined ? input.shopName.trim() : existing?.shopName;
    const shopBio = input.shopBio !== undefined ? input.shopBio.trim() : existing?.shopBio;
    const shopLocation = input.shopLocation !== undefined ? input.shopLocation.trim() : existing?.shopLocation;
    const shopLogo = input.shopLogo !== undefined ? input.shopLogo.trim() : (existing?.shopLogo || "");

    const isComplete = Boolean(shopName && shopBio && shopLocation);
    const now = new Date();

    const updateFields: Record<string, unknown> = {
      shopName,
      shopBio,
      shopLogo,
      shopLocation,
      isProfileComplete: isComplete,
      updatedAt: now,
    };

    const res = await getShopCollection().findOneAndUpdate(
      { vendorId: String(vendorId) },
      { $set: updateFields, $setOnInsert: { _id: new ObjectId(), vendorId: String(vendorId), createdAt: now } },
      { upsert: true, returnDocument: "after" }
    );

    // Cascade shopName update to all existing menuItems owned by this vendor
    if (shopName) {
      await getDb()
        .collection("menuItems")
        .updateMany(
          { vendorId: String(vendorId) },
          { $set: { vendorName: shopName, updatedAt: now } }
        );
    }

    if (!res) {
      return { ok: false, error: "Failed to save shop profile." };
    }

    return { ok: true, shop: serializeShop(res) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update shop profile.";
    return { ok: false, error: message };
  }
}
