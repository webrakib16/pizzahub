"use client";

import { useState, useEffect, use } from "react";
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
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  Award,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { addToCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

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

// ─── Sample Customer Reviews ──────────────────────────────────────────────────
const SAMPLE_REVIEWS = [
  {
    id: "r-1",
    author: "Tanvir Ahmed",
    rating: 5,
    date: "2 days ago",
    size: 'Medium (10")',
    crust: "Cheese Burst",
    comment:
      "Hands down one of the best pizzas I've had in a long time! The cheese burst crust was piping hot and delightfully gooey. Arrived within 30 minutes in top condition.",
    verified: true,
    likes: 18,
  },
  {
    id: "r-2",
    author: "Nusrat Jahan",
    rating: 5,
    date: "1 week ago",
    size: 'Large (12")',
    crust: "Classic",
    comment:
      "Generous premium toppings, rich marinara sauce, and perfect crust bake. The whole family loved it for our Friday dinner feast!",
    verified: true,
    likes: 14,
  },
  {
    id: "r-3",
    author: "Fahim Shahriar",
    rating: 4,
    date: "2 weeks ago",
    size: 'Regular (8")',
    crust: "Thin Crust",
    comment:
      "Crispy base and well-balanced seasoning. Very satisfied with the quick delivery and hygiene standards of PizzaHub.",
    verified: true,
    likes: 9,
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MenuItemDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const isLoggedIn = Boolean(session?.user);

  // Client-side authentication guard: redirect to Sign In if not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${id}`)}`);
    }
  }, [isPending, session, router, id]);

  // ── Find Current Product (exclusively from real DB via API) ─────────────
  interface DynamicItem {
    id: string;
    vendorId?: string;
    vendorName?: string;
    shopBio?: string;
    shopLogo?: string;
    shopLocation?: string;
    vendorPremium?: boolean;
    name: string;
    category: string;
    categorySlug?: string;
    price: number;
    location: string;
    description: string;
    image: string;
    primaryImage?: string;
    images?: string[];
    rating?: number;
    reviews?: number;
    badge?: string;
    isActive?: boolean;
    status?: string;
    sizes?: string[];
    crusts?: string[];
    restaurantName?: string;
  }

  const [dbProduct, setDbProduct] = useState<DynamicItem | null>(null);
  const [dbRelated, setDbRelated] = useState<DynamicItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadItem() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        let res = await fetch(`${apiUrl}/api/menu/public/${id}`);
        if (!res.ok) {
          res = await fetch(`/api/menu/public/${id}`);
        }
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDbProduct(data);

            // Fetch related items (can be from any vendor/category, up to 3 items)
            try {
              let relatedList: DynamicItem[] = [];
              if (data.category) {
                let relRes = await fetch(
                  `${apiUrl}/api/menu/public?category=${encodeURIComponent(data.category)}&exclude=${encodeURIComponent(id)}&limit=3`
                );
                if (!relRes.ok) {
                  relRes = await fetch(
                    `/api/menu/public?category=${encodeURIComponent(data.category)}&exclude=${encodeURIComponent(id)}&limit=3`
                  );
                }
                if (relRes.ok) {
                  const relData = await relRes.json();
                  if (Array.isArray(relData)) {
                    relatedList = relData;
                  }
                }
              }

              // If fewer than 3 items in the same category, fetch other approved items across all vendors to show 3 cards
              if (relatedList.length < 3) {
                let anyRes = await fetch(
                  `${apiUrl}/api/menu/public?exclude=${encodeURIComponent(id)}&limit=6`
                );
                if (!anyRes.ok) {
                  anyRes = await fetch(
                    `/api/menu/public?exclude=${encodeURIComponent(id)}&limit=6`
                  );
                }
                if (anyRes.ok) {
                  const anyData = await anyRes.json();
                  if (Array.isArray(anyData)) {
                    for (const otherItem of anyData) {
                      if (relatedList.length >= 3) break;
                      if (!relatedList.some((r) => r.id === otherItem.id)) {
                        relatedList.push(otherItem);
                      }
                    }
                  }
                }
              }

              if (isMounted) {
                setDbRelated(relatedList);
              }
            } catch (relErr) {
              console.error("Error loading related items:", relErr);
            }
          }
        }
      } catch (err) {
        console.error("Error loading pizza details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadItem();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const currentProduct = dbProduct;

  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const isWishlisted = currentProduct ? isInWishlist(currentProduct.id) : false;

  // ── Interactive UI States (Unconditional Hooks for React Rules of Hooks) ─
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("regular");
  const [selectedCrust, setSelectedCrust] = useState<string>("classic");
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // ── Related Products (Real approved vendor items from same category) ──────
  const relatedPizzas = dbRelated;

  // Loading state while checking DB
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-orange-500" />
            <p className="text-zinc-400 text-sm">Loading pizza details…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Invalid Item ID Handling: Show Appropriate Error Screen ──────────────
  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center space-y-6 rounded-3xl bg-[#141416] p-8 sm:p-10 border border-white/10 shadow-2xl">
            <div className="size-20 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
              🍕
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                <AlertCircle className="size-3.5" />
                <span>Error 404: Not Found</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Menu Item Not Found
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                The pizza or menu item with ID <span className="text-orange-400 font-mono font-bold">&ldquo;{id}&rdquo;</span> could not be found. It may have been retired or the link is incorrect.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Return to Full Menu</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Item Details & Availability ───────────────────────────────────────────
  const prodVendorName =
    ("vendorName" in currentProduct && currentProduct.vendorName)
      ? currentProduct.vendorName
      : ("restaurantName" in currentProduct && currentProduct.restaurantName)
        ? currentProduct.restaurantName
        : "PizzaHub Partner";

  const prodImage =
    ("primaryImage" in currentProduct && currentProduct.primaryImage)
      ? currentProduct.primaryImage
      : currentProduct.image;

  const item = {
    id: currentProduct.id,
    name: currentProduct.name,
    category: currentProduct.category,
    categorySlug: currentProduct.categorySlug,
    price: currentProduct.price,
    restaurantName: prodVendorName,
    location: currentProduct.location,
    description:
      currentProduct.description ||
      (currentProduct as unknown as { vendorInfo?: string }).vendorInfo ||
      "Authentic freshly baked pizza crafted with premium mozzarella and fresh ingredients.",
    image: prodImage,
    rating: currentProduct.rating ?? 4.8,
    reviews: currentProduct.reviews ?? 250,
    badge: currentProduct.badge || "Bestseller",
    isActive: currentProduct.isActive !== false,
    status: currentProduct.status || "approved",
  };

  const vendorShopName = dbProduct?.vendorName || prodVendorName || "PizzaHub Restaurant";
  const vendorShopBio = dbProduct?.shopBio || "Premium pizzas, fast delivery, and high hygiene ratings.";
  const vendorShopLogo = dbProduct?.shopLogo || "";
  const vendorShopLocation = dbProduct?.shopLocation || item.location;
  const isVendorPremium = Boolean(dbProduct?.vendorPremium);

  // Only approved and active items can be ordered
  const canOrder = item.isActive && item.status === "approved";

  // Role Checks
  const userRole = session?.user?.role;

  // ── Gallery Images (Supports uploaded images array or fallback photography) ─
  const productImages = (currentProduct as unknown as { images?: string[] })?.images;
  const galleryImages = Array.isArray(productImages) && productImages.length > 0
    ? productImages
    : [
      item.image,
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1000&auto=format&fit=crop&q=80",
    ];

  // ── Dynamic Pricing Calculation (Unit price + Total price) ─────────────────
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
  };

  const handleRelatedWishlistToggle = (
    prod: {
      id: string;
      name: string;
      price: number;
      image: string;
      description?: string;
      rating?: number;
      reviews?: number;
      badge?: string;
    },
    e: React.MouseEvent
  ) => {
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
    const added = toggleWishlistItem({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      description: prod.description,
      rating: prod.rating,
      reviews: prod.reviews,
      badge: prod.badge,
    });
    toast.add({
      title: added ? "Saved to wishlist!" : "Removed from wishlist",
      type: "success",
    });
  };

  // ── Validation Guard: Ordering Rules ──────────────────────────────────────
  const validateOrderAction = (): boolean => {
    if (!isLoggedIn) {
      toast.add({
        title: "Please sign in to place an order",
        type: "info",
      });
      router.push("/sign-in");
      return false;
    }

    if (userRole === "admin") {
      toast.add({
        title: "Admins cannot place customer orders",
        type: "error",
      });
      return false;
    }

    if (!canOrder) {
      toast.add({
        title: "Only approved and active items can be ordered",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!validateOrderAction()) return;

    const sizeLabel = SIZE_OPTIONS.find((s) => s.value === selectedSize)?.label;
    const crustLabel = CRUST_OPTIONS.find((c) => c.value === selectedCrust)?.label;

    // Add to cart state and update Navbar badge
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: unitPrice,
        image: item.image,
        size: sizeLabel,
        crust: crustLabel,
      },
      quantity
    );

    setIsAddedToCart(true);
    toast.add({
      title: `${quantity}x ${item.name} added to cart! (৳ ${totalPrice})`,
      type: "success",
    });
    setTimeout(() => setIsAddedToCart(false), 1400);
  };

  const handleOrderNow = () => {
    if (!validateOrderAction()) return;

    const sizeLabel = SIZE_OPTIONS.find((s) => s.value === selectedSize)?.label;
    const crustLabel = CRUST_OPTIONS.find((c) => c.value === selectedCrust)?.label;

    addToCart(
      {
        id: item.id,
        name: item.name,
        price: unitPrice,
        image: item.image,
        size: sizeLabel,
        crust: crustLabel,
      },
      quantity
    );

    router.push("/checkout");
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
        <div className="max-w-7xl mx-auto space-y-8">

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
                      unoptimized
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
                  className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-orange-500/70 hover:scale-105 transition-all shadow-md z-10 cursor-pointer"
                >
                  <Heart
                    className={`size-5 transition-colors ${isWishlisted ? "fill-orange-500 text-orange-500" : "text-white"
                      }`}
                  />
                </button>

                {/* Previous Image Navigation Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 hover:scale-105 transition-all shadow-md z-10 cursor-pointer"
                >
                  <ChevronLeft className="size-5" />
                </button>

                {/* Next Image Navigation Arrow Button */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 hover:scale-105 transition-all shadow-md z-10 cursor-pointer"
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
                      className={`relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${isActive
                        ? "border-2 border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-950/50 scale-[1.02]"
                        : "border border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                        }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        unoptimized
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
                {vendorShopLogo ? (
                  <div className="relative size-16 sm:size-20 shrink-0 rounded-2xl overflow-hidden border border-orange-500/40 shadow-inner">
                    <Image
                      src={vendorShopLogo}
                      alt={vendorShopName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-16 sm:size-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-zinc-950 border border-orange-500/40 text-orange-500 p-2 text-center shadow-inner">
                    <span className="text-2xl leading-none">🍕</span>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-white mt-1 leading-tight">
                      PizzaHub
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-orange-400">
                      Outlet
                    </span>
                  </div>
                )}

                {/* Vendor Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    About Vendor
                  </span>

                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-white truncate">
                      {vendorShopName}
                    </h4>
                    {/* Orange verified checkmark badge */}
                    <span className="flex size-4 items-center justify-center rounded-full bg-orange-500 text-white shrink-0">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    {isVendorPremium && (
                      <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                        Premium
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400">
                    {vendorShopBio}
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
                      <MapPin className="size-3.5 text-orange-400" />
                      <span>{vendorShopLocation}</span>
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
                <div className="flex items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-bold">
                    <span>🍕</span>
                    <span>{item.category}</span>
                  </div>

                  {!canOrder && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold">
                      <AlertCircle className="size-3 text-amber-500" />
                      <span>Currently Unavailable</span>
                    </div>
                  )}
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
                    <span>{item.badge}</span>
                  </div>
                </div>

                {/* Product Description */}
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* 2. Price, Quantity Selector, Add to Cart & Order Now */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
                {/* Price in BDT - dynamically syncs with quantity */}
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-3xl sm:text-4xl font-black text-orange-500 font-mono tracking-tight">
                    ৳ {totalPrice}
                  </span>
                </div>

                {/* Quantity Selector: Minus, Value, Plus */}
                <div className="flex items-center rounded-full border border-white/15 bg-[#141416] p-1 shadow-inner shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !canOrder}
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
                    disabled={!canOrder}
                    aria-label="Increase quantity"
                    className="flex size-7 sm:size-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA (red-to-orange gradient rounded button) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canOrder}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg shadow-orange-950/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isAddedToCart
                    ? "bg-emerald-600 text-white scale-95"
                    : "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-95 active:scale-95"
                    }`}
                >
                  <ShoppingCart className="size-4" />
                  <span>{isAddedToCart ? "Added!" : "Add to Cart"}</span>
                </button>

                {/* Order Now Button: text color is red-to-orange gradient */}
                <button
                  type="button"
                  onClick={handleOrderNow}
                  disabled={!canOrder}
                  className="px-6 py-3 rounded-full border border-white/20 bg-[#161619] hover:border-orange-500/60 hover:bg-[#1a1a1e] active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent font-black text-xs sm:text-sm">
                    Order Now
                  </span>
                </button>
              </div>

              {!canOrder && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 flex items-center gap-2.5 text-xs text-amber-400">
                  <AlertCircle className="size-4 shrink-0 text-amber-500" />
                  <span>This item is currently inactive or awaiting approval and cannot be ordered.</span>
                </div>
              )}

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
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${isSelected
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
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${isSelected
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
                <Link
                  href={`/menu?search=${encodeURIComponent(item.restaurantName || "")}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-zinc-900 text-xs font-semibold text-zinc-200 hover:text-white hover:border-orange-500/50 transition-colors shrink-0 cursor-pointer"
                >
                  <span>View Vendor</span>
                  <span>→</span>
                </Link>
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
                {relatedPizzas.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-[#141416] p-6 text-center">
                    <p className="text-zinc-400 text-xs">
                      More chef recommendations coming soon!
                    </p>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 mt-2"
                    >
                      <span>Explore all pizzas</span>
                      <span>→</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {relatedPizzas.slice(0, 3).map((prod) => {
                      const displayImg = prod.primaryImage || prod.image || "";
                      const isRelFav = isInWishlist(prod.id);
                      return (
                        <Link
                          key={prod.id}
                          href={`/menu/${prod.id}`}
                          className="group flex flex-col justify-between rounded-2xl bg-[#141416] p-3 border border-white/10 hover:border-orange-500/50 hover:shadow-[0_4px_20px_rgba(249,115,22,0.18)] hover:-translate-y-1 transition-all duration-300"
                        >
                          <div>
                            {/* Image with Wishlist Button */}
                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5">
                              {displayImg ? (
                                <Image
                                  src={displayImg}
                                  alt={prod.name}
                                  fill
                                  unoptimized
                                  sizes="(max-width: 640px) 100vw, 33vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="size-full flex items-center justify-center text-3xl">🍕</div>
                              )}

                              <button
                                type="button"
                                onClick={(e) => handleRelatedWishlistToggle({ ...prod, image: displayImg }, e)}
                                aria-label="Wishlist"
                                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-orange-500/60 transition-colors cursor-pointer"
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
                )}
              </div>

            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              REVIEWS & RATINGS SECTION: Customer feedback & vendor breakdown
             ═════════════════════════════════════════════════════════════════ */}
          <section className="pt-8 border-t border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <MessageSquare className="size-5 text-orange-500" />
                  <span>Customer Reviews & Ratings</span>
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                  Real feedback from verified pizza lovers who ordered {item.name}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-semibold">
                  <Award className="size-3.5 text-orange-400" />
                  <span>100% Verified Purchases</span>
                </span>
              </div>
            </div>

            {/* Ratings Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-2xl bg-[#141416] p-6 border border-white/10">
              {/* Score column */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10 text-center">
                <span className="text-5xl font-black text-white font-mono">{item.rating}</span>
                <div className="flex items-center gap-1 my-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400">
                  Based on {item.reviews.toLocaleString()} reviews
                </p>
                <span className="mt-3 text-[11px] font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
                  96% Recommend this pizza
                </span>
              </div>

              {/* Progress bars column */}
              <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
                {[
                  { star: 5, pct: 78 },
                  { star: 4, pct: 15 },
                  { star: 3, pct: 4 },
                  { star: 2, pct: 2 },
                  { star: 1, pct: 1 },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-zinc-400 font-medium shrink-0 flex items-center gap-1">
                      <span>{row.star}</span>
                      <Star className="size-3 text-orange-400 fill-orange-400" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-zinc-400 font-mono text-[11px]">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {SAMPLE_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl bg-[#121215] p-5 border border-white/10 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-sm text-white">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Check className="size-2.5" />
                              <span>Verified Order</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < rev.rating
                            ? "fill-orange-400 text-orange-400"
                            : "text-zinc-600"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span>Size: <strong className="text-zinc-200">{rev.size}</strong></span>
                      <span>•</span>
                      <span>Crust: <strong className="text-zinc-200">{rev.crust}</strong></span>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="size-3" />
                      <span>Helpful ({rev.likes})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}