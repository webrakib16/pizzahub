"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  PlusCircle,
  Trash2,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import type { MenuItem } from "@/types/menu-item";
import { toast } from "@/components/ui/toast";

export default function VendorMenuList({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleActive = async (item: MenuItem) => {
    setLoadingId(item.id);
    try {
      const res = await fetch(`/api/vendor/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: data.error || "Failed to update availability",
          type: "error",
        });
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i))
      );
      toast.add({
        title: !item.isActive
          ? `"${item.name}" is now Active`
          : `"${item.name}" is now Inactive`,
        type: "success",
      });
    } catch {
      toast.add({ title: "Failed to update status", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/vendor/menu/${id}`, {
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
            Pending Approval
          </span>
        );
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#141416] p-12 text-center shadow-xl">
        <UtensilsCrossed className="mx-auto size-12 text-zinc-600" />
        <h3 className="mt-4 text-base font-bold text-white">
          No Menu Items Created Yet
        </h3>
        <p className="mt-1 text-xs text-zinc-400">
          Start publishing pizzas from your kitchen. New items will be reviewed by admin.
        </p>
        <Link
          href="/vendor/menu/add"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all"
        >
          <PlusCircle className="size-4" />
          Add Your First Pizza
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-xl"
          >
            <div>
              {/* Image Frame */}
              <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="320px"
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-black/40" />

                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-base font-black text-orange-500 whitespace-nowrap">
                    ৳{item.price}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-1">
                  <MapPin className="size-3 text-orange-500 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                {item.status === "rejected" && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-[11px] text-red-400">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>Rejected items are hidden from customers.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="border-t border-white/5 bg-black/20 p-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleToggleActive(item)}
                disabled={loadingId === item.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  item.isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
                }`}
              >
                <span className={`size-1.5 rounded-full ${item.isActive ? "bg-emerald-400" : "bg-zinc-500"}`} />
                {item.isActive ? "Active" : "Inactive"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  title="View details"
                  className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:border-white/30 cursor-pointer"
                >
                  <Eye className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={loadingId === item.id}
                  title="Delete pizza"
                  className="flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── View Details Modal ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-zinc-900">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                <span className="text-xs text-zinc-400 mt-0.5 inline-block">{selectedItem.category}</span>
              </div>
              <span className="text-xl font-black text-orange-500">৳{selectedItem.price}</span>
            </div>

            <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Approval Status:</span>
              {getStatusBadge(selectedItem.status)}
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="mt-6 w-full rounded-full border border-white/15 bg-zinc-900 py-2.5 text-xs font-bold text-white hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
