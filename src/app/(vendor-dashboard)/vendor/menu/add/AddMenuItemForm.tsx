"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  ImagePlus,
  Link2,
  Loader2,
  PlusCircle,
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(""); // direct URL input
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const atLimit = activeCount >= 3;

  // The final image to use: uploaded file takes priority over typed URL
  const resolvedPreview = imagePreview || (imageUrl.trim() ? imageUrl.trim() : null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Item name is required.";
    if (!form.category) errs.category = "Please select a category.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Enter a valid price (greater than 0).";
    if (!form.location.trim()) errs.location = "Location / area is required.";
    if (!imageFile && !imageUrl.trim())
      errs.image = "Please upload an image or paste an image URL.";
    return errs;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl(""); // clear URL input when file chosen
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    // If user types a URL, clear any selected file
    if (e.target.value.trim()) {
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    }
    setErrors((prev) => ({ ...prev, image: "" }));
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
      let finalImageUrl = imageUrl.trim();

      // If a file was selected, upload it to ImgBB first
      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadToImgBB(imageFile);
        setUploading(false);
      }

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
          image: finalImageUrl,
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

      {/* ── Image Section ── */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-zinc-300">
          Item Image <span className="text-red-400">*</span>
        </label>

        {/* Upload box */}
        <div
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 bg-zinc-900/50 p-8 transition-colors hover:border-orange-500/40 hover:bg-orange-500/5"
        >
          {resolvedPreview ? (
            <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl">
              <Image
                src={resolvedPreview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={!imageFile} // external URLs don't go through Next.js image optimizer
              />
            </div>
          ) : (
            <>
              <ImagePlus className="size-10 text-zinc-500" />
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-300">
                  Click to upload image
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  PNG, JPG, WEBP — uploaded to ImgBB
                </p>
              </div>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {imageFile && (
          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="self-start text-xs text-zinc-400 underline hover:text-red-400"
          >
            Remove uploaded file
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] font-semibold text-zinc-500">OR</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Image URL input */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
            <Link2 className="size-3.5 text-orange-400" />
            Paste Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/pizza-image.jpg"
            value={imageUrl}
            onChange={handleUrlChange}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
          <p className="text-[11px] text-zinc-500">
            Paste any public image link (ImgBB, Google Drive, Cloudinary, etc.)
          </p>
        </div>

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
            {uploading ? "Uploading image…" : "Saving…"}
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
