import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  proxyAuthGuard,
  proxyCustomerGuard,
  proxyVendorGuard,
  proxyAdminGuard,
} from "@/lib/proxy";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Server-side guard for dashboard pages.
 * Enforces unauthenticated -> /sign-in and blocked -> /sign-in?error=blocked.
 */
export async function requireUser() {
  return proxyAuthGuard();
}

/**
 * Guard for Customer Dashboard:
 * Only Customers can access. Redirects Vendors and Admins to their respective dashboards.
 */
export async function requireCustomer() {
  return proxyCustomerGuard();
}

/**
 * Guard for Vendor Dashboard:
 * Only Vendors can access.
 */
export async function requireVendor() {
  return proxyVendorGuard();
}

/**
 * Guard for Admin Dashboard:
 * Only Admins can access.
 */
export async function requireAdmin() {
  return proxyAdminGuard();
}
