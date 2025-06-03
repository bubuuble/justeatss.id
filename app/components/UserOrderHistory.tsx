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
  FiDollarSign,
  FiUser
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
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'settlement':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancel':
      case 'deny':
      case 'expire':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
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
  };  if (!isLoaded || loading) {
    return (
      <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-orange-100/5 dark:from-zinc-900/30 dark:via-transparent dark:to-orange-900/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-zinc-100/90 via-zinc-200/80 to-zinc-100/70 dark:from-zinc-900/90 dark:via-zinc-800/80 dark:to-zinc-900/70 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/30 dark:border-zinc-700/30">
                  <div className="h-6 bg-zinc-300/50 dark:bg-zinc-700/50 rounded-xl w-1/4 mb-4"></div>
                  <div className="h-4 bg-zinc-300/50 dark:bg-zinc-700/50 rounded-lg w-1/2 mb-2"></div>
                  <div className="h-4 bg-zinc-300/50 dark:bg-zinc-700/50 rounded-lg w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }  if (!user) {
    return (
      <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-orange-100/5 dark:from-zinc-900/30 dark:via-transparent dark:to-orange-900/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-screen relative z-10">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gradient-to-br from-zinc-100/90 via-zinc-200/80 to-zinc-100/70 dark:from-zinc-900/90 dark:via-zinc-800/80 dark:to-zinc-900/70 backdrop-blur-xl rounded-3xl p-12 border border-zinc-200/30 dark:border-zinc-700/30">
              <div className="mb-8 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 rounded-2xl mx-auto flex items-center justify-center">
                  <FiPackage className="w-10 h-10 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500/20 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Sign In to View Orders</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Please sign in to access your order history and track your purchases
              </p>
              <Link 
                href="/sign-in"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                <FiUser className="w-5 h-5" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }  if (error) {
    return (
      <section className="bg-white dark:bg-black min-h-screen text-black dark:text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-orange-100/5 dark:from-zinc-900/30 dark:via-transparent dark:to-orange-900/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-zinc-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                    <FiXCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent mb-3">
                    Unable to Load Orders
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{error}</p>
                </div>
                
                <button 
                  onClick={() => fetchOrders(0, statusFilter)}
                  className="group w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );}  return (
    <section id="orders" className="bg-white dark:bg-black min-h-screen text-black dark:text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-orange-100/5 dark:from-zinc-900/30 dark:via-transparent dark:to-orange-900/5"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-zinc-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                📦 Order History
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
              Track your orders and see your complete purchase history with detailed information
            </p>
          </div>          {/* Status Filter */}
          <div className="mb-12">
            <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4 text-center">Filter by Status</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { value: 'all', label: '🔍 All Orders', count: orders.length },
                  { value: 'pending_confirmation', label: '⏳ Pending', count: orders.filter(o => o.orderStatus === 'pending_confirmation').length },
                  { value: 'confirmed', label: '✅ Confirmed', count: orders.filter(o => o.orderStatus === 'confirmed').length },
                  { value: 'processing', label: '⚙️ Processing', count: orders.filter(o => o.orderStatus === 'processing').length },
                  { value: 'shipped', label: '🚚 Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
                  { value: 'delivered', label: '📦 Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
                  { value: 'cancelled', label: '❌ Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      statusFilter === filter.value
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/70 border border-zinc-300 dark:border-zinc-600/30 hover:border-orange-500/30'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {filter.label}
                      {filter.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          statusFilter === filter.value
                            ? 'bg-white/20 text-white'
                            : 'bg-zinc-700 text-zinc-300'
                        }`}>
                          {filter.count}
                        </span>
                      )}
                    </span>
                    {statusFilter === filter.value && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-white/90 via-zinc-50/80 to-white/70 dark:from-zinc-900/90 dark:via-zinc-800/80 dark:to-zinc-900/70 backdrop-blur-xl rounded-3xl p-12 border border-zinc-200/30 dark:border-zinc-700/30 max-w-lg mx-auto">
                <div className="mb-6 relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 rounded-2xl mx-auto flex items-center justify-center">
                    <FiPackage className="w-12 h-12 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500/20 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mb-3">No Orders Found</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                  {statusFilter === 'all' 
                    ? "You haven't placed any orders yet. Start exploring our delicious products!" 
                    : `No orders found with status: ${statusFilter.replace('_', ' ')}`
                  }
                </p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
                >
                  <FiPackage className="w-5 h-5" />
                  Start Shopping
                </Link>
              </div>
            </div>          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="group bg-gradient-to-br from-white/90 via-zinc-50/80 to-white/70 dark:from-zinc-900/90 dark:via-zinc-800/80 dark:to-zinc-900/70 backdrop-blur-xl rounded-2xl border border-zinc-200/30 dark:border-zinc-700/30 hover:border-orange-500/30 transition-all duration-500 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl hover:shadow-orange-500/10"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-zinc-200/30 dark:border-zinc-700/30">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="p-3 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 rounded-xl group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-500">
                            {getStatusIcon(order.orderStatus)}
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-zinc-800 dark:text-white group-hover:text-orange-400 transition-colors">
                            Order #{order.orderId}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(order._createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:items-end gap-3">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="w-5 h-5 text-green-400" />
                          <span className="font-bold text-2xl text-zinc-800 dark:text-white">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`px-4 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>                  {/* Order Items */}
                  <div className="p-6 border-b border-zinc-200/30 dark:border-zinc-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-zinc-800 dark:text-white flex items-center gap-2">
                        <FiPackage className="w-5 h-5 text-orange-400" />
                        Items ({order.items.length})
                      </h4>
                      {order.items.length > 2 && (
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Showing first 2 items
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="group flex items-center gap-4 p-4 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30 hover:border-orange-500/30 transition-all duration-300">
                          {item.image && (
                            <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 ring-1 ring-zinc-300 dark:ring-zinc-600">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-800 dark:text-white truncate group-hover:text-orange-400 transition-colors">
                              {item.productName}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                              Qty: <span className="font-medium text-zinc-800 dark:text-white">{item.quantity}</span> × <span className="font-medium text-green-400">{formatPrice(item.price)}</span>
                            </p>
                            <p className="text-xs text-orange-400 font-medium mt-1">
                              Total: {formatPrice(item.quantity * item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="col-span-1 md:col-span-2 flex items-center justify-center p-4 bg-zinc-100/30 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/20 dark:border-zinc-700/20 border-dashed">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                            <FiPackage className="w-4 h-4" />
                            +{order.items.length - 2} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="p-6 space-y-4">
                    {/* Shipping Address */}
                    <div className="p-4 bg-zinc-100/30 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/20 dark:border-zinc-700/20">
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                        <FiTruck className="w-4 h-4 text-blue-400" />
                        Shipping Address
                      </h4>                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                      </p>
                    </div>                    {/* Tracking Information */}
                    {order.trackingNumber && (
                      <div className="p-4 bg-gradient-to-r from-blue-100/20 to-purple-100/20 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-500/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FiTruck className="w-5 h-5 text-blue-400" />
                          <div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">Tracking Number:</span>
                            <span className="text-sm text-blue-700 dark:text-blue-200 font-mono ml-2 bg-blue-100/30 dark:bg-blue-900/30 px-2 py-1 rounded">
                              {order.trackingNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-end pt-2">
                      <Link
                        href={`/orders/${order.orderId}`}
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30"
                      >
                        <FiEye className="w-5 h-5" />
                        View Details
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="text-center pt-8">
                  <div className="bg-gradient-to-br from-white/90 via-zinc-50/80 to-white/70 dark:from-zinc-900/90 dark:via-zinc-800/80 dark:to-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-zinc-200/30 dark:border-zinc-700/30 max-w-md mx-auto">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-zinc-600 disabled:to-zinc-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FiRefreshCw className="w-5 h-5 animate-spin" />
                          <span className="font-semibold">Loading more orders...</span>
                        </>
                      ) : (
                        <>
                          <FiPackage className="w-5 h-5" />
                          <span className="font-semibold">Load More Orders</span>
                          <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3">
                      Showing {orders.length} of {pagination.total} orders
                    </p>
                  </div>
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
