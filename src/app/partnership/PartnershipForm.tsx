"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
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
    const errs: Record<string, string> = {};
    if (!form.restaurantName.trim()) errs.restaurantName = "Restaurant name is required.";
    if (!form.ownerName.trim()) errs.ownerName = "Contact person name is required.";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email is required.";
    if (!form.phone.trim() || form.phone.length < 8) errs.phone = "Valid phone number is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    // Simulate application processing
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
    toast.add({
      title: "Partnership application received!",
      type: "success",
    });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 sm:p-12 text-center space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-2xl font-black text-white">Application Submitted!</h3>
        <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-white">{form.ownerName}</strong>. Our partnership manager will review <strong className="text-white">{form.restaurantName}</strong> and contact you at <strong className="text-orange-400">{form.email}</strong> within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({
              restaurantName: "",
              ownerName: "",
              email: "",
              phone: "",
              city: "Dhaka",
              specialty: "Artisanal Neapolitan",
              capacity: "50-100 pizzas/day",
              message: "",
            });
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            value={form.ownerName}
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
            value={form.email}
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
            Submitting Application…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Submit Partnership Application
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-zinc-500">
        By submitting, you agree to PizzaHub&apos;s food safety standards and restaurant partner terms.
      </p>
    </form>
  );
}
