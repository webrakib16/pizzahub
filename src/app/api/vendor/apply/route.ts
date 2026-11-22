import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createVendorShop, updateVendorShop } from "@/lib/vendor-shops";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in before applying." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const restaurantName = String(body.restaurantName || "").trim();
    const city = String(body.city || "Dhaka").trim();
    const specialty = String(body.specialty || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (!restaurantName) {
      return NextResponse.json(
        { error: "Restaurant name is required." },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const db = getDb();

    // 1. Upgrade user role to "vendor" in the user collection
    const userFilter = ObjectId.isValid(userId)
      ? { $or: [{ id: userId }, { _id: new ObjectId(userId) }] }
      : { id: userId };

    await db.collection("user").updateOne(userFilter, {
      $set: {
        role: "vendor",
        phone: phone || undefined,
        updatedAt: new Date(),
      },
    });

    // 2. Create or update vendorShops collection
    const existing = await db
      .collection("vendorShops")
      .findOne({ vendorId: String(userId) });

    const shopBio = message || `${specialty} restaurant located in ${city}.`;

    if (existing) {
      await updateVendorShop(userId, {
        shopName: restaurantName,
        shopBio,
        shopLocation: city,
      });
    } else {
      await createVendorShop(userId, {
        shopName: restaurantName,
        shopBio,
        shopLocation: city,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Congratulations! Your account has been upgraded to Vendor.",
      redirectUrl: "/vendor/dashboard",
    });
  } catch (error) {
    console.error("Error upgrading to vendor:", error);
    return NextResponse.json(
      { error: "Failed to submit partnership application. Please try again." },
      { status: 500 }
    );
  }
}
