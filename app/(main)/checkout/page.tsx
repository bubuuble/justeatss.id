// app/(main)/checkout/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useCart, CartItem  } from '../context/CartContext';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirect

// Type for saved/selected address
interface Address {
  id: string; street_address: string; city: string; state_province?: string | null;
  postal_code: string; country: string; phone_number?: string | null; is_default?: boolean | null;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = getCartTotal();

  // Fetch user's saved addresses
  useEffect(() => {
    if (isLoaded && user) {
      const fetchUserAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
          const response = await fetch('/api/addresses'); // Call your address API
          if (!response.ok) throw new Error('Failed to load addresses');
          const data: Address[] = await response.json();
          setUserAddresses(data);
          // Select default address if available
          const defaultAddr = data.find(addr => addr.is_default);
          if (defaultAddr) setSelectedAddress(defaultAddr);
          else if (data.length > 0) setSelectedAddress(data[0]); // Or select the first one
        } catch (err: any) {
          console.error("Error loading addresses:", err);
          // Optionally show this error in the UI
        } finally {
          setIsLoadingAddresses(false);
        }
      };
      fetchUserAddresses();
    }
  }, [user, isLoaded]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || cartItems.length === 0) {
      setError("Silakan pilih alamat pengiriman dan pastikan keranjang tidak kosong.");
      return;
    }
    setIsPlacingOrder(true);
    setError(null);

    try {
      const customerName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Pelanggan Justeatss';
      const customerEmail = user?.primaryEmailAddress?.emailAddress || 'email@example.com';
      const customerPhone = selectedAddress.phone_number || user?.primaryPhoneNumber?.phoneNumber || ''; // Ambil dari alamat dulu, lalu profil

      const orderData = {
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          slug: item.slug,
          // Anda mungkin perlu menambahkan sku, category, url, type jika payment method Doku tertentu mewajibkannya
          sku: item.id, // Contoh sederhana
          category: "food-and-beverage", // Contoh, lihat daftar kategori Doku
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${item.slug}`,
        })),
        totalAmount: totalAmount,
        shippingAddress: { // Sesuaikan dengan field yang dibutuhkan Doku
            first_name: customerName.split(' ')[0],
            last_name: customerName.split(' ').slice(1).join(' ') || customerName.split(' ')[0], // Handle nama tunggal
            address: selectedAddress.street_address,
            city: selectedAddress.city,
            postal_code: selectedAddress.postal_code,
            phone: selectedAddress.phone_number || customerPhone, // Pastikan format Doku (misal, tanpa +)
            country_code: selectedAddress.country.length === 3 ? selectedAddress.country : "IDN", // Doku butuh 3 digit
        },
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone, // Pastikan format Doku (misal, tanpa +)
      };      // Panggil API route Midtrans untuk menginisiasi pembayaran
      const response = await fetch('/api/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menginisiasi pembayaran.');
      }

      // Jika sukses, result akan berisi redirectUrl dari Midtrans
      if (result.redirectUrl) {
        console.log("Mengarahkan ke Midtrans Payment URL:", result.redirectUrl);
        // Kosongkan keranjang SETELAH redirect sukses
        clearCart();
        window.location.href = result.redirectUrl; // Redirect ke halaman pembayaran Midtrans
      } else {
        throw new Error('URL pembayaran Midtrans tidak diterima.');
      }

    } catch (err: any) {
      console.error("Error saat proses checkout:", err);
      setError(err.message || "Terjadi kesalahan saat memproses pesanan Anda.");
      setIsPlacingOrder(false); // Pastikan set loading false jika ada error sebelum redirect
    }
    // setIsPlacingOrder(false); // Ini mungkin tidak tercapai jika redirect berhasil
  };

  if (!isLoaded) return <div className="text-center py-10 text-white">Loading...</div>;
  if (!user) {
    // Should already be protected by middleware, but as a fallback
    router.push('/sign-in?redirect_url=/checkout');
    return null;
  }
  if (cartItems.length === 0 && !isPlacingOrder) {
     // Redirect if cart is empty, unless currently placing order
     router.push('/products');
     return <div className="text-center py-10 text-white">Cart is empty, redirecting...</div>;
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-4">
            <span className="font-light">Check</span>
            <span className="font-bold text-orange-500 ml-4">out</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light">Complete your order with secure payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Address & Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Selection */}
            <section className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-black font-bold text-sm">1</span>
                </div>
                <h2 className="text-2xl font-semibold">Shipping Address</h2>
              </div>
              
              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-zinc-400">Loading addresses...</span>
                </div>
              ) : userAddresses.length > 0 ? (
                <div className="space-y-4">
                  <select
                    value={selectedAddress?.id || ''}
                    onChange={(e) => {
                      const addr = userAddresses.find(a => a.id === e.target.value);
                      setSelectedAddress(addr || null);
                    }}
                    className="w-full p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  >
                    <option value="">Select delivery address</option>
                    {userAddresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.street_address}, {addr.city} {addr.is_default ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                  
                  {selectedAddress && (
                    <div className="mt-4 p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-xl">
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-white">{selectedAddress.street_address}</p>
                        <p className="text-zinc-300">{selectedAddress.city}, {selectedAddress.state_province} {selectedAddress.postal_code}</p>
                        <p className="text-zinc-300">{selectedAddress.country}</p>
                        {selectedAddress.phone_number && <p className="text-zinc-400">📞 {selectedAddress.phone_number}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📍</span>
                    </div>
                    <p className="text-zinc-400 mb-3">You don't have any addresses yet.</p>
                    <Link href="/account" className="inline-block bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                      Add Address
                    </Link>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link href="/account" className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-300">
                  ⚙️ Manage Addresses
                </Link>
              </div>
            </section>

            {/* Cart Items */}
            <section className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-black font-bold text-sm">2</span>
                </div>
                <h2 className="text-2xl font-semibold">Order Summary</h2>
                <span className="ml-auto bg-zinc-800 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:border-orange-500/30 transition-all duration-300">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-zinc-400">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-400">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Total & Pay Button */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 sticky top-24">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-black font-bold text-sm">3</span>
                </div>
                <h2 className="text-2xl font-semibold">Payment</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal:</span> 
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Delivery:</span> 
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-zinc-700/50 pt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span> 
                    <span className="text-orange-400">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddress || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-orange-500/25"
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Processing Order...
                  </div>
                ) : (
                  '🚀 Proceed to Payment'
                )}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-zinc-500">
                  Secure payment powered by Midtrans
                </p>
                <div className="flex justify-center items-center mt-2 space-x-2">
                  <span className="text-xs text-zinc-400">🔒 SSL Encrypted</span>
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400">💳 Multiple Payment Methods</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}