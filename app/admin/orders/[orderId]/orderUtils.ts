// app/admin/orders/[orderId]/orderUtils.ts

// Hapus import { Order } dari "@/types/Order";
// Ganti dengan definisi lokal yang lebih lengkap untuk memastikan semua properti ada
// Idealnya, definisi ini harus berada di "@/types/Order"
interface Order {
  _id: string;
  orderId?: string;
  userName?: string;
  userEmail?: string;
  totalAmount?: number;
  orderStatus?: string;
  paymentStatus?: string;
  _createdAt?: string;
  items?: Array<{
    productName?: string;
    quantity?: number;
    price?: number;
  }>;
  paymentDetails?: {
    transactionId?: string;
    paymentType?: string;
    paidTime?: string;
    transactionTime?: string;
    fraudStatus?: string;
    transactionStatus?: string; // <--- MENAMBAHKAN INI UNTUK MEMPERBAIKI KESALAHAN
  };
  orderHistory?: Array<{
    _key?: string;
    status?: string;
    timestamp?: string;
    updatedBy?: string;
    note?: string;
  }>;
  shippingAddress?: any;
  adminNotes?: string;
  orderNotes?: string;
  customerNotes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

/**
 * Fungsi terpusat untuk memetakan status pesanan lama ke status standar.
 * Ini memastikan konsistensi data di server, klien, dan rute API.
 * Menangani status pesanan, status pembayaran, dan status dalam riwayat pesanan.
 * @param order The raw order object, possibly containing legacy statuses.
 * @returns A new order object with mapped statuses, or null if the input is null.
 */
export const mapOrderStatuses = (order: Order | null): Order | null => {
  if (!order) {
    return null;
  }

  // Create a new object to avoid mutating the original
  const mappedOrder: Order = { ...order };

  // 1. Map the main order status
  if (mappedOrder.orderStatus === 'settlement') {
    mappedOrder.orderStatus = 'confirmed';
  }
  // Ensure orderStatus is always a string
  mappedOrder.orderStatus = mappedOrder.orderStatus || 'unknown'; // Provide a default if undefined

  // 2. Map the payment status
  // TOP Priority: If transactionStatus from paymentDetails is 'settlement' or 'capture',
  // this is strong evidence that payment is successful.
  if (
    mappedOrder.paymentDetails?.transactionStatus === 'settlement' || 
    mappedOrder.paymentDetails?.transactionStatus === 'capture'
  ) {
    mappedOrder.paymentStatus = 'paid';
  }
  // Second priority: If the direct paymentStatus from Sanity is 'settlement' or 'capture'
  else if (
    mappedOrder.paymentStatus === 'settlement' || 
    mappedOrder.paymentStatus === 'capture'
  ) {
    mappedOrder.paymentStatus = 'paid';
  }
  // Third priority: If order status is delivered or confirmed, and payment is still pending,
  // we assume payment is successful.
  else if (
    (mappedOrder.orderStatus === 'delivered' || mappedOrder.orderStatus === 'confirmed') &&
    mappedOrder.paymentStatus === 'pending'
  ) {
    mappedOrder.paymentStatus = 'paid';
  }
  // Fourth priority: If payment status is still 'pending' but a paid time is recorded
  else if (
    mappedOrder.paymentStatus === 'pending' && mappedOrder.paymentDetails?.paidTime
  ) {
    mappedOrder.paymentStatus = 'paid';
  }
  // Ensure paymentStatus is always a string
  mappedOrder.paymentStatus = mappedOrder.paymentStatus || 'pending'; // Provide a default if undefined


  // 3. Map statuses within the order history array
  if (Array.isArray(mappedOrder.orderHistory)) {
    mappedOrder.orderHistory = mappedOrder.orderHistory.map(entry => ({
      ...entry,
      status: entry.status === 'settlement' ? 'confirmed' : (entry.status || 'unknown'), // Ensure history status is also a string
    }));
  }

  return mappedOrder;
};

// Centralized color logic for status badges
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending_confirmation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'confirmed': 'bg-green-100 text-green-800 border-green-200',
    'processing': 'bg-blue-100 text-blue-800 border-blue-200',
    'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
    'delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
    'refunded': 'bg-gray-100 text-gray-800 border-gray-200',
    'settlement': 'bg-green-100 text-green-800 border-green-200', // For legacy data, treat as confirmed
    'unknown': 'bg-gray-100 text-gray-800 border-gray-200', // Add color for unknown status
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'paid': 'bg-green-100 text-green-800 border-green-200',
    'capture': 'bg-green-100 text-green-800 border-green-200', // Capture is also a paid status
    'deny': 'bg-red-100 text-red-800 border-red-200',
    'cancel': 'bg-red-100 text-red-800 border-red-200',
    'expire': 'bg-red-100 text-red-800 border-red-200',
    'failed': 'bg-red-100 text-red-800 border-red-200',
    'refund': 'bg-gray-100 text-gray-800 border-gray-200',
    'unknown': 'bg-gray-100 text-gray-800 border-gray-200', // Add color for unknown status
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};
