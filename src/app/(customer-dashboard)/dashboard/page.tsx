import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOrdersForUser } from "@/lib/orders";
import { formatOrderDateTime, shortOrderId } from "@/lib/order-format";
import OrderStatusBadge from "@/components/dashboard/shared/OrderStatusBadge";

const STATS = [
  {
    key: "total",
    label: "Total Orders",
    icon: ShoppingBag,
    accent: "text-orange-400 border-orange-500/25 bg-orange-500/10",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    accent: "text-amber-400 border-amber-500/25 bg-amber-500/10",
  },
  {
    key: "accepted",
    label: "Accepted",
    icon: CheckCircle2,
    accent: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    accent: "text-red-400 border-red-500/25 bg-red-500/10",
  },
] as const;

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const orders = await getOrdersForUser(user.id);

  const counts = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    accepted: orders.filter((order) => order.status === "accepted").length,
    rejected: orders.filter((order) => order.status === "rejected").length,
  };

  const recentOrders = orders.slice(0, 5);
  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          My Account
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Welcome back, {firstName}. Here is a summary of your PizzaHub orders.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-white/10 bg-[#141416] p-4 shadow-lg sm:p-5"
          >
            <div
              className={`flex size-9 items-center justify-center rounded-xl border ${stat.accent}`}
            >
              <stat.icon className="size-4" />
            </div>
            <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {counts[stat.key]}
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#141416] shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-white">Recent Orders</h2>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 transition-colors hover:text-orange-300"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-orange-500/25 bg-orange-500/15 text-orange-500">
              <ShoppingBag className="size-6" />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Your placed orders will show up here.
            </p>
            <Link
              href="/menu"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-95 active:scale-[0.99]"
            >
              Browse Menu
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03] sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">
                      Order #{shortOrderId(order.id)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-zinc-400">
                      {order.items.length} item
                      {order.items.length === 1 ? "" : "s"} · ৳
                      {order.totalAmount.toLocaleString("en-US")} ·{" "}
                      {formatOrderDateTime(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
