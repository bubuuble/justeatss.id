// app/(main)/orders/[orderId]/EnhancedShippingAddress.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FiMapPin, FiPhone, FiUser, FiLoader, FiHome } from "react-icons/fi";

interface Address {
  id: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  phone_number?: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

interface OrderShippingInfo {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface AddressData {
  orderShippingInfo: OrderShippingInfo;
  enhancedAddress: Address | null;
  allAddresses: Address[];
  totalAddresses: number;
  warning?: string;
}

interface EnhancedShippingAddressProps {
  orderId: string;
  fallbackShippingAddress?: OrderShippingInfo;
}

export default function EnhancedShippingAddress({
  orderId,
  fallbackShippingAddress,
}: EnhancedShippingAddressProps) {
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  useEffect(() => {
    const fetchEnhancedAddress = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching enhanced address for order:", orderId);

        const response = await fetch(`/api/orders/${orderId}/address`);
        console.log(
          "📡 Response status:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ API Error:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Enhanced address data received:", {
          hasOrderInfo: !!data.orderShippingInfo,
          hasEnhanced: !!data.enhancedAddress,
          addressCount: data.allAddresses?.length || 0,
        });

        setAddressData(data);
      } catch (err) {
        console.error("❌ Error fetching enhanced address:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchEnhancedAddress();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiMapPin className="w-5 h-5" />
          Shipping Address
        </h2>
        <div className="flex items-center justify-center py-8">
          <FiLoader className="w-6 h-6 text-orange-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !addressData) {
    // Fallback to basic shipping address
    const shippingInfo =
      fallbackShippingAddress || addressData?.orderShippingInfo;
    return (
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiMapPin className="w-5 h-5" />
          Shipping Address
        </h2>
        {shippingInfo ? (
          <div className="space-y-2">
            {shippingInfo.name && (
              <p className="text-white font-medium flex items-center gap-2">
                <FiUser className="w-4 h-4 text-zinc-400" />
                {shippingInfo.name}
              </p>
            )}
            <p className="text-zinc-300">{shippingInfo.address}</p>
            <p className="text-zinc-300">
              {shippingInfo.city}, {shippingInfo.postalCode}
            </p>
            {shippingInfo.phone && (
              <p className="text-zinc-300 flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-zinc-400" />
                {shippingInfo.phone}
              </p>
            )}
            {error && (
              <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-xs">
                ⚠️ Enhanced address data unavailable - showing basic info
              </div>
            )}
          </div>
        ) : (
          <div className="text-zinc-400 text-sm">
            No shipping address information available
          </div>
        )}
      </div>
    );
  }

  const {
    orderShippingInfo,
    enhancedAddress,
    allAddresses,
    totalAddresses,
    warning,
  } = addressData;

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiMapPin className="w-5 h-5" />
          Shipping Address
        </h2>
        <div className="flex items-center gap-2">
          {totalAddresses > 1 && (
            <button
              onClick={() => setShowAllAddresses(!showAllAddresses)}
              className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors text-zinc-300"
            >
              {showAllAddresses ? "Hide" : "Show"} All ({totalAddresses})
            </button>
          )}
          {enhancedAddress && (
            <div className="text-xs px-2 py-1 bg-green-900/30 border border-green-700 rounded text-green-300 flex items-center gap-1">
              <FiHome className="w-3 h-3" />
              Enhanced
            </div>
          )}
        </div>
      </div>

      {enhancedAddress ? (
        <>
          {/* Enhanced Address Display */}
          <div className="space-y-3">
            <div className="p-3 bg-green-900/20 border border-green-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-300 font-medium">
                  Primary Address
                </span>
                {enhancedAddress.is_default && (
                  <span className="text-xs px-1 py-0.5 bg-blue-900/30 border border-blue-700 rounded text-blue-300">
                    Default
                  </span>
                )}
              </div>
              <div className="text-white space-y-1">
                <p className="font-medium">{enhancedAddress.street_address}</p>
                <p>
                  {enhancedAddress.city}
                  {enhancedAddress.state_province &&
                    `, ${enhancedAddress.state_province}`}{" "}
                  {enhancedAddress.postal_code}
                </p>
                <p className="text-zinc-300">{enhancedAddress.country}</p>
                {enhancedAddress.phone_number && (
                  <p className="text-zinc-300 flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    {enhancedAddress.phone_number}
                  </p>
                )}
              </div>
            </div>

            {/* Order Shipping Info for Comparison */}
            <div className="text-xs text-zinc-500 border-t border-zinc-700 pt-3">
              {" "}
            </div>
          </div>{" "}
        </>
      ) : (
        <div className="space-y-2">
          {orderShippingInfo?.name && (
            <p className="text-white font-medium flex items-center gap-2">
              <FiUser className="w-4 h-4 text-zinc-400" />
              {orderShippingInfo.name}
            </p>
          )}
          <p className="text-zinc-300">{orderShippingInfo?.address}</p>
          <p className="text-zinc-300">
            {orderShippingInfo?.city}, {orderShippingInfo?.postalCode}
          </p>{" "}
          {orderShippingInfo?.phone && (
            <p className="text-zinc-300 flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-zinc-400" />
              {orderShippingInfo.phone}
            </p>
          )}
          {warning && (
            <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-xs">
              ⚠️ {warning}
            </div>
          )}
          {!enhancedAddress && !warning && (
            <div className="mt-3 p-2 bg-blue-900/30 border border-blue-700 rounded text-blue-300 text-xs">
              ℹ️ No enhanced address data available
            </div>
          )}
        </div>
      )}

      {/* All Addresses Dropdown */}
      {showAllAddresses && allAddresses.length > 0 && (
        <div className="border-t border-zinc-600 pt-4 mt-4">
          <h3 className="font-medium text-zinc-300 mb-3">
            All Your Addresses ({allAddresses.length})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {allAddresses.map((addr, index) => (
              <div
                key={addr.id}
                className={`p-3 rounded border text-sm ${
                  addr.id === enhancedAddress?.id
                    ? "bg-green-900/20 border-green-700"
                    : "bg-zinc-700/20 border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-zinc-400">#{index + 1}</span>
                  {addr.is_default && (
                    <span className="text-xs px-1 py-0.5 bg-blue-900/30 border border-blue-700 rounded text-blue-300">
                      Default
                    </span>
                  )}
                  {addr.id === enhancedAddress?.id && (
                    <span className="text-xs px-1 py-0.5 bg-green-900/30 border border-green-700 rounded text-green-300">
                      Used
                    </span>
                  )}
                </div>
                <div className="text-zinc-300 space-y-0.5">
                  <p>{addr.street_address}</p>
                  <p>
                    {addr.city}
                    {addr.state_province && `, ${addr.state_province}`}{" "}
                    {addr.postal_code}
                  </p>
                  <p className="text-zinc-400">{addr.country}</p>
                  {addr.phone_number && (
                    <p className="text-zinc-400">📱 {addr.phone_number}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
