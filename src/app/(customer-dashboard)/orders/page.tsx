import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShoppingBag,
  Store,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOrdersForUser } from "@/lib/orders";
import {
  formatOrderDate,
  formatOrderDateTime,
  shortOrderId,
} from "@/lib/order-format";
import OrderStatusBadge from "@/components/dashboard/shared/OrderStatusBadge";
import CancelOrderDialog from "@/components/dashboard/shared/CancelOrderDialog";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getOrdersForUser(user.id);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          My Account
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Track your orders, review delivery details, and cancel pending orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#141416] px-5 py-16 text-center shadow-xl sm:px-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-orange-500/25 bg-orange-500/15 text-orange-500">
            <ShoppingBag className="size-6" />
          </div>
          <p className="mt-4 text-base font-bold text-white">No orders yet</p>
          <p className="mt-1 text-sm text-zinc-400">
            Once you place an order, it will appear here.
          </p>
          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-95 active:scale-[0.99]"
          >
            Browse Menu
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-sm font-bold text-white">
                    Order #{shortOrderId(order.id)}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Requested {formatOrderDateTime(order.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="space-y-4 px-5 py-5 sm:px-6">
                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li
                      key={`${item.menuItemId}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">
                          {item.name}
                          <span className="ml-1.5 text-xs font-semibold text-zinc-500">
                            × {item.quantity}
                          </span>
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-400">
                          <Store className="size-3 shrink-0" />
                          {item.vendorName}
                        </p>
                        {(item.size || item.crust) && (
                          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                            {[item.size, item.crust]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 text-sm font-bold text-white">
                        ৳{(item.unitPrice * item.quantity).toLocaleString("en-US")}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-orange-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Delivery Date
                      </p>
                      <p className="text-sm text-zinc-200">
                        {formatOrderDate(order.deliveryDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-orange-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Delivery Address
                      </p>
                      <p className="text-sm text-zinc-200">
                        {order.deliveryAddress}, {order.deliveryArea}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-black/20 px-5 py-4 sm:px-6">
                <p className="text-sm text-zinc-400">
                  Total{" "}
                  <span className="font-black text-white">
                    ৳{order.totalAmount.toLocaleString("en-US")}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  {order.status === "pending" && (
                    <CancelOrderDialog
                      orderId={order.id}
                      shortId={shortOrderId(order.id)}
                    />
                  )}
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-200 transition-colors hover:border-white/30 hover:text-white"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
