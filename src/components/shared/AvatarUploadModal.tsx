"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string | null;
  currentName?: string | null;
  onSuccess?: (newImageUrl: string) => void;
}

export default function AvatarUploadModal({
  isOpen,
  onClose,
  currentImage,
  currentName,
  onSuccess,
}: AvatarUploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const resolvedPreview =
    imagePreview ||
    (imageUrl.trim() ? imageUrl.trim() : currentImage || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl("");
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key is not configured.");

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed. Try pasting an image link instead.");
    return data.data.url as string;
  };

  const handleSave = async () => {
    let finalUrl = imageUrl.trim();

    if (!imageFile && !finalUrl) {
      toast.add({ title: "Please select an image or enter a URL.", type: "error" });
      return;
    }

    try {
      if (imageFile) {
        setUploading(true);
        finalUrl = await uploadToImgBB(imageFile);
        setUploading(false);
      }

      setSaving(true);
      const res = await fetch("/api/user/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: finalUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({ title: data.error || "Failed to update profile photo", type: "error" });
        return;
      }

      toast.add({ title: "Profile photo updated successfully!", type: "success" });
      onSuccess?.(finalUrl);
      onClose();
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update photo.";
      toast.add({ title: msg, type: "error" });
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const isLoading = uploading || saving;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Camera className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Change Profile Photo</h3>
              <p className="text-xs text-zinc-400">{currentName || "Your Account"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Current / New Avatar Preview */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative size-24 rounded-full overflow-hidden border-2 border-orange-500/40 bg-zinc-900 shadow-xl">
            {resolvedPreview ? (
              <Image
                src={resolvedPreview}
                alt="Avatar preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-red-600 to-orange-500 text-2xl font-black text-white">
                {currentName?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
          <p className="text-[11px] text-zinc-400">Photo preview</p>
        </div>

        {/* Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-zinc-900/50 p-6 transition-colors hover:border-orange-500/40 hover:bg-orange-500/5"
        >
          <ImagePlus className="size-7 text-zinc-400" />
          <p className="text-xs font-semibold text-zinc-300">
            {imageFile ? imageFile.name : "Click to select a photo from your device"}
          </p>
          <p className="text-[10px] text-zinc-500">JPG, PNG, WEBP</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase">OR PASTE URL</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* URL Input */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
            <Link2 className="size-3.5 text-orange-400" />
            Direct Image Link
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (e.target.value.trim()) {
                setImageFile(null);
                setImagePreview(null);
              }
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-full border border-white/15 bg-zinc-900 py-2.5 text-xs font-bold text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-orange-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:opacity-95 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {uploading ? "Uploading…" : "Saving…"}
              </>
            ) : (
              "Save Photo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
