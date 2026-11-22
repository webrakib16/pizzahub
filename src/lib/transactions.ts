import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Transaction {
  id: string;
  vendorId: string;
  vendorName: string;
  plan: string;
  amount: number;
  status: "success" | "failed" | "pending";
  createdAt: string;
}

interface TransactionDocument {
  _id: ObjectId;
  vendorId: string;
  vendorName: string;
  plan: string;
  amount: number;
  status: "success" | "failed" | "pending";
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

  return {
    id: doc._id.toString(),
    vendorId: doc.vendorId,
    vendorName: doc.vendorName || "Vendor",
    plan: doc.plan || "Premium",
    amount: Number(doc.amount) || 499,
    status: doc.status || "success",
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
