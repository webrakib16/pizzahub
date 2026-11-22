import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Transaction {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  plan: string;
  amount: number;
  status: "success" | "failed" | "pending";
  stripeSessionId: string;
  receiptId: string;
  createdAt: string;
}

interface TransactionDocument {
  _id: ObjectId;
  vendorId: string;
  vendorName?: string;
  vendorEmail?: string;
  plan?: string;
  amount: number;
  status?: "success" | "failed" | "pending";
  stripeSessionId?: string;
  receiptId?: string;
  createdAt: Date | string;
}

function getCollection() {
  return getDb().collection<TransactionDocument>("transactions");
}

function serialize(doc: TransactionDocument): Transaction {
  const parseDate = (d: unknown): string => {
    if (d instanceof Date) return d.toISOString();
    if (typeof d === "string") return d;
    return new Date().toISOString();
  };

  const hex = doc._id.toString();
  const receipt = doc.receiptId || `#PZ-${hex.slice(-6).toUpperCase()}`;

  return {
    id: hex,
    vendorId: doc.vendorId,
    vendorName: doc.vendorName || "Vendor",
    vendorEmail: doc.vendorEmail || "—",
    plan: doc.plan || "Premium",
    amount: Number(doc.amount) || 499,
    status: doc.status || "success",
    stripeSessionId: doc.stripeSessionId || "",
    receiptId: receipt,
    createdAt: parseDate(doc.createdAt),
  };
}

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const docs = await getCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(serialize);
  } catch {
    return [];
  }
}
