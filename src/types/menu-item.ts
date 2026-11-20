export type MenuItemStatus = "pending" | "approved" | "rejected";

export interface MenuItem {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  /** Primary image URL */
  primaryImage?: string;
  /** Primary / cover image URL (kept for backward compatibility) */
  image: string;
  /** All image URLs for the gallery (index 0 is always the primary image) */
  images: string[];
  status: MenuItemStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewMenuItemInput {
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  /** Primary image URL */
  primaryImage?: string;
  /** Primary / cover image URL */
  image: string;
  /** All image URLs — first element matches primaryImage */
  images: string[];
}
