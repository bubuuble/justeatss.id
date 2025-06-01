// app/components/UserOrderHistory.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck,
  FiRefreshCw,
  FiEye,
  FiChevronRight,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  _createdAt: string;
  _updatedAt: string;
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };  paymentDetails?: {
    paymentType: string;
    transactionId: string;
    paymentUrl?: string;
  };
  customerNotes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
}

interface OrderHistoryResponse {
  orders: Order[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const UserOrderHistory: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });

  const fetchOrders = async (offset = 0, status = 'all') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
        ...(status !== 'all' && { status })
      });

      const response = await fetch(`/api/orders/user?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: OrderHistoryResponse = await response.json();
      
      if (offset === 0) {
        setOrders(data.orders);
      } else {
        setOrders(prev => [...prev, ...data.orders]);
      }
      
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders(0, statusFilter);
    }
  }, [isLoaded, user, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending_confirmation':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <FiRefreshCw className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FiPackage className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending_confirmation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'settlement':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancel':
      case 'deny':
      case 'expire':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchOrders(pagination.offset + pagination.limit, statusFilter);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isLoaded || loading) {
    return (
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <FiPackage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sign In to View Orders</h3>
            <p className="text-gray-400 mb-6">Please sign in to see your order history</p>
            <Link 
              href="/sign-in"
              className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Orders</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => fetchOrders(0, statusFilter)}
              className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <section id="orders" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Order History
            </h2>
            <p className="text-gray-400 text-lg">
              Track your orders and see your purchase history
            </p>
          </div>

          {/* Status Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { value: 'all', label: 'All Orders' },
                { value: 'pending_confirmation', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'processing', label: 'Processing' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === filter.value
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-gray-400 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't placed any orders yet" 
                  : `No orders with status: ${statusFilter}`
                }
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        {getStatusIcon(order.orderStatus)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(order._createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4 text-green-400" />
                        <span className="font-semibold text-lg">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Items ({order.items.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                          {item.image && (
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-600">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.productName}</p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="col-span-1 md:col-span-2 text-center text-sm text-gray-400">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Shipping Address</h4>
                    <p className="text-sm text-gray-400">
                      {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                    </p>
                  </div>

                  {/* Tracking Information */}
                  {order.trackingNumber && (
                    <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FiTruck className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Tracking Number:</span>
                        <span className="text-sm text-blue-200 font-mono">{order.trackingNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Link
                      href={`/orders/${order.orderId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors text-sm"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                      <FiChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="text-center pt-6">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Orders
                        <FiChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserOrderHistory;
