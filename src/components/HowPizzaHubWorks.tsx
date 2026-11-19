"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Chef Hat Icon for top pill
function ChefHatIcon({ className = "size-4 text-orange-400" }: { className?: string }) {
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
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}

export default function HowPizzaHubWorks() {
  return (
    <section className="relative py-24 md:py-32 bg-[#09090b] overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-orange-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-orange-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-16 md:mb-20">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-500/40 bg-zinc-950/80 backdrop-blur-md mb-6 shadow-sm">
            <ChefHatIcon className="size-4 text-orange-400" />
            <span className="text-sm font-semibold text-white tracking-wide">
              Simple Ordering Process
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            How <span className="text-orange-500">PizzaHub</span> Works
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Get your favourite pizza delivered to your doorstep in just <br /> 3 easy steps.
          </p>
        </div>

        {/* ── 3 Cascading Zigzag Cards Layout with Exact Reference S-Curve ── */}
        <div className="relative max-w-[850px] mx-auto">
          {/* 
            Desktop SVG Curved Connector Path:
            Runs EXACTLY like the reference image:
            1. Starts from the middle right of Card 1 (x: 420, y: 80)
            2. Arcs outward to the right and drops vertically down in an elegant S-curve to the middle left of Card 2 (x: 430, y: 260)
            3. From the lower middle left of Card 2 (x: 430, y: 260), it arcs backward left and drops down to the top right of Card 3 (x: 420, y: 440)
          */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 850 568"
            fill="none"
          >
            {/* Top Curve: Card 1 right edge → horizontal right → curves down into Card 2 top */}
            <path
              d="M 420 84 C 520 84, 550 120, 550 198"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />

            {/* Bottom Curve: Card 2 left edge → horizontal left → curves down into Card 3 top */}
            <path
              d="M 430 270 C 330 270, 300 320, 300 398"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />

            {/* Glowing Accent Node at Card 1 right edge */}
            <circle cx="420" cy="84" r="7" fill="#ffffff" stroke="#f97316" strokeWidth="3.5" />
            {/* Glowing Accent Node at Card 2 left edge */}
            <circle cx="430" cy="270" r="7" fill="#ffffff" stroke="#f97316" strokeWidth="3.5" />
          </svg>

          <div className="flex flex-col gap-10 md:gap-8 relative z-10">
            {/* ── STEP 01 (Left Aligned) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-start w-full"
            >
              <div
                className="relative w-full md:w-[420px] rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#141417] via-[#101013] to-[#0c0c0e] border border-white/10 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1"
                style={{
                  boxShadow:
                    "0 15px 35px -5px rgba(0,0,0,0.8), 0 10px 20px -8px rgba(234,88,12,0.35)",
                }}
              >
                {/* Glowing bottom orange reflection border */}
                <div className="absolute inset-x-8 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-90" />

                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Left 3D Real Pizza Slice from reference */}
                  <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                    <Image
                      src="/assets/steps/step1_pizza.png"
                      alt="Explore & Choose Pizza"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-3.5 py-1 rounded-full border border-orange-500/40 text-orange-400 text-xs font-bold tracking-wider mb-2 bg-orange-500/5">
                      Step 01
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      Explore & Choose
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      Browse our menu, discover delicious pizzas and pick your favourites.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── STEP 02 (Right Aligned) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex justify-end w-full"
            >
              <div
                className="relative w-full md:w-[420px] rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#141417] via-[#101013] to-[#0c0c0e] border border-white/10 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1"
                style={{
                  boxShadow:
                    "0 15px 35px -5px rgba(0,0,0,0.8), 0 10px 20px -8px rgba(234,88,12,0.35)",
                }}
              >
                {/* Glowing bottom orange reflection border */}
                <div className="absolute inset-x-8 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-90" />

                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-3.5 py-1 rounded-full border border-orange-500/40 text-orange-400 text-xs font-bold tracking-wider mb-2 bg-orange-500/5">
                      Step 02
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      Place Your Order
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      Add your favourites to the cart, choose delivery details and checkout securely.
                    </p>
                  </div>

                  {/* Right Premium Glowing Cart Icon from reference */}
                  <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                    <Image
                      src="/assets/steps/step2_cart.png"
                      alt="Place Your Order"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── STEP 03 (Left Aligned) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex justify-start w-full"
            >
              <div
                className="relative w-full md:w-[420px] rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#141417] via-[#101013] to-[#0c0c0e] border border-white/10 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1"
                style={{
                  boxShadow:
                    "0 15px 35px -5px rgba(0,0,0,0.8), 0 10px 20px -8px rgba(234,88,12,0.35)",
                }}
              >
                {/* Glowing bottom orange reflection border */}
                <div className="absolute inset-x-8 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-90" />

                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Left Premium Delivery Scooter from reference */}
                  <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                    <Image
                      src="/assets/steps/step3_scooter.png"
                      alt="Get It Delivered Scooter"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-3.5 py-1 rounded-full border border-orange-500/40 text-orange-400 text-xs font-bold tracking-wider mb-2 bg-orange-500/5">
                      Step 03
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      Get It Delivered
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      Sit back and enjoy your freshly baked pizza, delivered hot to your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Order Now Button matching exact reference gradient & shape ── */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-base shadow-xl shadow-orange-950/50 hover:opacity-95 active:scale-95 transition-all"
          >
            <span>Order Now</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
