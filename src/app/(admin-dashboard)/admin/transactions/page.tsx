import { Receipt } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getAllTransactions } from "@/lib/transactions";
import { formatOrderDateTime } from "@/lib/order-format";

export default async function AdminTransactionsPage() {
  await requireAdmin();
  const transactions = await getAllTransactions();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Platform Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Read-only view of platform subscription transactions. Records cannot be edited.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#141416] p-14 text-center shadow-xl">
          <Receipt className="mx-auto size-12 text-zinc-600" />
          <p className="mt-4 text-sm font-semibold text-white">No Transactions Yet</p>
          <p className="mt-1 text-xs text-zinc-400">
            Vendor subscription transactions will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#141416] shadow-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-5 gap-4 border-b border-white/5 px-6 py-3">
            {["Vendor", "Plan", "Amount", "Status", "Date"].map((h) => (
              <span key={h} className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                {h}
              </span>
            ))}
          </div>

          <ul className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="grid gap-2 px-5 py-4 sm:px-6 sm:grid-cols-5 sm:items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Vendor */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {tx.vendorName}
                  </p>
                  <p className="text-[11px] text-zinc-500 sm:hidden">
                    {tx.plan} · ৳{tx.amount.toLocaleString()}
                  </p>
                </div>

                {/* Plan */}
                <span className="hidden sm:block text-xs text-zinc-300 font-semibold">
                  {tx.plan}
                </span>

                {/* Amount */}
                <span className="hidden sm:block text-xs font-bold text-orange-400">
                  ৳{tx.amount.toLocaleString()}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    tx.status === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : tx.status === "failed"
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>

                {/* Date */}
                <span className="text-xs text-zinc-400">
                  {formatOrderDateTime(tx.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
