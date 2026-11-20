import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Server-side guard for dashboard pages. Redirects signed-out visitors to
 * the sign-in page and returns the current user otherwise.
 */
export async function requireUser() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
}

/**
 * Guard for Customer Dashboard. Redirects vendors and admins to their
 * respective dashboards.
 */
export async function requireCustomer() {
  const user = await requireUser();

  if (user.role === "vendor") {
    redirect("/vendor/dashboard");
  }

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  }

  return user;
}

/**
 * Guard for Vendor Dashboard. Only vendors and admins may enter.
 */
export async function requireVendor() {
  const user = await requireUser();

  if (user.role !== "vendor" && user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

/**
 * Guard for Admin Dashboard. Only admins may enter.
 */
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}
