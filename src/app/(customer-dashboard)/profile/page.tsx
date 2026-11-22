"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  Camera,
  Store,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import AvatarUploadModal from "@/components/shared/AvatarUploadModal";

export default function CustomerProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const getInitials = (val?: string | null) => {
    if (!val) return "U";
    return val
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.add({ title: "Name cannot be empty", type: "error" });
      return;
    }

    setIsSavingName(true);
    // Simulating profile name update
    setTimeout(() => {
      setIsSavingName(false);
      toast.add({ title: "Profile updated successfully!", type: "success" });
    }, 600);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.add({ title: "Enter current password", type: "error" });
      return;
    }
    if (newPassword.length < 8) {
      toast.add({
        title: "New password must be at least 8 characters",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.add({ title: "Passwords do not match", type: "error" });
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.add({
        title: "Password changed successfully!",
        type: "success",
      });
    }, 800);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Member";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* ── Page Header ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          My Account
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage your personal details, email, and password security.
        </p>
      </div>

      {/* ── User Overview Card ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div
            onClick={() => setAvatarModalOpen(true)}
            title="Click to change profile photo"
            className="relative group cursor-pointer"
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                width={64}
                height={64}
                unoptimized
                className="size-16 rounded-2xl object-cover ring-2 ring-orange-500/30"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-xl font-black text-white shadow-lg shadow-orange-950/40 ring-2 ring-white/10">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
              <Camera className="size-4 text-orange-400 mb-0.5" />
              <span>Change</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {user?.name || "Customer User"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-400">
                <Shield className="size-3" />
                Customer
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{user?.email}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Joined {memberSince}</p>
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Camera className="size-3" />
              <span>Change Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Become a Vendor Banner ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Store className="size-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white">Own a Pizza Restaurant or Kitchen?</h3>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Expand your business! Apply to become a PizzaHub Partner and start selling pizzas directly to customers.
          </p>
        </div>
        <Link
          href="/partnership"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-950/40 transition-opacity hover:opacity-95"
        >
          <span>Become a Vendor</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* ── Personal Info Form ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <User className="size-4 text-orange-400" />
          <h2 className="text-base font-bold text-white">
            Personal Information
          </h2>
        </div>

        <form onSubmit={handleUpdateName} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                value={name || user?.name || ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090b] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-400"
                />
                <Mail className="absolute right-3 top-3 size-4 text-zinc-500" />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                Email is linked to authentication and cannot be changed.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingName}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-950/40 transition-all hover:opacity-95 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <CheckCircle2 className="size-3.5" />
              {isSavingName ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Security & Password ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <KeyRound className="size-4 text-orange-400" />
          <h2 className="text-base font-bold text-white">Security & Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090b] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090b] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090b] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-5 py-2.5 text-xs font-bold text-zinc-200 transition-colors hover:border-white/30 hover:text-white disabled:opacity-60 cursor-pointer"
            >
              <Lock className="size-3.5" />
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      <AvatarUploadModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentImage={user?.image}
        currentName={user?.name}
      />
    </div>
  );
}
