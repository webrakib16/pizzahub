"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// ─── Realistic 3D Emoji-style SVG Icons ───────────────────────────────────────

/** Classic Pizzas — realistic pizza slice with layered toppings */
function IconPizza() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6">
      <defs>
        <radialGradient id="ic-p-crust" cx="50%" cy="80%" r="70%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <radialGradient id="ic-p-cheese" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <radialGradient id="ic-p-sauce" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <filter id="ic-p-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#451a03" floodOpacity="0.6" />
        </filter>
      </defs>
      {/* Crust (outer arc) */}
      <path d="M4 44 L24 4 L44 44 Z" fill="url(#ic-p-crust)" filter="url(#ic-p-shadow)" />
      {/* Crust highlight */}
      <path d="M24 6 L10 40" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      {/* Sauce base */}
      <path d="M10 40 L24 12 L38 40 Z" fill="url(#ic-p-sauce)" />
      {/* Cheese layer */}
      <path d="M13 38 L24 16 L35 38 Z" fill="url(#ic-p-cheese)" />
      {/* Cheese drip bubbles */}
      <ellipse cx="20" cy="34" rx="3" ry="2" fill="#fde68a" opacity="0.7" />
      <ellipse cx="28" cy="36" rx="2.5" ry="1.8" fill="#fde68a" opacity="0.6" />
      {/* Pepperoni */}
      <circle cx="24" cy="28" r="3.5" fill="#dc2626" />
      <circle cx="24" cy="28" r="3.5" fill="none" stroke="#b91c1c" strokeWidth="0.5" />
      <circle cx="24" cy="27" r="1.2" fill="#fca5a5" opacity="0.4" />
      <circle cx="18" cy="36" r="3" fill="#dc2626" />
      <circle cx="18" cy="35" r="1" fill="#fca5a5" opacity="0.4" />
      <circle cx="30" cy="36" r="3" fill="#dc2626" />
      <circle cx="30" cy="35" r="1" fill="#fca5a5" opacity="0.4" />
      {/* Basil herb dot */}
      <ellipse cx="23" cy="22" rx="1.5" ry="1" fill="#16a34a" opacity="0.85" />
    </svg>
  );
}

/** Vegetarian — realistic fresh lettuce / veggie bowl */
function IconVegetarian() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6">
      <defs>
        <radialGradient id="ic-v-leaf" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
        <radialGradient id="ic-v-leaf2" cx="60%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#166534" />
        </radialGradient>
        <radialGradient id="ic-v-tomato" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <filter id="ic-v-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#14532d" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Background leaf */}
      <path d="M24 6 C38 6 44 18 40 32 C36 42 12 44 8 32 C4 20 10 6 24 6 Z" fill="url(#ic-v-leaf)" filter="url(#ic-v-shadow)" />
      {/* Main vein */}
      <path d="M24 8 C22 18 18 28 12 36" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
      {/* Side veins */}
      <path d="M24 14 C30 14 36 18 38 24" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M23 22 C29 22 34 26 35 31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      {/* Highlight shimmer */}
      <ellipse cx="19" cy="12" rx="6" ry="4" fill="white" opacity="0.2" transform="rotate(-20 19 12)" />
      {/* Small tomato */}
      <circle cx="34" cy="12" r="6" fill="url(#ic-v-tomato)" />
      <ellipse cx="32" cy="10" rx="2.5" ry="1.5" fill="white" opacity="0.3" />
      {/* Tomato stem */}
      <path d="M34 6 C34 4 36 3 36 5" stroke="#15803d" strokeWidth="1.4" strokeLinecap="round" />
      {/* Stem */}
      <path d="M20 38 C18 42 14 44 12 43" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Meat Lovers — realistic BBQ beef / steak */
function IconMeat() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6">
      <defs>
        <radialGradient id="ic-m-meat" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <radialGradient id="ic-m-fat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
        <linearGradient id="ic-m-bone" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <filter id="ic-m-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#451a03" floodOpacity="0.6" />
        </filter>
      </defs>
      {/* Meat body */}
      <path d="M6 28 C6 16 14 8 24 8 C34 8 42 14 42 24 C42 34 34 42 22 40 C12 38 6 34 6 28 Z" fill="url(#ic-m-meat)" filter="url(#ic-m-shadow)" />
      {/* Fat marbling lines */}
      <path d="M14 20 Q22 17 30 22" stroke="url(#ic-m-fat)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M16 27 Q24 24 32 29" stroke="url(#ic-m-fat)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M18 33 Q26 30 33 34" stroke="url(#ic-m-fat)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Highlight / sear shine */}
      <ellipse cx="20" cy="16" rx="8" ry="5" fill="white" opacity="0.12" transform="rotate(-15 20 16)" />
      {/* Bone handle */}
      <rect x="30" y="30" width="14" height="7" rx="3.5" fill="url(#ic-m-bone)" />
      <circle cx="30" cy="33.5" r="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
      <circle cx="44" cy="33.5" r="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
      {/* Grill marks */}
      <path d="M12 24 L18 20" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M15 30 L22 26" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/** Specialty & Gourmet — realistic chef hat */
