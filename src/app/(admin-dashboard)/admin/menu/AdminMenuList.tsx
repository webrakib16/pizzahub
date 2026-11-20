"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  Trash2,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import type { MenuItem } from "@/types/menu-item";
import { toast } from "@/components/ui/toast";

export default function AdminMenuList({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter !== "all") {
      list = list.filter((i) => i.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.vendorName.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, search, statusFilter]);

  const handleStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.add({ title: data.error || "Failed to update item", type: "error" });
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
      toast.add({
        title: `Item ${status}`,
        type: "success",
      });
    } catch {
      toast.add({ title: "Failed to update item", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}/status`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.add({ title: "Could not delete item", type: "error" });
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.add({ title: `Deleted "${name}"`, type: "success" });
    } catch {
      toast.add({ title: "Failed to delete item", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: MenuItem["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="size-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-400">
            <XCircle className="size-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
            <Clock className="size-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, vendor, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p className="text-xs text-zinc-500">
        Showing <span className="text-white font-semibold">{filtered.length}</span> of {items.length} items
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#141416] p-14 text-center">
          <UtensilsCrossed className="mx-auto size-12 text-zinc-600" />
          <p className="mt-4 text-sm font-semibold text-white">No items found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-xl"
            >
              {/* Image */}
              <div className="relative h-40 w-full bg-zinc-900 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="320px"
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 space-y-1.5">
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {item.category} · <span className="text-orange-400 font-bold">৳{item.price}</span>
                </p>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-[11px] text-zinc-500">
                  Vendor: <span className="text-zinc-300 font-semibold">{item.vendorName}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-white/5 p-3 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  {item.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(item.id, "approved")}
                      disabled={loadingId === item.id}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-3" />
                      )}
                      Approve
                    </button>
                  )}
                  {item.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(item.id, "rejected")}
                      disabled={loadingId === item.id}
                      className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      Reject
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={loadingId === item.id}
                  title="Delete item"
                  className="flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
