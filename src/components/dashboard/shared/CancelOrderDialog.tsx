"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { safeFetchApi } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelOrderDialogProps {
  orderId: string;
  shortId: string;
  className?: string;
}

export function CancelOrderDialog({
  orderId,
  shortId,
  className,
}: CancelOrderDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (isCancelling) return;

    setIsCancelling(true);

    try {
      const response = await safeFetchApi(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        toast.add({
          title: data.error ?? "Could not cancel this order.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: `Order #${shortId} has been cancelled.`,
        type: "success",
      });
      setOpen(false);
      router.refresh();
    } catch {
      toast.add({
        title: "Could not cancel this order. Please try again.",
        type: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40",
          className
        )}
      >
        <XCircle className="size-3.5" />
        Cancel order
      </AlertDialogTrigger>

      <AlertDialogContent className="border border-white/10 bg-[#141416] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Cancel order #{shortId}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            This will cancel your pending order. Once cancelled, the order cannot
            be restored.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="border-white/10 bg-transparent">
          <AlertDialogCancel
            disabled={isCancelling}
            className="border-white/15 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
          >
            Keep order
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-90"
          >
            {isCancelling ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, cancel order"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CancelOrderDialog;
