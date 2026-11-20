import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  HelpCircle,
  Laptop,
  Percent,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import PartnershipForm from "./PartnershipForm";

const STATS = [
  { label: "Active Pizza Lovers", value: "50,000+", icon: Users },
  { label: "Partner Restaurants", value: "150+", icon: Store },
  { label: "On-Time Deliveries", value: "99.4%", icon: Truck },
  { label: "Average Partner Rating", value: "4.9 ★", icon: Sparkles },
];

const PERKS = [
  {
    icon: Percent,
    title: "0% Commission for 30 Days",
    description:
      "Keep 100% of your earnings during your first month. No onboarding fee, no hidden charges.",
    accent: "text-red-400 border-red-500/25 bg-red-500/10",
  },
  {
    icon: Laptop,
    title: "Modern Vendor Dashboard",
    description:
      "Manage your active pizzas, set custom sizes & crusts, and monitor customer orders in real-time.",
    accent: "text-orange-400 border-orange-500/25 bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    title: "Homepage Spotlight",
    description:
      "Premium partners receive prime visibility on our homepage carousel and search results.",
    accent: "text-amber-400 border-amber-500/25 bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Direct & Safe Payments",
    description:
      "Transparent order settlements and transaction reports directly inside your portal.",
    accent: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Submit Your Application",
    description: "Fill out the quick form below with your restaurant details, location, and specialties.",
  },
  {
    step: "02",
    title: "Fast 24h Review",
    description: "Our onboarding team verifies your kitchen info and activates your vendor account.",
  },
  {
    step: "03",
    title: "Upload Your Menu",
    description: "Add your mouth-watering pizzas, prices, toppings, and high-resolution photography.",
  },
  {
    step: "04",
    title: "Start Receiving Orders",
    description: "Accept customer orders, bake hot pizzas, and delight thousands of diners across your city.",
  },
];

