import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type Role = "admin" | "vendor" | "customer";

export interface ProtectedUser {
  id: string;
  name?: string;
  email: string;
  role: Role;
  blocked: boolean;
}

/**
 * Server-Side Route Protection Proxy
 *
 * Implements strict platform rules:
 * 1. All dashboard routes are protected.
 * 2. Role verification is done on the server (hiding frontend links is not enough).
 * 3. Only Admin can open Admin Dashboard, only Vendors the Vendor Dashboard, only Customers the Customer Dashboard.
 * 4. Unauthenticated users are redirected to Sign In (/sign-in).
 * 5. Blocked users must not access protected platform features (redirected to /sign-in?error=blocked).
 */
export async function proxyAuthGuard(allowedRoles?: Role[]): Promise<ProtectedUser> {
  // 1. Check active session (server-side)
  const session = await getSession();

  // Rule: Unauthenticated users are redirected to Sign In
  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const db = getDb();

  // Rule: Blocked users must not access protected platform features
  // Always query real-time MongoDB status to immediately catch users blocked while logged in
  const userFilter = ObjectId.isValid(userId)
    ? { $or: [{ id: userId }, { _id: new ObjectId(userId) }] }
    : { id: userId };

  const dbUser = await db.collection("user").findOne(userFilter);

  // If user is marked blocked in database, reject access immediately
  if (dbUser?.blocked === true) {
    redirect("/sign-in?error=blocked");
  }

  // Determine confirmed server role
  const rawRole = dbUser?.role || (session.user as { role?: string }).role || "customer";
  const role: Role = rawRole === "admin" || rawRole === "vendor" ? rawRole : "customer";

  // Rule: Role verification must also be done on the server.
  // Cross-dashboard protection: redirect user to their own respective dashboard if accessing an unauthorized dashboard.
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "admin") {
      redirect("/admin/dashboard");
    } else if (role === "vendor") {
      redirect("/vendor/dashboard");
    } else {
      redirect("/dashboard");
    }
  }

  return {
    id: userId,
    name: dbUser?.name || session.user.name,
    email: dbUser?.email || session.user.email,
    role,
    blocked: false,
  };
}

/**
 * Customer Dashboard Guard:
 * Only Customers can access. Vendors & Admins are redirected to their dashboards.
 * Unauthenticated redirected to /sign-in, blocked users redirected to /sign-in?error=blocked.
 */
export async function proxyCustomerGuard(): Promise<ProtectedUser> {
  return proxyAuthGuard(["customer"]);
}

/**
 * Vendor Dashboard Guard:
 * Only Vendors can access. Customers & Admins are redirected.
 * Unauthenticated redirected to /sign-in, blocked users redirected to /sign-in?error=blocked.
 */
export async function proxyVendorGuard(): Promise<ProtectedUser> {
  return proxyAuthGuard(["vendor"]);
}

/**
 * Admin Dashboard Guard:
 * Only Admins can access. Non-admins redirected to their dashboards.
 * Unauthenticated redirected to /sign-in, blocked users redirected to /sign-in?error=blocked.
 */
export async function proxyAdminGuard(): Promise<ProtectedUser> {
  return proxyAuthGuard(["admin"]);
}
