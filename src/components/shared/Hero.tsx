import Image from "next/image";
import {
  ArrowRight,
  Bike,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Pizza,
  Search,
} from "lucide-react";

const heroFeatures = [
  { icon: Clock, text: "Made fresh, always" },
  { icon: MapPin, text: "Local shops, real flavor" },
  { icon: Bike, text: "At your door, fast" },
  { icon: Heart, text: "Good food does good" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px] flex flex-col justify-between overflow-hidden bg-zinc-950">
      {/* Background Hero Image */}
      <div className=" absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/hero.jpg"
          alt="Freshly baked pizza with hot stretching mozzarella cheese"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[right_center] sm:object-[right_center] lg:object-[right_center]"
        />

        {/* Left Dark Gradient Overlay for optimal text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 via-35% sm:via-45% to-black/40 lg:to-transparent" />

        {/* Top and Bottom edge gradients for smooth page integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-12 sm:pb-8 lg:px-8">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-wide text-zinc-200 sm:text-sm">
            Freshly Baked &bull; Delivered Hot
          </p>

          {/* Headline */}
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[62px] lg:leading-[1.1]">
            Your Favourite
            <div>
              Pizza, <span className="font-bold text-orange-500">Made Fresh</span>
            </div>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-[530px] text-sm text-zinc-300 leading-relaxed sm:text-base">
            PizzaHub is an easy-to-use pizza ordering and delivery platform where you can explore delicious pizzas, customize your favorites, and order online effortlessly. Enjoy fresh, flavorful pizzas delivered straight to your doorstep...!
          </p>

          {/* Search and Location bar */}
          <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-white/15 bg-zinc-950/70 p-2 shadow-2xl backdrop-blur-md sm:max-w-[480px] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:px-4 sm:py-2">
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-2.5 px-2 py-1.5 sm:px-0">
              <Search className="size-4 shrink-0 text-zinc-400" />
              <input
                type="text"
                placeholder="Search for pizza, deals..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* Separator */}
            <span
              className="hidden h-5 w-px bg-white/15 sm:mx-3 sm:block"
              aria-hidden="true"
            />

            {/* Location Selector */}
            <div className="flex flex-1 items-center justify-between gap-2 px-2 py-1.5 sm:px-0">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>
              <ChevronDown className="size-4 shrink-0 text-zinc-400" />
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="mt-15">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-red-950/40 transition-all hover:opacity-95 hover:shadow-orange-950/50 sm:text-base"
            >
              <Pizza className="size-5 shrink-0" />
              <span>Explore Pizza Menu</span>
              <ArrowRight className="size-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Feature Strip (without white background, dark theme with brand accents) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-y-3 px-4 py-3 sm:justify-between sm:px-6 lg:px-8">
          {heroFeatures.map((item, index) => (
            <div key={item.text} className="flex items-center">
              {index > 0 && (
                <span
                  className="hidden h-4 w-px bg-white/15 md:mr-6 md:block lg:mr-8"
                  aria-hidden="true"
                />
              )}
              <div className="flex items-center gap-2.5 px-2 sm:px-3">
                <item.icon className="size-4 sm:size-[18px] text-orange-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-zinc-300">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
