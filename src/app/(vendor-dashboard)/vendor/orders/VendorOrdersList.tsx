"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import type { Order } from "@/types/order";
import OrderStatusBadge from "@/components/dashboard/shared/OrderStatusBadge";
import { toast } from "@/components/ui/toast";
import { shortOrderId, formatOrderDateTime, formatOrderDate } from "@/lib/order-format";

export default function VendorOrdersList({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleAction = async (
    orderId: string,
    action: "accepted" | "rejected"
  ) => {
    setLoadingId(orderId);
    try {
      const res = await fetch(`/api/vendor/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.add({ title: data.error || "Failed to update order", type: "error" });
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: action } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: action } : null);
      }
      toast.add({
        title: `Order #${shortOrderId(orderId)} ${action}`,
        type: "success",
      });
    } catch {
      toast.add({ title: "Failed to update order", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#141416] p-14 text-center shadow-xl">
        <ShoppingBag className="mx-auto size-12 text-zinc-600" />
        <h3 className="mt-4 text-base font-bold text-white">No Orders Yet</h3>
        <p className="mt-1 text-xs text-zinc-400">
          Customer orders for your restaurant will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-white/10 bg-[#141416] p-4 shadow-lg sm:p-5"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">
                  Order #{shortOrderId(order.id)}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {order.customerName} · {formatOrderDateTime(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Items preview */}
            <div className="mt-3 flex flex-wrap gap-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative size-9 overflow-hidden rounded-lg bg-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="36px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      ৳{item.unitPrice} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
              <p className="text-xs font-bold text-orange-400">
                Total: ৳{order.totalAmount.toLocaleString()}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
                >
                  Details
                </button>

                {order.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction(order.id, "accepted")}
                      disabled={loadingId === order.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(order.id, "rejected")}
                      disabled={loadingId === order.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle className="size-3.5" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Order #{shortOrderId(selectedOrder.id)}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {formatOrderDateTime(selectedOrder.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            {/* Customer Info */}
            <section className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Customer Info
              </p>
              <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-3 space-y-1 text-xs text-zinc-300">
                <p><span className="font-bold text-white">Name:</span> {selectedOrder.customerName}</p>
                <p><span className="font-bold text-white">Email:</span> {selectedOrder.customerEmail}</p>
                <p><span className="font-bold text-white">Phone:</span> {selectedOrder.phone || "—"}</p>
              </div>
            </section>

            {/* Items */}
            <section className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Order Items
              </p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 p-2.5"
                  >
                    <div className="relative size-11 overflow-hidden rounded-lg bg-zinc-800 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="44px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-zinc-400">
                        ৳{item.unitPrice} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-400">
                      ৳{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Info */}
            <section className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Delivery
              </p>
              <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-3 space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-orange-400 shrink-0" />
                  <span>
                    <span className="font-bold text-white">Date:</span>{" "}
                    {formatOrderDate(selectedOrder.deliveryDate)}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="size-3 text-orange-400 shrink-0 mt-0.5" />
                  <span>
                    <span className="font-bold text-white">Address:</span>{" "}
                    {selectedOrder.deliveryAddress}
                    {selectedOrder.deliveryArea && `, ${selectedOrder.deliveryArea}`}
                  </span>
                </div>
                {selectedOrder.instructions && (
                  <div className="flex items-start gap-1.5">
                    <MessageSquare className="size-3 text-orange-400 shrink-0 mt-0.5" />
                    <span>
                      <span className="font-bold text-white">Note:</span>{" "}
                      {selectedOrder.instructions}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-5">
              <span className="text-xs text-zinc-400">Total Amount</span>
              <span className="text-base font-black text-orange-400">
                ৳{selectedOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Actions in modal */}
            <div className="flex gap-2">
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleAction(selectedOrder.id, "accepted")}
                    disabled={loadingId === selectedOrder.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" />
                    Accept Order
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(selectedOrder.id, "rejected")}
                    disabled={loadingId === selectedOrder.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="size-4" />
                    Reject Order
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 rounded-full border border-white/15 bg-zinc-900 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
