import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function AuthRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { callbackUrl } = await searchParams;

  const userId = session.user.id;
  const db = getDb();
  const filter = ObjectId.isValid(userId)
    ? { $or: [{ id: userId }, { _id: new ObjectId(userId) }] }
    : { id: userId };

  const dbUser = await db.collection("user").findOne(filter);
  const role = dbUser?.role || (session.user as { role?: string }).role || "customer";

  // If a valid callbackUrl exists (e.g. /menu/[id]), redirect back to it
  if (callbackUrl && callbackUrl.startsWith("/")) {
    redirect(callbackUrl);
  }

  if (role === "admin") {
    redirect("/admin/dashboard");
  } else if (role === "vendor") {
    redirect("/vendor/dashboard");
  } else {
    redirect("/");
  }
}
