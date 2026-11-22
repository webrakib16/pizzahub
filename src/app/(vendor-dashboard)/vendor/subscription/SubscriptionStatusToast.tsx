"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/toast";

interface SubscriptionStatusToastProps {
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

export default function SubscriptionStatusToast({
  type,
  title,
  description,
}: SubscriptionStatusToastProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      toast.add({
        title,
        description,
        type,
      });
    }
  }, [type, title, description]);

  return null;
}
