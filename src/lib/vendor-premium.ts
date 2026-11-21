import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Checks whether a vendor has an active Premium subscription.
 * Checks both the 'user' and 'vendorShops' collections in MongoDB.
 */
export async function isVendorPremium(vendorId: string): Promise<boolean> {
  if (!vendorId) return false;
  try {
    const db = getDb();

    // 1. Check user collection
    const userQuery = ObjectId.isValid(vendorId)
      ? { $or: [{ id: vendorId }, { _id: new ObjectId(vendorId) }] }
      : { id: vendorId };

    const user = await db.collection("user").findOne(userQuery);
    if (user?.isPremium === true) {
      return true;
    }

    // 2. Check vendorShops collection
    const shop = await db.collection("vendorShops").findOne({ vendorId });
    if (shop?.isPremium === true) {
      return true;
    }

    return false;
  } catch (err) {
    console.error("Error checking vendor premium status:", err);
    return false;
  }
}
