import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getVendorShop } from "@/lib/vendor-shops";

// GET /api/vendor/:vendorId — Public vendor info for About Vendor section
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  const { vendorId } = await params;
  if (!vendorId) {
    return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
  }

  // 1. Look up shop profile in vendorShops collection
  const shop = await getVendorShop(vendorId);
  if (shop && shop.shopName) {
    return NextResponse.json({
      vendorId: shop.vendorId,
      shopName: shop.shopName,
      shopBio: shop.shopBio || "Authentic freshly baked pizzas made with premium ingredients.",
      shopLogo: shop.shopLogo || "",
      shopLocation: shop.shopLocation || "Dhaka",
      isProfileComplete: shop.isProfileComplete,
    });
  }

  // 2. Fallback to user document if shop profile not yet created
  const db = getDb();
  let user = null;
  if (ObjectId.isValid(vendorId)) {
    user = await db.collection("user").findOne({ _id: new ObjectId(vendorId) });
  }
  if (!user) {
    user = await db.collection("user").findOne({ id: vendorId });
  }

  if (!user) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  return NextResponse.json({
    vendorId: user.id || user._id?.toString(),
    shopName: user.name || "PizzaHub Partner",
    shopBio: "Delicious handcrafted pizzas made fresh daily.",
    shopLogo: user.image || "",
    shopLocation: "Dhaka",
    isProfileComplete: false,
  });
}
