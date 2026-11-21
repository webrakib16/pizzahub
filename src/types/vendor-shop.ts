export interface VendorShop {
  id?: string;
  vendorId: string;
  shopName: string;
  shopBio: string;
  shopLogo?: string;
  shopLocation: string;
  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorShopInput {
  shopName: string;
  shopBio: string;
  shopLogo?: string;
  shopLocation: string;
}
