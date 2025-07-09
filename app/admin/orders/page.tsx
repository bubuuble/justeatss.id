// app/admin/orders/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { client } from '../../../sanity/lib/client';
import Link from 'next/link';
import FilterControls from './FilterControls';
// Pastikan path impor untuk orderUtils benar
import { mapOrderStatuses, getStatusColor, getPaymentStatusColor } from './[orderId]/orderUtils';

// Admin Orders Management Page
// Interface Order diperbarui untuk menangani properti yang mungkin undefined/null dari Sanity
interface Order {
  _id: string;
  orderId?: string; // Menjadikan properti ini opsional
  userName?: string; // Menjadikan properti ini opsional
  userEmail?: string; // Menjadikan properti ini opsional
  totalAmount?: number; // Menjadikan properti ini opsional
  orderStatus?: string; // Menjadikan properti ini opsional
  paymentStatus?: string; // Menjadikan properti ini opsional
  _createdAt?: string; // Menjadikan properti ini opsional
  items?: Array<{ // Menjadikan properti ini opsional
    productName?: string; // Properti di dalam item juga opsional
    quantity?: number; // Properti di dalam item juga opsional
    price?: number; // Properti di dalam item juga opsional
  }>;
  paymentDetails?: { // Properti ini sudah opsional
    transactionId?: string;
    paymentType?: string;
  };
}

async function getOrders(status?: string, paymentStatus?: string) {
  let filter = '_type == "order"';
  
  // Menambahkan filter untuk status pesanan
  if (status && status === 'confirmed') {
    // Menangani kasus di mana 'confirmed' juga harus menyertakan status 'settlement' lama
    filter += ` && (orderStatus == "confirmed" || orderStatus == "settlement")`;
  } else if (status && status !== 'all') {
    filter += ` && orderStatus == "${status}"`;
  }
  
  // Menambahkan filter untuk status pembayaran
  if (paymentStatus && paymentStatus === 'paid') {
    // Menangani kasus di mana 'paid' (Completed) juga harus menyertakan status 'settlement' dan 'capture'
    filter += ` && paymentStatus in ["paid", "settlement", "capture"]`;
  } else if (paymentStatus && paymentStatus !== 'all') {
    filter += ` && paymentStatus == "${paymentStatus}"`;
  }

  // Melakukan fetch data dari Sanity
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
      items[]{ // Memastikan 'items' diambil sebagai array objek
        productName,
        quantity,
        price
      },
      paymentDetails
    }`
  );

  return orders as Order[];
}

// Next.js Server Component
export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; payment?: string };
}) {
  const { userId } = await auth();
  
  // Redirect jika user belum login
  if (!userId) {
    redirect('/sign-in');
  }

  // Destructure searchParams untuk menghindari error penggunaan API dinamis Next.js
  const { status, payment } = searchParams;

  // TODO: Tambahkan pemeriksaan peran admin yang tepat di sini
  
  // Mengambil data pesanan mentah dari Sanity
  const rawOrders = await getOrders(status, payment);

  // Memetakan status untuk setiap pesanan agar konsisten dengan tampilan halaman detail
  // CATATAN: Kemungkinan besar, INKONSISTENSI STATUS PEMBAYARAN berasal dari fungsi mapOrderStatuses ini.
  // Menambahkan filter(Boolean) untuk menghilangkan entri null/undefined yang mungkin dihasilkan
  const orders = rawOrders.map(order => mapOrderStatuses(order as any)).filter(Boolean) as Order[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Bagian Manajemen Pesanan */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                📦 Order Management
              </h1>
              <p className="text-zinc-400 mt-2">Manage and track all customer orders</p>
            </div>
            {/* Tombol Navigasi Cepat */}
            <div className="flex gap-4">
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
        </div>
        {/* Filter Kontrol */}
        <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <FilterControls 
            currentStatus={status} 
            currentPayment={payment} 
          />
          <div className="mt-4 text-sm text-zinc-400">
            Total: {orders.length} orders
          </div>
        </div>

        {/* Tabel Daftar Pesanan */}
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
                        #{order.orderId?.slice(-8) || 'N/A'} {/* Menggunakan optional chaining dan fallback 'N/A' */}
                      </div>
                      {order.paymentDetails?.transactionId && (
                        <div className="text-xs text-zinc-400">
                          TXN: {order.paymentDetails.transactionId.slice(-8)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{order.userName || 'N/A'}</div>
                      <div className="text-xs text-zinc-400">{order.userEmail || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {(order.items?.length || 0)} items
                      </div>
                      <div className="text-xs text-zinc-400">
                        {/* Memastikan productNames ada dan difilter agar tidak ada nilai null/undefined */}
                        {order.items?.slice(0, 2).map(item => item?.productName).filter(Boolean).join(', ') || 'No items'}
                        {order.items && order.items.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        IDR {order.totalAmount?.toLocaleString() || '0'} {/* Menggunakan optional chaining dan fallback '0' */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Menggunakan getStatusColor dan memastikan string kosong jika orderStatus null/undefined */}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.orderStatus || '')}`}>
                        {/* Mengubah format status dan fallback 'UNKNOWN' */}
                        {(order.orderStatus?.replace('_', ' ').toUpperCase() || 'UNKNOWN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Menggunakan getPaymentStatusColor dan memastikan string kosong jika paymentStatus null/undefined */}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus || '')}`}>
                        {/* Mengubah format status dan fallback 'UNKNOWN' */}
                        {(order.paymentStatus?.toUpperCase() || 'UNKNOWN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {/* Menampilkan tanggal atau 'N/A' jika _createdAt null/undefined */}
                      {order._createdAt ? new Date(order._createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {order.orderId && ( // Hanya tampilkan Link jika orderId ada
                          <Link
                            href={`/admin/orders/${order.orderId}`}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            👁️ View
                          </Link>
                        )}
                        {order._id && ( // Hanya tampilkan Link jika _id ada
                          <Link
                            href={`/admin/studio/structure/order;${order._id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                        )}
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

        {/* Ringkasan Statistik Cepat */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-orange-400">
              {orders.filter(o => o.orderStatus === 'pending_confirmation').length}
            </div>
            <div className="text-sm text-zinc-400">Pending Orders</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-green-400">
              {orders.filter(o => o.paymentStatus === 'paid').length}
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
