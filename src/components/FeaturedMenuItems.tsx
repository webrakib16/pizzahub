"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Store,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";

function PizzaSliceIcon({ className = "size-5 text-orange-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 11h.01" />
      <path d="M11 15h.01" />
      <path d="M16 16h.01" />
      <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
      <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
    </svg>
  );
}

// 6 items evenly distributed across 360 degrees = 60 degrees each
const ITEM_COUNT = 6;
const ANGLE_PER_ITEM = 360 / ITEM_COUNT; // 60 deg
const RADIUS = 430; // Compact radius ensuring cards & bottom elements are always visible

const CORE_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

function normalizeCategory(raw: string = ""): string {
  const c = raw.toLowerCase();
  if (c.includes("classic")) return "Classic Pizzas";
  if (c.includes("veg")) return "Vegetarian Pizzas";
  if (c.includes("meat")) return "Meat Lovers";
  if (c.includes("gourmet") || c.includes("special")) return "Specialty / Gourmet Pizzas";
  if (c.includes("side") || c.includes("appetizer")) return "Sides & Appetizers";
  if (c.includes("beverage") || c.includes("dessert") || c.includes("drink")) return "Beverages & Desserts";
  return raw;
}

interface PublicMenuItemDto {
  id: string;
  name: string;
  category?: string;
  price: number;
  vendorName?: string;
  location?: string;
  description?: string;
  primaryImage?: string;
  image?: string;
}

export interface FeaturedItemData {
  id: string;
  name: string;
  category: string;
  price: number;
  restaurantName: string;
  location: string;
  vendorInfo: string;
  image: string;
}

export interface FeaturedItemSlot {
  slotId: string;
  category: string;
  item: FeaturedItemData | null;
}

