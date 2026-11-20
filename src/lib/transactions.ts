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
  createdAt: Date;
}

function getCollection() {
  return getDb().collection<TransactionDocument>("transactions");
}

function serialize(doc: TransactionDocument): Transaction {
  return {
    id: doc._id.toString(),
    vendorId: doc.vendorId,
    vendorName: doc.vendorName,
    plan: doc.plan,
    amount: doc.amount,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
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
