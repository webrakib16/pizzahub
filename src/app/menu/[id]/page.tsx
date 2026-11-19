"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  ShoppingCart,
  Flame,
  ShieldCheck,
  Truck,
  MapPin,
  Store,
  Check,
  Minus,
  Plus,
  Home,
  Utensils,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { MENU_ITEMS } from "@/data/menu-data";
import { FEATURED_MENU_ITEMS } from "@/data/featured-menu";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

// ─── Customization Pricing Rules ──────────────────────────────────────────────
const SIZE_OPTIONS = [
  { label: 'Regular (8")', value: "regular", priceOffset: 0 },
  { label: 'Medium (10")', value: "medium", priceOffset: 150 },
  { label: 'Large (12")', value: "large", priceOffset: 300 },
] as const;

const CRUST_OPTIONS = [
  { label: "Classic", value: "classic", priceOffset: 0 },
  { label: "Thin Crust", value: "thin", priceOffset: 30 },
  { label: "Cheese Burst", value: "cheese-burst", priceOffset: 100 },
  { label: "Stuffed Crust", value: "stuffed", priceOffset: 120 },
] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MenuItemDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  // ── Find Current Product ──────────────────────────────────────────────────
  const menuItem = MENU_ITEMS.find((m) => m.id === id || m.slug === id);
  const featuredItem = !menuItem
    ? FEATURED_MENU_ITEMS.find((m) => m.id === id || m.slug === id)
    : null;

  const currentProduct = menuItem || (featuredItem as (typeof MENU_ITEMS)[0] | undefined);

  // Fallback / default data if matching item is missing
  const item = useMemo(() => {
    return {
      id: currentProduct?.id || id,
      name: currentProduct?.name || "Classic Pepperoni Pizza",
      category: currentProduct?.category || "Classic Pizzas",
      categorySlug: currentProduct?.categorySlug || "classic",
      price: currentProduct?.price || 550,
      restaurantName: currentProduct?.restaurantName || "PizzaHub Outlet",
      location: currentProduct?.location || "Rajshahi, Bangladesh",
      description:
        currentProduct?.description ||
        "A timeless favorite with rich tomato sauce, premium pepperoni, and melted mozzarella on a perfectly baked crust.",
      image:
        currentProduct?.image ||
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1000&auto=format&fit=crop&q=80",
      rating: currentProduct?.rating || 4.8,
      reviews: currentProduct?.reviews || 1256,
      badge: currentProduct?.badge || "Bestseller",
    };
  }, [currentProduct, id]);

  // ── Gallery Images (5 high-resolution photography assets) ─────────────────
  const galleryImages = useMemo(() => {
    return [
      item.image,
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1000&auto=format&fit=crop&q=80",
    ];
  }, [item.image]);

  // ── Interactive UI States ─────────────────────────────────────────────────
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("regular");
  const [selectedCrust, setSelectedCrust] = useState<string>("classic");
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [relatedWishlist, setRelatedWishlist] = useState<Record<string, boolean>>({});

  // ── Related Products (3 distinct pizza cards) ─────────────────────────────
  const relatedPizzas = useMemo(() => {
    const others = MENU_ITEMS.filter((p) => p.id !== item.id && p.slug !== item.id);
    return others.slice(0, 3);
  }, [item.id]);

  // ── Dynamic Pricing Calculation ───────────────────────────────────────────
  const sizeOffset = SIZE_OPTIONS.find((s) => s.value === selectedSize)?.priceOffset || 0;
  const crustOffset = CRUST_OPTIONS.find((c) => c.value === selectedCrust)?.priceOffset || 0;
  const unitPrice = item.price + sizeOffset + crustOffset;
  const totalPrice = unitPrice * quantity;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      toast.add({
        title: "Please sign in to save pizzas to your wishlist",
        type: "info",
      });
      router.push("/sign-in");
      return;
    }
    setIsWishlisted((prev) => {
      const next = !prev;
      toast.add({
        title: next ? "Added to your wishlist!" : "Removed from wishlist",
        type: "success",
      });
      return next;
    });
  };

  const handleRelatedWishlistToggle = (prodId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.add({
        title: "Please sign in to save pizzas to your wishlist",
        type: "info",
      });
      router.push("/sign-in");
      return;
    }
    setRelatedWishlist((prev) => {
      const next = !prev[prodId];
      toast.add({
        title: next ? "Saved to wishlist!" : "Removed from wishlist",
        type: "success",
      });
      return { ...prev, [prodId]: next };
    });
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.add({
        title: "Please sign in to add items to your cart",
        type: "info",
      });
      router.push("/sign-in");
      return;
    }

    setIsAddedToCart(true);
    toast.add({
      title: `${quantity}x ${item.name} added to cart! (৳ ${totalPrice})`,
      type: "success",
    });
    setTimeout(() => setIsAddedToCart(false), 1400);
  };

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      toast.add({
        title: "Please sign in to complete your order",
        type: "info",
      });
      router.push("/sign-in");
      return;
    }

    toast.add({
      title: `Proceeding to checkout with ${quantity}x ${item.name} (৳ ${totalPrice})`,
      type: "success",
    });
  };

  const handleBackNavigation = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/menu");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white overflow-x-clip">
      {/* ── Navbar ── */}
      <Navbar />

      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Top Bar: Circular Back Button & Breadcrumbs ── */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackNavigation}
              aria-label="Go back"
              className="flex size-9 items-center justify-center rounded-full bg-[#141416] border border-white/10 text-zinc-300 hover:text-white hover:border-orange-500/50 hover:bg-[#18181c] transition-all cursor-pointer shadow-sm shrink-0"
            >
              <ArrowLeft className="size-4" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 overflow-x-auto no-scrollbar py-1">
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors shrink-0">
                <Home className="size-3.5 text-orange-500" />
                <span>Home</span>
              </Link>
              <span className="text-zinc-600 font-bold shrink-0">›</span>

              <Link href="/menu" className="inline-flex items-center gap-1.5 hover:text-white transition-colors shrink-0">
                <Utensils className="size-3.5 text-orange-500" />
                <span>Explore Menu</span>
              </Link>
              <span className="text-zinc-600 font-bold shrink-0">›</span>

              <span className="inline-flex items-center gap-1 text-orange-400 font-bold truncate max-w-[180px] sm:max-w-sm">
                <span>🍕</span>
                <span className="truncate">{item.name}</span>
              </span>
            </nav>
          </div>

          {/* ── Two-Column Product Details Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* ═══════════════════════════════════════════════════════════════
                LEFT SIDE: Image Gallery & About Vendor Card
               ═══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* 1. Large Main Pizza Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden bg-[#121215] border border-white/10 shadow-2xl group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={galleryImages[selectedImageIndex]}
                      alt={`${item.name} view ${selectedImageIndex + 1}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle vignette shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Wishlist Heart Button — top right dark circular pill */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label="Toggle wishlist"
                  className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-orange-500/70 hover:scale-105 transition-all shadow-md z-10"
                >
                  <Heart
                    className={`size-5 transition-colors ${
                      isWishlisted ? "fill-orange-500 text-orange-500" : "text-white"
                    }`}
                  />
                </button>

                {/* Previous Image Navigation Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 hover:scale-105 transition-all shadow-md z-10"
                >
                  <ChevronLeft className="size-5" />
                </button>

                {/* Next Image Navigation Arrow Button */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 hover:scale-105 transition-all shadow-md z-10"
                >
                  <ChevronRight className="size-5" />
                </button>

                {/* Image Counter Badge (1/5) */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white tracking-widest z-10">
                  {selectedImageIndex + 1}/{galleryImages.length}
                </div>
              </div>

              {/* 2. Five Thumbnail Images Below Main Image */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = idx === selectedImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`Select image ${idx + 1}`}
                      className={`relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-2 border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-950/50 scale-[1.02]"
                          : "border border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* 3. About Vendor Card */}
              <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                {/* Vendor Square Logo Badge */}
                <div className="flex size-16 sm:size-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-zinc-950 border border-orange-500/40 text-orange-500 p-2 text-center shadow-inner">
                  <span className="text-2xl leading-none">🍕</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter text-white mt-1 leading-tight">
                    PizzaHub
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-orange-400">
                    Outlet
                  </span>
                </div>

                {/* Vendor Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    About Vendor
                  </span>

                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-white truncate">
                      {item.restaurantName}
                    </h4>
                    {/* Orange verified checkmark badge */}
                    <span className="flex size-4 items-center justify-center rounded-full bg-orange-500 text-white shrink-0">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Premium pizzas, fast delivery, and great taste.
                  </p>

                  {/* Rating, Delivery & Verified Meta Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-1 font-semibold text-white">
                      <Star className="size-3.5 fill-orange-400 text-orange-400" />
                      <span>4.9</span>
                      <span className="text-zinc-500 font-normal">(2,340 reviews)</span>
                    </div>

                    <span className="text-zinc-700 hidden sm:inline">•</span>

                    <div className="flex items-center gap-1 text-zinc-300">
                      <Truck className="size-3.5 text-orange-400" />
                      <span>30–40 min</span>
                    </div>

                    <span className="text-zinc-700 hidden sm:inline">•</span>

                    <div className="flex items-center gap-1 text-orange-400 font-semibold">
                      <ShieldCheck className="size-3.5 text-orange-500" />
                      <span>Verified Vendor</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════════════
                RIGHT SIDE: Product Info, Customizer, Actions & Related
               ═══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 space-y-6">

              {/* 1. Header & Rating */}
              <div>
                {/* Category Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-bold mb-3">
                  <span>🍕</span>
                  <span>{item.category}</span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  {item.name}
                </h1>

                {/* Star rating & Bestseller badge */}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Star className="size-4 fill-orange-400 text-orange-400" />
                    <span className="font-bold text-white">{item.rating}</span>
                    <span className="text-zinc-500">({item.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <span className="text-zinc-700">|</span>

                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
                    <Flame className="size-3 text-orange-500" />
                    <span>Bestseller</span>
                  </div>
                </div>

                {/* Product Description */}
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* 2. Price, Quantity Selector, Add to Cart & Order Now */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
                {/* Price in BDT */}
                <span className="text-3xl sm:text-4xl font-black text-orange-500 font-mono tracking-tight shrink-0">
                  ৳ {unitPrice}
                </span>

                {/* Quantity Selector: Minus, Value, Plus */}
                <div className="flex items-center rounded-full border border-white/15 bg-[#141416] p-1 shadow-inner shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex size-7 sm:size-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Minus className="size-3.5" />
                  </button>

                  <span className="w-8 text-center text-sm font-bold text-white font-mono">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex size-7 sm:size-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA (red-to-orange gradient rounded button) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg shadow-orange-950/40 cursor-pointer ${
                    isAddedToCart
                      ? "bg-emerald-600 text-white scale-95"
                      : "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-95 active:scale-95"
                  }`}
                >
                  <ShoppingCart className="size-4" />
                  <span>{isAddedToCart ? "Added!" : "Add to Cart"}</span>
                </button>

                {/* Order Now Button: NO icon, text color is red-to-orange gradient */}
                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="px-6 py-3 rounded-full border border-white/20 bg-[#161619] hover:border-orange-500/60 hover:bg-[#1a1a1e] active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent font-black text-xs sm:text-sm">
                    Order Now
                  </span>
                </button>
              </div>

              {/* 3. Section: "Customize Your Pizza" */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Customize Your Pizza
                </h3>

                {/* Size Selection */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-400 w-24 shrink-0">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((opt) => {
                      const isSelected = selectedSize === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedSize(opt.value)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-orange-950/50 scale-[1.02]"
                              : "bg-[#141416] border border-white/10 text-zinc-300 hover:border-orange-500/40 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Crust Type Selection */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-400 w-24 shrink-0">
                    Crust Type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CRUST_OPTIONS.map((opt) => {
                      const isSelected = selectedCrust === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedCrust(opt.value)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-orange-950/50 scale-[1.02]"
                              : "bg-[#141416] border border-white/10 text-zinc-300 hover:border-orange-500/40 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Vendor Information Bar */}
              <div className="rounded-2xl border border-white/10 bg-[#121215] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5 text-xs">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="size-4 text-orange-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                        Location
                      </span>
                      <span className="font-semibold text-white">{item.location}</span>
                    </div>
                  </div>

                  <span className="text-zinc-800 hidden sm:inline">|</span>

                  {/* Vendor Name */}
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Store className="size-4 text-orange-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                        Vendor
                      </span>
                      <span className="font-semibold text-white">{item.restaurantName}</span>
                    </div>
                  </div>
                </div>

                {/* View Vendor Button */}
                <button
                  type="button"
                  onClick={() => {
                    toast.add({
                      title: `Viewing vendor profile: ${item.restaurantName}`,
                      type: "info",
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-zinc-900 text-xs font-semibold text-zinc-200 hover:text-white hover:border-orange-500/50 transition-colors shrink-0 cursor-pointer"
                >
                  <span>View Vendor</span>
                  <span>→</span>
                </button>
              </div>

              {/* 5. Related Products: "You Might Also Like" */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    You Might Also Like
                  </h3>
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <span>View All</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* 3 Related Pizza Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {relatedPizzas.map((prod) => {
                    const isRelFav = relatedWishlist[prod.id];
                    return (
                      <Link
                        key={prod.id}
                        href={`/menu/${prod.id}`}
                        className="group flex flex-col justify-between rounded-2xl bg-[#141416] p-3 border border-white/10 hover:border-orange-500/50 hover:shadow-[0_4px_20px_rgba(249,115,22,0.18)] hover:-translate-y-1 transition-all duration-300"
                      >
                        <div>
                          {/* Image with Wishlist Button */}
                          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            <button
                              type="button"
                              onClick={(e) => handleRelatedWishlistToggle(prod.id, e)}
                              aria-label="Wishlist"
                              className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-orange-500/60 transition-colors"
                            >
                              <Heart
                                className={`size-3.5 ${
                                  isRelFav ? "fill-orange-500 text-orange-500" : "text-white"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Product Name */}
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                        </div>

                        {/* Price */}
                        <div className="mt-2 pt-1.5 flex items-center justify-between">
                          <span className="text-sm font-black text-orange-500 font-mono">
                            ৳ {prod.price}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-semibold group-hover:text-orange-400 transition-colors">
                            Details →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
