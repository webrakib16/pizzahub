"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Star,
  ChevronRight,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { useWishlist, WishlistItem } from "@/hooks/use-wishlist";
import { addToCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toast";

// ─── Pizza Slice SVG Icon for Bottom Banner ──────────────────────────────────
function PizzaSliceIcon({ className = "size-7 text-orange-500" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 22h20L12 2z" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      <circle cx="8" cy="18" r="1" fill="currentColor" />
      <circle cx="16" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

// ─── Clear Wishlist Confirmation Dialog ──────────────────────────────────────
function ClearWishlistDialog({
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
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mx-auto">
          <Trash2 className="size-6" />
        </div>

        <h2 className="text-center text-lg font-black text-white">
          Clear Wishlist?
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Are you sure you want to remove all saved pizzas from your wishlist?
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
            Clear All
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Empty Wishlist State ─────────────────────────────────────────────────────
function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
      <div className="relative">
        <div className="size-28 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
          <Heart className="size-12 text-orange-500/60" />
        </div>
        <div className="absolute -top-1 -right-1 size-5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white text-[10px] font-black">
          0
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
          You haven&apos;t saved any pizzas yet. Explore our menu and save your favourites for later!
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

// ─── Wishlist Item Card ───────────────────────────────────────────────────────
function WishlistCard({
  item,
  onRemove,
  onAddToCart,
  addedId,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  addedId: string | null;
}) {
  const isAdded = addedId === item.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col justify-between rounded-3xl bg-[#141416] p-4 border border-white/10 hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.14)] transition-all duration-300"
    >
      <div>
        {/* Pizza Image Container */}
        <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-zinc-900 mb-4">
          <Link href={`/menu/${item.id}`}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          </Link>

          {/* Remove / Heart button on top right dark circular pill */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from wishlist`}
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:scale-110 transition-all shadow-md cursor-pointer"
          >
            <Heart className="size-4.5 fill-red-500 text-red-500" />
          </button>
        </div>

        {/* Pizza Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug truncate">
          <Link href={`/menu/${item.id}`}>{item.name}</Link>
        </h3>

        {/* Rating & Review / Badge row */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <div className="flex items-center gap-1 text-zinc-300">
            <Star className="size-3.5 fill-orange-400 text-orange-400" />
            <span className="font-bold text-white">{item.rating || 4.8}</span>
            <span className="text-zinc-500">
              ({item.reviews || 420} reviews)
            </span>
          </div>

          {item.badge && (
            <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold">
              {item.badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-xs mt-2 line-clamp-1 leading-relaxed">
          {item.description || "Delicious pizza made with premium toppings and melted cheese."}
        </p>

        {/* Price */}
        <div className="mt-3.5 mb-4">
          <span className="text-xl sm:text-2xl font-black text-orange-500 font-mono tracking-tight">
            ৳ {item.price}
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={() => onAddToCart(item)}
        className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-sm ${
          isAdded
            ? "bg-emerald-600 border-emerald-500 text-white scale-[0.98]"
            : "border-white/15 bg-[#18181c] text-white hover:border-orange-500/60 hover:bg-orange-500/10 active:scale-[0.99]"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="size-4" />
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="size-4 text-orange-400" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </motion.div>
  );
}

// ─── Main Wishlist Page Component ─────────────────────────────────────────────
export default function WishlistPage() {
  const { items, totalCount, removeFromWishlist, clearWishlist } = useWishlist();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    toast.add({
      title: "Removed from wishlist",
      type: "info",
    });
  };

  const handleClearConfirm = () => {
    clearWishlist();
    setShowClearDialog(false);
    toast.add({
      title: "Wishlist cleared",
      type: "success",
    });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      1
    );

    setRecentlyAddedId(item.id);
    toast.add({
      title: `${item.name} added to cart! (৳ ${item.price})`,
      type: "success",
    });

    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white overflow-x-clip">
      {/* Sticky Navbar */}
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Rounded square badge with orange heart icon */}
              <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/25 text-orange-500 shrink-0">
                <Heart className="size-7" />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                    My Wishlist
                  </h1>
                  {totalCount > 0 && (
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black">
                      {totalCount}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-zinc-400 text-sm">
                  Your saved pizzas for later.
                </p>
              </div>
            </div>

            {/* Clear Wishlist Action Button */}
            {totalCount > 0 && (
              <button
                type="button"
                onClick={() => setShowClearDialog(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-[#141416] text-xs font-semibold text-zinc-300 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Trash2 className="size-4" />
                <span>Clear Wishlist</span>
              </button>
            )}
          </div>

          {/* ── Wishlist Content ────────────────────────────────────────── */}
          {items.length === 0 ? (
            <div className="rounded-3xl bg-[#141416] border border-white/10 shadow-xl">
              <EmptyWishlist />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                    addedId={recentlyAddedId}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ── Bottom Banner: "Explore More Pizzas" ─────────────────────── */}
          <div className="rounded-3xl bg-[#141416] border border-white/10 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
                <PizzaSliceIcon className="size-6 sm:size-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Explore More Pizzas
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Discover more delicious pizzas from our menu.
                </p>
              </div>
            </div>

            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/40 hover:opacity-95 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>Browse Menu</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

        </div>
      </main>

      {/* ── Confirmation Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showClearDialog && (
          <ClearWishlistDialog
            onConfirm={handleClearConfirm}
            onCancel={() => setShowClearDialog(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
