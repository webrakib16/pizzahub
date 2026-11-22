"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Send, Store, ArrowRight, LogIn } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const LOCATIONS = ["Dhaka", "Chattogram", "Rajshahi", "Sylhet"];

const SPECIALTIES = [
  "Artisanal Neapolitan",
  "Classic NY-Style Thin Crust",
  "Deep Dish & Pan Pizza",
  "Wood-Fired Gourmet",
  "Vegetarian & Vegan Specialty",
  "Cheesy Stuffed Crust",
  "Other / Mixed Cuisine",
];

export default function PartnershipForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRole = (user as { role?: string })?.role;

  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "Dhaka",
    specialty: "Artisanal Neapolitan",
    capacity: "50-100 pizzas/day",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const owner = form.ownerName.trim() || user?.name?.trim() || "";
    const email = form.email.trim() || user?.email?.trim() || "";

    const errs: Record<string, string> = {};
    if (!form.restaurantName.trim()) errs.restaurantName = "Restaurant name is required.";
    if (!owner) errs.ownerName = "Contact person name is required.";
    if (!email || !email.includes("@")) errs.email = "Valid email is required.";
    if (!form.phone.trim() || form.phone.length < 8) errs.phone = "Valid phone number is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.add({
        title: "Please sign in to your account first before applying as a vendor.",
        type: "error",
      });
      router.push("/sign-in?callbackUrl=/partnership");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        ownerName: form.ownerName.trim() || user?.name || "",
        email: form.email.trim() || user?.email || "",
      };

      const res = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.add({
          title: data.error || "Failed to submit partnership application.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      setSubmitted(true);
      toast.add({
        title: "🎉 Congratulations! You are now registered as a PizzaHub Vendor.",
        type: "success",
      });

      setTimeout(() => {
        router.push("/vendor/dashboard");
      }, 1500);
    } catch {
      toast.add({
        title: "Network error occurred while applying. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // If already a vendor, show dashboard shortcut
  if (userRole === "vendor") {
    return (
      <div className="rounded-3xl border border-orange-500/30 bg-[#141416] p-8 text-center sm:p-12 space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
          <Store className="size-8" />
        </div>
        <h3 className="text-2xl font-black text-white">You Are Already a Vendor Partner!</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your account is registered as a verified restaurant partner. You can manage your menu items, view incoming customer orders, and upgrade your subscription from the Vendor Dashboard.
        </p>
        <div className="pt-2">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-opacity"
          >
            <span>Open Vendor Dashboard</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 sm:p-12 text-center space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-2xl font-black text-white">Application Approved!</h3>
        <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
          Welcome to PizzaHub Partners, <strong className="text-white">{form.ownerName}</strong>! Your restaurant <strong className="text-white">{form.restaurantName}</strong> is registered. Redirecting you to your Vendor Dashboard…
        </p>
        <div className="pt-3">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-colors"
          >
            <span>Go to Vendor Dashboard Now</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Not Logged In Warning banner */}
      {!isPending && !user && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <LogIn className="size-4 shrink-0 text-amber-400" />
            <span>Sign in to your account so we can link your restaurant profile.</span>
          </div>
          <Link
            href="/sign-in?callbackUrl=/partnership"
            className="font-bold underline hover:text-white shrink-0 ml-2"
          >
            Sign In
          </Link>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Restaurant Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Restaurant / Kitchen Name <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Bella Italia Pizzeria"
            value={form.restaurantName}
            onChange={(e) => {
              setForm((p) => ({ ...p, restaurantName: e.target.value }));
              setErrors((p) => ({ ...p, restaurantName: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.restaurantName && (
            <p className="text-xs text-red-400">{errors.restaurantName}</p>
          )}
        </div>

        {/* Owner / Contact Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Owner / Head Chef Name <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Chef Marco Rossi"
            value={form.ownerName || (user?.name ?? "")}
            onChange={(e) => {
              setForm((p) => ({ ...p, ownerName: e.target.value }));
              setErrors((p) => ({ ...p, ownerName: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.ownerName && (
            <p className="text-xs text-red-400">{errors.ownerName}</p>
          )}
        </div>

        {/* Business Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Business Email <span className="text-orange-500">*</span>
          </label>
          <input
            type="email"
            placeholder="partner@restaurant.com"
            value={form.email || (user?.email ?? "")}
            onChange={(e) => {
              setForm((p) => ({ ...p, email: e.target.value }));
              setErrors((p) => ({ ...p, email: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Direct Phone Number <span className="text-orange-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+880 1700-000000"
            value={form.phone}
            onChange={(e) => {
              setForm((p) => ({ ...p, phone: e.target.value }));
              setErrors((p) => ({ ...p, phone: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.phone && (
            <p className="text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* City Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Operating City <span className="text-orange-500">*</span>
          </label>
          <select
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none"
          >
            {LOCATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Pizza Specialty */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Primary Pizza Specialty
          </label>
          <select
            value={form.specialty}
            onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none"
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message / Details */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-zinc-300">
          About Your Kitchen & Signature Dishes
        </label>
        <textarea
          rows={3}
          placeholder="Tell us about your kitchen, wood-fired oven, crust techniques, or existing branches…"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-95 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Upgrading to Vendor…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Submit & Become a Partner
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-zinc-500">
        By submitting, you agree to PizzaHub&apos;s food safety standards and restaurant partner terms.
      </p>
    </form>
  );
}
