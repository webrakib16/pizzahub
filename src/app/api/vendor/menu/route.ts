import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getVendorMenuItems, createMenuItem } from "@/lib/menu-items";
import { getVendorShop, isShopProfileComplete } from "@/lib/vendor-shops";

// GET /api/vendor/menu — list vendor's own items
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getVendorMenuItems(user.id);
  return NextResponse.json(items);
}

// POST /api/vendor/menu — create a new menu item
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Shop profile gate: vendor must complete their shop profile first
  const hasShopProfile = await isShopProfileComplete(user.id);
  if (!hasShopProfile) {
    return NextResponse.json(
      { error: "Complete your shop profile before adding menu items" },
      { status: 400 }
    );
  }

  const shop = await getVendorShop(user.id);
  const vendorShopName = shop?.shopName || user.name || "Pizza Hub Partner";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, category, description, price, location, image, primaryImage, images } =
    body as Record<string, unknown>;

  const resolvedImages = Array.isArray(images) && images.length > 0
    ? (images as unknown[]).map(String).filter((url) => Boolean(url.trim()))
    : [];

  const resolvedPrimary = String(
    primaryImage || image || resolvedImages[0] || ""
  ).trim();

  // Ensure primary image is at the front of images list if not already
  const finalImages = resolvedImages.length > 0
    ? [resolvedPrimary, ...resolvedImages.filter((img) => img !== resolvedPrimary)]
    : [resolvedPrimary];

  if (!name || !category || !description || !price || !location || !resolvedPrimary) {
    return NextResponse.json(
      { error: "All fields are required: name, category, description, price, location, and at least one image" },
      { status: 400 }
    );
  }

  if (typeof price !== "number" || price <= 0) {
    return NextResponse.json(
      { error: "Price must be a positive number" },
      { status: 400 }
    );
  }

  const result = await createMenuItem(
    user.id,
    vendorShopName,
    {
      name: String(name),
      category: String(category),
      description: String(description),
      price: Number(price),
      location: String(location),
      primaryImage: resolvedPrimary,
      image: resolvedPrimary,
      images: finalImages,
    },
    false
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.item, { status: 201 });
}
