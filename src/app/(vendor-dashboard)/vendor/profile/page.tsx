"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Save, Store } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import AvatarUploadModal from "@/components/shared/AvatarUploadModal";

export default function VendorProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [restaurantName, setRestaurantName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // This page shows vendor profile info (read from session).
  // Full profile editing requires backend wiring — currently shows current data.

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Placeholder — real implementation would call an API to update the user record
    await new Promise((r) => setTimeout(r, 800));
    toast.add({ title: "Profile saved (demo)", type: "success" });
    setSaving(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Restaurant Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your restaurant name and account information.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl sm:p-8">
        {/* Avatar / logo area */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
          <div
            onClick={() => setAvatarModalOpen(true)}
            title="Click to change profile/logo photo"
            className="relative group cursor-pointer shrink-0"
          >
            {user?.image ? (
              <div className="relative size-16 rounded-2xl overflow-hidden ring-2 ring-orange-500/40">
                <Image
                  src={user.image}
                  alt={restaurantName || "Vendor"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-lg font-black text-white shadow-md shadow-orange-950/40">
                {restaurantName?.[0]?.toUpperCase() ?? <Store className="size-6" />}
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
              <Camera className="size-4 text-orange-400 mb-0.5" />
              <span>Change</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white">{restaurantName || "Your Restaurant"}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email ?? ""}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
                Vendor · Free Plan
              </span>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Camera className="size-3" />
                <span>Change Photo</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Restaurant / display name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">
              Restaurant Name
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Your restaurant name"
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
            />
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="rounded-xl border border-white/10 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
            />
            <p className="text-[11px] text-zinc-500">
              Email cannot be changed from this page.
            </p>
          </div>

          {/* Role (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Role</label>
            <input
              type="text"
              value="Vendor"
              readOnly
              className="rounded-xl border border-white/10 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed capitalize"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              <><Loader2 className="size-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="size-4" /> Save Changes</>
            )}
          </button>
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
