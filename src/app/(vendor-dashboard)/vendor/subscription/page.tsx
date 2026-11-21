import Link from "next/link";
import { Check, Sparkles, Star, Zap, Crown } from "lucide-react";
import { requireVendor } from "@/lib/session";
import { isVendorPremium } from "@/lib/vendor-premium";
import UpgradeToPremiumButton from "./UpgradeToPremiumButton";

const FREE_FEATURES = [
  "Publish up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management (accept / reject)",
  "Customer order tracking",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge on your profile",
  "Featured placement on the homepage",
  "Priority admin review for new items",
  "All Free plan features",
];

export default async function VendorSubscriptionPage() {
  const user = await requireVendor();
  const isPremium = await isVendorPremium(user.id);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Restaurant Management
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          Choose Your Plan
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Start free and upgrade when you&apos;re ready to grow your pizza business.
        </p>

        {isPremium && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400">
            <Crown className="size-3.5 text-orange-400" />
            <span>Active Subscription: Premium Vendor Plan</span>
          </div>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Free Plan */}
        <div
          className={`flex flex-col rounded-3xl border ${
            !isPremium ? "border-white/20 bg-[#141416]" : "border-white/5 bg-[#141416]/50 opacity-80"
          } p-6 shadow-xl`}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-zinc-400">
              <Zap className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Free</h2>
              <p className="text-xs text-zinc-400">
                {!isPremium ? "Current plan" : "Basic tier"}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <span className="text-3xl font-black text-white">৳0</span>
            <span className="text-sm text-zinc-400 ml-1">/ month</span>
          </div>

          <ul className="space-y-3 flex-1">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <Check className="size-3.5 shrink-0 text-emerald-400 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-full border border-white/10 bg-zinc-900 py-2.5 text-center text-xs font-bold text-zinc-400">
            {!isPremium ? "Current Plan" : "Included"}
          </div>
        </div>

        {/* Premium Plan */}
        <div
          className={`relative flex flex-col rounded-3xl border ${
            isPremium
              ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-[#141416] to-[#141416] shadow-emerald-950/30"
              : "border-orange-500/40 bg-gradient-to-b from-orange-500/10 via-[#141416] to-[#141416] shadow-orange-950/30"
          } p-6 shadow-2xl`}
        >
          {/* Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black text-white shadow-lg ${
                isPremium
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                  : "bg-gradient-to-r from-red-600 to-orange-500"
              }`}
            >
              {isPremium ? <Check className="size-2.5" /> : <Star className="size-2.5" />}
              {isPremium ? "CURRENT PLAN" : "RECOMMENDED"}
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-5 mt-2">
            <div
              className={`flex size-10 items-center justify-center rounded-2xl border ${
                isPremium
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                  : "border-orange-500/40 bg-orange-500/20 text-orange-400"
              }`}
            >
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Premium</h2>
              <p
                className={`text-xs font-semibold ${
                  isPremium ? "text-emerald-400" : "text-orange-400"
                }`}
              >
                Unlimited growth
              </p>
            </div>
          </div>

          <div className="mb-5">
            <span className="text-3xl font-black text-white">৳499</span>
            <span className="text-sm text-zinc-400 ml-1">/ month</span>
          </div>

          <ul className="space-y-3 flex-1">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-xs text-zinc-200">
                <Check
                  className={`size-3.5 shrink-0 mt-0.5 ${
                    isPremium ? "text-emerald-400" : "text-orange-400"
                  }`}
                />
                {feature}
              </li>
            ))}
          </ul>

          <UpgradeToPremiumButton isPremium={isPremium} />

          {isPremium ? (
            <Link
              href="/vendor/menu/add"
              className="mt-3 block text-center text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Publish new items →
            </Link>
          ) : (
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              Secured with Stripe Checkout. Cancel anytime.
            </p>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="rounded-3xl border border-white/10 bg-[#141416] overflow-hidden shadow-xl">
        <div className="border-b border-white/5 px-6 py-4">
          <h3 className="text-sm font-bold text-white">Plan Comparison</h3>
        </div>
        <table className="w-full text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-zinc-500 font-bold uppercase tracking-wider">
                Feature
              </th>
              <th className="text-center px-4 py-3 text-zinc-500 font-bold uppercase tracking-wider">
                Free
              </th>
              <th className="text-center px-4 py-3 text-orange-400 font-bold uppercase tracking-wider">
                Premium
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              ["Active menu items", "Max 3", "Unlimited"],
              ["Order management", "✓", "✓"],
              ["Admin review", "Standard", "Priority"],
              ["Vendor badge", "—", "Premium badge"],
              ["Homepage featured", "—", "✓"],
              ["Price", "৳0 / mo", "৳499 / mo"],
            ].map(([feature, free, premium]) => (
              <tr key={feature} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-medium text-zinc-300">{feature}</td>
                <td className="px-4 py-3 text-center text-zinc-400">{free}</td>
                <td className="px-4 py-3 text-center text-orange-400 font-semibold">{premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
