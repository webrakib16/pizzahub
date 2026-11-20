import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getVendorMenuItems, createMenuItem } from "@/lib/menu-items";

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, category, description, price, location, image } =
    body as Record<string, unknown>;

  if (!name || !category || !description || !price || !location || !image) {
    return NextResponse.json(
      { error: "All fields are required: name, category, description, price, location, image" },
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
    user.name ?? "Unknown Vendor",
    {
      name: String(name),
      category: String(category),
      description: String(description),
      price: Number(price),
      location: String(location),
      image: String(image),
    },
    false
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.item, { status: 201 });
}
