"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Camera,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import AnnouncementMarquee from "./AnnouncementMarquee";
import AvatarUploadModal from "./AvatarUploadModal";

// Role onujayi dashboard er path
function getDashboardHref(role?: string | null) {
  if (role === "vendor") return "/vendor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
}

// Role onujayi profile settings er path
function getProfileSettingsHref(role?: string | null) {
  if (role === "vendor") return "/vendor/profile";
  if (role === "admin") return "/admin/profile";
  return "/profile";
}

// Nav links: Home removed, Browse Menu + Dashboard + Partnership
function getNavLinks(role?: string | null) {
  return [
    { label: "Browse Menu", href: "/menu" },
    { label: "Dashboard", href: getDashboardHref(role) },
    { label: "Partnership", href: "/partnership" },
  ];
}

// Profile image na thakle name theke initials banano hoy
function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const isLoggedIn = Boolean(user);
  const isNotAdmin = user?.role !== "admin";
  const navLinks = getNavLinks(user?.role);
  const wishlistHref = !isLoggedIn ? "/sign-in" : user?.role === "vendor" ? "/vendor/wishlist" : "/wishlist";
  // Floating Wishlist button shows on all pages (including Homepage) whenever user has 1+ items in wishlist (hidden for admins)
  const shouldShowFloatingWishlist = isNotAdmin && wishlistCount > 0;

  // Dropdown er baire click ba Escape chaple dropdown bondho hoy
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  // Logout handler
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();

      if (error) {
        toast.add({
          title: "Could not log you out. Please try again.",
          type: "error",
        });
        setIsSigningOut(false);
        return;
      }

      setProfileOpen(false);
      setMenuOpen(false);
      toast.add({
        title: "Logged out successfully. See you soon!",
        type: "success",
      });
      router.push("/");
      router.refresh();
    } catch {
      toast.add({
        title: "Could not log you out. Please try again.",
        type: "error",
      });
      setIsSigningOut(false);
    }
  };

  const closeAll = () => {
    setProfileOpen(false);
    setMenuOpen(false);
  };

  // Avatar: image thakle seta, nahole initials
  const avatar = user?.image ? (
    // eslint-disable-next-line @next/next/no-img-element -- avatar URL dynamic (Google/ImgBB), tai plain img use kora hoyeche
    <img
      src={user.image}
      alt={user.name || "User avatar"}
      className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
    />
  ) : (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-sm font-bold text-white ring-1 ring-white/20">
      {getInitials(user?.name)}
    </span>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md">
        {/* Top Announcement Marquee Bar */}
        <AnnouncementMarquee />

        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Logo: icon image + text lockup (source logo er white bg remove kora) */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Image
            src="/assets/logo-icon.png"
            alt="PizzaHub icon"
            width={318}
            height={316}
            priority
            className="h-9 w-auto sm:h-10"
          />
          <span className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight sm:text-[22px]">
              <span className="text-white">Pizza</span>
              <span className="text-orange-500">Hub</span>
            </span>
            {/* Logo er yellow swoosh (simple SVG arc) */}
            <svg viewBox="0 0 100 10" className="h-1.5 w-full" aria-hidden="true">
              <path
                d="M2 8 Q 55 -3 98 8"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors hover:text-orange-500 ${
                    isActive ? "text-orange-500 font-semibold" : "text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: Cart Icon + Auth / User profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Cart Icon with Live Count Badge — links to /cart */}
          <Link
            href="/cart"
            aria-label="View shopping cart"
            className="relative flex size-9 sm:size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:border-orange-500/50 hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
          >
            <ShoppingCart className="size-4.5 sm:size-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-[10px] font-black text-white shadow-md shadow-orange-950/60 animate-in zoom-in-75 duration-200">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </Link>

          {/* Session load howar somoy choto skeleton (jate Sign In button flicker na kore) */}
          {isPending && (
            <span
              className="size-9 animate-pulse rounded-full bg-white/10"
              aria-hidden="true"
            />
          )}

          {/* Logged in: user profile + dropdown */}
          {!isPending && isLoggedIn && user && (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-2 pl-1 transition-colors hover:border-orange-500/50 hover:bg-white/[0.06] sm:gap-2.5 sm:pr-3"
              >
                {avatar}
                <span className="hidden min-w-0 flex-col text-left leading-tight sm:flex">
                  <span className="max-w-[130px] truncate text-sm font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="text-[11px] font-medium capitalize text-orange-400/90">
                    {user.role === "vendor"
                      ? "Vendor"
                      : user.role === "admin"
                        ? "Admin"
                        : "Customer"}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-zinc-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl shadow-black/60"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
                    <div
                      onClick={() => {
                        setAvatarModalOpen(true);
                        setProfileOpen(false);
                      }}
                      title="Tap to change photo"
                      className="relative group/avatar cursor-pointer shrink-0"
                    >
                      {avatar}
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity text-orange-400">
                        <Camera className="size-3.5" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {user.email}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarModalOpen(true);
                          setProfileOpen(false);
                        }}
                        className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                      >
                        <Camera className="size-3" />
                        <span>Change photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-1.5">
                    <Link
                      href={getDashboardHref(user.role)}
                      role="menuitem"
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-orange-500"
                    >
                      <LayoutDashboard className="size-4 text-zinc-400" />
                      Dashboard
                    </Link>
                    <Link
                      href={getProfileSettingsHref(user.role)}
                      role="menuitem"
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-orange-500"
                    >
                      <Settings className="size-4 text-zinc-400" />
                      Profile Settings
                    </Link>
                    {isNotAdmin && (
                      <Link
                        href={wishlistHref}
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-orange-500"
                      >
                        <Heart className="size-4 text-zinc-400" />
                        Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-white/10 p-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      {isSigningOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logged in: quick logout button before the dropdown (mobile e only icon) */}
          {!isPending && isLoggedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              aria-label="Logout"
              title="Logout"
              className="group flex items-center justify-center gap-2 rounded-full border-t border-x border-t-white/80 border-x-white/40 border-b-2 border-b-orange-500 bg-[#141416]/90 p-2 transition-all duration-200 hover:border-t-orange-500 hover:border-x-orange-500 hover:border-b-white hover:bg-white/5 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm cursor-pointer"
            >
              <LogOut className="size-4 shrink-0 text-red-500 group-hover:text-orange-500 transition-colors" />
              <span className="hidden sm:inline bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold">
                {isSigningOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          )}

          {/* Logged out: Sign In + Sign Up */}
          {!isPending && !isLoggedIn && (
            <>
              {/* Sign In button */}
              <Link
                href="/sign-in"
                className="hidden items-center gap-2 rounded-full border border-orange-500 px-4 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-500 hover:text-zinc-950 sm:flex"
              >
                <User className="size-4" />
                Sign In
              </Link>

              {/* Sign Up button: primary gradient (design system) */}
              <Link
                href="/sign-up"
                className="flex items-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile hamburger  */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-zinc-200 transition-colors hover:text-orange-500 lg:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 pt-3 pb-4 sm:px-6 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={closeAll}
                    className={`block rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:bg-white/5 hover:text-orange-500 ${
                      isActive ? "text-orange-500 font-semibold" : "text-zinc-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile: logged out -> auth buttons */}
          {!isPending && !isLoggedIn && (
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="/sign-in"
                onClick={closeAll}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-orange-500 px-4 py-2.5 text-sm font-medium text-orange-500"
              >
                <User className="size-4" />
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={closeAll}
                className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile: logged in -> user info + dashboard/profile/logout */}
          {!isPending && isLoggedIn && user && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-3">
                {avatar}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-400">{user.email}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1">
                <Link
                  href={getDashboardHref(user.role)}
                  onClick={closeAll}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-orange-500"
                >
                  <LayoutDashboard className="size-4 text-zinc-400" />
                  Dashboard
                </Link>
                <Link
                  href="/profile-settings"
                  onClick={closeAll}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-orange-500"
                >
                  <Settings className="size-4 text-zinc-400" />
                  Profile Settings
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60"
                >
                  <LogOut className="size-4" />
                  {isSigningOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>

      {/*
        Floating Wishlist button:
        • Visible on all pages (including Home page) whenever user has saved 1+ products in wishlist
        • Hidden when wishlistCount === 0 (no saved products)
        • Mobile: Vertical right-edge tab (mirrors mobile Resume reference)
        • Desktop: Fixed horizontal pill right-aligned with max-w-7xl content container
          (exactly below Logout button and aligned with product cards, as marked in reference)
      */}
      {shouldShowFloatingWishlist && (
        <>
          {/* ── MOBILE vertical tab (hidden on sm+) ── */}
          <Link
            href={wishlistHref}
            aria-label="View Wishlist"
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex sm:hidden flex-col items-center gap-1.5 px-2 py-3 rounded-l-xl rounded-r-none border-t-2 border-b-2 border-l border-t-white border-b-orange-500 border-l-white/20 bg-[#141416]/95 backdrop-blur-sm cursor-pointer group hover:bg-[#1a1a1c]/95 transition-all duration-300 active:scale-95 shadow-xl"
          >
            {/* Heart icon */}
            <Heart className="size-4 fill-red-500 text-red-500 shrink-0 group-hover:scale-110 transition-transform duration-200" />

            {/* Vertical text — red-to-orange gradient, writing-mode vertical */}
            <span
              className="text-[11px] font-extrabold tracking-widest uppercase bg-gradient-to-b from-red-500 to-orange-500 bg-clip-text text-transparent"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: "0.2em" }}
            >
              WISHLIST
            </span>

            {/* Badge */}
            <span className="flex min-w-[18px] h-[18px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-[9px] font-black text-white shadow-sm">
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          </Link>

          {/* ── DESKTOP horizontal floating button (hidden below sm) ──
              Anchored right-aligned with max-w-7xl content container,
              exactly beneath the Navbar's Logout button and beside product cards ── */}
          <div className="pointer-events-none fixed inset-x-0 bottom-24 sm:bottom-28 z-40 hidden sm:block">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
              <Link
                href={wishlistHref}
                aria-label="View Wishlist"
                className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border-t-2 border-b-2 border-x border-t-white border-b-orange-500 border-x-white/20 bg-[#141416]/95 backdrop-blur-md cursor-pointer group hover:bg-[#1a1a1c]/95 hover:border-t-orange-500 hover:border-b-white hover:shadow-[0_4px_25px_rgba(249,115,22,0.3)] hover:scale-105 transition-all duration-300 active:scale-95 shadow-2xl"
              >
                <Heart className="size-4 fill-red-500 text-red-500 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-extrabold tracking-widest uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Wishlist
                </span>
                <span className="flex min-w-[18px] h-[18px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-[9px] font-black text-white shadow-sm">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Profile Photo Change Modal */}
      {isLoggedIn && (
        <AvatarUploadModal
          isOpen={avatarModalOpen}
          onClose={() => setAvatarModalOpen(false)}
          currentImage={user?.image}
          currentName={user?.name}
        />
      )}
    </>
  );
}
