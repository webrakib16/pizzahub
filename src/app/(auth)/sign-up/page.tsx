"use client";

import { useState } from "react";
import { useIsMounted } from "@/hooks/use-is-mounted";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Check,
    Eye,
    EyeOff,
    Gift,
    Lock,
    Mail,
    Percent,
    ShieldAlert,
    Store,
    Truck,
    User,
    Users,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { signUp } from "@/lib/auth-client";

// Left panel er feature cards
const features = [
    { icon: Truck, label: "Fast Delivery" },
    { icon: Percent, label: "Exclusive Offers" },
    { icon: Gift, label: "Vendor Rewards" },
];

// Shared input style (icon on the left, dark surface)
const inputClasses =
    "h-12 w-full rounded-lg border border-white/15 bg-[#1a1613]/80 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20";

export default function SignUpPage() {
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "" as "" | "customer" | "vendor" | "admin",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hydration er age submit disable — na hole native GET submit hoye
    // password URL e chole jay ar account create hoy na.
    const isMounted = useIsMounted();

    // Password Validation Rules
    const passwordRules = {
        hasMinLength: formData.password.length >= 6,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasLowercase: /[a-z]/.test(formData.password),
    };

    const isPasswordValid =
        passwordRules.hasMinLength &&
        passwordRules.hasUppercase &&
        passwordRules.hasLowercase;

    // Input change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.add({ title: "Please enter your full name.", type: "error" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            toast.add({ title: "Please enter a valid email address.", type: "error" });
            return;
        }

        if (!isPasswordValid) {
            toast.add({
                title: "Password does not meet the security requirements.",
                type: "error",
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.add({ title: "Passwords do not match.", type: "error" });
            return;
        }

        if (
            formData.role !== "customer" &&
            formData.role !== "vendor" &&
            formData.role !== "admin"
        ) {
            toast.add({ title: "Please select an account role.", type: "error" });
            return;
        }

        setIsSubmitting(true);

        try {
            // Email sob somoy trim + lowercase — sign-in page o same rule use kore.
            // Ei email tai sign in korar somoy exactly dite hobe.
            const email = formData.email.trim().toLowerCase();

            // Better Auth -> MongoDB te asol user toiri hoy
            const { data: signUpData, error: signUpError } = await signUp.email({
                name: formData.name.trim(),
                email,
                password: formData.password,
                role: formData.role,
            });

            if (signUpError) {
                toast.add({
                    title:
                        signUpError.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
                            ? "This email is already registered. Please sign in instead."
                            : signUpError.message ||
                            "Could not create your account. Please try again.",
                    type: "error",
                });
                return;
            }

            // Learning/debug: sign-up response theke notun user er data console e dekhao
            console.log("[PizzaHub] sign-up successful — user data:", signUpData?.user);

            toast.add({
                title: `${formData.role === "vendor" ? "Vendor" : "Customer"} account created for ${email}. Welcome to PizzaHub!`,
                type: "success",
            });

            // Redirect according to role
            setTimeout(() => {
                if (formData.role === "vendor") {
                    router.push("/vendor/dashboard");
                } else {
                    router.push("/");
                }
            }, 1200);
        } catch {
            toast.add({
                title: "An unexpected error occurred during registration. Please try again.",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google Sign Up Handler
    const handleGoogleSignUp = () => {
        // Google login enable korte .env e GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET lagbe
        console.log("Google Sign Up clicked for role:", formData.role);
        toast.add({
            title:
                "Google sign-up is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.",
            type: "error",
        });
    };

    return (
        <main className="relative min-h-screen bg-[#080605] text-white">
            {/* ===== Full page background photo ===== */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <Image
                    src="/assets/sign-up bg.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-[42%_50%]"
                />

                {/* Darkening layers: keep the pizza readable, calm the right side */}
                <div className="absolute inset-0 bg-[#080605]/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#080605]/30 to-[#080605]/75" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#080605]/55 via-transparent to-[#080605]/80" />
            </div>

            {/* ===== Page content ===== */}
            <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,740px)] lg:px-10 lg:py-0 xl:px-16">
                {/* ===== Left showcase (desktop) ===== */}
                <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:py-10 lg:pr-6 xl:pl-6">
                    {/* Logo lockup */}
                    <Link
                        href="/"
                        className="inline-flex w-fit items-center gap-2 transition-transform hover:scale-105"
                    >
                        <Image
                            src="/assets/logo-icon.png"
                            alt="PizzaHub Logo"
                            width={318}
                            height={316}
                            priority
                            className="h-11 w-auto"
                        />
                        <span className="flex flex-col text-left">
                            <span className="text-2xl font-extrabold tracking-tight">
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

                    {/* Headline */}
                    <div className="mt-20 max-w-[560px] xl:mt-20">
                        <h1 className="text-[46px] leading-[1.1] font-extrabold tracking-tight xl:text-[56px]">
                            <span className="text-white">Join</span>{" "}
                            <span className="text-orange-500">PizzaHub</span>
                        </h1>
                        <p className="mt-5 max-w-[490px] text-lg leading-relaxed text-zinc-100 xl:text-[19px]">
                            Create your account to order delicious pizzas, track
                            orders, and enjoy exclusive rewards.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="mt-auto grid grid-cols-3 gap-5">
                        {features.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-black/35 px-3 py-4 backdrop-blur-sm"
                            >
                                <item.icon className="size-7 text-orange-500" />
                                <span className="text-sm font-semibold text-white">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ===== Sign up card ===== */}
                <section className="flex items-center justify-center lg:py-6">
                    <div className="relative w-full max-w-[740px]">
                        {/* Mobile logo */}
                        <div className="mb-6 flex justify-center lg:hidden">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2"
                            >
                                <Image
                                    src="/assets/logo-icon.png"
                                    alt="PizzaHub Logo"
                                    width={318}
                                    height={316}
                                    priority
                                    className="h-10 w-auto"
                                />
                                <span className="flex flex-col text-left">
                                    <span className="text-2xl font-extrabold tracking-tight">
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

                        {/* Card shell with warm rim light */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f0d0b]/95 px-5 py-7 shadow-[0_0_90px_-25px_rgba(249,115,22,0.45)] backdrop-blur-md sm:px-8 sm:py-8 lg:px-[52px] lg:py-8">
                            {/* Warm corner glows + rim lines */}
                            <div
                                className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-orange-500/25 blur-3xl"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-orange-600/20 blur-3xl"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
                                aria-hidden="true"
                            />

                            {/* Heading */}
                            <div className="relative text-center">
                                <h2 className="text-[28px] font-bold tracking-tight text-white sm:text-[34px]">
                                    Create an Account
                                </h2>
                                <p className="mt-2 text-[15px] text-zinc-400">
                                    Join{" "}
                                    <span className="text-orange-500">PizzaHub</span>{" "}
                                    as a customer or register your restaurants.
                                </p>
                            </div>

                            {/* Google button */}
                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                className="relative mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/25 bg-white/[0.02] px-4 text-[15px] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/[0.05]"
                            >
                                <svg
                                    className="size-5"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
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
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="relative my-4 flex items-center gap-4">
                                <span
                                    className="h-px flex-1 bg-white/15"
                                    aria-hidden="true"
                                />
                                <span className="text-xs text-zinc-400">
                                    or sign up with email
                                </span>
                                <span
                                    className="h-px flex-1 bg-white/15"
                                    aria-hidden="true"
                                />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="relative space-y-3">
                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1 block text-[13px] font-semibold text-zinc-200"
                                    >
                                        Full Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-orange-300/70" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1 block text-[13px] font-semibold text-zinc-200"
                                    >
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-orange-300/70" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1 block text-[13px] font-semibold text-zinc-200"
                                    >
                                        Password{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-orange-300/70" />
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword ? "text" : "password"
                                            }
                                            autoComplete="new-password"
                                            required
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`${inputClasses} pr-11`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-zinc-400 transition-colors hover:text-white"
                                        >
                                            {showPassword ? (
                                                <Eye className="size-4" />
                                            ) : (
                                                <EyeOff className="size-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password requirements */}
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2 text-xs">
                                        <span className="text-[11px] font-medium text-zinc-400">
                                            Password Requirements:
                                        </span>
                                        <div
                                            className={`flex items-center gap-1.5 transition-colors ${passwordRules.hasMinLength
                                                ? "text-emerald-400"
                                                : "text-zinc-500"
                                                }`}
                                        >
                                            <Check
                                                className={`size-3.5 ${passwordRules.hasMinLength
                                                    ? "stroke-[3]"
                                                    : "opacity-40"
                                                    }`}
                                            />
                                            <span>Min 6 chars</span>
                                        </div>
                                        <div
                                            className={`flex items-center gap-1.5 transition-colors ${passwordRules.hasUppercase
                                                ? "text-emerald-400"
                                                : "text-zinc-500"
                                                }`}
                                        >
                                            <Check
                                                className={`size-3.5 ${passwordRules.hasUppercase
                                                    ? "stroke-[3]"
                                                    : "opacity-40"
                                                    }`}
                                            />
                                            <span>1 Uppercase</span>
                                        </div>
                                        <div
                                            className={`flex items-center gap-1.5 transition-colors ${passwordRules.hasLowercase
                                                ? "text-emerald-400"
                                                : "text-zinc-500"
                                                }`}
                                        >
                                            <Check
                                                className={`size-3.5 ${passwordRules.hasLowercase
                                                    ? "stroke-[3]"
                                                    : "opacity-40"
                                                    }`}
                                            />
                                            <span>1 Lowercase</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-1 block text-[13px] font-semibold text-zinc-200"
                                    >
                                        Confirm Password{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-orange-300/70" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            required
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`${inputClasses} pr-11`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password confirmation"
                                                    : "Show password confirmation"
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-zinc-400 transition-colors hover:text-white"
                                        >
                                            {showConfirmPassword ? (
                                                <Eye className="size-4" />
                                            ) : (
                                                <EyeOff className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Account Role */}
                                <div>
                                    <p className="mb-2 text-[13px] font-semibold text-zinc-200">
                                        Account Role{" "}
                                        <span className="text-red-500">*</span>
                                    </p>
                                    <div
                                        role="radiogroup"
                                        aria-label="Account role"
                                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                                    >
                                        {/* Customer */}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={
                                                formData.role === "customer"
                                            }
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    role: "customer",
                                                }))
                                            }
                                            className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${formData.role === "customer"
                                                ? "border-orange-500/70 bg-orange-500/10"
                                                : "border-white/15 bg-[#1a1613]/60 hover:border-white/30"
                                                }`}
                                        >
                                            <span
                                                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${formData.role === "customer"
                                                    ? "border-orange-500"
                                                    : "border-zinc-500"
                                                    }`}
                                            >
                                                {formData.role === "customer" && (
                                                    <span className="size-2.5 rounded-full bg-orange-500" />
                                                )}
                                            </span>
                                            <Users className="size-6 shrink-0 text-orange-400/80" />
                                            <span className="flex min-w-0 flex-col">
                                                <span className="text-[14px] font-semibold text-white">
                                                    Customer
                                                </span>
                                                <span className="text-[11px] text-zinc-400">
                                                    Order pizzas
                                                </span>
                                            </span>
                                        </button>

                                        {/* Vendor */}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={formData.role === "vendor"}
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    role: "vendor",
                                                }))
                                            }
                                            className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${formData.role === "vendor"
                                                ? "border-orange-500/70 bg-orange-500/10"
                                                : "border-white/15 bg-[#1a1613]/60 hover:border-white/30"
                                                }`}
                                        >
                                            <span
                                                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${formData.role === "vendor"
                                                    ? "border-orange-500"
                                                    : "border-zinc-500"
                                                    }`}
                                            >
                                                {formData.role === "vendor" && (
                                                    <span className="size-2.5 rounded-full bg-orange-500" />
                                                )}
                                            </span>
                                            <Store className="size-6 shrink-0 text-orange-400/80" />
                                            <span className="flex min-w-0 flex-col">
                                                <span className="text-[14px] font-semibold text-white">
                                                    Vendor
                                                </span>
                                                <span className="text-[11px] text-zinc-400">
                                                    Restaurant owner
                                                </span>
                                            </span>
                                        </button>

                                        {/* Admin */}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={formData.role === "admin"}
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    role: "admin",
                                                }))
                                            }
                                            className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${formData.role === "admin"
                                                ? "border-orange-500/70 bg-orange-500/10"
                                                : "border-white/15 bg-[#1a1613]/60 hover:border-white/30"
                                                }`}
                                        >
                                            <span
                                                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${formData.role === "admin"
                                                    ? "border-orange-500"
                                                    : "border-zinc-500"
                                                    }`}
                                            >
                                                {formData.role === "admin" && (
                                                    <span className="size-2.5 rounded-full bg-orange-500" />
                                                )}
                                            </span>
                                            <ShieldAlert className="size-6 shrink-0 text-orange-400/80" />
                                            <span className="flex min-w-0 flex-col">
                                                <span className="text-[14px] font-semibold text-white">
                                                    Admin
                                                </span>
                                                <span className="text-[11px] text-zinc-400">
                                                    Site management
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={!isMounted || isSubmitting}
                                    className="mt-2 h-[52px] w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-base font-bold text-white shadow-lg shadow-orange-950/50 transition-opacity hover:opacity-95 disabled:opacity-50 sm:h-[56px] sm:text-lg"
                                >
                                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                                </button>
                            </form>

                            {/* Footer link */}
                            <p className="relative mt-6 text-center text-[15px] text-zinc-400">
                                Already have an account?{" "}
                                <Link
                                    href="/sign-in"
                                    className="font-semibold text-orange-500 transition-colors hover:text-orange-400"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
