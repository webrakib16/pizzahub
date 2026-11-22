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
  let session = null;
  let id = "";

  try {
    const resolvedParams = await params;
    id = resolvedParams?.id || "";
    session = await getSession();
  } catch (err) {
    console.error("[MenuItemLayout] Error retrieving session/params:", err);
  }

  // Rule: Item Details (/menu/[id]) is private; redirect to Sign In if not logged in
  if (!session?.user) {
    const targetUrl = id ? `/menu/${id}` : "/menu";
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(targetUrl)}`);
  }

  // Rule: Blocked users must not access protected platform features
  try {
    const userId = session.user.id;
    const db = getDb();
    const userFilter = ObjectId.isValid(userId)
      ? { $or: [{ id: userId }, { _id: new ObjectId(userId) }] }
      : { id: userId };

    const dbUser = await db.collection("user").findOne(userFilter);
    if (dbUser?.blocked === true) {
      redirect("/sign-in?error=blocked");
    }
  } catch (dbErr) {
    console.error("[MenuItemLayout] Error checking blocked status:", dbErr);
  }

  return <>{children}</>;
}
