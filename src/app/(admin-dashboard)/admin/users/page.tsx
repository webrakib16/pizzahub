import { requireAdmin } from "@/lib/session";
import { getAllUsers } from "@/lib/users";
import AdminUsersList from "./AdminUsersList";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAllUsers();

  const totalVendors = users.filter((u) => u.role === "vendor").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const blocked = users.filter((u) => u.blocked).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Platform Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          View, search, and block / unblock registered users.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Customers", value: totalCustomers, color: "text-zinc-300 border-zinc-500/25 bg-zinc-500/10" },
          { label: "Vendors", value: totalVendors, color: "text-blue-400 border-blue-500/25 bg-blue-500/10" },
          { label: "Blocked", value: blocked, color: "text-red-400 border-red-500/25 bg-red-500/10" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border ${s.color} p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminUsersList initialUsers={users} />
    </div>
  );
}
