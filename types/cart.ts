// lib/types/cart.ts

export interface CartItem {
  id: string; // Product ID (from Sanity _id or your product identifier)
  name: string;
  price: number;
  imageUrl?: string; // Optional image for display in cart
  quantity: number;
  // Add other relevant product details you want in the cart, e.g., variant info
  // slug?: string; // For linking back to product page
}

export interface CartState {
  items: CartItem[];
  // Add other cart-level state later, e.g., discountCode, subtotal, etc.
}