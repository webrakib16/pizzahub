import { Ban, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
    icon: Ban,
  },
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const config = STATUS_STYLES[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold",
        config.className,
        className
      )}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

export default OrderStatusBadge;