function IconChefHat() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6">
      <defs>
        <radialGradient id="ic-c-hat" cx="40%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <linearGradient id="ic-c-band" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="ic-c-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="ic-c-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Hat puff */}
      <path d="M10 30 C10 14 15 6 24 6 C33 6 38 14 38 30 Z" fill="url(#ic-c-hat)" filter="url(#ic-c-shadow)" />
      {/* Puff highlight */}
      <ellipse cx="19" cy="14" rx="5" ry="8" fill="white" opacity="0.5" transform="rotate(-10 19 14)" />
      {/* Hat band / brim */}
      <rect x="8" y="29" width="32" height="7" rx="3" fill="url(#ic-c-band)" />
      {/* Band detail line */}
      <line x1="12" y1="32.5" x2="36" y2="32.5" stroke="#fed7aa" strokeWidth="1" opacity="0.4" />
      {/* Brim top highlight */}
      <path d="M10 30 Q24 27 38 30" stroke="white" strokeWidth="1.2" opacity="0.35" />
      {/* Plate base */}
      <rect x="10" y="36" width="28" height="5" rx="2.5" fill="url(#ic-c-base)" />
    </svg>
  );
}

/** Sides & Appetizers — realistic stacked onion rings / plates */
function IconSides() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6">
      <defs>
        <radialGradient id="ic-s-ring1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <radialGradient id="ic-s-ring2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="60%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <radialGradient id="ic-s-ring3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <filter id="ic-s-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#451a03" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Bottom ring */}
      <ellipse cx="24" cy="38" rx="17" ry="5.5" fill="url(#ic-s-ring1)" filter="url(#ic-s-shadow)" />
      <ellipse cx="24" cy="38" rx="10" ry="2.8" fill="#92400e" opacity="0.4" />
      <ellipse cx="21" cy="36" rx="6" ry="2" fill="#fde68a" opacity="0.25" />
      {/* Middle ring */}
      <ellipse cx="24" cy="29" rx="15" ry="5" fill="url(#ic-s-ring2)" filter="url(#ic-s-shadow)" />
      <ellipse cx="24" cy="29" rx="8.5" ry="2.4" fill="#7c2d12" opacity="0.4" />
      <ellipse cx="21" cy="27.5" rx="5" ry="1.8" fill="#fed7aa" opacity="0.25" />
      {/* Top ring */}
      <ellipse cx="24" cy="20" rx="13" ry="4.5" fill="url(#ic-s-ring3)" filter="url(#ic-s-shadow)" />
      <ellipse cx="24" cy="20" rx="7" ry="2.2" fill="#9a3412" opacity="0.4" />
      <ellipse cx="21" cy="18.5" rx="4" ry="1.5" fill="#fed7aa" opacity="0.3" />
    </svg>
  );
}

/** Desserts & Beverages — realistic layered cake with drip */
function IconDessert() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6">
      <defs>
        <linearGradient id="ic-d-cake" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="ic-d-frost" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fefce8" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="ic-d-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="ic-d-drip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <filter id="ic-d-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#451a03" floodOpacity="0.55" />
        </filter>
      </defs>
      {/* Bottom cake tier */}
      <rect x="6" y="32" width="36" height="10" rx="3.5" fill="url(#ic-d-cake)" filter="url(#ic-d-shadow)" />
      <rect x="6" y="32" width="36" height="4" rx="2" fill="url(#ic-d-frost)" />
      {/* Middle tier */}
      <rect x="10" y="22" width="28" height="11" rx="3" fill="url(#ic-d-mid)" filter="url(#ic-d-shadow)" />
      <rect x="10" y="22" width="28" height="4" rx="2" fill="url(#ic-d-frost)" />
      {/* Drips on middle frost */}
      <path d="M15 26 Q14 30 14 29" stroke="url(#ic-d-drip)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 26 Q23 31 23 30" stroke="url(#ic-d-drip)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 26 Q32 30 31 29" stroke="url(#ic-d-drip)" strokeWidth="2" strokeLinecap="round" />
      {/* Top tier */}
      <rect x="14" y="14" width="20" height="9" rx="2.5" fill="url(#ic-d-cake)" filter="url(#ic-d-shadow)" />
      <rect x="14" y="14" width="20" height="3.5" rx="2" fill="url(#ic-d-frost)" />
      {/* Candle */}
      <rect x="22" y="7" width="4" height="8" rx="2" fill="#f1f5f9" />
      <path d="M24 7 C22.5 4 25.5 2 24 1 C24 3 26.5 4.5 24 7 Z" fill="#fbbf24" />
      <ellipse cx="24" cy="4" rx="1.5" ry="2" fill="#f97316" opacity="0.6" />
      {/* Candle highlight */}
      <line x1="23" y1="8" x2="23" y2="13" stroke="white" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

