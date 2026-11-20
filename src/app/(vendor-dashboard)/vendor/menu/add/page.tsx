import { requireVendor } from "@/lib/session";
import { getActiveVendorCount } from "@/lib/menu-items";
import AddMenuItemForm from "./AddMenuItemForm";

export default async function AddMenuItemPage() {
  const user = await requireVendor();
  const activeCount = await getActiveVendorCount(user.id);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Restaurant Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Add Menu Item
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Fill in the details below. Your item will be reviewed by the admin before going live.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl sm:p-8">
        <AddMenuItemForm activeCount={activeCount} />
      </div>
    </div>
  );
}
