import Link from "next/link";
import { CheckCircle2, Sparkles, PlusCircle, LayoutDashboard, ArrowRight } from "lucide-react";
import { requireVendor } from "@/lib/session";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await requireVendor();
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <div className="mx-auto w-full max-w-xl py-8">
      <div className="rounded-3xl border border-white/10 bg-[#141416] p-8 text-center shadow-2xl relative overflow-hidden sm:p-10">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-orange-500/10 blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="size-10" />
        </div>

        {/* Status Badge */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400">
          <Sparkles className="size-3" />
          <span>Payment Successful</span>
        </div>

        {/* Heading */}
        <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
          Welcome to Premium!
        </h1>

        <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
          Thank you for upgrading! Your transaction was processed securely via Stripe.
          Your subscription is now active with unlimited menu item publishing.
        </p>

        {sessionId && (
          <div className="mt-4 rounded-xl border border-white/5 bg-zinc-900/60 px-4 py-2 text-[11px] text-zinc-500 font-mono break-all max-w-sm mx-auto">
            Session: {sessionId.slice(0, 24)}...
          </div>
        )}

        {/* Benefits summary list */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-900/40 p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            What is unlocked for your restaurant:
          </p>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>Unlimited active menu items (3-item limit removed)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>Priority admin review for fast approvals</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>Exclusive Verified Premium badge on your shop profile</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/vendor/menu/add"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-90 transition-all"
          >
            <PlusCircle className="size-4" />
            <span>Add Menu Items</span>
            <ArrowRight className="size-3.5" />
          </Link>

          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-6 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <LayoutDashboard className="size-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
