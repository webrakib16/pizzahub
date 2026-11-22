"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Grid3X3,
  List as ListIcon,
  ChevronDown,
  RotateCcw,
  Check,
  MapPin,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import type { MenuItem } from "@/data/menu-data";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_TABS = [
  { label: "All Items", slug: "all", type: "all" },
  { label: "Classic Pizzas", slug: "classic", type: "classic" },
  { label: "Vegetarian Pizzas", slug: "vegetarian", type: "vegetarian" },
  { label: "Meat Lovers", slug: "meat-lovers", type: "meat" },
  { label: "Gourmet Pizzas", slug: "gourmet", type: "gourmet" },
  { label: "Sides & Appetizers", slug: "sides-appetizers", type: "sides" },
  { label: "Beverages & Desserts", slug: "beverages-desserts", type: "beverages-desserts" },
] as const;

function CategoryTabIcon({ type, className = "size-4" }: { type: string; className?: string }) {
  switch (type) {
    case "all":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2L2 22h20L12 2z" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          <circle cx="8" cy="18" r="1" fill="currentColor" />
          <circle cx="16" cy="18" r="1" fill="currentColor" />
        </svg>
      );
    case "classic":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" strokeDasharray="2 2" opacity="0.4" />
          <circle cx="8" cy="8" r="1.2" fill="currentColor" />
          <circle cx="16" cy="8" r="1.2" fill="currentColor" />
          <circle cx="12" cy="16" r="1.2" fill="currentColor" />
        </svg>
      );
    case "vegetarian":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case "meat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M17.5 4.5a4.5 4.5 0 0 0-6.36 0L5.3 10.34a3 3 0 0 0 0 4.24l4.12 4.12a3 3 0 0 0 4.24 0l5.84-5.84a4.5 4.5 0 0 0 0-6.36Z" />
          <path d="m4 20 2-2" />
          <path d="M3 21a1.5 1.5 0 1 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z" />
        </svg>
      );
    case "sides":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 11l1.5 10h11L19 11" />
          <path d="M5 11h14" />
          <path d="M7 11V4M10 11V2M14 11V3M17 11V5" />
        </svg>
      );
    case "gourmet":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.9 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
      );
    case "beverages-desserts":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M7 8h10l-1.5 13h-7L7 8z" />
          <path d="M5 8h14" />
          <path d="M15 2l-3 6" />
          <circle cx="18" cy="6" r="2.5" />
          <path d="M18 3.5v1M18 8.5v1" />
        </svg>
      );
    default:
      return null;
  }
}

const LOCATIONS = [
  "All Locations",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "PizzaHub Restaurant",
  "Pizza Club",
  "Urban Pizza",
  "Italiano Pizzeria",
] as const;

const SIZES = ["Regular (8\")", "Medium (10\")", "Large (12\")"] as const;
const CRUSTS = ["Classic Crust", "Thin Crust", "Cheese Burst", "Stuffed Crust"] as const;

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Top Rated", value: "top-rated" },
] as const;

// ─── Dual-Thumb Range Slider Component ────────────────────────────────────────

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}

function DualRangeSlider({
  min,
  max,
  step = 20,
  minValue,
  maxValue,
  onChange,
}: DualRangeSliderProps) {
  const minPercent = Math.max(0, Math.min(100, Math.round(((minValue - min) / (max - min)) * 100)));
  const maxPercent = Math.max(0, Math.min(100, Math.round(((maxValue - min) / (max - min)) * 100)));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxValue - step);
    onChange(val, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minValue + step);
    onChange(minValue, val);
  };

  return (
    <div className="w-full space-y-3">
      {/* Price Readout */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-zinc-400">
          Price Range
        </span>
        <span className="font-black text-orange-400 font-mono text-xs">
          ৳ {minValue} — ৳ {maxValue}
        </span>
      </div>

      {/* Slider Track with Dual Thumbs */}
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-800" />
        <div
          className="absolute h-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          aria-label="Minimum price"
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          aria-label="Maximum price"
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-[11px] text-zinc-500 font-medium">
        <span>৳ {min}</span>
        <span>৳ {max}</span>
      </div>
    </div>
  );
}

// ─── Searchable Location Dropdown ─────────────────────────────────────────────

