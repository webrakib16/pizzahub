"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import AvatarUploadModal from "@/components/shared/AvatarUploadModal";
import { toast } from "@/components/ui/toast";

export default function AdminProfileClient() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image || null);

  const getInitials = (val?: string | null) => {
    if (!val) return "A";
    return val
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.add({ title: "Name cannot be empty", type: "error" });
      return;
    }
    toast.add({ title: "Admin profile updated!", type: "success" });
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Administration
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Admin Profile Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your platform administrator credentials and avatar.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 sm:p-8 shadow-xl space-y-6">
        {/* Avatar area */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
          <div className="relative group">
            {avatarUrl ? (
              <div className="relative size-16 rounded-2xl overflow-hidden ring-2 ring-orange-500/40">
                <Image
                  src={avatarUrl}
                  alt={user?.name || "Admin"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-xl font-black text-white shadow-lg shadow-orange-950/40 ring-2 ring-white/10">
                {getInitials(user?.name)}
              </div>
            )}

            {/* Tap to change avatar overlay button */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Change photo"
              title="Change profile photo"
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-white text-[9px] font-bold cursor-pointer"
            >
              <Camera className="size-4 mb-0.5 text-orange-400" />
              <span>Change</span>
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white truncate">
                {user?.name || "Platform Admin"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
                <ShieldCheck className="size-3" />
                Administrator
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 truncate">{user?.email}</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-2 cursor-pointer"
            >
              <Camera className="size-3" />
              <span>Change Profile Photo</span>
            </button>
          </div>
        </div>

        {/* Info Form */}
        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Admin Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin Name"
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Email Address (Read-only)</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="rounded-xl border border-white/10 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Role</label>
            <input
              type="text"
              value="System Administrator"
              readOnly
              className="rounded-xl border border-white/10 bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>

      <AvatarUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentImage={avatarUrl}
        currentName={user?.name}
        onSuccess={(url) => setAvatarUrl(url)}
      />
    </div>
  );
}
