"use client";

import Link from "next/link";
import { Flame, Sparkles, Truck, UtensilsCrossed, Star } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    icon: Flame,
    iconColor: "text-red-400",
    badge: "HOT DEAL",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    text: "Flat 20% OFF on all gourmet pizzas • Use code",
    highlight: "PIZZAHUB20",
    href: "/menu",
  },
  {
    icon: Sparkles,
    iconColor: "text-orange-400",
    badge: "PARTNER WITH US",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    text: "Own a pizza kitchen? Reach 50,000+ hungry diners across Bangladesh",
    highlight: "Learn More →",
    href: "/partnership",
  },
  {
    icon: Truck,
    iconColor: "text-amber-400",
    badge: "FAST DELIVERY",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    text: "Piping hot delivery in 30 minutes or your next pizza is on us!",
    highlight: "Order Now",
    href: "/menu",
  },
  {
    icon: UtensilsCrossed,
    iconColor: "text-orange-400",
    badge: "ARTISANAL",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    text: "100% fresh, hand-stretched sourdough & authentic wood-fired crusts",
    highlight: "Explore Menu",
    href: "/menu",
  },
  {
    icon: Star,
    iconColor: "text-yellow-400",
    badge: "TOP RATED",
    badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    text: "Over 12,500+ verified 5-star reviews from happy pizza lovers",
    highlight: "See Reviews",
    href: "/menu",
  },
];

export default function AnnouncementMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-[#0d0d10] via-[#16141a] to-[#0d0d10] py-2 text-xs select-none">
      {/* Subtle glowing side fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-zinc-950 to-transparent" />

      {/* Marquee Track — duplicated for infinite seamless loop */}
      <div className="animate-marquee items-center gap-8">
        {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="inline-flex shrink-0 items-center gap-2.5 transition-colors hover:text-white"
            >
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.badgeColor}`}
              >
                <Icon className={`size-3 ${item.iconColor}`} />
                {item.badge}
              </span>
              <span className="font-medium text-zinc-300">
                {item.text}{" "}
                <strong className="font-extrabold text-orange-400 underline-offset-2 hover:underline">
                  {item.highlight}
                </strong>
              </span>
              <span className="text-zinc-600 px-2" aria-hidden="true">
                ✦
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
