"use client";

import { useState, useMemo } from "react";
import {
  Download,
  Search,
  Copy,
  Check,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  CalendarRange,
  Users,
  Receipt,
  Wallet,
} from "lucide-react";
import { formatOrderDate } from "@/lib/order-format";
import type { Transaction } from "@/lib/transactions";

interface TransactionsClientProps {
  initialTransactions: Transaction[];
}

export default function TransactionsClient({ initialTransactions }: TransactionsClientProps) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute 5 metrics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalRevenue = 0;
    let thisMonthRevenue = 0;
    let thisYearRevenue = 0;
    const uniqueVendors = new Set<string>();
    let paidTransactions = 0;

    for (const tx of initialTransactions) {
      if (tx.status === "success") {
        totalRevenue += tx.amount;
        paidTransactions += 1;

        if (tx.vendorId || tx.vendorEmail) {
          uniqueVendors.add(tx.vendorId || tx.vendorEmail);
        }

        const txDate = new Date(tx.createdAt);
        if (!isNaN(txDate.getTime())) {
          if (txDate.getFullYear() === currentYear) {
            thisYearRevenue += tx.amount;
            if (txDate.getMonth() === currentMonth) {
              thisMonthRevenue += tx.amount;
            }
          }
        }
      }
    }

    return {
      totalRevenue,
      thisMonthRevenue,
      thisYearRevenue,
      paidVendors: uniqueVendors.size,
      paidTransactions,
    };
  }, [initialTransactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialTransactions;

    return initialTransactions.filter((tx) => {
      return (
        tx.vendorName.toLowerCase().includes(q) ||
        tx.vendorEmail.toLowerCase().includes(q) ||
        tx.receiptId.toLowerCase().includes(q) ||
        tx.stripeSessionId.toLowerCase().includes(q) ||
        tx.plan.toLowerCase().includes(q)
      );
    });
  }, [initialTransactions, search]);

  // Copy to clipboard helper
  const handleCopy = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopiedId(sessionId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  // Export CSV helper
  const handleExportCSV = () => {
    if (initialTransactions.length === 0) return;

    const headers = ["Receipt", "Vendor", "Email", "Plan", "Amount", "Currency", "Status", "Stripe Session", "Date"];
    const rows = filteredTransactions.map((tx) => [
      `"${tx.receiptId.replace(/"/g, '""')}"`,
      `"${tx.vendorName.replace(/"/g, '""')}"`,
      `"${tx.vendorEmail.replace(/"/g, '""')}"`,
      `"${tx.plan.replace(/"/g, '""')}"`,
      tx.amount,
      "BDT",
      tx.status === "success" ? "Paid" : tx.status,
      `"${tx.stripeSessionId.replace(/"/g, '""')}"`,
      `"${new Date(tx.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pizzahub-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-500">
            <Wallet className="size-3.5" />
            <span>FINANCIAL OVERVIEW</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Payments & Revenue
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track vendor upgrades, total platform earnings, and Stripe transactions.
          </p>
        </div>

        {/* Top-right Export CSV button */}
        <button
          onClick={handleExportCSV}
          disabled={initialTransactions.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Download className="size-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ── 5 Metric Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {/* Card 1: Total Revenue */}
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 shadow-xl transition-colors hover:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Revenue</span>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            ৳{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">All-time verified earnings</p>
        </div>

        {/* Card 2: This Month */}
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 shadow-xl transition-colors hover:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">This Month</span>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-1.5 text-sky-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            ৳{stats.thisMonthRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Current month revenue</p>
        </div>

        {/* Card 3: This Year */}
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 shadow-xl transition-colors hover:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">This Year</span>
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-1.5 text-purple-400">
              <CalendarRange className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            ৳{stats.thisYearRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Current year revenue</p>
        </div>

        {/* Card 4: Paid Vendors */}
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 shadow-xl transition-colors hover:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Paid Vendors</span>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-1.5 text-amber-400">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {stats.paidVendors}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Unique upgraded accounts</p>
        </div>

        {/* Card 5: Paid Transactions */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 shadow-xl transition-colors hover:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Paid Transactions</span>
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-1.5 text-orange-400">
              <Receipt className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {stats.paidTransactions}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Completed Stripe checkouts</p>
        </div>
      </div>

      {/* ── Transaction History Section ── */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-xl">
        {/* Section Header with Search Bar */}
        <div className="flex flex-col gap-3 border-b border-white/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white sm:text-lg">Transaction History</h2>
            <p className="text-xs text-zinc-400">
              Showing {filteredTransactions.length} of {initialTransactions.length} records
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email, receipt, session, vendor..."
              className="w-full rounded-xl border border-white/10 bg-[#09090b] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Empty state */}
        {filteredTransactions.length === 0 ? (
          <div className="p-14 text-center">
            <Receipt className="mx-auto size-12 text-zinc-600" />
            <p className="mt-4 text-sm font-semibold text-white">No Transactions Found</p>
            <p className="mt-1 text-xs text-zinc-400">
              {search ? "No records match your search criteria." : "Vendor subscription transactions will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Receipt
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Vendor
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Vendor Email
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Stripe Session
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Receipt */}
                    <td className="px-5 py-4 font-mono font-medium text-zinc-400 whitespace-nowrap">
                      {tx.receiptId}
                    </td>

                    {/* Vendor Name & Plan */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-bold text-white">{tx.vendorName}</p>
                      <p className="text-[10px] font-medium text-orange-400">{tx.plan}</p>
                    </td>

                    {/* Vendor Email */}
                    <td className="px-5 py-4 text-zinc-300 font-medium whitespace-nowrap">
                      {tx.vendorEmail}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-zinc-400 whitespace-nowrap">
                      {formatOrderDate(tx.createdAt)}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                      ৳{tx.amount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {tx.status === "success" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          <span>Paid</span>
                        </span>
                      ) : tx.status === "failed" ? (
                        <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-400">
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Stripe Session with Copy */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {tx.stripeSessionId ? (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                          <span>{tx.stripeSessionId.slice(0, 11)}...</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.stripeSessionId)}
                            className="cursor-pointer text-zinc-400 transition-colors hover:text-white"
                            title="Copy Stripe Session ID"
                          >
                            {copiedId === tx.stripeSessionId ? (
                              <Check className="size-3 text-emerald-400" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
