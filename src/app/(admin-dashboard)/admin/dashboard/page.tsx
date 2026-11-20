import {
  CheckCircle2,
  Clock,
  Receipt,
  ShieldCheck,
  Store,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getAllUsers } from "@/lib/users";
import { getAllMenuItemsForAdmin } from "@/lib/menu-items";
import { getAllOrders } from "@/lib/orders";
import { getAllTransactions } from "@/lib/transactions";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [users, menuItems, orders, transactions] = await Promise.all([
    getAllUsers(),
    getAllMenuItemsForAdmin(),
    getAllOrders(),
    getAllTransactions(),
  ]);

  const totalUsers = users.length;
  const totalVendors = users.filter((u) => u.role === "vendor").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const totalMenuItems = menuItems.length;
  const pendingMenuItems = menuItems.filter((i) => i.status === "pending").length;
  const totalTransactions = transactions.length;

  const STATS = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      accent: "text-blue-400 border-blue-500/25 bg-blue-500/10",
    },
    {
      label: "Vendors",
      value: totalVendors,
      icon: Store,
      accent: "text-orange-400 border-orange-500/25 bg-orange-500/10",
    },
    {
      label: "Customers",
      value: totalCustomers,
      icon: ShieldCheck,
      accent: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
    },
    {
      label: "Total Menu Items",
      value: totalMenuItems,
      icon: UtensilsCrossed,
      accent: "text-purple-400 border-purple-500/25 bg-purple-500/10",
    },
    {
      label: "Pending Review",
      value: pendingMenuItems,
      icon: Clock,
      accent: "text-amber-400 border-amber-500/25 bg-amber-500/10",
    },
    {
      label: "Transactions",
      value: totalTransactions,
      icon: Receipt,
      accent: "text-cyan-400 border-cyan-500/25 bg-cyan-500/10",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Platform Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Overview of the entire PizzaHub platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-[#141416] p-4 shadow-lg"
          >
            <div
              className={`flex size-9 items-center justify-center rounded-xl border ${stat.accent}`}
            >
              <stat.icon className="size-4" />
            </div>
            <p className="mt-3 text-2xl font-black text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-3xl border border-white/10 bg-[#141416] shadow-xl">
        <div className="border-b border-white/5 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-white">Recent Platform Orders</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Latest orders across all vendors</p>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-500">No orders yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
              >
                <div>
                  <p className="text-sm font-bold text-white">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {order.items.length} items · ৳{order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                      order.status === "pending"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : order.status === "accepted"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : order.status === "rejected"
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                    }`}
                  >
                    {order.status === "accepted" && <CheckCircle2 className="size-3" />}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
