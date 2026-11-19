"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MapPin,
  Store,
  Tag,
  X,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  
} from "lucide-react";
import { FEATURED_MENU_ITEMS, FeaturedMenuItem } from "@/data/featured-menu";

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

export default function FeaturedMenuItems() {
  const items: FeaturedMenuItem[] = FEATURED_MENU_ITEMS;
  const [activeRotation, setActiveRotation] = useState(0);
  const [modalItem, setModalItem] = useState<FeaturedMenuItem | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Determine which item is currently front-facing
  const activeIndex =
    Math.round((-activeRotation / ANGLE_PER_ITEM) % ITEM_COUNT + ITEM_COUNT) % ITEM_COUNT;

  const handleCardClick = (index: number, item: FeaturedMenuItem) => {
    if (activeIndex === index) {
      // Already front-facing: open modal
      setModalItem(item);
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
            className="absolute left-2 sm:left-6 z-40 size-11 rounded-full bg-zinc-900/90 hover:bg-orange-500 border border-white/10 hover:border-orange-500 flex items-center justify-center text-white shadow-2xl backdrop-blur-md transition-all duration-300"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Rotate right"
            className="absolute right-2 sm:right-6 z-40 size-11 rounded-full bg-zinc-900/90 hover:bg-orange-500 border border-white/10 hover:border-orange-500 flex items-center justify-center text-white shadow-2xl backdrop-blur-md transition-all duration-300"
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
                stiffness: 140,
                damping: 20,
                mass: 0.9,
              }}
              style={{
                width: "250px",
                height: "380px",
                position: "relative",
                transformStyle: "preserve-3d",
              }}
            >
              {items.map((item, index) => {
                const itemAngle = index * ANGLE_PER_ITEM;
                const isCenter = index === activeIndex;
                const isFav = Boolean(favorites[item.id]);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(index, item)}
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
                      className={`w-full h-full rounded-[24px] overflow-hidden flex flex-col p-3 bg-[#141416] border transition-all duration-300 shadow-2xl ${isCenter
                        ? "border-orange-500/90 ring-2 ring-orange-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(249,115,22,0.35)]"
                        : "border-white/10 opacity-75 hover:opacity-100 hover:border-white/30"
                        }`}
                    >
                      {/* Image Frame with Category & Heart */}
                      <div className="relative h-[185px] w-full rounded-[16px] overflow-hidden bg-zinc-900 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          priority={isCenter}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="260px"
                        />
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
                          onClick={(e) => toggleFavorite(item.id, e)}
                          aria-label="Add to wishlist"
                          className="absolute top-2.5 right-2.5 z-10 size-7 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-red-500 hover:bg-black/80 transition-colors"
                        >
                          <Heart
                            className={`size-3.5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-white/80"
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
                            <span className="text-orange-500 font-extrabold text-sm sm:text-base whitespace-nowrap">
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
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalItem(item);
                            }}
                            className="flex w-full items-center justify-center gap-1.5 h-8 sm:h-9 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/40 hover:opacity-95 active:scale-95 transition-all"
                          >
                            <span>View Details</span>
                            <ArrowRight className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── Interactive Pagination Indicators ── */}
        <div className="flex items-center justify-center gap-2 mt-12 md:mt-16 relative z-30">
          {items.map((item, index) => {
            const isCenter = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCardClick(index, item)}
                aria-label={`Go to item ${index + 1}: ${item.name}`}
                className="group p-1.5"
              >
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${isCenter
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

      {/* ── Exact In-Page Card Detail Modal (Popup) ── */}
      <AnimatePresence>
        {modalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#141416] border border-white/10 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setModalItem(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 size-9 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-black/80 transition-colors"
              >
                <X className="size-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                  <Image
                    src={modalItem.image}
                    alt={modalItem.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-3">
                    {modalItem.category}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {modalItem.name}
                  </h3>

                  <p className="text-3xl font-black text-orange-500 mt-2.5">
                    ৳ {modalItem.price}
                  </p>

                  <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                    {modalItem.vendorInfo}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs sm:text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Store className="size-4 text-orange-500 shrink-0" />
                      <span>
                        Restaurant: <strong className="text-white">{modalItem.restaurantName}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-orange-500 shrink-0" />
                      <span>
                        Location: <strong className="text-white">{modalItem.location}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="size-4 text-orange-500 shrink-0" />
                      <span>
                        Status: <strong className="text-emerald-400 capitalize">{modalItem.status}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/menu/${modalItem.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-950/40 hover:opacity-95 active:scale-95 transition-all text-center"
                    >
                      <ShoppingBag className="size-4" />
                      <span>Order This Item</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
