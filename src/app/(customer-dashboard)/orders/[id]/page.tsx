import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOrderForUser } from "@/lib/orders";
import {
  formatOrderDate,
  formatOrderDateTime,
  shortOrderId,
} from "@/lib/order-format";
import OrderStatusBadge from "@/components/dashboard/shared/OrderStatusBadge";
import CancelOrderDialog from "@/components/dashboard/shared/CancelOrderDialog";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const order = await getOrderForUser(id, user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Back to My Orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Order Details
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              #{shortOrderId(order.id)}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Requested {formatOrderDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {order.status === "pending" && (
              <CancelOrderDialog
                orderId={order.id}
                shortId={shortOrderId(order.id)}
              />
            )}
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-xl">
            <div className="border-b border-white/5 px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-white">Items</h2>
            </div>
            <ul className="divide-y divide-white/5">
              {order.items.map((item, index) => (
                <li
                  key={`${item.menuItemId}-${index}`}
                  className="flex items-center gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                      {item.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-400">
                      <Store className="size-3 shrink-0" />
                      {item.vendorName}
                    </p>
                    {(item.size || item.crust) && (
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                        {[item.size, item.crust].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-zinc-400">
                      ৳{item.unitPrice.toLocaleString("en-US")} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-white">
                    ৳
                    {(item.unitPrice * item.quantity).toLocaleString("en-US")}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#141416] p-5 shadow-xl sm:p-6">
            <h2 className="text-base font-bold text-white">Delivery Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail
                icon={<User className="size-4" />}
                label="Recipient"
                value={order.customerName}
              />
              <Detail
                icon={<Phone className="size-4" />}
                label="Phone"
                value={order.phone}
              />
              <Detail
                icon={<CalendarDays className="size-4" />}
                label="Delivery Date"
                value={formatOrderDate(order.deliveryDate)}
              />
              <Detail
                icon={<MapPin className="size-4" />}
                label="Delivery Address"
                value={`${order.deliveryAddress}, ${order.deliveryArea}`}
              />
            </div>

            {order.instructions && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  Special Instructions
                </p>
                <p className="mt-1 text-sm text-zinc-200">
                  {order.instructions}
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#141416] p-5 shadow-xl sm:p-6">
            <h2 className="text-base font-bold text-white">Payment Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={order.subtotal} />
              <Row label="Delivery charge" value={order.deliveryCharge} />
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-bold text-white">Total</dt>
                  <dd className="text-base font-black text-orange-400">
                    ৳{order.totalAmount.toLocaleString("en-US")}
                  </dd>
                </div>
              </div>
            </dl>
            <p className="mt-4 text-xs text-zinc-500">
              Delivery area: {order.deliveryArea}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#141416] p-5 shadow-xl sm:p-6">
            <h2 className="text-base font-bold text-white">Status</h2>
            <div className="mt-3">
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              {order.status === "pending" &&
                "Waiting for the restaurant to accept your order. You can cancel it while it is pending."}
              {order.status === "accepted" &&
                "Your order has been accepted and is being prepared."}
              {order.status === "rejected" &&
                "The restaurant rejected this order. Please contact support if you need help."}
              {order.status === "cancelled" &&
                "This order was cancelled and cannot be restored."}
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Last updated {formatOrderDateTime(order.updatedAt)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-orange-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        <p className="text-sm text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="font-semibold text-zinc-200">
        ৳{value.toLocaleString("en-US")}
      </dd>
    </div>
  );
}
