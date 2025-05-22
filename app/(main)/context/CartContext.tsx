
// app/context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define the shape of your cart item and cart state
export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  slug?: string; // Optional: for linking
  inStock?: boolean; // Added inStock property
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem('justeatss_cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) { // Basic validation
          setCartItems(parsedCart);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem('justeatss_cart'); // Clear corrupted cart
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem('justeatss_cart')) { // Only save if cart had items or was previously saved
        localStorage.setItem('justeatss_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);


  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    // Check if product is in stock
    if (product.inStock === false) {
      // Cannot add out-of-stock products
      return false;
    }
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.max(1, item.quantity + quantityToAdd) } // Ensure quantity is at least 1
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity: Math.max(1, quantityToAdd) }];
      }
    });
    
    return true; // Successfully added to cart
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item // Ensure quantity is at least 1
      ).filter(item => item.quantity > 0) // Optionally remove item if quantity becomes 0
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('justeatss_cart'); // Also clear from localStorage
  }, []);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};