interface SearchableLocationProps {
  selected: string;
  onSelect: (location: string) => void;
}

function SearchableLocationSelect({ selected, onSelect }: SearchableLocationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return LOCATIONS;
    return LOCATIONS.filter((loc) => loc.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between pl-9 pr-3 py-2.5 rounded-xl bg-[#18181c] border border-white/10 text-zinc-200 text-xs font-medium hover:border-orange-500/50 focus:outline-none focus:border-orange-500 transition-colors"
      >
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-orange-500 pointer-events-none" />
        <span className="truncate">{selected}</span>
        <ChevronDown
          className={`size-3.5 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-white/10 bg-[#161619] shadow-2xl z-50 p-2 overflow-hidden"
          >
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location or branch..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5 no-scrollbar">
              {filtered.length > 0 ? (
                filtered.map((loc) => {
                  const isSelected = selected === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        onSelect(loc);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                        isSelected
                          ? "bg-orange-500/15 text-orange-400 font-bold"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{loc}</span>
                      {isSelected && <Check className="size-3 text-orange-500 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <p className="text-zinc-500 text-[11px] text-center py-3">
                  No locations matching &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Filter Panel (Desktop & Mobile Shared) ───────────────────────────────────

interface FilterPanelProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  selectedCrusts: string[];
  onToggleCrust: (crust: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

function FilterPanel({
  minPrice,
  maxPrice,
  onPriceChange,
  selectedSizes,
  onToggleSize,
  selectedCrusts,
  onToggleCrust,
  selectedLocation,
  onSelectLocation,
  onReset,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <SlidersHorizontal className="size-4 text-orange-500" />
          <span>Filter Menu</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
          >
            <RotateCcw className="size-3" />
            Clear All
          </button>
        )}
      </div>

      {/* FILTER 1: Dual-Thumb Price Range */}
      <div className="py-2 border-b border-white/10 pb-5">
        <DualRangeSlider
          min={200}
          max={1200}
          step={20}
          minValue={minPrice}
          maxValue={maxPrice}
          onChange={onPriceChange}
        />
      </div>

      {/* Location Filter */}
      <div className="py-2 border-b border-white/10 pb-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
          Delivery Location & Branch
        </label>
        <SearchableLocationSelect
          selected={selectedLocation}
          onSelect={onSelectLocation}
        />
      </div>

      {/* FILTER 2: Pizza Size (Multi-Select) */}
      <div className="py-2 border-b border-white/10 pb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Pizza Size
          </label>
          {selectedSizes.length > 0 && (
            <span className="text-[11px] text-orange-400 font-semibold">
              {selectedSizes.length} selected
            </span>
          )}
        </div>
        <div className="space-y-2.5">
          {SIZES.map((size) => {
            const checked = selectedSizes.includes(size);
            return (
              <label
                key={size}
                onClick={() => onToggleSize(size)}
                className="flex items-center gap-3 text-xs text-zinc-300 hover:text-white cursor-pointer select-none group"
              >
                <div
                  className={`flex size-4 items-center justify-center rounded border transition-colors ${
                    checked
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500"
                  }`}
                >
                  {checked && <Check className="size-3 stroke-[3]" />}
                </div>
                <span className={checked ? "font-semibold text-white" : ""}>
                  {size}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* FILTER 3: Crust Type (Multi-Select) */}
      <div className="py-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Crust Type
          </label>
          {selectedCrusts.length > 0 && (
            <span className="text-[11px] text-orange-400 font-semibold">
              {selectedCrusts.length} selected
            </span>
          )}
        </div>
        <div className="space-y-2.5">
          {CRUSTS.map((crust) => {
            const checked = selectedCrusts.includes(crust);
            return (
              <label
                key={crust}
                onClick={() => onToggleCrust(crust)}
                className="flex items-center gap-3 text-xs text-zinc-300 hover:text-white cursor-pointer select-none group"
              >
                <div
                  className={`flex size-4 items-center justify-center rounded border transition-colors ${
                    checked
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500"
                  }`}
                >
                  {checked && <Check className="size-3 stroke-[3]" />}
                </div>
                <span className={checked ? "font-semibold text-white" : ""}>
                  {crust}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Zero-Layout-Shift Skeleton Card ──────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#141416] p-3.5 sm:p-4 animate-pulse">
      <div>
        <div className="aspect-[4/3] w-full rounded-xl bg-zinc-900 mb-3.5" />
        <div className="h-5 w-3/4 bg-zinc-800 rounded mb-2" />
        <div className="h-3 w-full bg-zinc-800/80 rounded mb-1.5" />
        <div className="h-3 w-2/3 bg-zinc-800/80 rounded" />
      </div>
      <div className="flex items-center justify-between mt-4 pt-2">
        <div className="h-6 w-16 bg-zinc-800 rounded" />
        <div className="h-8 w-28 bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}

// ─── Main Menu Page Component ─────────────────────────────────────────────────

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
  createdAt?: string;
}

export default function MenuPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [minPrice, setMinPrice] = useState<number>(200);
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCrusts, setSelectedCrusts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Live Menu Items strictly from DB (approved vendor items only)
  const [liveMenuItems, setLiveMenuItems] = useState<MenuItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMenu() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        let res = await fetch(`${apiUrl}/api/menu/public`);
        if (!res.ok) {
          res = await fetch("/api/menu/public");
        }
        if (res.ok) {
          const data = (await res.json()) as PublicMenuItemDto[];
          if (isMounted && Array.isArray(data)) {
            const mapped = data.map((d: PublicMenuItemDto) => {
              const catLower = (d.category || "").toLowerCase();
              let slug:
                | "classic"
                | "vegetarian"
                | "meat-lovers"
                | "gourmet"
                | "sides-appetizers"
                | "beverages-desserts" = "classic";
              if (catLower.includes("veg")) slug = "vegetarian";
              else if (catLower.includes("meat") || catLower.includes("spicy") || catLower.includes("bbq") || catLower.includes("seafood")) slug = "meat-lovers";
              else if (catLower.includes("gourmet") || catLower.includes("special")) slug = "gourmet";
              else if (catLower.includes("side")) slug = "sides-appetizers";
              else if (catLower.includes("dessert") || catLower.includes("drink") || catLower.includes("beverage"))
                slug = "beverages-desserts";

              const primary = d.primaryImage || d.image || "";

              return {
                id: d.id,
                name: d.name,
                slug: d.id,
                category: d.category || "Classic Pizzas",
                categorySlug: slug,
                price: Number(d.price) || 450,
                restaurantName: d.vendorName || "PizzaHub Partner",
                location: (d.location || "Dhaka") as MenuItem["location"],
                description: d.description || "",
                image: primary,
                rating: 4.8,
                reviews: 190,
                badge: "Approved",
                sizes: ["Regular (8\")", "Medium (10\")", "Large (12\")"] as ("Regular (8\")" | "Medium (10\")" | "Large (12\")")[],
                crusts: ["Classic Crust", "Thin Crust", "Cheese Burst"] as ("Classic Crust" | "Thin Crust" | "Cheese Burst" | "Stuffed Crust")[],
                isPopular: true,
                createdAt: d.createdAt,
                isActive: true,
                status: "approved" as const,
              };
            });

            setLiveMenuItems(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading live menu items:", err);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }

    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  // Interactive UI States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isFilteringLoading, setIsFilteringLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  // Subtle loading transition on filter change — stable ref so React Compiler
  // doesn't add it to effect deps and cause an infinite loop.
  const triggerFilterTransition = useCallback(() => {
    setIsFilteringLoading(true);
    setCurrentPage(1);
    const timer = setTimeout(() => setIsFilteringLoading(false), 140);
    return () => clearTimeout(timer);
  }, []);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    triggerFilterTransition();
  }, [triggerFilterTransition]);

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    triggerFilterTransition();
  }, [triggerFilterTransition]);

  const toggleCrust = useCallback((crust: string) => {
    setSelectedCrusts((prev) =>
      prev.includes(crust) ? prev.filter((c) => c !== crust) : [...prev, crust]
    );
    triggerFilterTransition();
  }, [triggerFilterTransition]);

  const toggleWishlist = useCallback((item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.add({
        title: "Please sign in to save your favorite pizzas!",
        type: "info",
      });
      router.push("/sign-in");
      return;
    }
    const added = toggleWishlistItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      rating: item.rating,
      reviews: item.reviews,
      badge: item.badge,
    });
    toast.add({
      title: added ? "Added to your wishlist!" : "Removed from wishlist",
      type: "success",
    });
  }, [isLoggedIn, router, toggleWishlistItem]);

  const handleViewDetails = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/menu/${id}`);
  }, [router]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedLocation("All Locations");
    setMinPrice(200);
    setMaxPrice(1200);
    setSelectedSizes([]);
    setSelectedCrusts([]);
    setSortBy("popular");
    setCurrentPage(1);
    triggerFilterTransition();
  }, [triggerFilterTransition]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeCategory !== "all" ||
    selectedLocation !== "All Locations" ||
    minPrice > 200 ||
    maxPrice < 1200 ||
    selectedSizes.length > 0 ||
    selectedCrusts.length > 0;

  const activeFiltersCount =
    (searchQuery.trim() ? 1 : 0) +
    (activeCategory !== "all" ? 1 : 0) +
    (selectedLocation !== "All Locations" ? 1 : 0) +
    (minPrice > 200 || maxPrice < 1200 ? 1 : 0) +
    selectedSizes.length +
    selectedCrusts.length;

  // ── Combined Filtering Logic ────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return liveMenuItems.filter((item) => {
      // Search by Name (case-insensitive)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Filter by Category
      if (activeCategory !== "all" && item.categorySlug !== activeCategory) {
        return false;
      }

      // Filter by Location / Branch
      if (selectedLocation !== "All Locations") {
        const matchesCity = item.location === selectedLocation;
        const matchesBranch = item.restaurantName === selectedLocation;
        if (!matchesCity && !matchesBranch) {
          return false;
        }
      }

      // Filter by Price Range (AND)
      if (item.price < minPrice || item.price > maxPrice) {
        return false;
      }

      // Filter by Size (OR within group, AND with others)
      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((s) => item.sizes.includes(s as (typeof SIZES)[number]))
      ) {
        return false;
      }

      // Filter by Crust (OR within group, AND with others)
      if (
        selectedCrusts.length > 0 &&
        !selectedCrusts.some((c) => item.crusts.includes(c as (typeof CRUSTS)[number]))
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return (b.createdAt || b.id).localeCompare(a.createdAt || a.id);
      if (sortBy === "top-rated") return b.rating - a.rating || b.reviews - a.reviews;
      // Default: popular
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.reviews - a.reviews;
    });
  }, [
    liveMenuItems,
    searchQuery,
    activeCategory,
    selectedLocation,
    minPrice,
    maxPrice,
    selectedSizes,
    selectedCrusts,
    sortBy,
  ]);

  // ── Pagination Calculation ────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

  // Reset to page 1 whenever filters change
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white overflow-x-clip">
      {/* ── 1. Navbar ── */}
      <Navbar />

      <main className="flex-1">
        {/* ── 2. Menu Hero Section ── */}
        <section className="relative overflow-hidden bg-[#0c0c0e] border-b border-white/5">
          <div className="pointer-events-none absolute -top-24 left-1/4 w-[500px] h-[300px] bg-orange-600/10 blur-[130px] rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:col-span-6 z-10"
              >
                {/* Back to Home Page Navigation */}
                <div className="mb-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-orange-400 transition-colors group cursor-pointer"
                  >
                    <ArrowLeft className="size-4 text-orange-500 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                  </Link>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/40 bg-zinc-950/70 backdrop-blur-sm mb-5 shadow-sm">
                  <span className="flex size-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-bold text-orange-400 tracking-wide uppercase">
                    Our Menu
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white tracking-tight leading-[1.15]">
                  Explore Our <span className="text-orange-500">Full Menu</span>
                </h1>

                <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
                  Discover a wide range of delicious pizzas, sides, and refreshing
                  beverages made for every craving.
                </p>

                {/* Hero Search Input */}
                <div className="relative mt-7 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your favourite pizza..."
                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#141416] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Pizza Banner with Cheese Pull */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:col-span-6 relative flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[560px] h-[260px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                  <Image
                    src="/assets/menu-hero-pizza.jpg"
                    alt="Artisan pizza with cheese pull"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/80 via-transparent to-transparent pointer-events-none hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/90 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 3. Category Navigation Bar ── */}
        <section className="sticky top-16 sm:top-[72px] z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 lg:gap-2.5 overflow-x-auto py-3 sm:py-3.5 no-scrollbar scrollbar-none">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    onClick={() => {
                      setActiveCategory(tab.slug);
                      triggerFilterTransition();
                    }}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-orange-950/40 border-t border-x border-t-white/80 border-x-white/40 border-b-2 border-b-orange-400 scale-[1.02]"
                        : "bg-[#141416] border-t border-x border-t-white/80 border-x-white/40 border-b-2 border-b-orange-500 text-zinc-300 hover:text-white hover:border-t-orange-500 hover:border-x-orange-500 hover:border-b-white"
                    }`}
                  >
                    <CategoryTabIcon type={tab.type} className="size-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Main Content Area: Sidebar + Products ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex gap-8 items-start">

            {/* ── DESKTOP FILTER SIDEBAR — sticky, stays fixed while products scroll ── */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-[136px] sm:top-[144px] self-start max-h-[calc(100vh-155px)] overflow-y-auto no-scrollbar">
              <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 shadow-xl">
                <FilterPanel
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  selectedSizes={selectedSizes}
                  onToggleSize={toggleSize}
                  selectedCrusts={selectedCrusts}
                  onToggleCrust={toggleCrust}
                  selectedLocation={selectedLocation}
                  onSelectLocation={(loc) => {
                    setSelectedLocation(loc);
                    triggerFilterTransition();
                  }}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </aside>

            {/* ── RIGHT COLUMN: Products Toolbar, Chips & Grid ── */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Product Result Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                {/* Result count & Mobile filter button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileSheetOpen(true)}
                    className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141416] border border-white/10 text-xs font-bold text-zinc-200 hover:border-orange-500/50 shadow-sm transition-colors"
                  >
                    <SlidersHorizontal className="size-3.5 text-orange-500" />
                    <span>Filter</span>
                    {activeFiltersCount > 0 && (
                      <span className="flex size-4.5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-black">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <p className="text-zinc-400 text-sm">
                    Showing{" "}
                    <span className="text-white font-bold">{filteredItems.length}</span> items
                  </p>
                </div>

                {/* Sort dropdown & Grid/List view toggle */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Sort By Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSortOpen((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141416] border border-white/10 text-xs font-semibold text-zinc-300 hover:border-white/20 transition-colors"
                    >
                      <span className="text-zinc-500">Sort By:</span>
                      <span className="text-white">
                        {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                      </span>
                      <ChevronDown
                        className={`size-3.5 text-zinc-400 transition-transform ${
                          isSortOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#161619] shadow-2xl z-40 overflow-hidden"
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSortBy(opt.value);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                sortBy === opt.value
                                  ? "bg-orange-500/10 text-orange-400 font-bold"
                                  : "text-zinc-300 hover:bg-white/5"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid / List View Buttons */}
                  <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#141416] border border-white/10">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                      aria-label="Grid View"
                      title="Grid View"
                    >
                      <Grid3X3 className="size-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                      aria-label="List View"
                      title="List View"
                    >
                      <ListIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Active Filter Chips (Individual Removes & Clear All) ── */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                  <span className="text-xs text-zinc-500 font-medium">Active Filters:</span>

                  {/* Search Chip */}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium">
                      Search: &ldquo;{searchQuery}&rdquo;
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          triggerFilterTransition();
                        }}
                        aria-label="Remove search filter"
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {/* Category Chip */}
                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium">
                      Category: {CATEGORY_TABS.find((c) => c.slug === activeCategory)?.label}
                      <button
                        onClick={() => {
                          setActiveCategory("all");
                          triggerFilterTransition();
                        }}
                        aria-label="Remove category filter"
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {/* Location Chip */}
                  {selectedLocation !== "All Locations" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium">
                      <MapPin className="size-3" />
                      Location: {selectedLocation}
                      <button
                        onClick={() => {
                          setSelectedLocation("All Locations");
                          triggerFilterTransition();
                        }}
                        aria-label="Remove location filter"
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {/* Price Chip */}
                  {(minPrice > 200 || maxPrice < 1200) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium">
                      Price: ৳ {minPrice} - ৳ {maxPrice}
                      <button
                        onClick={() => handlePriceChange(200, 1200)}
                        aria-label="Reset price filter"
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {/* Individual Size Chips */}
                  {selectedSizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium"
                    >
                      Size: {size}
                      <button
                        onClick={() => toggleSize(size)}
                        aria-label={`Remove size ${size}`}
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}

                  {/* Individual Crust Chips */}
                  {selectedCrusts.map((crust) => (
                    <span
                      key={crust}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium"
                    >
                      Crust: {crust}
                      <button
                        onClick={() => toggleCrust(crust)}
                        aria-label={`Remove crust ${crust}`}
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}

                  {/* Clear All Action */}
                  <button
                    onClick={resetFilters}
                    className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 ml-1 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* ── Error State ── */}
              {hasError ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-red-500/20 bg-red-950/10">
                  <AlertCircle className="size-12 text-red-500 mb-3" />
                  <h3 className="text-xl font-black text-white mb-2">
                    Unable to load menu products
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6">
                    Something went wrong while retrieving the menu. Please check your
                    network connection and try again.
                  </p>
                  <button
                    onClick={() => {
                      setHasError(false);
                      triggerFilterTransition();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-md hover:opacity-95"
                  >
                    <RotateCcw className="size-3.5" />
                    Retry
                  </button>
                </div>
              ) : isFilteringLoading || initialLoading ? (
                /* ── Loading Skeleton State (Zero layout shift) ── */
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                      : "grid grid-cols-1 gap-4"
                  }
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                /* ── Products Display (Grid & List Views) ── */
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                        : "grid grid-cols-1 gap-4"
                    }
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedItems.map((item, index) => {
                        const isFavorited = isInWishlist(item.id);

                        if (viewMode === "list") {
                          // ── Horizontal List View Card ──
                          return (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.25, delay: index * 0.015 }}
                              className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-[#141416] p-4 sm:p-5 border-t border-x border-white/15 border-b-[3px] border-b-orange-500 hover:border-t-orange-500 hover:border-x-orange-500 hover:border-b-white hover:shadow-[0_4px_24px_rgba(234,88,12,0.18)] transition-all duration-300"
                            >
                              {/* Image with heart & badge */}
                              <div className="relative size-36 sm:size-44 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-zinc-900">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="176px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                                  onClick={(e) => handleViewDetails(item.id, e)}
                                />
                                {item.badge && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-bold">
                                    {item.badge}
                                  </span>
                                )}
                                <button
                                  onClick={(e) => toggleWishlist(item, e)}
                                  className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-orange-500/60 transition-colors"
                                  aria-label="Wishlist"
                                >
                                  <Heart
                                    className={`size-4 transition-colors ${
                                      isFavorited ? "fill-orange-500 text-orange-500" : "text-white"
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Details in Center */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                                      {item.category}
                                    </span>
                                    <span className="text-[11px] text-zinc-600">•</span>
                                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                                      <MapPin className="size-2.5 text-orange-500" />
                                      {item.location}
                                    </span>
                                  </div>

                                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                    <button
                                      onClick={(e) => handleViewDetails(item.id, e)}
                                      className="text-left font-bold text-white hover:text-orange-400 transition-colors"
                                    >
                                      {item.name}
                                    </button>
                                  </h3>

                                  <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>

                                {/* Price Row & Action */}
                                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-3 border-t border-white/5">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-zinc-300">Price</span>
                                    <span className="text-2xl font-black text-orange-500 font-mono">
                                      ৳ {item.price}
                                    </span>
                                  </div>

                                  <button
                                    onClick={(e) => handleViewDetails(item.id, e)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-orange-950/40 transition-all"
                                  >
                                    <Eye className="size-4" />
                                    <span>View Details</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        }

                        // ── Grid View Product Card (Clone of User Reference Image) ──
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, delay: index * 0.015 }}
                            className="group flex flex-col justify-between rounded-2xl bg-[#141416] p-3.5 sm:p-4 border-t border-x border-white/15 border-b-[3px] border-b-orange-500 hover:border-t-orange-500 hover:border-x-orange-500 hover:border-b-white hover:shadow-[0_8px_32px_rgba(249,115,22,0.22)] hover:-translate-y-1 transition-all duration-300"
                          >
                            <div>
                              {/* Pizza Image Container */}
                              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-900 mb-3.5">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                                  onClick={(e) => handleViewDetails(item.id, e)}
                                />

                                {/* Wishlist Heart Button - round dark pill with border */}
                                <button
                                  onClick={(e) => toggleWishlist(item, e)}
                                  className="absolute top-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-orange-500/60 transition-colors shadow-sm"
                                  aria-label="Wishlist"
                                >
                                  <Heart
                                    className={`size-4.5 transition-colors ${
                                      isFavorited ? "fill-orange-500 text-orange-500" : "text-white"
                                    }`}
                                  />
                                </button>

                                {item.badge && (
                                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold tracking-wide shadow-md">
                                    {item.badge}
                                  </span>
                                )}
                              </div>

                              {/* Product Name */}
                              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                                <button
                                  onClick={(e) => handleViewDetails(item.id, e)}
                                  className="text-left font-bold text-white hover:text-orange-400 transition-colors"
                                >
                                  {item.name}
                                </button>
                              </h3>

                              {/* Short Description */}
                              <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>

                              {/* Price Row: "Price" on Left, Amount on Right */}
                              <div className="flex items-center justify-between mt-4 mb-3.5 pt-2">
                                <span className="text-sm sm:text-base font-medium text-zinc-300">
                                  Price
                                </span>
                                <span className="text-xl sm:text-2xl font-black text-orange-500 font-mono tracking-tight">
                                  ৳ {item.price}
                                </span>
                              </div>
                            </div>

                            {/* Full-width View Details Button */}
                            <button
                              onClick={(e) => handleViewDetails(item.id, e)}
                              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold shadow-md shadow-orange-950/30 hover:opacity-95 active:scale-[0.99] transition-all"
                            >
                              <Eye className="size-4.5" />
                              <span>View Details</span>
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* ── 5. Pagination (12 items per page) ── */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
                      <p className="text-xs text-zinc-400">
                        Showing{" "}
                        <span className="text-white font-bold">
                          {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>
                        {" - "}
                        <span className="text-white font-bold">
                          {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredItems.length)}
                        </span>
                        {" of "}
                        <span className="text-white font-bold">{filteredItems.length}</span> pizzas
                      </p>

                      <div className="flex items-center gap-1.5">
                        {/* Prev Button */}
                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            window.scrollTo({ top: 400, behavior: "smooth" });
                          }}
                          disabled={safeCurrentPage === 1}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#141416] border border-white/10 text-xs font-bold text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500/50 hover:text-white transition-all"
                        >
                          <ChevronLeft className="size-3.5" />
                          <span>Prev</span>
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          const isCurrent = page === safeCurrentPage;
                          return (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 400, behavior: "smooth" });
                              }}
                              className={`size-9 rounded-xl text-xs font-bold transition-all ${
                                isCurrent
                                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-orange-950/40"
                                  : "bg-[#141416] border border-white/10 text-zinc-400 hover:border-orange-500/40 hover:text-white"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 400, behavior: "smooth" });
                          }}
                          disabled={safeCurrentPage === totalPages}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#141416] border border-white/10 text-xs font-bold text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500/50 hover:text-white transition-all"
                        >
                          <span>Next</span>
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ── Empty State ── */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-white/10 bg-[#121215]"
                >
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 text-3xl mb-4 shadow-inner">
                    🍕
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">No pizzas found</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-6">
                    Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-orange-950/40 transition-opacity"
                  >
                    <RotateCcw className="size-3.5" />
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── MOBILE FILTER DRAWER (shadcn/ui Sheet) ── */}
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent side="right" showCloseButton={false} className="p-6 overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-base font-bold text-white">
                <SlidersHorizontal className="size-4 text-orange-500" />
                <span>Filter Menu</span>
              </SheetTitle>
              <SheetClose className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <X className="size-5" />
              </SheetClose>
            </div>
          </SheetHeader>

          <FilterPanel
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            selectedSizes={selectedSizes}
            onToggleSize={toggleSize}
            selectedCrusts={selectedCrusts}
            onToggleCrust={toggleCrust}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              triggerFilterTransition();
            }}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => setIsMobileSheetOpen(false)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/50 hover:opacity-95 transition-opacity"
            >
              Show {filteredItems.length} Pizzas
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-2.5 rounded-full border border-white/10 text-zinc-400 text-xs font-semibold hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ── 10. Footer ── */}
      <Footer />
    </div>
  );
}
