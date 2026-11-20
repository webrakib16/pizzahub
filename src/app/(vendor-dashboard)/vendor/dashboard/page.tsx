import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { requireVendor } from "@/lib/session";
import { getVendorMenuItems } from "@/lib/menu-items";
import { getOrdersForVendor } from "@/lib/orders";
import OrderStatusBadge from "@/components/dashboard/shared/OrderStatusBadge";
import { shortOrderId, formatOrderDateTime } from "@/lib/order-format";

export default async function VendorOverviewPage() {
  const user = await requireVendor();
  const vendorName = user.name || "Vendor";

  const [items, orders] = await Promise.all([
    getVendorMenuItems(user.id),
    getOrdersForVendor(vendorName),
  ]);

  const totalMenuItems = items.length;
  const activeMenuItems = items.filter((i) => i.isActive).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const acceptedOrders = orders.filter((o) => o.status === "accepted").length;
  const subscriptionPlan = "Free"; // Free / Premium

  const STATS = [
    {
      label: "Total Menu Items",
      value: totalMenuItems,
      icon: UtensilsCrossed,
      accent: "text-orange-400 border-orange-500/25 bg-orange-500/10",
    },
    {
      label: "Active Menu Items",
      value: activeMenuItems,
      sub: `${activeMenuItems} / 3 Free limit`,
      icon: CheckCircle2,
      accent: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      accent: "text-amber-400 border-amber-500/25 bg-amber-500/10",
    },
    {
      label: "Accepted Orders",
      value: acceptedOrders,
      icon: ShoppingBag,
      accent: "text-blue-400 border-blue-500/25 bg-blue-500/10",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Restaurant Portal
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Vendor Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Welcome back, <span className="text-white font-semibold">{vendorName}</span>. Manage your menu and incoming orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/vendor/menu/add"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all cursor-pointer"
          >
            <PlusCircle className="size-4" />
            Add Menu Item
          </Link>
        </div>
      </div>

      {/* ── Subscription Banner ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-[#141416] to-[#141416] p-5 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/20 text-orange-400">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Current Plan: {subscriptionPlan} Tier</h2>
              <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-black text-orange-400 uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Publish up to 3 active menu items. Upgrade to Premium for unlimited items & homepage spotlight.
            </p>
          </div>
        </div>
        <Link
          href="/vendor/subscription"
          className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-colors"
        >
          <span>Upgrade to Premium</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-[#141416] p-4 shadow-lg sm:p-5"
          >
            <div className={`flex size-9 items-center justify-center rounded-xl border ${stat.accent}`}>
              <stat.icon className="size-4" />
            </div>
            <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-zinc-400">
              {stat.label}
            </p>
            {stat.sub && (
              <p className="mt-1 text-[11px] font-medium text-orange-400">
                {stat.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Recent Customer Orders ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141416] shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-white">Recent Customer Orders</h2>
            <p className="text-xs text-zinc-400">Manage incoming orders for your pizzas</p>
          </div>
          <Link
            href="/vendor/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <ShoppingBag className="mx-auto size-10 text-zinc-600" />
            <p className="mt-3 text-sm font-semibold text-white">No orders yet</p>
            <p className="text-xs text-zinc-400 mt-1">Customer orders for your restaurant will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6 hover:bg-white/[0.02] transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    Order #{shortOrderId(order.id)}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {order.customerName} · {order.items.length} items · ৳{order.totalAmount.toLocaleString()} · {formatOrderDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <Link
                    href="/vendor/orders"
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white"
                  >
                    Manage
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
