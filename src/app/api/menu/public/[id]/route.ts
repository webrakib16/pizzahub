import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getVendorShop } from "@/lib/vendor-shops";

// GET /api/menu/public/:id — Single item details with joined vendor shop information
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const db = getDb();
    let item = null;
    if (ObjectId.isValid(id)) {
      item = await db.collection("menuItems").findOne({ _id: new ObjectId(id) });
    }
    if (!item) {
      item = await db.collection("menuItems").findOne({
        $or: [{ id: String(id) }, { slug: String(id) }],
      } as Record<string, unknown>);
    }

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // Join vendor shop info
    const shop = await getVendorShop(item.vendorId);

    // Look up vendor subscription / email if available
    let vendorUser = null;
    if (ObjectId.isValid(item.vendorId)) {
      vendorUser = await db.collection("user").findOne({ _id: new ObjectId(item.vendorId) });
    }
    if (!vendorUser) {
      vendorUser = await db.collection("user").findOne({ id: item.vendorId });
    }

    const primary = item.primaryImage || item.image;
    const allImages = item.images?.length ? item.images : [primary];

    return NextResponse.json({
      id: item._id.toString(),
      vendorId: item.vendorId,
      vendorName: shop?.shopName || item.vendorName,
      shopBio: shop?.shopBio || "Premium pizzas, fast delivery, and high hygiene ratings.",
      shopLogo: shop?.shopLogo || vendorUser?.image || "",
      shopLocation: shop?.shopLocation || item.location,
      vendorPremium: vendorUser?.subscription === "premium",
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      location: item.location,
      image: primary,
      primaryImage: primary,
      images: allImages,
      status: item.status,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  } catch (error) {
    console.error("Public menu item error:", error);
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}
