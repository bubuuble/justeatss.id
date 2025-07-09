// types/Order.ts

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  // Tambahkan properti lain jika ada
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface PaymentDetails {
  transactionId: string;
  paymentType: string;
  transactionTime: string;
  paidTime?: string;
  fraudStatus: string;
}

export interface OrderHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: string;
  orderStatus: string;
  paymentDetails?: PaymentDetails;
  orderHistory?: OrderHistoryEntry[];
  // Tambahkan properti lain dari query Sanity Anda jika diperlukan
  [key: string]: any; // Izinkan properti lain untuk fleksibilitas
}