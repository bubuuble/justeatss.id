// app/admin/orders/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { client } from '../../../sanity/lib/client';
import Link from 'next/link';
import FilterControls from './FilterControls';

// Admin Orders Management Page
interface Order {
  _id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  _createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  paymentDetails?: {
    transactionId?: string;
    paymentType?: string;
  };
}

async function getOrders(status?: string, paymentStatus?: string) {
  let filter = '_type == "order"';
  
  if (status && status !== 'all') {
    filter += ` && orderStatus == "${status}"`;
  }
  
  if (paymentStatus && paymentStatus !== 'all') {
    filter += ` && paymentStatus == "${paymentStatus}"`;
  }

  const orders = await client.fetch(
    `*[${filter}] | order(_createdAt desc) [0...50] {
      _id,
      orderId,
      userName,
      userEmail,
      totalAmount,
      orderStatus,
      paymentStatus,
      _createdAt,
      items,
      paymentDetails
    }`
  );

  return orders as Order[];
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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; payment?: string }>;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // TODO: Add proper admin role checking
  
  const resolvedSearchParams = await searchParams;
  const orders = await getOrders(resolvedSearchParams.status, resolvedSearchParams.payment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                📦 Order Management
              </h1>
              <p className="text-zinc-400 mt-2">Manage and track all customer orders</p>
            </div>            <div className="flex gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                ← Dashboard
              </Link>
              <Link
                href="/admin/studio"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                🎨 Sanity Studio
              </Link>
            </div>
          </div>
        </div>        {/* Filters */}
        <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <FilterControls 
            currentStatus={resolvedSearchParams.status} 
            currentPayment={resolvedSearchParams.payment} 
          />
          <div className="mt-4 text-sm text-zinc-400">
            Total: {orders.length} orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        #{order.orderId?.slice(-8)}
                      </div>
                      {order.paymentDetails?.transactionId && (
                        <div className="text-xs text-zinc-400">
                          TXN: {order.paymentDetails.transactionId.slice(-8)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{order.userName}</div>
                      <div className="text-xs text-zinc-400">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-xs text-zinc-400">
                        {order.items?.slice(0, 2).map(item => item.productName).join(', ')}
                        {order.items?.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        IDR {order.totalAmount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          👁️ View
                        </Link>
                        <Link
                          href={`/admin/studio/structure/order;${order._id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          ✏️ Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-zinc-400 text-lg">📦 No orders found</div>
              <p className="text-zinc-500 text-sm mt-2">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-orange-400">
              {orders.filter(o => o.orderStatus === 'pending_confirmation').length}
            </div>
            <div className="text-sm text-zinc-400">Pending Orders</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-green-400">
              {orders.filter(o => o.paymentStatus === 'settlement').length}
            </div>
            <div className="text-sm text-zinc-400">Paid Orders</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-blue-400">
              {orders.filter(o => o.orderStatus === 'processing').length}
            </div>
            <div className="text-sm text-zinc-400">Processing</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-purple-400">
              IDR {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-zinc-400">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
