"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  Save,
  Store,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import AvatarUploadModal from "@/components/shared/AvatarUploadModal";

export default function VendorProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needToCompleteShop = searchParams.get("complete_shop") === "true";

  const { data: session } = useSession();
  const user = session?.user;

  const [shopName, setShopName] = useState("");
  const [shopBio, setShopBio] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopLogo, setShopLogo] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Load existing vendor shop profile
  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch("/api/vendor/shop", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setShopName(data.shopName || "");
          setShopBio(data.shopBio || "");
          setShopLocation(data.shopLocation || "");
          setShopLogo(data.shopLogo || "");
          setIsProfileComplete(Boolean(data.isProfileComplete));
        } else if (res.status === 404) {
          // Defaults if not created yet
          if (user?.name) setShopName(user.name);
          setIsProfileComplete(false);
        }
      } catch (err) {
        console.error("Error loading shop profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName.trim()) {
      toast.add({ title: "Shop Name is required", type: "error" });
      return;
    }
    if (!shopLocation.trim()) {
      toast.add({ title: "Shop Location / Area is required", type: "error" });
      return;
    }
    if (!shopBio.trim()) {
      toast.add({ title: "Shop Bio / Description is required", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/vendor/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          shopName: shopName.trim(),
          shopBio: shopBio.trim(),
          shopLocation: shopLocation.trim(),
          shopLogo: shopLogo.trim() || user?.image || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({ title: data.error || "Failed to save profile", type: "error" });
        return;
      }

      setIsProfileComplete(Boolean(data.isProfileComplete));
      toast.add({ title: "Shop Profile updated successfully!", type: "success" });

      if (needToCompleteShop) {
        router.push("/vendor/menu/add");
      }
    } catch {
      toast.add({ title: "Network error saving profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayLogo = shopLogo || user?.image;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Restaurant Management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Shop Profile & Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your restaurant brand name, location, and details displayed across PizzaHub.
        </p>
      </div>

      {/* Profile Incomplete Banner */}
      {(!isProfileComplete || needToCompleteShop) && !loading && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5 shadow-lg shadow-amber-950/20">
          <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-300">
              Complete Your Shop Profile
            </h3>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Before you can create and publish pizzas, please set your restaurant{" "}
              <strong>Shop Name</strong>, <strong>Location / Area</strong>, and{" "}
              <strong>Short Bio</strong> below.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-xl sm:p-8">
        {/* Avatar / Shop Logo area */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
          <div
            onClick={() => setAvatarModalOpen(true)}
            title="Click to change restaurant logo"
            className="relative group cursor-pointer shrink-0"
          >
            {currentDisplayLogo ? (
              <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden ring-2 ring-orange-500/40 shadow-md">
                <Image
                  src={currentDisplayLogo}
                  alt={shopName || "Vendor"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-2xl font-black text-white shadow-md shadow-orange-950/40">
                {shopName?.[0]?.toUpperCase() ?? <Store className="size-8" />}
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
              <Camera className="size-4 text-orange-400 mb-0.5" />
              <span>Change</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base sm:text-lg font-black text-white truncate">
                {shopName || "Your Restaurant"}
              </p>
              {isProfileComplete && (
                <span className="flex size-4 items-center justify-center rounded-full bg-orange-500 text-white shrink-0">
                  <CheckCircle2 className="size-3" />
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 truncate">{user?.email ?? ""}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-block rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
                Vendor Portal
              </span>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Camera className="size-3" />
                <span>Upload Logo</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <Loader2 className="size-8 animate-spin text-orange-500 mb-2" />
            <span className="text-xs">Loading shop profile…</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Shop / Restaurant Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>
                  Shop Name <span className="text-red-400">*</span>
                </span>
                <span className="text-[11px] font-normal text-zinc-500">
                  Appears on menu cards & details page
                </span>
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Pizza Club, Napoli Woodfired"
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
              />
            </div>

            {/* Shop Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>
                  Shop Location / City <span className="text-red-400">*</span>
                </span>
                <span className="text-[11px] font-normal text-zinc-500">
                  Primary area (e.g. Dhaka, Rajshahi, Gulshan)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={shopLocation}
                  onChange={(e) => setShopLocation(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
                />
                <MapPin className="size-4 text-orange-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Shop Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>
                  Restaurant Bio / Description <span className="text-red-400">*</span>
                </span>
                <span className="text-[11px] font-normal text-zinc-500">
                  Shown in &ldquo;About Vendor&rdquo; on product details
                </span>
              </label>
              <textarea
                rows={3}
                required
                value={shopBio}
                onChange={(e) => setShopBio(e.target.value)}
                placeholder="e.g. Premium handcrafted wood-fired pizzas made fresh daily with authentic ingredients."
                className="rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none resize-none"
              />
            </div>

            {/* Shop Logo URL (Optional manual URL or updated via modal) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>Shop Logo Image URL</span>
                <span className="text-[11px] font-normal text-zinc-500">
                  Optional direct link
                </span>
              </label>
              <input
                type="url"
                value={shopLogo}
                onChange={(e) => setShopLogo(e.target.value)}
                placeholder="https://... (or use Change Photo above)"
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              {/* Account Personal Name (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400">Account Owner</label>
                <input
                  type="text"
                  value={user?.name ?? ""}
                  readOnly
                  className="rounded-xl border border-white/5 bg-zinc-800/40 px-3.5 py-2 text-xs text-zinc-400 cursor-not-allowed"
                />
              </div>

              {/* Email (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400">Account Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="rounded-xl border border-white/5 bg-zinc-800/40 px-3.5 py-2 text-xs text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving Shop Profile…
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save Shop Profile
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <AvatarUploadModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentImage={shopLogo || user?.image}
        currentName={shopName || user?.name}
      />
    </div>
  );
}
