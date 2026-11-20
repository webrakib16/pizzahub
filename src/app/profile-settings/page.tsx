import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function ProfileSettingsRedirect() {
  const session = await getSession();
  const role = session?.user?.role;

  if (role === "vendor") {
    redirect("/vendor/profile");
  }

  if (role === "admin") {
    redirect("/admin/profile");
  }

  // Customers and visitors default to customer profile
  redirect("/profile");
}
