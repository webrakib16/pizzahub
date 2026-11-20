import { requireVendor } from "@/lib/session";
import { getOrdersForVendor } from "@/lib/orders";
import VendorOrdersList from "./VendorOrdersList";

export default async function VendorOrdersPage() {
  const user = await requireVendor();
  const vendorName = user.name ?? "";
  const orders = await getOrdersForVendor(vendorName);

  const pending = orders.filter((o) => o.status === "pending").length;
  const accepted = orders.filter((o) => o.status === "accepted").length;
  const rejected = orders.filter((o) => o.status === "rejected").length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Restaurant Management
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Customer Orders
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Accept or reject pending orders from your customers.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: pending, color: "text-amber-400 border-amber-500/25 bg-amber-500/10" },
          { label: "Accepted", value: accepted, color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10" },
          { label: "Rejected", value: rejected, color: "text-red-400 border-red-500/25 bg-red-500/10" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.color} p-4 text-center`}
          >
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <VendorOrdersList initialOrders={orders} />
    </div>
  );
}
