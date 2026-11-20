"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Link2,
  Loader2,
  Plus,
  PlusCircle,
  Star,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

const CATEGORIES = [
  "Classic Pizza",
  "Gourmet Pizza",
  "Vegetarian",
  "Spicy",
  "Cheese",
  "BBQ",
  "Seafood",
  "Dessert Pizza",
  "Sides",
  "Drinks",
];

interface ImageItem {
  id: string;
  file?: File;
  previewUrl: string;
  source: "file" | "url";
}

export default function AddMenuItemForm({
  activeCount,
}: {
  activeCount: number;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState<number>(0);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const atLimit = activeCount >= 3;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Item name is required.";
    if (!form.category) errs.category = "Please select a category.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Enter a valid price (greater than 0).";
    if (!form.location.trim()) errs.location = "Location / area is required.";
    if (images.length === 0)
      errs.image = "Please upload at least one image or add an image URL.";
    return errs;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      toast.add({
        title: "Maximum of 5 images allowed. Please remove an image first.",
        type: "error",
      });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const fileList = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.add({
        title: `Only ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""} could be added (max 5).`,
        type: "info",
      });
    }

    const newItems: ImageItem[] = fileList.map((file) => ({
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      file,
      previewUrl: URL.createObjectURL(file),
      source: "file",
    }));

    setImages((prev) => [...prev, ...newItems]);
    setErrors((prev) => ({ ...prev, image: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast.add({
        title: "Please enter a valid URL starting with http:// or https://",
        type: "error",
      });
      return;
    }

    if (images.length >= 5) {
      toast.add({
        title: "Maximum of 5 images allowed. Please remove an image first.",
        type: "error",
      });
      return;
    }

    const newItem: ImageItem = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      previewUrl: trimmed,
      source: "url",
    };

    setImages((prev) => [...prev, newItem]);
    setUrlInput("");
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const target = prev[indexToRemove];
      if (target?.file && target.previewUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(target.previewUrl);
        } catch {}
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });

    setPrimaryIndex((currentPrimary) => {
      if (indexToRemove === currentPrimary) {
        // Default to the first remaining image
        return 0;
      }
      if (indexToRemove < currentPrimary) {
        return currentPrimary - 1;
      }
      return currentPrimary;
    });
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });

    // Update primary index tracking
    setPrimaryIndex((currentPrimary) => {
      if (currentPrimary === index) return targetIndex;
      if (currentPrimary === targetIndex) return index;
      return currentPrimary;
    });
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
    if (!data.success) throw new Error("Image upload failed. Please try again.");
    return data.data.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        if (item.file) {
          setUploadProgress(`Uploading image ${i + 1} of ${images.length}…`);
          const url = await uploadToImgBB(item.file);
          uploadedUrls.push(url);
        } else {
          uploadedUrls.push(item.previewUrl);
        }
      }
      setUploading(false);

      const resolvedPrimary = uploadedUrls[primaryIndex] || uploadedUrls[0];
      // Put primary image first, followed by remaining images
      const orderedImages = [
        resolvedPrimary,
        ...uploadedUrls.filter((_, idx) => idx !== primaryIndex),
      ];

      setSubmitting(true);
      const res = await fetch("/api/vendor/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          description: form.description.trim(),
          price: Number(form.price),
          location: form.location.trim(),
          primaryImage: resolvedPrimary,
          image: resolvedPrimary,
          images: orderedImages,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({ title: data.error || "Failed to add item.", type: "error" });
        return;
      }

      toast.add({
        title: `"${form.name.trim()}" submitted for admin review!`,
        type: "success",
      });
      router.push("/vendor/menu");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.add({ title: msg, type: "error" });
    } finally {
      setUploading(false);
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  const isLoading = uploading || submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Free tier limit warning */}
      {atLimit && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            You&apos;ve reached the <strong>Free plan limit</strong> of 3 active items.
            New items will be saved as{" "}
            <strong>Inactive</strong> until you{" "}
            <a
              href="/vendor/subscription"
              className="underline underline-offset-2 hover:text-amber-200"
            >
              upgrade to Premium
            </a>
            .
          </span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Item Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Item Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Pepperoni Feast"
            value={form.name}
            onChange={(e) => {
              setForm((p) => ({ ...p, name: e.target.value }));
              setErrors((p) => ({ ...p, name: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => {
              setForm((p) => ({ ...p, category: e.target.value }));
              setErrors((p) => ({ ...p, category: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Price (৳) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 450"
            value={form.price}
            onChange={(e) => {
              setForm((p) => ({ ...p, price: e.target.value }));
              setErrors((p) => ({ ...p, price: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.price && (
            <p className="text-xs text-red-400">{errors.price}</p>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300">
            Location / Area <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Gulshan, Dhaka"
            value={form.location}
            onChange={(e) => {
              setForm((p) => ({ ...p, location: e.target.value }));
              setErrors((p) => ({ ...p, location: "" }));
            }}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          {errors.location && (
            <p className="text-xs text-red-400">{errors.location}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-zinc-300">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Describe the pizza — toppings, crust, special ingredients…"
          value={form.description}
          onChange={(e) => {
            setForm((p) => ({ ...p, description: e.target.value }));
            setErrors((p) => ({ ...p, description: "" }));
          }}
          className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none resize-none"
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      {/* ── Item Image Section (Supports up to 5 images, file uploads + direct URLs, reordering, primary selection) ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300">
            Item Images <span className="text-red-400">*</span>
          </label>
          <span className="text-[11px] font-medium text-zinc-400">
            {images.length}/5 images {images.length > 0 && "• 1st is Primary cover"}
          </span>
        </div>

        {/* Upload box */}
        {images.length < 5 ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-white/15 bg-zinc-900/50 p-6 sm:p-7 transition-colors hover:border-orange-500/40 hover:bg-orange-500/5"
          >
            <ImagePlus className="size-8 text-zinc-500" />
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-300">
                Click to upload images ({5 - images.length} slot{5 - images.length > 1 ? "s" : ""} left)
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                PNG, JPG, WEBP — select multiple or one-by-one (uploaded to ImgBB)
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center text-xs text-zinc-400">
            Maximum of 5 images reached. Remove an image if you want to add another.
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* URL Input */}
        {images.length < 5 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                OR ADD VIA LINK
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-orange-400" />
                <input
                  type="url"
                  placeholder="Paste direct image URL (https://...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                Add URL
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              Paste public image links (ImgBB, Google Drive, Cloudinary, etc.)
            </p>
          </div>
        )}

        {/* Previews Grid */}
        {images.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-[11px] font-semibold text-zinc-400">
              Image Previews ({images.length}/5) — Click &ldquo;Make Primary&rdquo; or reorder:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {images.map((img, idx) => {
                const isPrimary = idx === primaryIndex;
                return (
                  <div
                    key={img.id}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border bg-zinc-900/90 transition-all ${
                      isPrimary
                        ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/50"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                      <Image
                        src={img.previewUrl}
                        alt={`Item image ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      {/* Primary Badge */}
                      {isPrimary && (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-orange-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                          <Star className="size-2.5 fill-white" />
                          Primary
                        </span>
                      )}

                      {/* Delete button (top right) */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove image"
                        className="absolute top-1.5 right-1.5 rounded-md bg-black/70 p-1 text-zinc-400 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    {/* Bottom controls */}
                    <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950/70 px-2 py-1.5 text-[11px]">
                      {/* Left/Right reorder */}
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          title="Move left"
                          className="rounded p-0.5 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="size-3.5" />
                        </button>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === images.length - 1}
                          title="Move right"
                          className="rounded p-0.5 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>

                      {/* Make Primary button */}
                      {!isPrimary ? (
                        <button
                          type="button"
                          onClick={() => setPrimaryIndex(idx)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
                          title="Set as primary cover photo"
                        >
                          <Star className="size-3" />
                          Make Primary
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-orange-400">
                          Main
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {errors.image && (
          <p className="text-xs text-red-400">{errors.image}</p>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-xs text-zinc-400">
        <UtensilsCrossed className="mt-0.5 size-3.5 shrink-0 text-orange-400" />
        <span>
          New items are saved with{" "}
          <strong className="text-white">Pending</strong> status and will be
          reviewed by the admin before appearing on the public menu.
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {uploading ? (uploadProgress || "Uploading images…") : "Saving…"}
          </>
        ) : (
          <>
            <PlusCircle className="size-4" />
            Submit for Review
          </>
        )}
      </button>
    </form>
  );
}
