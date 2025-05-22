// app/(main)/cart/page.tsx
"use client";

import React from 'react';
import { useCart, CartItem } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Helper to format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getItemCount } = useCart();
  const totalAmount = getCartTotal();
  const itemCount = getItemCount();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  if (!user) {
    return null; // Prevent rendering if not logged in (redirect will happen)
  }

  if (itemCount === 0) {
    return (
      <div className=" bg-black container mx-auto px-4 py-12 text-center text-white">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <Link href="/products">
          <button className="bg-orange-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-amber-600">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black container mx-auto px-4 py-8 md:py-12 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="flex items-center gap-4 bg-zinc-900 p-4 rounded-lg shadow">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded object-cover" />
              )}
              <div className="flex-grow">
                <Link href={item.slug ? `/products/${item.slug}` : '#'} className="text-lg font-semibold hover:underline">{item.name}</Link>
                <p className="text-sm text-zinc-400">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 rounded hover:bg-zinc-700 disabled:opacity-50"><FiMinus /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded hover:bg-zinc-700"><FiPlus /></button>
              </div>
              <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-zinc-700"><FiTrash2 /></button>
            </div>
          ))}
           {cartItems.length > 0 && (
             <button
               onClick={clearCart}
               className="mt-4 text-sm text-zinc-400 hover:text-red-500 hover:underline"
             >
               Clear Cart
             </button>
           )}
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1 bg-zinc-900 p-6 rounded-lg shadow h-fit sticky top-20"> {/* Sticky summary */}
          <h2 className="text-2xl font-semibold mb-6 border-b border-zinc-700 pb-3">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({itemCount} items)</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            {/* Add Taxes and Shipping later */}
            <div className="flex justify-between text-zinc-400">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <hr className="border-zinc-700 my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/checkout')} // Navigate to checkout page
            className="mt-8 w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}