"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
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

// Navbar er link gulo ekhane list kora — pore easily change kora jabe
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
];

// Role onujayi dashboard er path
function getDashboardHref(role?: string | null) {
  if (role === "vendor") return "/vendor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
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
  const { data: session, isPending } = useSession();
  const { totalCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const isLoggedIn = Boolean(user);

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
    <header className="relative z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur">
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

        {/* Desktop nav links — Home active (orange), hover e color change hoy */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`text-[15px] font-medium transition-colors hover:text-orange-500 ${
                  link.label === "Home" ? "text-orange-500" : "text-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
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
                    {avatar}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {user.email}
                      </p>
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
                      href="/profile-settings"
                      role="menuitem"
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-orange-500"
                    >
                      <Settings className="size-4 text-zinc-400" />
                      Profile Settings
                    </Link>
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
              className="flex items-center justify-center gap-2 rounded-full border border-red-500/40 p-2 text-red-400 transition-colors hover:border-red-500/70 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm sm:font-medium"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="hidden sm:inline">
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
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={closeAll}
                  className={`block rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:bg-white/5 hover:text-orange-500 ${
                    link.label === "Home" ? "text-orange-500" : "text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
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
  );
}
