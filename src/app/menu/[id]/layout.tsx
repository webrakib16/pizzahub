import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function MenuItemLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  // Rule: Item Details (/menu/[id]) is private; redirect to Sign In if not logged in
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${id}`)}`);
  }

  // Rule: Blocked users must not access protected platform features
  const userId = session.user.id;
  const db = getDb();
  const userFilter = ObjectId.isValid(userId)
    ? { $or: [{ id: userId }, { _id: new ObjectId(userId) }] }
    : { id: userId };

  const dbUser = await db.collection("user").findOne(userFilter);
  if (dbUser?.blocked === true) {
    redirect("/sign-in?error=blocked");
  }

  return <>{children}</>;
}
