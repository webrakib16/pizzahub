import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getVendorShop,
  createVendorShop,
  updateVendorShop,
} from "@/lib/vendor-shops";

// GET /api/vendor/shop — return current vendor's shop profile
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = await getVendorShop(user.id);
  if (!shop) {
    return NextResponse.json({ error: "Shop profile not found" }, { status: 404 });
  }

  return NextResponse.json(shop);
}

// POST /api/vendor/shop — create shop profile (initial setup)
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createVendorShop(user.id, {
    shopName: String(body.shopName || ""),
    shopBio: String(body.shopBio || ""),
    shopLogo: body.shopLogo ? String(body.shopLogo) : undefined,
    shopLocation: String(body.shopLocation || ""),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.shop, { status: 201 });
}

// PATCH /api/vendor/shop — update shop profile
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await updateVendorShop(user.id, {
    shopName: body.shopName !== undefined ? String(body.shopName) : undefined,
    shopBio: body.shopBio !== undefined ? String(body.shopBio) : undefined,
    shopLogo: body.shopLogo !== undefined ? String(body.shopLogo) : undefined,
    shopLocation: body.shopLocation !== undefined ? String(body.shopLocation) : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.shop);
}
