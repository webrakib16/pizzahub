"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface FeatureItem {
  id: string;
  title: string;
  lines: [string, string];
  tag: string;
  badge: string;
  shortDesc: string;
  highlight: string;
  desktopPos: {
    left: string;
    top: string;
    lineX: number;
    lineY1: number;
    lineY2: number;
    dotY: number;
  };
}

const features: FeatureItem[] = [
  {
    id: "freshly-made",
    title: "Freshly Made Pizzas",
    lines: ["Freshly Made", "Pizzas"],
    tag: "Artisan Quality",
    badge: "100% Fresh Daily",
    shortDesc: "Slow-fermented dough rolled daily, topped with vine-ripened tomato sauce and whole-milk mozzarella.",
    highlight: "Stone-deck baked on order",
    desktopPos: {
      left: "14%",
      top: "22%",
      lineX: 140,
      lineY1: 270,
      lineY2: 400,
      dotY: 400,
    },
  },
  {
    id: "multiple-pizzerias",
    title: "Multiple Pizzerias",
    lines: ["Multiple", "Pizzerias"],
    tag: "50+ Kitchens",
    badge: "Curated Variety",
    shortDesc: "Order from iconic local pizzerias and master artisans across the city on one seamless platform.",
    highlight: "Verified independent ovens",
    desktopPos: {
      left: "29%",
      top: "9%",
      lineX: 290,
      lineY1: 175,
      lineY2: 240,
      dotY: 240,
    },
  },
  {
    id: "fast-delivery",
    title: "Fast & Reliable Delivery",
    lines: ["Fast & Reliable", "Delivery"],
    tag: "Avg. 28 Mins",
    badge: "Thermal Heat-Lock",
    shortDesc: "Insulated thermal delivery bags and smart GPS dispatch keep pizzas bubbling hot and crust crisp.",
    highlight: "Real-time courier tracking",
    desktopPos: {
      left: "50%",
      top: "2%",
      lineX: 500,
      lineY1: 125,
      lineY2: 175,
      dotY: 175,
    },
  },
  {
    id: "quality-assurance",
    title: "Quality Assurance",
    lines: ["Quality", "Assurance"],
    tag: "Certified Clean",
    badge: "Safety Guaranteed",
    shortDesc: "Every partner kitchen passes strict food hygiene standards and uses tamper-evident security packaging.",
    highlight: "100% Quality checked",
    desktopPos: {
      left: "71%",
      top: "9%",
      lineX: 710,
      lineY1: 175,
      lineY2: 240,
      dotY: 240,
    },
  },
  {
    id: "friendly-support",
    title: "Friendly Support",
    lines: ["Friendly", "Support"],
    tag: "24/7 Live Care",
    badge: "Dedicated Team",
    shortDesc: "Live assistance ready round-the-clock to modify orders, resolve inquiries, or ensure your satisfaction.",
    highlight: "Instant response guarantee",
    desktopPos: {
      left: "86%",
      top: "22%",
      lineX: 860,
      lineY1: 270,
      lineY2: 400,
      dotY: 400,
    },
  },
];

/* ── Realistic & Premium 3D-Styled SVG Icons with Rich Metallic Gradients & Shading ── */

function PremiumChefHatIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="chefHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="chefBrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#ffc060" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="chefGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f97316" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Puffy Crown with Pleats */}
      <path
        d="M8 18C5.8 18 4 16.2 4 14C4 12.1 5.4 10.5 7.2 10.1C7.1 9.7 7 9.4 7 9C7 5.7 9.7 3 13 3C14.7 3 16.2 3.7 17.2 4.9C18.2 4.3 19.3 4 20.5 4C23.5 4 26 6.5 26 9.5C26 9.8 26 10.2 25.9 10.5C27.1 11.2 28 12.5 28 14C28 16.2 26.2 18 24 18H8Z"
        fill="url(#chefHatGrad)"
        filter="url(#chefGlow)"
      />
      {/* Pleat Crease Highlights */}
      <path d="M12.5 6V17M16.5 5.5V17M20.5 6.5V17" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" />
      {/* Outer Rim Shadow */}
      <path d="M8 18H24V20H8V18Z" fill="#c2410c" />
      {/* Headband Brim */}
      <rect x="7" y="19" width="18" height="6" rx="2" fill="url(#chefBrimGrad)" />
      {/* Headband Accent Grooves */}
      <line x1="9" y1="22" x2="23" y2="22" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      {/* Sparkle Accent */}
      <circle cx="23" cy="7" r="1.2" fill="#ffffff" />
    </svg>
  );
}

function PremiumPizzeriaStoreIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="doorGlow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="storeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f97316" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Awning Canopy */}
      <path
        d="M4 11L6 5H26L28 11L25 14L22 11L19 14L16 11L13 14L10 11L7 14L4 11Z"
        fill="url(#roofGrad)"
        filter="url(#storeGlow)"
      />
      {/* Awning Stripes */}
      <path d="M9.5 5.5L8.5 11.5M15.5 5.5L14.5 11.5M21.5 5.5L20.5 11.5" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Store Base Structure */}
      <rect x="6" y="14" width="20" height="13" rx="2" fill="#18181b" stroke="#f97316" strokeWidth="1.5" />
      {/* Arched Brick Oven Doorway with Golden Glow */}
      <path d="M12 27V19C12 16.8 13.8 15 16 15C18.2 15 20 16.8 20 19V27H12Z" fill="url(#doorGlow)" />
      {/* Display Window */}
      <rect x="8" y="17" width="2.5" height="4" rx="0.5" fill="#f97316" fillOpacity="0.4" />
      <rect x="21.5" y="17" width="2.5" height="4" rx="0.5" fill="#f97316" fillOpacity="0.4" />
      {/* Signboard on Roof */}
      <rect x="11" y="2" width="10" height="3" rx="1" fill="#ffb03a" />
      <circle cx="16" cy="3.5" r="0.8" fill="#18181b" />
    </svg>
  );
}

function PremiumDeliveryScooterIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="scooterBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="wheelRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
        <filter id="scooterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f97316" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Insulated Pizza Delivery Box on Rack */}
      <rect x="3" y="8" width="9" height="9" rx="2" fill="url(#scooterBody)" filter="url(#scooterGlow)" />
      <path d="M3 12H12" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="7.5" cy="14" r="1.2" fill="#ffffff" />
      {/* Handlebars & Stem */}
      <path d="M22 6H25M23.5 6L21 16" stroke="#e4e4e7" strokeWidth="1.8" strokeLinecap="round" />
      {/* Curved Aerodynamic Chassis */}
      <path
        d="M11 17H16C17.5 17 19 18 19.8 19.3L22 23H11"
        fill="none"
        stroke="url(#scooterBody)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cushioned Seat */}
      <path d="M12 14H16.5C17.3 14 18 14.7 18 15.5V16H12V14Z" fill="#3f3f46" />
      {/* Rear Wheel */}
      <circle cx="8" cy="24" r="4.5" fill="url(#wheelRim)" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="8" cy="24" r="1.5" fill="#f4f4f5" />
      {/* Front Wheel */}
      <circle cx="24" cy="24" r="4.5" fill="url(#wheelRim)" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="1.5" fill="#f4f4f5" />
      {/* Headlight Beam */}
      <path d="M25 12L29 11M25 14L28 14" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PremiumQualityBadgeIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f97316" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Twin Ribbons */}
      <path d="M11 20L9 30L14 26L16 28L15 20H11Z" fill="url(#ribbonGrad)" />
      <path d="M21 20L23 30L18 26L16 28L17 20H21Z" fill="url(#ribbonGrad)" />
      {/* Rosette Outer Starburst */}
      <circle cx="16" cy="14" r="11" fill="url(#shieldGrad)" filter="url(#badgeGlow)" />
      {/* Inner Inset Ring */}
      <circle cx="16" cy="14" r="9" fill="#18181b" stroke="#ffb03a" strokeWidth="1.2" />
      {/* Gleaming Checkmark */}
      <path
        d="M12 14L14.8 17L20 11.5"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crown Star Highlight */}
      <circle cx="16" cy="7.5" r="1" fill="#ffedd5" />
    </svg>
  );
}

function PremiumSupportHeadsetIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="headsetBand" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#ffb03a" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="earcupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <filter id="headsetGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f97316" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Over-ear Headband */}
      <path
        d="M6 16C6 10.5 10.5 6 16 6C21.5 6 26 10.5 26 16"
        stroke="url(#headsetBand)"
        strokeWidth="2.8"
        strokeLinecap="round"
        filter="url(#headsetGlow)"
      />
      {/* Metallic Headband Slider Accents */}
      <rect x="5.5" y="14" width="2" height="3" rx="0.5" fill="#f4f4f5" />
      <rect x="24.5" y="14" width="2" height="3" rx="0.5" fill="#f4f4f5" />
      {/* Left Padded Ear Cup */}
      <rect x="4" y="15" width="5" height="9" rx="2.5" fill="url(#earcupGrad)" />
      <rect x="5" y="16.5" width="2" height="6" rx="1" fill="#18181b" />
      {/* Right Padded Ear Cup */}
      <rect x="23" y="15" width="5" height="9" rx="2.5" fill="url(#earcupGrad)" />
      <rect x="25" y="16.5" width="2" height="6" rx="1" fill="#18181b" />
      {/* Flexible Microphone Boom with Indicator */}
      <path
        d="M24 21C24 24.5 21 27 16 27H15"
        stroke="#e4e4e7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Mic Capsule & LED Glow */}
      <circle cx="13" cy="27" r="2.2" fill="#ea580c" />
      <circle cx="13" cy="27" r="1" fill="#ffedd5" />
    </svg>
  );
}