// ─── Category Data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: "classic",
    label: "CLASSIC PIZZAS",
    name: "Napoli Classics",
    description: "Timeless Italian flavors in every bite.",
    count: "24 Items",
    Icon: IconPizza,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&auto=format&fit=crop&q=80",
  },
  {
    slug: "vegetarian",
    label: "VEGETARIAN PIZZAS",
    name: "Garden Harvest",
    description: "Fresh veggies, rich flavors.",
    count: "18 Items",
    Icon: IconVegetarian,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&auto=format&fit=crop&q=80",
  },
  {
    slug: "meat-lovers",
    label: "MEAT LOVERS",
    name: "Carnivore's Crown",
    description: "Loaded with premium meats.",
    count: "15 Items",
    Icon: IconMeat,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80",
  },
  {
    slug: "specialty-gourmet",
    label: "SPECIALTY & GOURMET",
    name: "Artisan Signatures",
    description: "Chef-crafted, premium combinations.",
    count: "12 Items",
    Icon: IconChefHat,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&auto=format&fit=crop&q=80",
  },
  {
    slug: "sides-appetizers",
    label: "SIDES & APPETIZERS",
    name: "Bite & Share",
    description: "Perfect sides to share & enjoy.",
    count: "20 Items",
    Icon: IconSides,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700&auto=format&fit=crop&q=80",
  },
  {
    slug: "desserts-beverages",
    label: "DESSERTS & BEVERAGES",
    name: "Sweet Endings",
    description: "Cakes, treats, and refreshing drinks.",
    count: "16 Items",
    Icon: IconDessert,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PizzaCategories() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-[#09090b] overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-500/50 bg-zinc-950/80 backdrop-blur-md mb-5">
            <span className="text-sm font-semibold text-orange-400 tracking-wide">Browse Categories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Explore Our <span className="text-orange-500">Menu</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Six lovingly curated collections — from timeless Italian classics to indulgent gourmet creations. Find your craving in seconds.
          </p>
        </motion.div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.Icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              >
                <Link
                  href={`/menu?category=${cat.slug}`}
                  className="group flex flex-col rounded-[20px] border border-orange-500/35 bg-[#0f0f12] overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:-translate-y-1 block"
                >
                  {/* ── Top: food image with overlays ── */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/25" />
                    {/* Bottom fade into card bg */}
                    <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#0f0f12] to-transparent" />

                    {/* Icon — top left */}
                    <div className="absolute top-3.5 left-3.5 flex items-center justify-center size-10 rounded-xl bg-zinc-950/80 backdrop-blur-sm border border-orange-500/40 shadow-lg group-hover:border-orange-500/70 group-hover:scale-105 transition-all duration-300">
                      <Icon />
                    </div>

                    {/* Items count — top right */}
                    <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-sm border border-orange-500/40 text-orange-400 text-xs font-bold tracking-wide group-hover:border-orange-500/70 transition-colors duration-300">
                      {cat.count}
                    </span>
                  </div>

                  {/* ── Bottom: text content ── */}
                  <div className="flex flex-col px-5 pb-6 pt-4">
                    {/* Category label */}
                    <span className="text-[11px] font-black tracking-widest uppercase text-orange-500">
                      {cat.label}
                    </span>

                    {/* Category name */}
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-2.5 leading-tight group-hover:text-orange-50 transition-colors duration-300">
                      {cat.name}
                    </h3>

                    {/* Description — 1 line */}
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 truncate">
                      {cat.description}
                    </p>

                    {/* CTA button — centered */}
                    <div className="mt-5 flex justify-center">
                      <span className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-900/30 group-hover:opacity-90 transition-opacity duration-200">
                        View Full Menu
                        <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-14 sm:mt-16"
        >
          <span className="text-zinc-300 font-medium text-sm sm:text-base">
            Want to see everything?
          </span>
          <Link
            href="/menu"
            className="text-orange-500 hover:text-orange-400 font-bold text-sm sm:text-base transition-colors duration-200"
          >
            View Full Menu →
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
