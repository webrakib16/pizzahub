import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

// GET /api/menu/public — List approved and active menu items
// Supports query params: limit, category, location, exclude, search, sort
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const exclude = searchParams.get("exclude");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    const query: Record<string, unknown> = {
      status: "approved",
      isActive: true,
    };

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (location && location !== "all") {
      query.location = { $regex: location, $options: "i" };
    }

    if (exclude) {
      if (ObjectId.isValid(exclude)) {
        query._id = { $nin: [new ObjectId(exclude), String(exclude)] };
      } else {
        query._id = { $ne: String(exclude) };
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price-low") sortOptions = { price: 1 };
    else if (sort === "price-high") sortOptions = { price: -1 };
    else if (sort === "oldest") sortOptions = { createdAt: 1 };

    const db = getDb();
    let cursor = db.collection("menuItems").find(query).sort(sortOptions);

    if (limit && !isNaN(Number(limit))) {
      cursor = cursor.limit(Number(limit));
    }

    const items = await cursor.toArray();

    return NextResponse.json(
      items.map((item) => ({
        id: item._id.toString(),
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        location: item.location,
        image: item.primaryImage || item.image,
        primaryImage: item.primaryImage || item.image,
        images: item.images?.length ? item.images : [item.primaryImage || item.image],
        status: item.status,
        isActive: item.isActive,
        createdAt: item.createdAt,
      }))
    );
  } catch (error) {
    console.error("Public menu fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}
