"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Store, UtensilsCrossed, Loader2 } from "lucide-react";
import { safeFetchApi } from "@/lib/api-client";

interface MenuItemDto {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: string;
  primaryImage?: string;
  vendorName?: string;
}

export default function PizzaCategories() {
  const [items, setItems] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLatestItems() {
      try {
        const res = await safeFetchApi("/api/menu/public?limit=6&sort=newest");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setItems(data);
          }
        }
      } catch (err) {
        console.error("Error loading explore menu items:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLatestItems();
    return () => {
      isMounted = false;
    };
  }, []);

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
            <span className="text-sm font-semibold text-orange-400 tracking-wide">
              Fresh From Our Kitchens
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Explore Our <span className="text-orange-500">Menu</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Latest approved creations lovingly crafted by partner restaurants — from artisan pizzas to indulgent sides.
          </p>
        </motion.div>

        {/* ── Cards Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Loader2 className="size-8 animate-spin text-orange-500 mb-3" />
            <span className="text-sm">Loading latest menu items…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#121215] p-12 text-center max-w-xl mx-auto shadow-2xl">
            <div className="size-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Menu Items Published Yet</h3>
            <p className="text-zinc-400 text-sm mb-6">
              New dishes will appear here once approved by our team. Check back shortly!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/40 hover:opacity-90 transition-all"
            >
              Browse Full Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {items.map((item, index) => {
              const displayImg = item.primaryImage || item.image;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                >
                  <Link
                    href="/menu"
                    className="group flex flex-col rounded-[20px] border border-orange-500/35 bg-[#0f0f12] overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:-translate-y-1 block h-full"
                  >
                    {/* Top image */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-900">
                      {displayImg ? (
                        <Image
                          src={displayImg}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-3xl">🍕</div>
                      )}
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#0f0f12] to-transparent" />

                      {/* Category tag — top left */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-600/90 text-white shadow-md backdrop-blur-sm">
                          {item.category}
                        </span>
                      </div>

                      {/* Price tag — top right */}
                      <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-zinc-950/85 backdrop-blur-sm border border-orange-500/40 text-orange-400 text-xs font-black tracking-wide font-mono">
                        ৳ {item.price}
                      </span>
                    </div>

                    {/* Bottom text */}
                    <div className="flex flex-col flex-1 px-5 pb-6 pt-4 justify-between">
                      <div>
                        {/* Vendor shop name & location */}
                        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 gap-2">
                          <span className="inline-flex items-center gap-1.5 truncate text-orange-400 font-semibold text-[11px] uppercase tracking-wider">
                            <Store className="size-3 shrink-0" />
                            <span className="truncate">{item.vendorName || "Partner Restaurant"}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 shrink-0 text-zinc-400 text-[11px]">
                            <MapPin className="size-3 text-orange-500 shrink-0" />
                            <span>{item.location}</span>
                          </span>
                        </div>

                        {/* Item Name */}
                        <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight group-hover:text-orange-50 transition-colors duration-300 line-clamp-1">
                          {item.name}
                        </h3>

                        {/* Description */}
                        <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* CTA button */}
                      <div className="mt-5 flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-900/30 group-hover:opacity-90 transition-opacity duration-200">
                          View Full Menu
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

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
            Explore Full Menu →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
