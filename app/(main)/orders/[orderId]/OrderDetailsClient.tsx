// app/(main)/orders/[orderId]/OrderDetailsClient.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
  FiCopy,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import EnhancedShippingAddress from './EnhancedShippingAddress';
import { useAlert } from '@/app/components/AlertProvider';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  userId?: string;
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
    name?: string;
  };  paymentDetails?: {
    paymentType: string;
    transactionId: string;
    paymentUrl?: string;
  };
  customerNotes?: string;
  adminNotes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }>;
}

interface OrderDetailsClientProps {
  order: Order;
}

const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { showAlert, showConfirm } = useAlert();const handleCancelOrderConfirm = () => {
    showConfirm({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order? This action cannot be undone.',
      type: 'warning',
      confirmText: 'Yes, Cancel Order',
      cancelText: 'Keep Order',
      showCancel: true,
      onConfirm: handleCancelOrder,
    });
  };
  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      console.log('🔄 Attempting to cancel order:', order.orderId);
      
      const response = await fetch(`/api/orders/${order.orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelled by user' }),
      });

      console.log('📡 Cancel response status:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cancel successful:', result);
        showAlert({
          title: 'Order Cancelled',
          message: 'Your order has been cancelled successfully!',
          type: 'success',
          autoClose: true,
          duration: 3000
        });
        // Refresh the page to show updated order status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('❌ Cancel error:', errorData);
        showAlert({
          title: 'Cancel Failed',
          message: errorData.message || `Failed to cancel order (${response.status})`,
          type: 'error',
          autoClose: true,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      showAlert({
        title: 'Cancel Failed',
        message: 'Failed to cancel order. Please check your connection and try again.',
        type: 'error',
        autoClose: true,
        duration: 5000
      });
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-400" />;
      case 'confirmed':
        return <FiCheckCircle className="w-5 h-5 text-blue-400" />;
      case 'processing':
        return <FiRefreshCw className="w-5 h-5 text-purple-400" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-orange-400" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-300 border-yellow-700/30';
      case 'confirmed':
        return 'bg-blue-900/20 text-blue-300 border-blue-700/30';
      case 'processing':
        return 'bg-purple-900/20 text-purple-300 border-purple-700/30';
      case 'shipped':
        return 'bg-orange-900/20 text-orange-300 border-orange-700/30';
      case 'delivered':
        return 'bg-green-900/20 text-green-300 border-green-700/30';
      case 'cancelled':
        return 'bg-red-900/20 text-red-300 border-red-700/30';
      default:
        return 'bg-gray-900/20 text-gray-300 border-gray-700/30';
    }
  };

  const getPaymentStatusDisplay = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['paid', 'settlement', 'capture', 'success'].includes(lowerStatus)) {
      return {
        text: 'Paid',
        className: 'bg-green-900/20 text-green-300',
      };
    }
    if (['failed', 'cancel', 'expire', 'deny'].includes(lowerStatus)) {
      return {
        text: 'Failed',
        className: 'bg-red-900/20 text-red-300',
      };
    }
    // Default for 'pending'
    return {
      text: status.charAt(0).toUpperCase() + status.slice(1),
      className: 'bg-yellow-900/20 text-yellow-300',
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Create status timeline
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being prepared' },
    { key: 'processing', label: 'Processing', description: 'Your order is being prepared' },
    { key: 'shipped', label: 'Shipped', description: 'Order is on its way to you' },
    { key: 'delivered', label: 'Delivered', description: 'Order has been delivered' }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.orderStatus.toLowerCase());
  const isCancelled = order.orderStatus.toLowerCase() === 'cancelled';

  const paymentDisplay = getPaymentStatusDisplay(order.paymentStatus);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Order Details</h1>
            <p className="text-zinc-400">Order #{order.orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            {!isCancelled && (
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <FiTruck className="w-5 h-5" />
                  Order Progress
                </h2>
                <div className="relative">
                  <div className="flex justify-between">
                    {statusSteps.map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                          index <= currentStatusIndex 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-zinc-800 border-zinc-600 text-zinc-400'
                        }`}>
                          {index <= currentStatusIndex ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${
                            index <= currentStatusIndex ? 'text-white' : 'text-zinc-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1 max-w-20">
                            {step.description}
                          </p>
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute top-5 h-0.5 ${
                            index < currentStatusIndex 
                              ? 'bg-green-500' 
                              : 'bg-zinc-600'
                          }`} 
                          style={{
                            left: `${((index + 1) / statusSteps.length) * 100 - 10}%`,
                            width: `${100 / statusSteps.length - 20}%`
                          }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
                    {item.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.productName}</h3>
                      <p className="text-zinc-400 text-sm">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>                    <div className="text-right">
                      <p className="font-semibold text-white">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-4 border-t border-zinc-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Amount</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FiFileText className="w-5 h-5" />
                  Order Notes
                </h2>
                <p className="text-zinc-300">{order.customerNotes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Order ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{order.orderId}</span>
                    <button
                      onClick={() => copyToClipboard(order.orderId)}
                      className="p-1 rounded hover:bg-zinc-700 transition-colors"
                    >
                      <FiCopy className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Status</span>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Payment Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${paymentDisplay.className}`}>
                    {paymentDisplay.text}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Order Date</span>
                  <span className="text-white text-sm">{formatDate(order._createdAt)}</span>
                </div>

                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Tracking</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{order.trackingNumber}</span>
                      <button
                        onClick={() => copyToClipboard(order.trackingNumber!)}
                        className="p-1 rounded hover:bg-zinc-700 transition-colors"
                      >
                        <FiCopy className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>            {/* Enhanced Shipping Address */}
            <EnhancedShippingAddress 
              orderId={order.orderId} 
              fallbackShippingAddress={order.shippingAddress}
            />{/* Payment Details */}
            {order.paymentDetails && (
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5" />
                  Payment Details
                </h2>
                <div className="space-y-2">
                  {order.paymentDetails.paymentType && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Payment Method</span>
                      <span className="text-white">{order.paymentDetails.paymentType}</span>
                    </div>
                  )}
                  {order.paymentDetails.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Transaction ID</span>
                      <span className="text-white font-mono text-sm">{order.paymentDetails.transactionId}</span>
                    </div>
                  )}
                  {order.paymentDetails.paymentUrl && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Payment URL</span>
                      <a 
                        href={order.paymentDetails.paymentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline"
                      >
                        View Payment
                      </a>
                    </div>
                  )}
                  {!order.paymentDetails.paymentType && !order.paymentDetails.transactionId && (
                    <div className="text-zinc-400 text-sm">
                      Payment details not available
                    </div>
                  )}
                </div>
              </div>
            )}{/* Action Buttons */}
            <div className="space-y-3">              {(order.orderStatus.toLowerCase() === 'pending_confirmation' || order.orderStatus.toLowerCase() === 'confirmed') && (
                <button 
                  onClick={handleCancelOrderConfirm}
                  disabled={cancelling}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FiXCircle className="w-4 h-4" />
                      Cancel Order
                    </>
                  )}
                </button>
              )}
              
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <FiDownload className="w-4 h-4" />
                Download Receipt
              </button>
              
              <Link 
                href="mailto:support@justeatss.id"
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiMail className="w-4 h-4" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>        {/* Copy Success Toast */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsClient;
