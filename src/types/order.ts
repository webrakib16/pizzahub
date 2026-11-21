export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type DeliveryLocation = "inside-dhaka" | "outside-dhaka";

export interface OrderItem {
  menuItemId: string;
  name: string;
  image: string;
  vendorName: string;
  unitPrice: number;
  quantity: number;
  size?: string;
  crust?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  deliveryLocation: DeliveryLocation;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryDate: string;
  instructions: string;
  status: OrderStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}
