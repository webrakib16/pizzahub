import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function AuthRedirectPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const db = getDb();
  const filter = ObjectId.isValid(userId)
    ? { $or: [{ id: userId }, { _id: new ObjectId(userId) }] }
    : { id: userId };

  const dbUser = await db.collection("user").findOne(filter);
  const role = dbUser?.role || (session.user as { role?: string }).role || "customer";

  if (role === "admin") {
    redirect("/admin/dashboard");
  } else if (role === "vendor") {
    redirect("/vendor/dashboard");
  } else {
    redirect("/");
  }
}
