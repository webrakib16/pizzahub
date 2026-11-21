import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { requireVendor } from "@/lib/session";

export default async function PaymentCancelPage() {
  await requireVendor();

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <div className="rounded-3xl border border-white/10 bg-[#141416] p-8 text-center shadow-xl sm:p-10">
        {/* Cancel Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-zinc-400">
          <XCircle className="size-8 text-zinc-400" />
        </div>

        <h1 className="mt-5 text-2xl font-black text-white">Payment Cancelled</h1>

        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
          Your payment was cancelled. No charges were made to your account. You can upgrade
          whenever you are ready to publish more than 3 active items.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-90 transition-all"
          >
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Link>

          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-900 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
