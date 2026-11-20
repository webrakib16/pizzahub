import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  blocked?: boolean;
  createdAt?: Date;
  image?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
  createdAt: string;
  image?: string;
}

function getUsersCollection() {
  return getDb().collection<UserDocument>("user");
}

function serialize(doc: UserDocument): AppUser {
  return {
    id: doc._id.toString(),
    name: doc.name ?? "",
    email: doc.email ?? "",
    role: doc.role ?? "customer",
    blocked: doc.blocked ?? false,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date(0).toISOString(),
    image: doc.image,
  };
}

export async function getAllUsers(): Promise<AppUser[]> {
  try {
    const docs = await getUsersCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(serialize);
  } catch {
    return [];
  }
}

export async function setUserBlocked(
  userId: string,
  blocked: boolean
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(userId)) {
      return { ok: false, error: "Invalid user ID." };
    }

    const res = await getUsersCollection().updateOne(
      { _id: new ObjectId(userId) },
      { $set: { blocked } }
    );

    return { ok: res.matchedCount > 0 };
  } catch {
    return { ok: false, error: "Failed to update user." };
  }
}

export async function updateUserImage(
  userId: string,
  image: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(userId)) {
      return { ok: false, error: "Invalid user ID." };
    }

    const res = await getUsersCollection().updateOne(
      { _id: new ObjectId(userId) },
      { $set: { image } }
    );

    return { ok: res.matchedCount > 0 };
  } catch {
    return { ok: false, error: "Failed to update profile image." };
  }
}

