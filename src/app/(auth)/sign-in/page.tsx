"use client";

import { useState } from "react";
import { useIsMounted } from "@/hooks/use-is-mounted";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydration er age submit button disable thake.
  // Na hole React handler attach howar age click korle browser form ta
  // native GET hisebe submit kore fele — password URL e chole jay ar account create hoy na.
  const isMounted = useIsMounted();

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Event handler for Credentials login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.email.trim() || !formData.password) {
      toast.add({ title: "Please fill in both email and password.", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.add({ title: "Please enter a valid email address.", type: "error" });
      return;
    }

    setIsSubmitting(true);

    // Email always trimmed + lowercase — sign-up o same rule use kore,
    // tai "Rafik@Gmail.com" ar "rafik@gmail.com" ek e account hisebe kaj korbe
    const email = formData.email.trim().toLowerCase();

    try {
      const { data: signInData, error: signInError } = await signIn.email({
        email,
        password: formData.password,
        rememberMe,
      });

      if (signInError) {
        // 403 / ACCOUNT_BLOCKED: admin has blocked this user
        const isBlocked =
          signInError.status === 403 ||
          (signInError as { code?: string }).code === "ACCOUNT_BLOCKED";

        toast.add({
          title: isBlocked
            ? "🚫 Your account has been blocked by an administrator. Please contact support."
            : signInError.status === 401
            ? "Incorrect email or password. Use the exact email you signed up with — passwords are case-sensitive."
            : signInError.message || "Could not sign you in. Please try again.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      // Learning/debug: Better Auth sign-in response theke user object console e dekhao
      console.log("[PizzaHub] sign-in successful — user data:", signInData?.user);

      // Role-aware redirect after sign-in
      const role = (signInData?.user as { role?: string } | null | undefined)?.role;
      const userName = signInData?.user?.name ?? "there";

      const welcomeTitle =
        role === "vendor"
          ? `🍕 Welcome back, ${userName}! Manage your restaurant from the Vendor Portal.`
          : role === "admin"
          ? `🛡️ Welcome back, ${userName}! You're logged into the Admin Panel.`
          : `🎉 Welcome back, ${userName}! Ready to order some delicious pizza?`;

      toast.add({
        title: welcomeTitle,
        type: "success",
      });
      setTimeout(() => {
        if (role === "vendor") {
          router.push("/vendor/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }, 1000);
    } catch {
      toast.add({
        title: "An unexpected error occurred. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  // Event handler for Google login
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.add({
        title: "Could not initiate Google authentication. Please verify credentials.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full bg-orange-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        {/* Auth Card */}
        <div className="rounded-[28px] border border-orange-500/40 bg-[#0c0c0e] p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
          {/* Real Website Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group transition-transform hover:scale-105"
            >
              <Image
                src="/assets/logo-icon.png"
                alt="PizzaHub Logo"
                width={48}
                height={48}
                priority
                className="h-10 w-auto"
              />
              <span className="flex flex-col text-left">
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-white">Pizza</span>
                  <span className="text-orange-500">Hub</span>
                </span>
                <svg
                  viewBox="0 0 100 10"
                  className="h-1.5 w-full"
                  aria-hidden="true"
                >
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
          </div>

          {/* Heading */}
          <div className="text-center mt-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back!
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              Sign in to your{" "}
              <span className="font-semibold text-orange-500">PizzaHub</span>{" "}
              account to continue
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-zinc-900/60 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800/80 hover:border-white/30"
          >
            <svg className="size-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0c0c0e] px-3 text-zinc-400 font-medium">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-1.5"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/60 pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white mb-1.5"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/60 pl-11 pr-11 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500 accent-orange-500"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isMounted || isSubmitting}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-95 hover:shadow-orange-900/50 disabled:opacity-50"
            >
              {isSubmitting ? <span>Signing In...</span> : <span>Sign In</span>}
            </button>
          </form>

          {/* Toggle Link at Bottom */}
          <div className="mt-7 text-center text-sm text-zinc-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
