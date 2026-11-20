import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isValidDeliveryDate } from "@/lib/delivery-date";
import { getDeliveryCharge, priceOrderItems } from "@/lib/order-pricing";
import { createOrder } from "@/lib/orders";
import type { DeliveryLocation } from "@/types/order";

const DELIVERY_LOCATIONS: DeliveryLocation[] = [
  "inside-dhaka",
  "outside-dhaka",
];

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Please sign in to place an order." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  if (typeof body !== "object" || body === null) {
    return badRequest("Invalid request body.");
  }

  const input = body as Record<string, unknown>;

  const fullName =
    typeof input.fullName === "string" ? input.fullName.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const address = typeof input.address === "string" ? input.address.trim() : "";
  const area = typeof input.area === "string" ? input.area.trim() : "";
  const instructions =
    typeof input.instructions === "string" ? input.instructions.trim() : "";
  const deliveryDate =
    typeof input.deliveryDate === "string" ? input.deliveryDate.trim() : "";
  const deliveryLocation = input.deliveryLocation as DeliveryLocation;

  if (!fullName) return badRequest("Full name is required.");
  if (fullName.length > 100) return badRequest("Full name is too long.");

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    return badRequest("Enter a valid phone number.");
  }

  if (!address) return badRequest("Delivery address is required.");
  if (address.length > 300) return badRequest("Delivery address is too long.");

  if (!area) return badRequest("Delivery area is required.");
  if (area.length > 100) return badRequest("Delivery area is too long.");

  if (!DELIVERY_LOCATIONS.includes(deliveryLocation)) {
    return badRequest("Please select a valid delivery location.");
  }

  if (!isValidDeliveryDate(deliveryDate)) {
    return badRequest("Please choose a valid delivery date (today or later).");
  }

  if (instructions.length > 500) {
    return badRequest("Special instructions are too long.");
  }

  const priced = priceOrderItems(input.items);

  if (!priced.ok) {
    return badRequest(priced.error);
  }

  const deliveryCharge = getDeliveryCharge(deliveryLocation);
  const { items, subtotal } = priced.priced;

  const order = await createOrder({
    userId: session.user.id,
    customerName: fullName,
    customerEmail: session.user.email,
    phone,
    items,
    subtotal,
    deliveryCharge,
    totalAmount: subtotal + deliveryCharge,
    deliveryLocation,
    deliveryArea: area,
    deliveryAddress: address,
    deliveryDate,
    instructions,
  });

  return NextResponse.json({ order }, { status: 201 });
}
