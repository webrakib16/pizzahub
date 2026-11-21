import { redirect } from "next/navigation";
import { requireVendor } from "@/lib/session";
import { getActiveVendorCount } from "@/lib/menu-items";
import { isShopProfileComplete } from "@/lib/vendor-shops";
import { isVendorPremium } from "@/lib/vendor-premium";
import AddMenuItemForm from "./AddMenuItemForm";

export default async function AddMenuItemPage() {
  const user = await requireVendor();

  // Shop Profile Gate: Vendor must complete their shop profile before adding menu items
  const hasShopProfile = await isShopProfileComplete(user.id);
  if (!hasShopProfile) {
    redirect("/vendor/profile?complete_shop=true");
  }

  const isPremium = await isVendorPremium(user.id);
  const activeCount = await getActiveVendorCount(user.id);

  // Free plan: max 3 active items — if not Premium, redirect to subscription
  if (!isPremium && activeCount >= 3) {
    redirect("/vendor/subscription");
  }

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
        <AddMenuItemForm activeCount={activeCount} isPremium={isPremium} />
      </div>
    </div>
  );
}
