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
  }  if (itemCount === 0) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/30 dark:from-zinc-900/20 via-transparent to-orange-100/20 dark:to-orange-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zinc-300/20 dark:bg-zinc-700/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 text-center text-black dark:text-white max-w-2xl relative z-10">
          <div className="space-y-8">
            {/* Enhanced cart icon */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/80 dark:from-zinc-800/60 to-zinc-300/90 dark:to-zinc-900/80 rounded-full flex items-center justify-center border border-zinc-300/50 dark:border-zinc-700/30 backdrop-blur-sm">
                <FiShoppingCart className="w-16 h-16 text-zinc-400 dark:text-zinc-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white">
                Your Cart is <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">Empty</span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
                Discover our amazing selection of delicious treats and start adding items to your cart
              </p>
            </div>
            
            <Link href="/products" className="inline-block">
              <button className="group relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative">Continue Shopping</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/40 dark:from-zinc-900/30 via-transparent to-orange-100/10 dark:to-orange-900/5"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-20 max-w-7xl relative z-10">
        <div className="mb-8 sm:mb-12 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-black dark:text-white mb-2 sm:mb-4">
            Shopping <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Cart</span>
          </h1>
          <div className="flex items-center justify-center lg:justify-start gap-2 text-base sm:text-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <p className="text-zinc-600 dark:text-zinc-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-12">
          {/* Cart Items Section */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className="group relative bg-gradient-to-br from-zinc-100/90 dark:from-zinc-900/90 via-zinc-200/80 dark:via-zinc-800/80 to-zinc-100/70 dark:to-zinc-900/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-zinc-300/50 dark:border-zinc-700/30 hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                    {/* Product Image & Info Section */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.imageUrl ? (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 ring-2 ring-zinc-300/50 dark:ring-zinc-700/50 group-hover:ring-orange-500/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-500/25">
                            <Image 
                              src={item.imageUrl} 
                              alt={item.name} 
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center ring-2 ring-zinc-300/50 dark:ring-zinc-700/50 group-hover:ring-orange-500/50 transition-all duration-500">
                            <FiShoppingCart className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={item.slug ? `/products/${item.slug}` : '#'} 
                          className="text-sm sm:text-lg font-semibold text-black dark:text-white hover:text-orange-400 transition-colors duration-300 block mb-1 line-clamp-2 group-hover:text-orange-300"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                          <span>Unit Price:</span>
                          <span className="font-medium text-orange-400 group-hover:text-orange-300 transition-colors duration-300">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Controls Section */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800/60 rounded-xl p-1 border border-zinc-300/50 dark:border-zinc-700/50 group-hover:bg-zinc-300/80 dark:group-hover:bg-zinc-700/60 group-hover:border-zinc-400/50 dark:group-hover:border-zinc-600/50 transition-all duration-300">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          disabled={item.quantity <= 1} 
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-transparent hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <div className="w-12 sm:w-14 text-center">
                          <span className="font-bold text-sm sm:text-base text-black dark:text-white">{item.quantity}</span>
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-transparent hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 transition-all duration-200 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right min-w-[80px] sm:min-w-[100px]">
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Total</div>
                        <div className="text-lg sm:text-xl font-bold text-black dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-100 transition-colors duration-300">{formatCurrency(item.price * item.quantity)}</div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/60 transition-all duration-300 flex items-center justify-center group/delete hover:shadow-lg hover:shadow-red-500/25"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/delete:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {cartItems.length > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-zinc-300/50 dark:border-zinc-800/50">
                <button
                  onClick={clearCart}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-red-400 transition-colors duration-300 font-medium hover:underline decoration-red-400 underline-offset-4"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-zinc-100/90 dark:from-zinc-900/90 via-zinc-200/80 dark:via-zinc-800/80 to-zinc-100/90 dark:to-zinc-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-zinc-300/50 dark:border-zinc-700/30 sticky top-24 shadow-2xl shadow-zinc-300/50 dark:shadow-zinc-900/50">
              {/* Header with subtle accent */}
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl -m-2"></div>
                <h2 className="relative text-xl sm:text-2xl font-semibold text-black dark:text-white">Order Summary</h2>
              </div>
              
              <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                <div className="flex justify-between items-center text-base sm:text-lg group hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 -mx-2 px-2 py-2 rounded-lg transition-colors duration-200">
                  <span className="text-zinc-700 dark:text-zinc-300">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-black dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-200 transition-colors duration-200">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base group hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 -mx-2 px-2 py-2 rounded-lg transition-colors duration-200">
                  <span className="text-zinc-600 dark:text-zinc-400">Taxes</span>
                  <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base group hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 -mx-2 px-2 py-2 rounded-lg transition-colors duration-200">
                  <span className="text-zinc-600 dark:text-zinc-400">Shipping</span>
                  <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200">Calculated at checkout</span>
                </div>
                
                {/* Enhanced total section */}
                <div className="border-t border-zinc-300/50 dark:border-zinc-700/50 pt-4 sm:pt-5 mt-4">
                  <div className="flex justify-between items-center text-xl sm:text-2xl font-bold bg-gradient-to-r from-zinc-200/80 dark:from-zinc-800/50 to-zinc-300/80 dark:to-zinc-700/50 -mx-2 px-2 py-3 rounded-xl border border-zinc-300/50 dark:border-zinc-700/30">
                    <span className="text-black dark:text-white">Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced buttons */}
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-black px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 shadow-lg shadow-orange-500/25 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Proceed to Checkout</span>
                </button>
                <Link href="/products" className="block">
                  <button className="w-full border border-zinc-400/50 dark:border-zinc-600/50 text-zinc-700 dark:text-zinc-300 py-2 sm:py-3 rounded-xl font-medium hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:border-orange-500/50 hover:text-orange-500 dark:hover:text-orange-200 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-400/25 dark:hover:shadow-zinc-700/25">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}