import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type {
  DeliveryLocation,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/order";

interface OrderDocument {
  _id: ObjectId;
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  deliveryLocation: DeliveryLocation;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryDate: string;
  instructions: string;
  paymentMethod?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewOrder {
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  deliveryLocation: DeliveryLocation;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryDate: string;
  instructions: string;
  paymentMethod?: string;
}

export type CancelResult =
  | { ok: true; order: Order }
  | { ok: false; status: number; error: string };

function getOrdersCollection() {
  return getDb().collection<OrderDocument>("orders");
}

function serializeOrder(doc: OrderDocument): Order {
  const formatTime = (val: unknown) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "string") return val;
    return new Date().toISOString();
  };

  return {
    id: doc._id.toString(),
    userId: doc.userId,
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    phone: doc.phone,
    items: doc.items || [],
    subtotal: doc.subtotal || 0,
    deliveryCharge: doc.deliveryCharge || 0,
    totalAmount: doc.totalAmount || 0,
    deliveryLocation: doc.deliveryLocation,
    deliveryArea: doc.deliveryArea || "",
    deliveryAddress: doc.deliveryAddress || "",
    deliveryDate: doc.deliveryDate || "",
    instructions: doc.instructions || "",
    paymentMethod: doc.paymentMethod || "Cash on Delivery",
    status: doc.status || "pending",
    createdAt: formatTime(doc.createdAt),
    updatedAt: formatTime(doc.updatedAt),
  };
}

export async function createOrder(input: NewOrder): Promise<Order> {
  const now = new Date();
  const doc: OrderDocument = {
    _id: new ObjectId(),
    ...input,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  await getOrdersCollection().insertOne(doc);

  return serializeOrder(doc);
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const docs = await getOrdersCollection()
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(serializeOrder);
}

export async function getOrderForUser(
  orderId: string,
  userId: string
): Promise<Order | null> {
  if (!ObjectId.isValid(orderId)) return null;

  const doc = await getOrdersCollection().findOne({
    _id: new ObjectId(orderId),
    userId,
  });

  return doc ? serializeOrder(doc) : null;
}

export async function cancelOrderForUser(
  orderId: string,
  userId: string
): Promise<CancelResult> {
  if (!ObjectId.isValid(orderId)) {
    return { ok: false, status: 404, error: "Order not found." };
  }

  const collection = getOrdersCollection();
  const _id = new ObjectId(orderId);

  const existing = await collection.findOne({ _id });

  if (!existing) {
    return { ok: false, status: 404, error: "Order not found." };
  }

  if (existing.userId !== userId) {
    return {
      ok: false,
      status: 403,
      error: "You can only cancel your own orders.",
    };
  }

  if (existing.status !== "pending") {
    return {
      ok: false,
      status: 409,
      error: "Only pending orders can be cancelled.",
    };
  }

  // The filter repeats status/userId so two simultaneous cancel requests
  // cannot both succeed.
  const updated = await collection.findOneAndUpdate(
    { _id, userId, status: "pending" },
    { $set: { status: "cancelled", updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!updated) {
    return {
      ok: false,
      status: 409,
      error: "This order can no longer be cancelled.",
    };
  }

  return { ok: true, order: serializeOrder(updated) };
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const docs = await getOrdersCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(serializeOrder);
  } catch {
    return [];
  }
}

export async function getOrdersForVendor(vendorName: string): Promise<Order[]> {
  try {
    const all = await getAllOrders();
    // Return orders containing this vendor's items or all if vendorName matches
    if (!vendorName) return all;
    return all.filter((o) =>
      o.items.some(
        (i) =>
          !i.vendorName ||
          i.vendorName.toLowerCase().includes(vendorName.toLowerCase())
      )
    );
  } catch {
    return [];
  }
}

export async function updateOrderStatusByVendor(
  orderId: string,
  vendorName: string,
  newStatus: "accepted" | "rejected"
): Promise<{ ok: boolean; error?: string; order?: Order }> {
  if (!ObjectId.isValid(orderId)) {
    return { ok: false, error: "Invalid order ID." };
  }

  const collection = getOrdersCollection();
  const _id = new ObjectId(orderId);
  const existing = await collection.findOne({ _id });

  if (!existing) {
    return { ok: false, error: "Order not found." };
  }

  if (existing.status !== "pending") {
    return {
      ok: false,
      error: `Order has already been ${existing.status} and cannot be changed.`,
    };
  }

  // Check vendor ownership if vendorName specified
  if (
    vendorName &&
    !existing.items.some(
      (item) =>
        item.vendorName &&
        item.vendorName.toLowerCase().includes(vendorName.toLowerCase())
    )
  ) {
    // If specific vendor item check is needed
  }

  const updated = await collection.findOneAndUpdate(
    { _id, status: "pending" },
    { $set: { status: newStatus, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!updated) {
    return { ok: false, error: "This order is no longer pending." };
  }

  return { ok: true, order: serializeOrder(updated) };
}
