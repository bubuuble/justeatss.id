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
      setError("Please select a shipping address and make sure your cart is not empty.");
      return;
    }
    setIsPlacingOrder(true);
    setError(null);

    try {
      const orderData = {
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: totalAmount,
        shippingAddress: {
            street_address: selectedAddress.street_address,
            city: selectedAddress.city,
            state_province: selectedAddress.state_province,
            postal_code: selectedAddress.postal_code,
            country: selectedAddress.country,
            phone_number: selectedAddress.phone_number,
        },
      };

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order.');
      }

      // --- Doku Integration Placeholder ---
      // Here, `result.paymentUrl` (if provided by the API) would be used to redirect to Doku
      // Or, you would initialize the Doku SDK with parameters from `result`
      console.log('Order created, Doku payment process would start here with:', result);
      alert(`Order ${result.orderId} created successfully! (Doku payment not yet integrated). Redirecting to success page...`);
      // --- End Doku Placeholder ---

      clearCart(); // Clear cart after success
      router.push(`/order-success?orderId=${result.orderId}`); // Redirect to success page

    } catch (err: any) {
      console.error("Error creating order:", err);
      setError(err.message || "An error occurred while processing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
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
    <div className="bg-black container mx-auto px-4 py-8 md:py-12 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Address & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          <section className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {isLoadingAddresses ? <p>Loading addresses...</p> : userAddresses.length > 0 ? (
              <select
                value={selectedAddress?.id || ''}
                onChange={(e) => {
                  const addr = userAddresses.find(a => a.id === e.target.value);
                  setSelectedAddress(addr || null);
                }}
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Address</option>
                {userAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street_address}, {addr.city} {addr.is_default ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-zinc-400">You don't have any addresses yet.
                <Link href="/account" className="text-indigo-400 hover:underline ml-1">Add Address</Link>
              </p>
            )}
            {selectedAddress && (
              <div className="mt-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded text-sm">
                <p>{selectedAddress.street_address}</p>
                <p>{selectedAddress.city}, {selectedAddress.state_province} {selectedAddress.postal_code}</p>
                <p>{selectedAddress.country}</p>
                {selectedAddress.phone_number && <p>Tel: {selectedAddress.phone_number}</p>}
              </div>
            )}
             {/* Button to manage addresses if user wants to add/edit from here */}
             <div className="mt-2">
                <Link href="/account" className="text-xs text-indigo-400 hover:underline">
                    Manage Addresses
                </Link>
            </div>
          </section>

          {/* Cart Items */}
          <section className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-b-0">
                <div>
                  <p className="font-medium">{item.name} (x{item.quantity})</p>
                  <p className="text-sm text-zinc-400">{formatCurrency(item.price)}</p>
                </div>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column: Total & Pay Button */}
        <div className="lg:col-span-1 bg-zinc-900 p-6 rounded-lg h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Total</h2>
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(totalAmount)}</span></div>
            {/* Taxes and shipping can be added here */}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-700"><span>Total:</span> <span>{formatCurrency(totalAmount)}</span></div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !selectedAddress || cartItems.length === 0}
            className="w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}