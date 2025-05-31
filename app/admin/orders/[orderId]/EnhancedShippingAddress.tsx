// app/admin/orders/[orderId]/EnhancedShippingAddress.tsx
'use client';

import { useState, useEffect } from 'react';

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

interface BuyerAddressData {
  orderShippingInfo: OrderShippingInfo;
  enhancedAddress: Address | null;
  allAddresses: Address[];
  buyerUserId: string;
  totalAddresses: number;
}

interface EnhancedShippingAddressProps {
  orderId: string;
  fallbackShippingAddress?: OrderShippingInfo;
}

export default function EnhancedShippingAddress({ 
  orderId, 
  fallbackShippingAddress 
}: EnhancedShippingAddressProps) {
  const [addressData, setAddressData] = useState<BuyerAddressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    const fetchBuyerAddress = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/${orderId}/buyer-address`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch buyer address');
        }
        
        const data = await response.json();
        setAddressData(data);
      } catch (err) {
        console.error('Error fetching buyer address:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchBuyerAddress();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-orange-400">🚚 Shipping Address</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-700 rounded mb-2"></div>
          <div className="h-4 bg-zinc-700 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-zinc-700 rounded mb-2 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !addressData) {
    // Fallback to basic shipping address
    return (
      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-orange-400">🚚 Shipping Address</h2>
        {fallbackShippingAddress ? (
          <div className="text-white space-y-1">
            <p>{fallbackShippingAddress.name}</p>
            <p>{fallbackShippingAddress.phone}</p>
            <p>{fallbackShippingAddress.address}</p>
            <p>{fallbackShippingAddress.city}, {fallbackShippingAddress.postalCode}</p>
          </div>
        ) : (
          <p className="text-zinc-400">No shipping address available</p>
        )}
        {error && (
          <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded text-red-300 text-xs">
            ⚠️ Could not load enhanced address data: {error}
          </div>
        )}
      </div>
    );
  }

  const { orderShippingInfo, enhancedAddress, allAddresses, totalAddresses } = addressData;

  return (
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-orange-400">🚚 Shipping Address</h2>
        <div className="flex items-center gap-2">
          {totalAddresses > 1 && (
            <button
              onClick={() => setShowAllAddresses(!showAllAddresses)}
              className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
            >
              {showAllAddresses ? 'Hide' : 'Show'} All ({totalAddresses})
            </button>
          )}
          {enhancedAddress && (
            <span className="text-xs px-2 py-1 bg-green-900/30 border border-green-700 rounded text-green-300">
              ✓ Enhanced
            </span>
          )}
        </div>
      </div>

      {/* Primary Shipping Address */}
      <div className="space-y-4">
        {enhancedAddress ? (
          <>
            {/* Enhanced Address from Profile */}
            <div className="bg-zinc-700/30 rounded-lg p-4 border border-zinc-600">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium text-green-400">📍 Profile Address</h3>
                {enhancedAddress.is_default && (
                  <span className="text-xs px-2 py-1 bg-blue-900/30 border border-blue-700 rounded text-blue-300">
                    Default
                  </span>
                )}
              </div>
              
              <div className="text-white space-y-1">
                <p className="font-medium">{orderShippingInfo?.name || 'N/A'}</p>
                {enhancedAddress.phone_number && (
                  <p className="text-green-400">📱 {enhancedAddress.phone_number}</p>
                )}
                <p>{enhancedAddress.street_address}</p>
                <p>
                  {enhancedAddress.city}
                  {enhancedAddress.state_province && `, ${enhancedAddress.state_province}`}
                  {' '}{enhancedAddress.postal_code}
                </p>
                <p className="text-zinc-300">{enhancedAddress.country}</p>
              </div>
              
              <div className="mt-3 text-xs text-zinc-400 border-t border-zinc-600 pt-2">
                Address ID: {enhancedAddress.id} • 
                Added: {new Date(enhancedAddress.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Order Shipping Info for Comparison */}
          </>
        ) : (
          /* Fallback to Order Shipping Info */
          <div className="text-white space-y-1">
            <p>{orderShippingInfo?.name}</p>
            <p>{orderShippingInfo?.phone}</p>
            <p>{orderShippingInfo?.address}</p>
            <p>{orderShippingInfo?.city}, {orderShippingInfo?.postalCode}</p>
            <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-xs">
              ℹ️ No enhanced address data available for this buyer
            </div>
          </div>
        )}

        {/* All Addresses Dropdown */}
        {showAllAddresses && allAddresses.length > 0 && (
          <div className="border-t border-zinc-600 pt-4">
            <h3 className="font-medium text-zinc-300 mb-3">All Buyer Addresses ({allAddresses.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {allAddresses.map((addr, index) => (
                <div 
                  key={addr.id} 
                  className={`p-3 rounded border text-sm ${
                    addr.id === enhancedAddress?.id 
                      ? 'bg-green-900/20 border-green-700' 
                      : 'bg-zinc-700/20 border-zinc-600'
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
                      {addr.state_province && `, ${addr.state_province}`}
                      {' '}{addr.postal_code}
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
    </div>
  );
}
