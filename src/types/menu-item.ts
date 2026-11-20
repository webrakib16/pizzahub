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
  image: string;
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
  image: string;
}