export default function FeaturedMenuItems() {
  const router = useRouter();
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const [activeRotation, setActiveRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize with the 6 core category slots
  const [slots, setSlots] = useState<FeaturedItemSlot[]>(() =>
    CORE_CATEGORIES.map((cat, idx) => ({
      slotId: `slot-${idx}`,
      category: cat,
      item: null,
    }))
  );

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        let res = await fetch(`${apiUrl}/api/menu/public`);
        if (!res.ok) {
          res = await fetch("/api/menu/public");
        }
        if (res.ok) {
          const allItems = (await res.json()) as PublicMenuItemDto[];
          if (isMounted && Array.isArray(allItems)) {
            // Group approved vendor items by the 6 core categories
            const grouped: Record<string, PublicMenuItemDto[]> = {};
            for (const cat of CORE_CATEGORIES) {
              grouped[cat] = [];
            }

            for (const item of allItems) {
              const matchedCat = normalizeCategory(item.category);
              if (grouped[matchedCat]) {
                grouped[matchedCat].push(item);
              }
            }

            // Fill each category slot with its single best item, or keep empty ("fakha")
            const newSlots: FeaturedItemSlot[] = CORE_CATEGORIES.map((cat, idx) => {
              const catItems = grouped[cat];
              if (catItems && catItems.length > 0) {
                const best = catItems.reduce((prev, current) =>
                  (current.price || 0) > (prev.price || 0) ? current : prev
                );

                return {
                  slotId: `slot-${idx}`,
                  category: cat,
                  item: {
                    id: best.id,
                    name: best.name,
                    category: cat,
                    price: best.price,
                    restaurantName: best.vendorName || "Partner Restaurant",
                    location: best.location || "Dhaka",
                    vendorInfo: best.description || "Authentic wood-fired recipes",
                    image: best.primaryImage || best.image || "",
                  },
                };
              }

              // Category has no vendor items yet -> keep vacant ("fakha")
              return {
                slotId: `slot-${idx}`,
                category: cat,
                item: null,
              };
            });

            setSlots(newSlots);
          }
        }
      } catch (err) {
        console.error("Error loading featured items:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = (item: FeaturedItemData, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      badge: "Featured",
      rating: 4.8,
      reviews: 120,
    });
  };

  // Determine which item is currently front-facing
  const activeIndex =
    Math.round((-activeRotation / ANGLE_PER_ITEM) % ITEM_COUNT + ITEM_COUNT) % ITEM_COUNT;

  const handleCardClick = (index: number, slot: FeaturedItemSlot) => {
    if (activeIndex === index) {
      if (slot.item) {
        // Already front-facing: go directly to details page
        router.push(`/menu/${slot.item.id}`);
      }
    } else {
      // Rotate the cylinder so clicked card comes directly to front (0 deg)
      let diff = index - activeIndex;
      if (diff > ITEM_COUNT / 2) diff -= ITEM_COUNT;
      if (diff < -ITEM_COUNT / 2) diff += ITEM_COUNT;
      setActiveRotation((prev) => prev - diff * ANGLE_PER_ITEM);
    }
  };

  const handlePrev = () => {
    setActiveRotation((prev) => prev + ANGLE_PER_ITEM);
  };

  const handleNext = () => {
    setActiveRotation((prev) => prev - ANGLE_PER_ITEM);
  };

  return (
    <section className="relative py-20 md:py-28 bg-[#0a0a0c] overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-orange-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-orange-500/60" />
            <PizzaSliceIcon className="size-5 text-orange-500" />
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-orange-500/60" />
          </div>

          <h2 className="text-4xl md:text-4xl lg:text-[46px] font-black text-white tracking-tight">
            Featured <span className="text-orange-500">Menu Items</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Interactive 3D Carousel Cylinder. Click any side card to rotate it to front, or click the center card for full details.
          </p>
        </div>

        {/* ── 3D Rotating Cylinder Carousel ── */}
        <div className="relative w-full mt-25 py-8 md:py-12 flex justify-center items-center">
          {/* Nav Controls */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Rotate left"
            className="absolute left-2 sm:left-6 z-40 size-11 rounded-full bg-zinc-900/90 hover:bg-orange-500 border border-white/10 hover:border-orange-500 flex items-center justify-center text-white shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Rotate right"
            className="absolute right-2 sm:right-6 z-40 size-11 rounded-full bg-zinc-900/90 hover:bg-orange-500 border border-white/10 hover:border-orange-500 flex items-center justify-center text-white shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Perspective Cinema Viewport */}
          <div
            className="relative w-full max-w-5xl h-[390px] sm:h-[410px] md:h-[430px] flex items-center justify-center"
            style={{
              perspective: "1100px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* The Rotating 3D Cylinder Container */}
            <motion.div
              animate={{ rotateY: activeRotation }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 22,
                mass: 0.8,
              }}
              style={{
                width: "250px",
                height: "380px",
                position: "relative",
                transformStyle: "preserve-3d",
              }}
            >
              {slots.map((slot, index) => {
                const itemAngle = index * ANGLE_PER_ITEM;
                const isCenter = index === activeIndex;
                const item = slot.item;
                const isFav = item ? isInWishlist(item.id) : false;

                return (
                  <div
                    key={slot.slotId}
                    onClick={() => handleCardClick(index, slot)}
                    style={{
                      position: "absolute",
                      width: "250px",
                      height: "380px",
                      left: "0",
                      top: "0",
                      transform: `rotateY(${itemAngle}deg) translateZ(${RADIUS}px)`,
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                    className="cursor-pointer group select-none"
                  >
                    {/* The Visual Card */}
                    <div
                      className={`w-full h-full rounded-[24px] overflow-hidden flex flex-col p-3 bg-[#141416] border transition-all duration-300 shadow-2xl ${
                        isCenter
                          ? "border-orange-500/90 ring-2 ring-orange-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(249,115,22,0.35)]"
                          : "border-white/10 opacity-75 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      {loading ? (
                        /* Zero-Layout-Shift 3D Skeleton Card */
                        <div className="h-full flex flex-col justify-between animate-pulse">
                          <div className="h-[185px] w-full rounded-[16px] bg-zinc-800/80 mb-2 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-700/80 text-zinc-400">
                              {slot.category}
                            </div>
                            <PizzaSliceIcon className="size-8 text-zinc-700/60" />
                          </div>
                          <div className="p-2.5 flex flex-col flex-1 justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="h-4 w-28 bg-zinc-800 rounded" />
                                <div className="h-4 w-12 bg-zinc-800 rounded" />
                              </div>
                              <div className="h-3 w-32 bg-zinc-800/60 rounded" />
                              <div className="h-3 w-40 bg-zinc-800/40 rounded" />
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-white/5">
                              <div className="h-8 w-full rounded-xl bg-zinc-800/70" />
                            </div>
                          </div>
                        </div>
                      ) : item ? (
                        /* Loaded Card with Real Vendor Item */
                        <>
                          {/* Image Frame with Category & Heart */}
                          <div className="relative h-[185px] w-full rounded-[16px] overflow-hidden bg-zinc-900 shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                unoptimized
                                priority={isCenter}
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="260px"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-4xl">🍕</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-black/30" />

                            {/* Upper Left: Category */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-600/90 text-white shadow-md backdrop-blur-sm">
                                {item.category}
                              </span>
                            </div>

                            {/* Upper Right: Heart */}
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(item, e)}
                              aria-label="Add to wishlist"
                              className="absolute top-2.5 right-2.5 z-10 size-7 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-red-500 hover:bg-black/80 transition-colors"
                            >
                              <Heart
                                className={`size-3.5 transition-colors ${
                                  isFav ? "fill-red-500 text-red-500" : "text-white/80"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Content Area */}
                          <div className="p-2.5 flex flex-col flex-1 justify-between">
                            <div>
                              {/* Name & Price */}
                              <div className="flex items-start justify-between gap-1.5 mb-1">
                                <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-1">
                                  {item.name}
                                </h3>
                                <span className="text-orange-500 font-extrabold text-sm sm:text-base whitespace-nowrap font-mono">
                                  ৳ {item.price}
                                </span>
                              </div>

                              {/* Restaurant & Location */}
                              <div className="space-y-0.5 text-[11px] sm:text-xs text-zinc-400 mt-1">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Store className="size-3 text-orange-500 shrink-0" />
                                  <span className="truncate">{item.restaurantName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="size-3 text-orange-500 shrink-0" />
                                  <span>{item.location}</span>
                                </div>
                              </div>

                              <p className="text-xs text-white mt-1 line-clamp-2">{item.vendorInfo}</p>
                            </div>

                            {/* Bottom CTA Button */}
                            <div className="mt-2 pt-1.5 border-t border-white/5">
                              <Link
                                href={`/menu/${item.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex w-full items-center justify-center gap-1.5 h-8 sm:h-9 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/40 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                              >
                                <span>View Details</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Empty Category Slot ("fakha") */
                        <div className="h-full flex flex-col justify-between p-1">
                          <div className="relative h-[185px] w-full rounded-[16px] border border-dashed border-white/15 bg-zinc-950/50 flex flex-col items-center justify-center text-center p-3">
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-white/10">
                                {slot.category}
                              </span>
                            </div>
                            <div className="size-11 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500/60 mb-2">
                              <UtensilsCrossed className="size-5" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-400">Empty Category</span>
                            <span className="text-[10px] text-zinc-500 mt-1">Awaiting vendor menu items</span>
                          </div>

                          <div className="p-2.5 flex flex-col flex-1 justify-between">
                            <div>
                              <h3 className="text-white/80 font-bold text-sm sm:text-base leading-snug">
                                {slot.category}
                              </h3>
                              <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                                No dishes have been published under this category yet.
                              </p>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-white/5">
                              <Link
                                href="/menu"
                                onClick={(e) => e.stopPropagation()}
                                className="flex w-full items-center justify-center gap-1.5 h-8 sm:h-9 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-orange-500/50 text-xs font-medium transition-all"
                              >
                                <span>Browse Menu</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── Interactive Pagination Indicators ── */}
        <div className="flex items-center justify-center gap-2 mt-12 md:mt-16 relative z-30">
          {slots.map((slot, index) => {
            const isCenter = index === activeIndex;
            return (
              <button
                key={slot.slotId}
                type="button"
                onClick={() => handleCardClick(index, slot)}
                aria-label={`Go to category ${index + 1}: ${slot.category}`}
                className="group p-1.5 cursor-pointer"
              >
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isCenter
                      ? "w-8 bg-gradient-to-r from-red-600 to-orange-500 shadow-lg shadow-orange-500/50"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ── Explore All Menu Items CTA ── */}
        <div className="text-center mt-8 md:mt-12 relative z-30">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-orange-500 text-orange-400 font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm sm:text-base group shadow-xl shadow-orange-950/30"
          >
            <span>Explore All Menu Items</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