const FAQS = [
  {
    q: "How does the Free Plan work for new restaurant partners?",
    a: "Every vendor can start completely free! You can publish up to 3 active menu items and manage unlimited customer orders. When you want to publish more items and get homepage promotion, you can upgrade to Premium anytime.",
  },
  {
    q: "What are the requirements to become a PizzaHub Partner?",
    a: "You must operate a registered food kitchen, cloud kitchen, or restaurant in Dhaka, Chattogram, Rajshahi, or Sylhet and maintain high hygiene and food quality standards.",
  },
  {
    q: "How do I receive and accept customer orders?",
    a: "Once approved, you log into the Vendor Dashboard. Incoming customer orders will appear in your 'Customer Orders' tab with delivery details, where you can Accept or Reject them with one click.",
  },
  {
    q: "How long does the verification take?",
    a: "Our team reviews all submitted applications within 24 hours. Once verified, your kitchen goes live on PizzaHub immediately.",
  },
];

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ── 1. Hero Section ── */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/5">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-orange-500/10 blur-[150px]" />
          <div className="pointer-events-none absolute right-10 top-20 size-[300px] rounded-full bg-red-600/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400 mb-6">
              <Flame className="size-3.5 text-orange-400" />
              <span>Partner With Bangladesh&apos;s #1 Pizza Marketplace</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Grow Your Pizza Business with{" "}
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                PizzaHub
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed">
              Showcase your handcrafted crusts to 50,000+ pizza fans. Enjoy seamless menu publishing, instant order dispatch, zero onboarding fees, and dedicated vendor tools.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#apply-form"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-950/50 hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Apply for Partnership</span>
                <ArrowRight className="size-4" />
              </a>

              <Link
                href="/vendor/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900/80 px-6 py-3.5 text-sm font-bold text-zinc-300 hover:border-white/30 hover:text-white transition-all backdrop-blur-md"
              >
                <Store className="size-4 text-orange-400" />
                <span>Existing Partner Portal</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. Platform Stats Strip ── */}
        <section className="border-b border-white/5 bg-[#0e0e11] py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#141416]/60 p-4 text-center sm:p-5"
                  >
                    <Icon className="size-5 text-orange-400 mb-2" />
                    <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
                    <p className="text-xs font-semibold text-zinc-400 mt-0.5">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Why Partner with Us (Perks) ── */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Why Partner With PizzaHub
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-4xl">
              Everything Your Pizzeria Needs to Thrive
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Built specifically for pizza chefs and kitchens looking to scale revenue with smart technology.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl flex flex-col justify-between hover:border-orange-500/30 transition-colors"
                >
                  <div>
                    <div className={`flex size-11 items-center justify-center rounded-2xl border ${perk.accent} mb-4`}>
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{perk.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{perk.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. How It Works (Steps) ── */}
        <section className="py-16 sm:py-20 border-y border-white/5 bg-[#0e0e11]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Simple Onboarding
              </p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-4xl">
                Get Your Pizzeria Live in 4 Simple Steps
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div
                  key={step.step}
                  className="relative rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-lg"
                >
                  <span className="text-3xl font-black text-orange-500/40 font-mono block mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Partner Plans & Pricing ── */}
        <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Transparent Pricing
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-4xl">
              Choose the Plan That Fits Your Scale
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Start with our 100% Free plan, upgrade to Premium whenever you want unlimited growth.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-3xl border border-white/10 bg-[#141416] p-7 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Free Tier</span>
                <h3 className="text-2xl font-black text-white mt-1">Free Forever</h3>
                <p className="text-3xl font-black text-white mt-3">৳0 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
                <p className="text-xs text-zinc-400 mt-2 mb-6">Perfect for new kitchens and boutique pizza makers testing the platform.</p>

                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Publish up to 3 active menu items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Full Vendor Dashboard & order management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Customer messaging & delivery tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Standard admin approval within 24 hours</span>
                  </li>
                </ul>
              </div>

              <a
                href="#apply-form"
                className="mt-8 block w-full rounded-full border border-white/20 bg-zinc-900 py-3 text-center text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                Apply for Free Tier
              </a>
            </div>

            {/* Premium Plan */}
            <div className="relative rounded-3xl border border-orange-500/40 bg-gradient-to-b from-orange-500/10 via-[#141416] to-[#141416] p-7 shadow-2xl flex flex-col justify-between">
              <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">
                Most Popular
              </span>

              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Premium Growth</span>
                <h3 className="text-2xl font-black text-white mt-1">Premium Partner</h3>
                <p className="text-3xl font-black text-orange-400 mt-3">৳499 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
                <p className="text-xs text-zinc-300 mt-2 mb-6">For established restaurants aiming to dominate pizza deliveries in their city.</p>

                <ul className="space-y-3 text-xs text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-orange-400 shrink-0" />
                    <span className="font-semibold text-white">Unlimited active menu items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-orange-400 shrink-0" />
                    <span className="font-semibold text-white">Homepage Featured Carousel placement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-orange-400 shrink-0" />
                    <span>Official &ldquo;Premium Partner&rdquo; verified badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-orange-400 shrink-0" />
                    <span>Priority review for new menu items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-orange-400 shrink-0" />
                    <span>All Free Tier features included</span>
                  </li>
                </ul>
              </div>

              <a
                href="#apply-form"
                className="mt-8 block w-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-orange-500 py-3 text-center text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all"
              >
                Join as Premium Partner
              </a>
            </div>
          </div>
        </section>

        {/* ── 6. Application Form Section ── */}
        <section id="apply-form" className="scroll-mt-24 py-16 sm:py-24 border-t border-white/5 bg-[#0e0e11]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 mb-3">
                <Store className="size-3.5 text-orange-400" />
                <span>Partner Onboarding Form</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Apply to Become a Partner
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Submit your restaurant information. Our team will review your application and respond within 24 hours.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 sm:p-8 shadow-2xl">
              <PartnershipForm />
            </div>
          </div>
        </section>

        {/* ── 7. FAQ Section ── */}
        <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Got Questions?
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 shadow-md space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="size-4 text-orange-400 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
