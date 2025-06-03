// app/(main)/cart/page.tsx
"use client";

import React from 'react';
import { useCart, CartItem } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
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
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-20 text-center text-white max-w-2xl">
          <div className="space-y-8">
            <div className="w-32 h-32 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center border border-zinc-700/50">
              <FiShoppingCart className="w-16 h-16 text-zinc-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-light text-white">Your Cart is Empty</h1>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Discover our amazing selection of delicious treats and start adding items to your cart
              </p>
            </div>
            <Link href="/products" className="inline-block">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-20 max-w-7xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-white mb-2 sm:mb-4">
            Shopping <span className="font-bold text-orange-500">Cart</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-12">
          {/* Cart Items Section */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className="group bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mb-3 sm:mb-0">
                    {item.imageUrl ? (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-800">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 rounded-xl flex items-center justify-center">
                        <span className="text-zinc-500 text-xs sm:text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="flex-grow min-w-0 w-full">
                    <Link 
                      href={item.slug ? `/products/${item.slug}` : '#'} 
                      className="text-base sm:text-xl font-medium text-white hover:text-orange-400 transition-colors duration-300 block mb-1 sm:mb-2 truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-base sm:text-lg font-semibold text-orange-400">{formatCurrency(item.price)}</p>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      disabled={item.quantity <= 1} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 sm:w-12 text-center font-semibold text-base sm:text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 transition-all duration-300 flex items-center justify-center"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Total Price */}
                  <div className="text-right min-w-[80px] sm:min-w-[100px] mt-3 sm:mt-0">
                    <p className="text-base sm:text-xl font-bold text-white">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300 flex items-center justify-center mt-3 sm:mt-0"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {cartItems.length > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-zinc-800/50">
                <button
                  onClick={clearCart}
                  className="text-zinc-400 hover:text-red-400 transition-colors duration-300 font-medium"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>
          {/* Order Summary Section */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-zinc-800/50 sticky top-24">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8 text-white">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-center text-base sm:text-lg">
                  <span className="text-zinc-300">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-white">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-zinc-400">Taxes</span>
                  <span className="text-zinc-400">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-zinc-400">Shipping</span>
                  <span className="text-zinc-400">Calculated at checkout</span>
                </div>
                <div className="border-t border-zinc-700/50 pt-3 sm:pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl sm:text-2xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-orange-400">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 mb-3 sm:mb-4"
              >
                Proceed to Checkout
              </button>
              <Link href="/products" className="block">
                <button className="w-full border border-zinc-600 text-zinc-300 py-2 sm:py-3 rounded-xl font-medium hover:bg-zinc-800/50 hover:border-orange-500/50 transition-all duration-300">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}