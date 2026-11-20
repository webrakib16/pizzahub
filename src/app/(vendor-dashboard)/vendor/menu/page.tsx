import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { requireVendor } from "@/lib/session";
import { getVendorMenuItems, getActiveVendorCount } from "@/lib/menu-items";
import VendorMenuList from "./VendorMenuList";

export default async function VendorMenuPage() {
  const user = await requireVendor();
  const [items, activeCount] = await Promise.all([
    getVendorMenuItems(user.id),
    getActiveVendorCount(user.id),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Restaurant Management
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            My Menu Items
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your pizzas, active availability, and approval status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/vendor/menu/add"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all cursor-pointer"
          >
            <PlusCircle className="size-4" />
            Add Menu Item
          </Link>
        </div>
      </div>

      {/* ── Active Limit Indicator ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#141416] px-5 py-3.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300">Free Tier Limit:</span>
          <span className="font-bold text-orange-400">
            {activeCount} of 3 active items published
          </span>
        </div>
        {activeCount >= 3 && (
          <Link
            href="/vendor/subscription"
            className="font-bold text-orange-400 hover:text-orange-300 underline underline-offset-2"
          >
            Upgrade to Premium for unlimited items →
          </Link>
        )}
      </div>

      {/* ── Menu Items Table / Cards ── */}
      <VendorMenuList initialItems={items} />
    </div>
  );
}
