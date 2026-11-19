"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  MapPin,
  ChevronRight,
  Info,
  ShieldCheck,
  Tag,
  Headphones,
  Bike,
  X,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { useCart, saveCartItems, CartItem } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toast";

// ─── Delivery Options ─────────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  {
    id: "inside-dhaka" as const,
    label: "Inside Dhaka",
    description: "Delivery within Dhaka city",
    charge: 100,
  },
  {
    id: "outside-dhaka" as const,
    label: "Outside Dhaka",
    description: "Delivery outside Dhaka",
    charge: 150,
  },
];

type DeliveryOptionId = "inside-dhaka" | "outside-dhaka";

// ─── Trust Badge Strip ────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Bike, title: "Fast Delivery", sub: "30–40 min" },
  { icon: ShieldCheck, title: "Secure Payment", sub: "100% safe" },
  { icon: Tag, title: "Best Offers", sub: "Get exclusive deals" },
  { icon: Headphones, title: "24/7 Support", sub: "We're always here" },
];

// ─── Clear Cart Confirmation Dialog ──────────────────────────────────────────
function ClearCartDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm rounded-3xl bg-[#141416] border border-white/10 p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mx-auto">
          <Trash2 className="size-6" />
        </div>

        <h2 className="text-center text-lg font-black text-white">Clear Cart?</h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-zinc-400 leading-relaxed">
          This will remove all items from your cart. This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/15 bg-zinc-900 py-2.5 text-sm font-semibold text-zinc-200 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-2.5 text-sm font-bold text-white hover:opacity-95 shadow-md shadow-orange-950/40 transition-all cursor-pointer"
          >
            Clear Cart
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Empty Cart State ─────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
      <div className="relative">
        <div className="size-28 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
          <ShoppingCart className="size-12 text-orange-500/60" />
        </div>
        <div className="absolute -top-1 -right-1 size-5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white text-[10px] font-black">
          0
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
          Looks like you haven&apos;t added anything yet. Explore our menu to find your perfect pizza!
        </p>
      </div>

      <Link
        href="/menu"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-950/40 hover:opacity-95 active:scale-95 transition-all"
      >
        <span>Explore Menu</span>
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

// ─── Single Cart Item Row ─────────────────────────────────────────────────────
function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (
    id: string,
    size: string | undefined,
    crust: string | undefined,
    quantity: number
  ) => void;
  onRemove: (
    id: string,
    size: string | undefined,
    crust: string | undefined
  ) => void;
}) {
  const lineTotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0"
    >
      {/* Pizza Image */}
      <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden shrink-0 bg-zinc-900 border border-white/5">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="text-sm sm:text-base font-bold text-white truncate">
          {item.name}
        </h3>

        {/* Size & Crust Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {item.size && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-[10px] text-zinc-400 font-medium">
              <span className="text-orange-500 leading-none">◉</span>
              Size: {item.size}
            </span>
          )}
          {item.crust && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-[10px] text-zinc-400 font-medium">
              <span className="text-orange-500 leading-none">◉</span>
              Crust: {item.crust}
            </span>
          )}
        </div>

        {/* Line Total Price */}
        <p className="text-base sm:text-lg font-black text-orange-500 font-mono">
          ৳ {lineTotal}
        </p>
      </div>

      {/* Quantity Stepper + Remove */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5 shrink-0">
        {/* Quantity Stepper */}
        <div className="flex items-center rounded-full border border-white/10 bg-[#1a1a1e] p-0.5">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() =>
              onUpdateQuantity(
                item.id,
                item.size,
                item.crust,
                Math.max(1, item.quantity - 1)
              )
            }
            disabled={item.quantity <= 1}
            className="flex size-7 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-7 text-center text-sm font-bold text-white font-mono select-none">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              onUpdateQuantity(item.id, item.size, item.crust, item.quantity + 1)
            }
            className="flex size-7 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Plus className="size-3" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.id, item.size, item.crust)}
          className="flex size-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-colors cursor-pointer"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();
  const { items, totalCount } = useCart();
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionId | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // ── Calculations ────────────────────────────────────────────────────────
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.id === deliveryOption);
  const deliveryCharge = selectedDelivery?.charge ?? 0;
  const totalAmount = subtotal + (deliveryOption ? deliveryCharge : 0);
  const canCheckout = deliveryOption !== null && items.length > 0;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleUpdateQuantity = (
    id: string,
    size: string | undefined,
    crust: string | undefined,
    quantity: number
  ) => {
    const updated = items.map((item) =>
      item.id === id && item.size === size && item.crust === crust
        ? { ...item, quantity }
        : item
    );
    saveCartItems(updated);
  };

  const handleRemove = (
    id: string,
    size: string | undefined,
    crust: string | undefined
  ) => {
    const updated = items.filter(
      (item) =>
        !(item.id === id && item.size === size && item.crust === crust)
    );
    saveCartItems(updated);
    toast.add({ title: "Item removed from cart", type: "info" });
  };

  const handleClearCart = () => {
    saveCartItems([]);
    setShowClearDialog(false);
    setDeliveryOption(null);
    toast.add({ title: "Cart cleared", type: "success" });
  };

  const handleCheckout = () => {
    if (!canCheckout) return;
    if (deliveryOption) {
      try {
        localStorage.setItem("pizzahub_delivery_location", deliveryOption);
      } catch {
        // ignore storage errors
      }
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white overflow-x-clip">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/15 border border-orange-500/25 text-orange-500 shrink-0">
              <ShoppingCart className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                Your Cart
              </h1>
              <p className="mt-1 text-zinc-400 text-sm">
                Review your items and proceed to checkout.
              </p>
            </div>
          </div>

          {/* ── Empty State ─────────────────────────────────────────────── */}
          {items.length === 0 ? (
            <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl">
              <EmptyCart />
            </div>
          ) : (
            /* ── Cart Content: Two-Column Layout ─────────────────────── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* ══ LEFT: Cart Items List ══════════════════════════════════ */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl overflow-hidden">

                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Cart Items
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-[11px] font-black">
                        {totalCount}
                      </span>
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowClearDialog(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Clear Cart</span>
                    </button>
                  </div>

                  {/* Items */}
                  <div className="px-5 sm:px-6">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <CartItemRow
                          key={`${item.id}-${item.size ?? ""}-${item.crust ?? ""}`}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemove={handleRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 sm:px-6 py-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => router.push("/menu")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-zinc-900 text-sm font-semibold text-zinc-200 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Continue Shopping</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ RIGHT: Order Summary ═══════════════════════════════════ */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl sticky top-6 overflow-hidden">

                  {/* Summary Header */}
                  <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-white/5">
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

                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">
                        Subtotal ({totalCount} {totalCount === 1 ? "item" : "items"})
                      </span>
                      <span className="font-bold text-white font-mono">৳ {subtotal}</span>
                    </div>

                    {/* Delivery Location Selector */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        <MapPin className="size-3.5 text-orange-500" />
                        Delivery Location
                      </label>

                      <div className="grid grid-cols-2 gap-2.5">
                        {DELIVERY_OPTIONS.map((option) => {
                          const isSelected = deliveryOption === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setDeliveryOption(option.id)}
                              className={`w-full rounded-2xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "border-orange-500 bg-orange-500/10 shadow-[0_0_16px_rgba(249,115,22,0.15)]"
                                  : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {/* Radio indicator */}
                                <span
                                  className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                    isSelected
                                      ? "border-orange-500 bg-orange-500"
                                      : "border-zinc-500"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="size-1.5 rounded-full bg-white" />
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <p
                                    className={`text-xs font-bold leading-tight ${
                                      isSelected ? "text-orange-400" : "text-white"
                                    }`}
                                  >
                                    {option.label}
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-zinc-400 font-medium">
                                    Delivery charge:{" "}
                                    <strong className="text-orange-400">
                                      ৳ {option.charge}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {!deliveryOption && (
                        <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                          <Info className="size-3 shrink-0" />
                          Select a delivery location to continue.
                        </p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/5" />

                    {/* Delivery Charge Row */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        Delivery Charge
                        <Info className="size-3 text-zinc-500" />
                      </span>
                      <span className="font-semibold text-zinc-200 font-mono">
                        {deliveryOption ? `৳ ${deliveryCharge}` : "—"}
                      </span>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-black text-white">Total Amount</span>
                      <span className="text-2xl font-black text-orange-500 font-mono tracking-tight">
                        ৳ {totalAmount}
                      </span>
                    </div>

                    {/* CTA: Proceed to Checkout */}
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={!canCheckout}
                      className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg ${
                        canCheckout
                          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-95 active:scale-[0.99] shadow-orange-950/40 cursor-pointer"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span>Proceed to Checkout</span>
                      <ChevronRight className="size-4" />
                    </button>

                    {!deliveryOption && items.length > 0 && (
                      <p className="text-center text-[11px] text-zinc-500">
                        Choose a delivery location to enable checkout.
                      </p>
                    )}

                    {/* Security note */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                      <ShieldCheck className="size-3 text-zinc-500" />
                      <span>Secure &amp; encrypted checkout</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Trust Badge Strip ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.title}
                className="flex items-center gap-3 rounded-2xl bg-[#141416] border border-white/5 px-4 py-3.5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-500">
                  <badge.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{badge.title}</p>
                  <p className="text-[10px] text-zinc-500">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* ── Clear Cart Confirmation Dialog ─────────────────────────────── */}
      <AnimatePresence>
        {showClearDialog && (
          <ClearCartDialog
            onConfirm={handleClearCart}
            onCancel={() => setShowClearDialog(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
