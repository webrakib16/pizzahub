"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export default function UpgradeToPremiumButton({
  isPremium = false,
}: {
  isPremium?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (isPremium) {
    return (
      <div className="mt-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3 text-center text-xs font-bold text-emerald-400">
        ✓ You are currently on the Premium Plan
      </div>
    );
  }

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);

      const sessionRes = await authClient.getSession();
      const token = sessionRes?.data?.session?.token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vendor/subscription/checkout`, {
        method: "POST",
        headers,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to start checkout session.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from payment server.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to payment server. Please ensure the backend is running.";
      toast.add({
        title: "Checkout Error",
        description: message,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      disabled={isLoading}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Redirecting to Stripe...</span>
        </>
      ) : (
        <>
          <Sparkles className="size-4" />
          <span>Upgrade to Premium</span>
          <ArrowRight className="size-3.5" />
        </>
      )}
    </button>
  );
}
