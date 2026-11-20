import { requireAdmin } from "@/lib/session";
import { getAllMenuItemsForAdmin } from "@/lib/menu-items";
import AdminMenuList from "./AdminMenuList";

export default async function AdminMenuPage() {
  await requireAdmin();
  const items = await getAllMenuItemsForAdmin();

  const pending = items.filter((i) => i.status === "pending").length;
  const approved = items.filter((i) => i.status === "approved").length;
  const rejected = items.filter((i) => i.status === "rejected").length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Platform Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Manage Menu Items
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Review submitted items. Approve, reject, or delete inappropriate content.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending Review", value: pending, color: "text-amber-400 border-amber-500/25 bg-amber-500/10" },
          { label: "Approved", value: approved, color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10" },
          { label: "Rejected", value: rejected, color: "text-red-400 border-red-500/25 bg-red-500/10" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border ${s.color} p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminMenuList initialItems={items} />
    </div>
  );
}
