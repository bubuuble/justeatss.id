// app/(main)/checkout/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useCart, CartItem  } from '../context/CartContext';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirect
import AccountModal from '../../components/AccountModal';

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
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const totalAmount = getCartTotal();

  // Function to open account modal on addresses tab
  const handleAddAddress = () => {
    setIsAccountModalOpen(true);
  };

  // Refresh addresses when modal closes
  const handleModalClose = async (wasOpen: boolean) => {
    setIsAccountModalOpen(false);
    if (wasOpen && user) {
      // Refresh addresses if modal was open (meaning user might have added/modified addresses)
      const fetchUserAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
          const response = await fetch('/api/addresses');
          if (response.ok) {
            const data: Address[] = await response.json();
            setUserAddresses(data);
            // Auto-select default address if available and none currently selected
            if (!selectedAddress) {
              const defaultAddr = data.find(addr => addr.is_default);
              if (defaultAddr) setSelectedAddress(defaultAddr);
              else if (data.length > 0) setSelectedAddress(data[0]);
            }
          }
        } catch (err) {
          console.error("Error refreshing addresses:", err);
        } finally {
          setIsLoadingAddresses(false);
        }
      };
      await fetchUserAddresses();
    }  };

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
          setError(null); // clear error if success
        } catch (err: any) {
          console.error("Error loading addresses:", err);
          setError(err.message || 'Gagal memuat alamat. Silakan coba lagi.');
        } finally {
          setIsLoadingAddresses(false);
        }
      };
      fetchUserAddresses();
    }
  }, [user, isLoaded]);

  // Refresh addresses when account modal closes
  useEffect(() => {
    if (!isAccountModalOpen && isLoaded && user) {
      const refetchAddresses = async () => {
        try {
          const response = await fetch('/api/addresses');
          if (response.ok) {
            const data: Address[] = await response.json();
            setUserAddresses(data);
            // Update selected address if it was modified
            if (selectedAddress) {
              const updatedSelected = data.find(addr => addr.id === selectedAddress.id);
              if (updatedSelected) {
                setSelectedAddress(updatedSelected);
              }
            }
          }
        } catch (err) {
          console.error("Error refreshing addresses:", err);
        }
      };
      refetchAddresses();
    }
  }, [isAccountModalOpen, isLoaded, user, selectedAddress]);

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
        // Simpan selectedAddress dan cart ke localStorage sebelum redirect ke Midtrans
        localStorage.setItem('justeatss_selected_address', JSON.stringify(selectedAddress));
        localStorage.setItem('justeatss_cart', JSON.stringify(cartItems));
        // Jangan clearCart di sini!
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

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Your cart is empty</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">Add some delicious items to proceed with checkout.</p>
          <Link 
            href="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">      {/* Account Modal */}
      <AccountModal 
        isOpen={isAccountModalOpen} 
        setIsOpen={setIsAccountModalOpen}
        initialTab="addresses"
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-light text-black dark:text-white">
              Checkout
            </h1>
            <Link 
              href="/cart"
              className="text-orange-500 hover:text-orange-400 transition-colors font-medium"
            >
              ← Back to Cart
            </Link>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Complete your order details below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            {/* Tampilkan error jika ada error fetch alamat */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Shipping Address</h3>
              
              {isLoadingAddresses ? (
                <div className="text-center py-4">
                  <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2">Loading addresses...</p>
                </div>
              ) : userAddresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">No addresses found. Please add a shipping address.</p>
                  <button
                    onClick={handleAddAddress}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddress?.id === address.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedAddress?.id === address.id
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-zinc-300 dark:border-zinc-600'
                              }`}
                            >
                              {selectedAddress?.id === address.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            {address.is_default && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-black dark:text-white">
                            <p className="font-medium">{address.street_address}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {address.city}, {address.state_province} {address.postal_code}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{address.country}</p>
                            {address.phone_number && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{address.phone_number}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleAddAddress}
                    className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-4 text-zinc-600 dark:text-zinc-400 hover:border-orange-500 hover:text-orange-500 transition-all duration-200"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Payment Method</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MT</span>
                  </div>
                  <div>
                    <p className="font-medium text-black dark:text-white">Midtrans Payment Gateway</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Secure payment via multiple methods</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-6">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-zinc-200 dark:border-zinc-700 last:border-b-0">
                    <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-black dark:text-white text-sm truncate">{item.name}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black dark:text-white text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Shipping</span>
                  <span>Calculated at payment</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tax</span>
                  <span>Calculated at payment</span>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-700" />
                <div className="flex justify-between text-xl font-bold text-black dark:text-white">
                  <span>Total</span>
                  <span className="text-orange-500">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="space-y-3">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || isPlacingOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-500 dark:disabled:text-zinc-400 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? 'Processing...' : 'Place Order'}
                </button>
                
                <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}