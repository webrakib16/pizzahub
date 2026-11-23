"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  ChevronDown,
  FileText,
  ShoppingCart,
  CheckCircle2,
  CreditCard,
  Truck,
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Banknote,
  Wallet,
  Sparkles,
  Check,
  Edit2,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { useCart, saveCartItems } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { getTodayInDhaka, isValidDeliveryDate } from "@/lib/delivery-date";
import { safeFetchApi } from "@/lib/api-client";

// ─── Dhaka Areas ─────────────────────────────────────────────────────────────
const DHAKA_AREAS = [
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Mirpur",
  "Mohammadpur",
  "Uttara",
  "Bashundhara",
  "Motijheel",
  "Old Dhaka",
  "Rampura",
  "Khilgaon",
  "Shyamoli",
  "Tejgaon",
  "Farmgate",
  "Panthapath",
];

const OUTSIDE_AREAS = [
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
];

// ─── Delivery Options ─────────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  { id: "inside-dhaka", label: "Inside Dhaka", charge: 100 },
  { id: "outside-dhaka", label: "Outside Dhaka", charge: 150 },
] as const;

type DeliveryId = "inside-dhaka" | "outside-dhaka";

// ─── Progress Steps ───────────────────────────────────────────────────────────
const STEPS = [
  { key: "cart", label: "Cart", icon: ShoppingCart },
  { key: "delivery", label: "Delivery", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirmation", label: "Confirmation", icon: CheckCircle2 },
] as const;

// ─── Form Field Types ─────────────────────────────────────────────────────────
interface FormData {
  fullName: string;
  phone: string;
  address: string;
  area: string;
  deliveryLocation: DeliveryId | "";
  deliveryDate: string;
  instructions: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  area?: string;
  deliveryLocation?: string;
  deliveryDate?: string;
}

// ─── Input component ──────────────────────────────────────────────────────────
function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400 font-medium">
      <AlertCircle className="size-3 shrink-0" />
      {msg}
    </p>
  );
}

const inputBase =
  "w-full rounded-xl bg-[#1a1a1e] border text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors px-3 py-2.5";
const inputNormal = "border-white/10 focus:border-orange-500/70";
const inputError = "border-red-500/60 focus:border-red-500";

