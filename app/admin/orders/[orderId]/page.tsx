// app/admin/orders/[orderId]/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EnhancedShippingAddress from './EnhancedShippingAddress';
import QuickActions from './QuickActions';

// Query to fetch a single order by its orderId
const singleOrderQuery = `
  *[_type == "order" && orderId == $orderId][0]{
    _id,
    orderId,
    userId,
    userName,
    userEmail,
    items,
    totalAmount,
    shippingAddress,
    paymentStatus,
    orderStatus,
    paymentDetails,
    orderHistory,
    adminNotes,
    orderNotes,
    customerNotes,
    estimatedDelivery,
    actualDelivery,
    _createdAt,
    _updatedAt,
    paymentGatewayResponse
  }
`;

async function getOrderDetails(orderId: string) {
  try {
    const order = await client.fetch(singleOrderQuery, { orderId });
    return order;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}

export default async function AdminOrderDetailPage({ 
  params 
}: { 
  params: Promise<{ orderId: string }> 
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const resolvedParams = await params;
  const order = await getOrderDetails(resolvedParams.orderId);

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending_confirmation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-green-100 text-green-800 border-green-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'refunded': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'settlement': 'bg-green-100 text-green-800 border-green-200',
      'capture': 'bg-green-100 text-green-800 border-green-200',
      'deny': 'bg-red-100 text-red-800 border-red-200',
      'cancel': 'bg-red-100 text-red-800 border-red-200',
      'expire': 'bg-red-100 text-red-800 border-red-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'refund': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                📦 Order #{order.orderId?.slice(-8)}
              </h1>
              <p className="text-zinc-400 mt-2">Order management and details</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/orders"
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                ← Back to Orders
              </Link>
              <Link
                href={`/admin/studio/structure/order;${order._id}`}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                ✏️ Edit in Studio
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">📋 Order Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Order Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Payment Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Order Date</label>
                  <p className="text-white">{new Date(order._createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Last Updated</label>
                  <p className="text-white">{new Date(order._updatedAt || order._createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">🛍️ Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-zinc-700 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.productName}</h3>
                      <p className="text-sm text-zinc-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">IDR {(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-zinc-400">@ IDR {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-zinc-600">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-orange-400">Total Amount:</span>
                    <span className="text-white">IDR {order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {order.paymentDetails && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-orange-400">💳 Payment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.paymentDetails.transactionId && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Transaction ID</label>
                      <p className="text-white font-mono text-sm">{order.paymentDetails.transactionId}</p>
                    </div>
                  )}
                  {order.paymentDetails.paymentType && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Payment Method</label>
                      <p className="text-white">{order.paymentDetails.paymentType}</p>
                    </div>
                  )}
                  {order.paymentDetails.transactionTime && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Transaction Time</label>
                      <p className="text-white">{new Date(order.paymentDetails.transactionTime).toLocaleString()}</p>
                    </div>
                  )}
                  {order.paymentDetails.settlementTime && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Settlement Time</label>
                      <p className="text-white">{new Date(order.paymentDetails.settlementTime).toLocaleString()}</p>
                    </div>
                  )}
                  {order.paymentDetails.fraudStatus && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Fraud Status</label>
                      <p className="text-white">{order.paymentDetails.fraudStatus}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order History */}
            {order.orderHistory && order.orderHistory.length > 0 && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-orange-400">📝 Order History</h2>
                <div className="space-y-4">
                  {order.orderHistory.map((entry: any, index: number) => (
                    <div key={index} className="flex gap-4 p-4 bg-zinc-700/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(entry.status)}`}>
                            {entry.status?.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-zinc-400">by {entry.updatedBy}</span>
                        </div>
                        <p className="text-white text-sm">{entry.note}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">👤 Customer Info</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Name</label>
                  <p className="text-white">{order.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
                  <p className="text-white">{order.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">User ID</label>
                  <p className="text-white font-mono text-sm">{order.userId}</p>
                </div>
              </div>
            </div>            {/* Enhanced Shipping Address */}
            <EnhancedShippingAddress 
              orderId={resolvedParams.orderId} 
              fallbackShippingAddress={order.shippingAddress}
            />

            {/* Delivery Info */}
            <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">📦 Delivery Info</h2>
              <div className="space-y-3">
                {order.estimatedDelivery && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Estimated Delivery</label>
                    <p className="text-white">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                )}
                {order.actualDelivery && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Actual Delivery</label>
                    <p className="text-white">{new Date(order.actualDelivery).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {(order.adminNotes || order.orderNotes || order.customerNotes) && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-orange-400">📝 Notes</h2>
                <div className="space-y-3">
                  {order.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Admin Notes</label>
                      <p className="text-white bg-zinc-700/50 p-3 rounded text-sm">{order.adminNotes}</p>
                    </div>
                  )}
                  {order.orderNotes && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Order Notes</label>
                      <p className="text-white bg-zinc-700/50 p-3 rounded text-sm">{order.orderNotes}</p>
                    </div>
                  )}
                  {order.customerNotes && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Customer Notes</label>
                      <p className="text-white bg-zinc-700/50 p-3 rounded text-sm">{order.customerNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}            {/* Quick Actions */}
            <QuickActions 
              orderId={resolvedParams.orderId}
              currentStatus={order.orderStatus || 'pending_confirmation'}
              currentPaymentStatus={order.paymentStatus || 'pending'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