function getFeatureIcon(id: string, className = "size-7") {
  switch (id) {
    case "freshly-made":
      return <PremiumChefHatIcon className={className} />;
    case "multiple-pizzerias":
      return <PremiumPizzeriaStoreIcon className={className} />;
    case "fast-delivery":
      return <PremiumDeliveryScooterIcon className={className} />;
    case "quality-assurance":
      return <PremiumQualityBadgeIcon className={className} />;
    case "friendly-support":
      return <PremiumSupportHeadsetIcon className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export default function WhyChooseUs() {
  // Only show details when hovered (or tapped on touch screens). Default is null.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTouchId, setActiveTouchId] = useState<string | null>(null);

  const currentFeature = features.find((f) => f.id === (hoveredId || activeTouchId));

  return (
    <section className="relative overflow-hidden bg-[#09090b] py-20 sm:py-28 lg:py-32 select-none">
      {/* ── Background Curved Orange Lens Flares ── */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full border border-orange-500/25 opacity-70 blur-[1px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/15 via-transparent to-transparent blur-2xl" />
      </div>
      <div className="pointer-events-none absolute top-4 left-4 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full" />

      <div className="pointer-events-none absolute -bottom-28 -right-28 w-[400px] sm:w-[520px] h-[400px] sm:h-[520px] rounded-full border border-orange-500/30 opacity-80 blur-[1px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-orange-500/20 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 w-40 h-40 bg-orange-600/15 blur-3xl rounded-full" />

      {/* Central Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-orange-500/8 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Top Pill / Badge with side accent lines */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent to-orange-500/70" />
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-500/50 bg-zinc-950/80 backdrop-blur-md shadow-[0_0_15px_rgba(234,88,12,0.15)]">
              <div className="relative size-4 sm:size-5 shrink-0">
                <Image
                  src="/assets/logo-icon.png"
                  alt="PizzaHub Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                <i>Pizza <span className="text-orange-500">Hub</span></i>
              </span>
            </div>
            <div className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent to-orange-500/70" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
            WHY CHOOSE <span className="text-orange-400 italic font-black">PizzaHub?</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            More than just pizza delivery — we bring great taste, local flavours, and a seamless ordering experience to your door.
          </p>
        </motion.div>

        {/* ── DESKTOP ARCH STAGE (lg & xl screens: Exact Visual Match) ── */}
        <div className="hidden lg:block relative w-full max-w-[1000px] h-[600px] mx-auto mt-10">
          {/* SVG Connector Dotted Lines & Glowing Touch Dots */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 600"
            fill="none"
          >
            {features.map((item) => {
              const isHovered = hoveredId === item.id;
              return (
                <g key={item.id}>
                  {/* Vertical Dotted Line */}
                  <line
                    x1={item.desktopPos.lineX}
                    y1={item.desktopPos.lineY1}
                    x2={item.desktopPos.lineX}
                    y2={item.desktopPos.lineY2}
                    stroke={isHovered ? "#ea580c" : "#f97316"}
                    strokeOpacity={isHovered ? 0.95 : 0.6}
                    strokeWidth={isHovered ? 2.5 : 2}
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Glowing Connection Dot on Arch */}
                  <circle
                    cx={item.desktopPos.lineX}
                    cy={item.desktopPos.dotY}
                    r={isHovered ? 6 : 4.5}
                    fill="#f97316"
                    className="transition-all duration-300"
                  />
                  {isHovered && (
                    <circle
                      cx={item.desktopPos.lineX}
                      cy={item.desktopPos.dotY}
                      r={10}
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth={1.5}
                      opacity={0.8}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* 3D Curved Orange Arch - Pure Black-Keyed (Zero White Fade) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[760px] h-[380px] pointer-events-none z-0"
          >
            <Image
              src="/assets/arch-glow.png"
              alt="PizzaHub Arch"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Central Female Character */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[430px] h-[395px] pointer-events-none z-10"
          >
            <Image
              src="/assets/female-clean.png"
              alt="PizzaHub Host"
              fill
              className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)]"
              priority
            />
            {/* Gentle bottom blend */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
          </motion.div>

          {/* 5 Interactive Feature Nodes Distributed Along The Arch */}
          {features.map((item, index) => {
            const isHovered = hoveredId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                style={{
                  left: item.desktopPos.left,
                  top: item.desktopPos.top,
                }}
                className="absolute -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer group"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* ── Compact Floating Premium Detail Card: Floats ABOVE the Icon (Zero Image Overlap) ── */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.94 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`absolute bottom-full mb-3.5 w-60 p-3 rounded-2xl bg-zinc-950/95 border border-orange-500/40 shadow-[0_12px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-xl z-40 pointer-events-none text-left ${
                        index === 0
                          ? "left-0"
                          : index === 4
                          ? "right-0"
                          : "left-1/2 -translate-x-1/2"
                      }`}
                    >
                      {/* Top Specular Accent Line */}
                      <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/80 to-transparent" />

                      {/* Header Badge */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold">
                          <Sparkles className="size-2.5" />
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold">{item.tag}</span>
                      </div>

                      {/* Title & Short Description */}
                      <h4 className="text-white font-extrabold text-xs mt-1">{item.title}</h4>
                      <p className="text-zinc-300 text-[11px] leading-snug mt-1">{item.shortDesc}</p>

                      {/* Single Highlight Bullet */}
                      <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/10 text-[10px] text-orange-300 font-medium">
                        <CheckCircle2 className="size-3 text-orange-400 shrink-0" />
                        <span>{item.highlight}</span>
                      </div>

                      {/* Downward Pointer Triangle Indicator */}
                      <div
                        className={`absolute -bottom-1.5 size-3 bg-zinc-950 border-r border-b border-orange-500/40 rotate-45 ${
                          index === 0
                            ? "left-6"
                            : index === 4
                            ? "right-6"
                            : "left-1/2 -translate-x-1/2"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Squircle Premium Icon Container with Smoked Glass & Metallic Inset */}
                <div
                  className={`relative flex items-center justify-center size-14 rounded-2xl border transition-all duration-300 ${
                    isHovered
                      ? "border-orange-500 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-[0_0_25px_rgba(234,88,12,0.65)] scale-110 -translate-y-1"
                      : "border-orange-500/40 bg-zinc-950/90 shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(234,88,12,0.18)] group-hover:border-orange-500/80 group-hover:scale-105"
                  }`}
                >
                  {getFeatureIcon(item.id, "size-7 drop-shadow-sm")}
                  {/* Subtle inner top highlight */}
                  <div className="absolute inset-x-2 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                </div>

                {/* 2-line Title Matching Reference */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-bold leading-tight transition-colors duration-300 ${
                      isHovered ? "text-orange-400 font-extrabold" : "text-white group-hover:text-orange-300"
                    }`}
                  >
                    {item.lines[0]}
                  </p>
                  <p
                    className={`text-sm font-bold leading-tight transition-colors duration-300 ${
                      isHovered ? "text-orange-400 font-extrabold" : "text-white group-hover:text-orange-300"
                    }`}
                  >
                    {item.lines[1]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── MOBILE & TABLET RESPONSIVE VIEW (Screens < 1024px) ── */}
        <div className="lg:hidden mt-8">
          {/* Centered Arch + Model Display */}
          <div className="relative w-full max-w-[480px] h-[280px] sm:h-[340px] mx-auto overflow-hidden">
            {/* Arch */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] sm:w-[500px] h-[210px] sm:h-[250px] pointer-events-none z-0">
              <Image
                src="/assets/arch-glow.png"
                alt="PizzaHub Arch"
                fill
                className="object-contain"
              />
            </div>
            {/* Model */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] h-[250px] sm:h-[300px] pointer-events-none z-10">
              <Image
                src="/assets/female-clean.png"
                alt="PizzaHub Host"
                fill
                className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
              />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Interactive Feature Pills */}
          <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto py-2 px-2 no-scrollbar">
            {features.map((item) => {
              const isSelected = activeTouchId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTouchId(isSelected ? null : item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white border-transparent shadow-lg shadow-orange-950/60 scale-105"
                      : "bg-zinc-900/90 text-zinc-300 border-white/10 hover:border-orange-500/40"
                  }`}
                >
                  {getFeatureIcon(item.id, "size-4")}
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Detail Card for Mobile / Tablet (Only rendered when user taps a feature) */}
          <div className="mt-4 max-w-sm mx-auto">
            <AnimatePresence>
              {currentFeature && (
                <motion.div
                  key={currentFeature.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-zinc-950/95 border border-orange-500/40 shadow-xl shadow-orange-950/50 relative overflow-hidden"
                >
                  <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-orange-500/10 border border-orange-500/30 shrink-0">
                      {getFeatureIcon(currentFeature.id, "size-5")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold">
                          {currentFeature.badge}
                        </span>
                        <span className="text-zinc-400 text-[10px] font-medium">{currentFeature.tag}</span>
                      </div>

                      <h3 className="text-sm font-extrabold text-white">{currentFeature.title}</h3>
                      <p className="mt-1 text-zinc-300 text-xs leading-relaxed">{currentFeature.shortDesc}</p>

                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-xs text-orange-300">
                        <CheckCircle2 className="size-3 text-orange-400 shrink-0" />
                        <span>{currentFeature.highlight}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