// ─── Checkout Page Component ──────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const { data: session, isPending: isSessionPending } = useSession();
  const isSignedIn = Boolean(session?.user);

  // Stepper state: 'delivery' -> 'payment' -> completes to order confirmation
  const [currentStep, setCurrentStep] = useState<"delivery" | "payment">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const [form, setForm] = useState<FormData>(() => {
    let initialLoc: DeliveryId | "" = "";
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("pizzahub_delivery_location");
        if (saved === "inside-dhaka" || saved === "outside-dhaka") {
          initialLoc = saved;
        }
      } catch {
        // ignore storage errors
      }
    }
    return {
      fullName: "",
      phone: "",
      address: "",
      area: "",
      deliveryLocation: initialLoc,
      deliveryDate: "",
      instructions: "",
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Calculations ────────────────────────────────────────────────────────────
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const selectedDeliveryOpt = DELIVERY_OPTIONS.find(
    (o) => o.id === form.deliveryLocation
  );
  const deliveryCharge = selectedDeliveryOpt ? selectedDeliveryOpt.charge : 0;
  const totalAmount = subtotal + deliveryCharge;

  // ── Areas depending on selected delivery location ───────────────────────────
  const areaList =
    form.deliveryLocation === "inside-dhaka"
      ? DHAKA_AREAS
      : form.deliveryLocation === "outside-dhaka"
        ? OUTSIDE_AREAS
        : [...DHAKA_AREAS, ...OUTSIDE_AREAS];

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleDeliveryLocation = (id: DeliveryId) => {
    setForm((prev) => ({ ...prev, deliveryLocation: id, area: "" }));
    if (errors.deliveryLocation) {
      setErrors((prev) => ({ ...prev, deliveryLocation: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.fullName.trim()) {
      next.fullName = "Full name is required.";
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      next.phone = "Enter a valid Bangladesh phone number.";
    }

    if (!form.address.trim()) {
      next.address = "Delivery address is required.";
    }

    if (!form.area) {
      next.area = "Please select an area.";
    }

    if (!form.deliveryLocation) {
      next.deliveryLocation = "Please select a delivery location.";
    }

    if (!form.deliveryDate) {
      next.deliveryDate = "Please choose a delivery date.";
    } else if (!isValidDeliveryDate(form.deliveryDate)) {
      next.deliveryDate = "Delivery date must be today or later.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Step 1 -> Step 2 transition
  const handleProceedToPayment = () => {
    if (!isSignedIn) {
      toast.add({
        title: "Please sign in before placing your order.",
        type: "error",
      });
      router.push("/sign-in");
      return;
    }

    if (!validate()) return;
    if (items.length === 0) return;

    setCurrentStep("payment");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Step 2 -> Order submission
  const handlePlaceOrder = async () => {
    if (!isSignedIn) {
      toast.add({
        title: "Please sign in before placing your order.",
        type: "error",
      });
      router.push("/sign-in");
      return;
    }

    if (!validate()) {
      setCurrentStep("delivery");
      return;
    }

    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        area: form.area,
        deliveryLocation: form.deliveryLocation,
        deliveryDate: form.deliveryDate,
        instructions: form.instructions,
        paymentMethod:
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Online / Digital Payment",
        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          size: item.size,
          crust: item.crust,
        })),
      };

      const response = await safeFetchApi("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        order?: { id: string };
        error?: string;
      };

      if (!response.ok || !data.order) {
        toast.add({
          title: data.error ?? "Could not place your order. Please try again.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      saveCartItems([]);
      try {
        localStorage.removeItem("pizzahub_delivery_location");
      } catch {
        // ignore
      }

      toast.add({
        title: "Order placed successfully! Thank you for ordering from PizzaHub.",
        type: "success",
      });

      router.push(`/orders/${data.order.id}`);
      router.refresh();
    } catch {
      toast.add({
        title: "Could not place your order. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === "delivery") {
      handleProceedToPayment();
    } else {
      handlePlaceOrder();
    }
  };

  // ── Empty cart guard ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-sm w-full text-center space-y-5 rounded-3xl bg-[#141416] border border-white/10 p-10 shadow-2xl">
            <div className="size-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <ShoppingCart className="size-7" />
            </div>
            <h2 className="text-xl font-black text-white">Your cart is empty</h2>
            <p className="text-zinc-400 text-sm">
              Add some delicious pizzas before checkout.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold shadow-md shadow-orange-950/40 hover:opacity-95 transition-all"
            >
              Explore Menu
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white overflow-x-clip">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* ── Page Header + Progress Bar ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            {/* Back + Title */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (currentStep === "payment") {
                    setCurrentStep("delivery");
                  } else {
                    router.back();
                  }
                }}
                aria-label="Go back"
                className="flex size-9 items-center justify-center rounded-full bg-[#141416] border border-white/10 text-zinc-300 hover:text-white hover:border-orange-500/50 transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                  Checkout
                </h1>
                <p className="mt-0.5 text-zinc-400 text-xs sm:text-sm">
                  {currentStep === "delivery"
                    ? "Step 2: Complete delivery information."
                    : "Step 3: Select your preferred payment option."}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center min-w-max">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCurrent = step.key === currentStep;
                  const isDone =
                    step.key === "cart" ||
                    (step.key === "delivery" && currentStep === "payment");
                  const isUpcoming = !isCurrent && !isDone;

                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        {/* Circle */}
                        <div
                          className={`flex size-9 items-center justify-center rounded-full border-2 transition-all ${
                            isCurrent
                              ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                              : isDone
                                ? "border-orange-500/60 bg-orange-500/15 text-orange-400"
                                : "border-zinc-700 bg-zinc-900 text-zinc-500"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        {/* Label */}
                        <span
                          className={`text-[10px] font-bold ${
                            isCurrent
                              ? "text-orange-400"
                              : isDone
                                ? "text-zinc-300"
                                : "text-zinc-600"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Connector line */}
                      {idx < STEPS.length - 1 && (
                        <div
                          className={`w-16 sm:w-20 h-0.5 mx-2 mb-4 rounded-full transition-colors ${
                            isDone
                              ? "bg-orange-500/70"
                              : isUpcoming
                                ? "bg-zinc-800"
                                : "bg-orange-500/30"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Main Two-Column Layout ─────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ══ LEFT COLUMN ════════════════════════════════════════════ */}
              <div className="lg:col-span-7 space-y-6">
                {!isSessionPending && !isSignedIn && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                      <AlertCircle className="size-4 shrink-0" />
                      Please sign in before placing your order.
                    </span>
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-950/40 transition-all hover:opacity-95"
                    >
                      Sign in
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                )}

                {/* ── STEP 1: Delivery Information Form ── */}
                {currentStep === "delivery" && (
                  <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl overflow-hidden">
                    {/* Form Card Header */}
                    <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-white/5">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400">
                        <MapPin className="size-4" />
                      </div>
                      <h2 className="text-base font-bold text-white">
                        Delivery Information
                      </h2>
                    </div>

                    <div className="px-5 sm:px-6 py-6 space-y-5">
                      {/* Row 1: Full Name + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                          <FieldLabel required>Full Name</FieldLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                            <input
                              type="text"
                              value={form.fullName}
                              onChange={(e) =>
                                handleChange("fullName", e.target.value)
                              }
                              placeholder="Your full name"
                              className={`${inputBase} pl-9 ${
                                errors.fullName ? inputError : inputNormal
                              }`}
                            />
                          </div>
                          <ErrorMsg msg={errors.fullName} />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <FieldLabel required>Phone Number</FieldLabel>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) =>
                                handleChange("phone", e.target.value)
                              }
                              placeholder="+880 1XXXXXXXXX"
                              className={`${inputBase} pl-9 ${
                                errors.phone ? inputError : inputNormal
                              }`}
                            />
                          </div>
                          <ErrorMsg msg={errors.phone} />
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <FieldLabel required>Delivery Address</FieldLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 size-4 text-zinc-500 pointer-events-none" />
                          <textarea
                            rows={3}
                            value={form.address}
                            onChange={(e) =>
                              handleChange("address", e.target.value)
                            }
                            placeholder="House / Road / Area (e.g. House 12, Road 5, Dhanmondi)"
                            className={`${inputBase} pl-9 resize-none ${
                              errors.address ? inputError : inputNormal
                            }`}
                          />
                        </div>
                        <ErrorMsg msg={errors.address} />
                      </div>

                      {/* Row 2: Area / Delivery Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Area Select */}
                        <div>
                          <FieldLabel required>Area / Location</FieldLabel>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                            <select
                              value={form.area}
                              onChange={(e) =>
                                handleChange("area", e.target.value)
                              }
                              className={`${inputBase} pl-9 pr-8 appearance-none cursor-pointer ${
                                errors.area ? inputError : inputNormal
                              } ${!form.area ? "text-zinc-500" : "text-white"}`}
                            >
                              <option value="" disabled>
                                Select your area
                              </option>
                              {areaList.map((area) => (
                                <option
                                  key={area}
                                  value={area}
                                  className="bg-[#1a1a1e] text-white"
                                >
                                  {area}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                          </div>
                          <ErrorMsg msg={errors.area} />
                        </div>

                        {/* Delivery Location Radio Cards */}
                        <div>
                          <FieldLabel required>Delivery Location</FieldLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {DELIVERY_OPTIONS.map((opt) => {
                              const isSelected = form.deliveryLocation === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleDeliveryLocation(opt.id)}
                                  className={`w-full rounded-xl border p-2.5 text-left transition-all duration-200 cursor-pointer ${
                                    isSelected
                                      ? "border-orange-500 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                                      : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span
                                      className={`mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                        isSelected
                                          ? "border-orange-500 bg-orange-500"
                                          : "border-zinc-500"
                                      }`}
                                    >
                                      {isSelected && (
                                        <span className="size-1 rounded-full bg-white" />
                                      )}
                                    </span>
                                    <div>
                                      <p
                                        className={`text-[11px] font-bold ${
                                          isSelected ? "text-orange-400" : "text-white"
                                        }`}
                                      >
                                        {opt.label}
                                      </p>
                                      <p className="text-[10px] text-zinc-400 mt-0.5">
                                        ৳ {opt.charge}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <ErrorMsg msg={errors.deliveryLocation} />
                        </div>
                      </div>

                      {/* Delivery Date */}
                      <div>
                        <FieldLabel required>Delivery Date</FieldLabel>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                          <input
                            type="date"
                            value={form.deliveryDate}
                            min={getTodayInDhaka()}
                            onChange={(e) =>
                              handleChange("deliveryDate", e.target.value)
                            }
                            className={`${inputBase} pl-9 ${
                              errors.deliveryDate ? inputError : inputNormal
                            } ${!form.deliveryDate ? "text-zinc-500" : "text-white"}`}
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] text-zinc-500">
                          Choose today or a later date.
                        </p>
                        <ErrorMsg msg={errors.deliveryDate} />
                      </div>

                      {/* Delivery Instructions (Optional) */}
                      <div>
                        <FieldLabel>
                          Delivery Instructions{" "}
                          <span className="text-zinc-500 font-normal text-[11px]">
                            (Optional)
                          </span>
                        </FieldLabel>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 size-4 text-zinc-500 pointer-events-none" />
                          <textarea
                            rows={2}
                            value={form.instructions}
                            onChange={(e) =>
                              handleChange("instructions", e.target.value)
                            }
                            placeholder="e.g. Call me before delivery, leave at the gate, etc."
                            className={`${inputBase} pl-9 resize-none ${inputNormal}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Payment Options ── */}
                {currentStep === "payment" && (
                  <div className="space-y-6">
                    {/* Payment Method Selector Card */}
                    <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl overflow-hidden">
                      <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-white/5">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400">
                          <CreditCard className="size-4" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white">
                            Select Payment Method
                          </h2>
                          <p className="text-[11px] text-zinc-400">
                            Choose how you would like to pay for your pizza order.
                          </p>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-4">
                        {/* Option 1: Cash on Delivery */}
                        <div
                          onClick={() => setPaymentMethod("cod")}
                          className={`relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                            paymentMethod === "cod"
                              ? "border-orange-500 bg-gradient-to-r from-orange-500/10 via-[#1a1a1e] to-[#141416] shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                              : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div
                                className={`flex size-11 items-center justify-center rounded-2xl border ${
                                  paymentMethod === "cod"
                                    ? "border-orange-500/50 bg-orange-500/20 text-orange-400"
                                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                <Banknote className="size-6" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-bold text-white">
                                    Cash on Delivery (COD)
                                  </h3>
                                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                    RECOMMENDED
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                                  Pay in cash when your hot, freshly baked pizza arrives at your door.
                                </p>
                              </div>
                            </div>

                            <span
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                paymentMethod === "cod"
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-zinc-600 bg-zinc-900"
                              }`}
                            >
                              {paymentMethod === "cod" && <Check className="size-3" />}
                            </span>
                          </div>
                        </div>

                        {/* Option 2: Digital / Online Payment */}
                        <div
                          onClick={() => setPaymentMethod("online")}
                          className={`relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                            paymentMethod === "online"
                              ? "border-orange-500 bg-gradient-to-r from-orange-500/10 via-[#1a1a1e] to-[#141416] shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                              : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div
                                className={`flex size-11 items-center justify-center rounded-2xl border ${
                                  paymentMethod === "online"
                                    ? "border-orange-500/50 bg-orange-500/20 text-orange-400"
                                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                <Wallet className="size-6" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-bold text-white">
                                    Online / Digital Payment
                                  </h3>
                                  <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                                    INSTANT
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                                  Pay with bKash, Nagad, Visa, or Mastercard. Instant automated order confirmation.
                                </p>
                              </div>
                            </div>

                            <span
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                paymentMethod === "online"
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-zinc-600 bg-zinc-900"
                              }`}
                            >
                              {paymentMethod === "online" && <Check className="size-3" />}
                            </span>
                          </div>

                          {/* Extra info when Online is selected */}
                          {paymentMethod === "online" && (
                            <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
                              <div className="flex items-center gap-1.5 text-zinc-300">
                                <ShieldCheck className="size-3.5 text-orange-500" />
                                <span>Secured checkout · 100% money-back guarantee</span>
                              </div>
                              <span className="text-zinc-500">
                                Supported: bKash · Nagad · Cards
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Summary Review Card */}
                    <div className="rounded-3xl bg-[#141416] border border-white/10 p-5 sm:p-6 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                          <MapPin className="size-3.5" />
                          <span>Delivering To</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep("delivery")}
                          className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                        >
                          <Edit2 className="size-3" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                        <div>
                          <p className="text-zinc-500 font-medium">Customer</p>
                          <p className="font-semibold text-white mt-0.5">
                            {form.fullName}
                          </p>
                          <p className="text-zinc-400">{form.phone}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 font-medium">Scheduled Date</p>
                          <p className="font-semibold text-white mt-0.5">
                            {form.deliveryDate}
                          </p>
                          <p className="text-zinc-400">
                            {selectedDeliveryOpt?.label} (৳{deliveryCharge})
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-zinc-500 font-medium">Full Address</p>
                          <p className="font-medium text-white mt-0.5">
                            {form.address}, {form.area}
                          </p>
                          {form.instructions && (
                            <p className="text-[11px] text-zinc-400 mt-1 italic">
                              &ldquo;{form.instructions}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ══ RIGHT: Order Summary ═══════════════════════════════════ */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl overflow-hidden sticky top-6">
                  {/* Summary Header */}
                  <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-white/5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                        <path d="M14 8H8M16 12H8M11 16H8" />
                      </svg>
                    </div>
                    <h2 className="text-base font-bold text-white">Order Summary</h2>
                  </div>

                  <div className="px-5 sm:px-6 py-5 space-y-5">
                    {/* Item List */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={`${item.id}-${item.size ?? ""}-${item.crust ?? ""}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative size-14 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/5">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate">
                              {[item.size, item.crust].filter(Boolean).join(" · ")}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[11px] text-zinc-500">× {item.quantity}</p>
                            <p className="text-sm font-black text-orange-500 font-mono">
                              ৳ {item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5" />

                    {/* Price Breakdown */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">
                          Subtotal ({totalCount} {totalCount === 1 ? "item" : "items"})
                        </span>
                        <span className="font-semibold text-white font-mono">
                          ৳ {subtotal}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Delivery Charge</span>
                        <span className="font-semibold text-white font-mono">
                          {form.deliveryLocation ? `৳ ${deliveryCharge}` : "—"}
                        </span>
                      </div>

                      {currentStep === "payment" && (
                        <div className="flex justify-between pt-1 border-t border-white/5 text-xs">
                          <span className="text-zinc-400">Payment Option</span>
                          <span className="font-bold text-orange-400">
                            {paymentMethod === "cod" ? "Cash on Delivery" : "Digital Payment"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-base font-black text-white">
                        Total Amount
                      </span>
                      <span className="text-2xl font-black text-orange-500 font-mono tracking-tight">
                        ৳ {totalAmount}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isSessionPending || !isSignedIn}
                      className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg ${
                        isSubmitting || isSessionPending || !isSignedIn
                          ? "bg-orange-500/60 text-white/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-95 active:scale-[0.99] shadow-orange-950/40 cursor-pointer"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="size-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          <span>Placing Order...</span>
                        </>
                      ) : currentStep === "delivery" ? (
                        <>
                          <span>Proceed to Payment</span>
                          <ChevronRight className="size-4" />
                        </>
                      ) : (
                        <>
                          {paymentMethod === "cod" ? (
                            <Banknote className="size-4" />
                          ) : (
                            <Sparkles className="size-4" />
                          )}
                          <span>
                            {paymentMethod === "cod"
                              ? "Confirm Order (Cash on Delivery)"
                              : `Pay ৳${totalAmount} & Place Order`}
                          </span>
                          <ChevronRight className="size-4" />
                        </>
                      )}
                    </button>

                    {!isSignedIn && !isSessionPending && (
                      <p className="text-center text-[11px] text-zinc-500">
                        You must be signed in to place an order.{" "}
                        <Link
                          href="/sign-in"
                          className="font-bold text-orange-400 hover:text-orange-300"
                        >
                          Sign in
                        </Link>
                      </p>
                    )}

                    {/* Fast delivery badges */}
                    <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Truck className="size-3 text-orange-500/60" />
                        <span>Fast Delivery</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-3 text-orange-500/60"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Secure Checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
