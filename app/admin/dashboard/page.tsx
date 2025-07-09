import { client } from '../../../sanity/lib/client'; // Ensure this path is correct
import Link from 'next/link';
// Impor kedua fungsi ini untuk konsistensi status dan warna
import { mapOrderStatuses, getStatusColor, getPaymentStatusColor } from '../orders/[orderId]/orderUtils';

// Quick stats queries - Disesuaikan agar lebih akurat dengan logika mapOrderStatuses
const statsQueries = {
  totalOrders: `count(*[_type == "order"])`,
  pendingOrders: `count(*[_type == "order" && orderStatus == "pending_confirmation"])`,
  completedOrders: `count(*[_type == "order" && orderStatus == "delivered"])`,
  // Total Revenue: Termasuk status pembayaran yang akan menjadi 'paid' setelah dipetakan
  totalRevenue: `*[_type == "order" && (paymentStatus == "paid" || paymentStatus == "settlement" || paymentStatus == "capture")]{totalAmount}`,
  // Pending Payments: Hitung hanya yang benar-benar pending (belum delivered/confirmed)
  pendingPayments: `count(*[_type == "order" && paymentStatus == "pending" && !(orderStatus in ["delivered", "confirmed"])])`,
  // Paid Payments Count: Hitung status pembayaran yang sudah 'paid', 'settlement', atau 'capture'
  paidPaymentsCount: `count(*[_type == "order" && (paymentStatus == "paid" || paymentStatus == "settlement" || paymentStatus == "capture")])`,
  failedPayments: `count(*[_type == "order" && paymentStatus in ["failed", "deny", "cancel", "expire"]])`,
};

// Recent orders query
const recentOrdersQuery = `
  *[_type == "order"] | order(_createdAt desc)[0...10] {
    _id,
    orderId,
    userName,
    userEmail,
    totalAmount,
    orderStatus,
    paymentStatus,
    _createdAt,
    paymentDetails
  }
`;

async function getDashboardData() {
  try {
    const [statsResults, recentOrdersRaw] = await Promise.all([
      Promise.all(Object.values(statsQueries).map(query => client.fetch(query))),
      client.fetch(recentOrdersQuery)
    ]);

    // Mengambil hasil sesuai urutan di statsQueries
    const [
      totalOrdersCount,
      pendingOrdersCount,
      completedOrdersCount,
      revenueDataArray, // Ini adalah array objek { totalAmount }
      pendingPaymentsCount,
      paidPaymentsTotalCount, // Menambahkan ini
      failedPaymentsCount
    ] = statsResults;
    
    // Pastikan totalAmount dari revenueDataArray dijumlahkan dengan benar
    const totalRevenueSum = (revenueDataArray || []).reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

    // Gunakan fungsi pemetaan terpusat untuk konsistensi data di recentOrders
    const recentOrders = (recentOrdersRaw || []).map(mapOrderStatuses).filter(Boolean);
    
    return {
      stats: {
        totalOrders: totalOrdersCount || 0,
        pendingOrders: pendingOrdersCount || 0,
        completedOrders: completedOrdersCount || 0,
        totalRevenue: totalRevenueSum,
        pendingPayments: pendingPaymentsCount || 0,
        paidPayments: paidPaymentsTotalCount || 0, // Menggunakan count yang benar
        failedPayments: failedPaymentsCount || 0,
      },
      recentOrders
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        paidPayments: 0, // Fallback juga
        failedPayments: 0,
      },
      recentOrders: []
    };
  }
}

// Helper functions (tinggalkan yang spesifik untuk format tampilan ini)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Hapus fungsi getStatusColor lokal yang konflik, sekarang kita import yang terpusat.
// import { getStatusColor, getPaymentStatusColor } from '../orders/[orderId]/orderUtils';
// Fungsi-fungsi ini sudah diimpor di bagian atas file.

export default async function AdminDashboard() {
  // Authentication and authorization is handled by the admin layout
  const { stats, recentOrders } = await getDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-zinc-400">Justeatss.id Order Management</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/admin/orders" // Assuming you have a dedicated page for all orders
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              📋 Manage Orders
            </Link>
            <Link
              href="/admin/studio" // Path to your Sanity Studio
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              📦 Open Sanity Studio
            </Link>
            <Link
              href="/admin/settings"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              ⚙️ Admin Settings
            </Link>
            <Link
              href="/"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base"
            >
              🏠 Back to Website
            </Link>
          </div>
        </div>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Paid Orders</p>
                {/* Ini adalah Completed Orders berdasarkan orderStatus, bukan paymentStatus */}
                <p className="text-3xl font-bold text-green-400">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          {/* Menampilkan Paid Payments yang sebenarnya */}
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Paid Payments</p>
                {/* Menggunakan stats.paidPayments yang baru */}
                <p className="text-3xl font-bold text-green-400">{stats.paidPayments}</p> 
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
            </div>
          </div>


          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Failed Payments</p>
                <p className="text-3xl font-bold text-red-400">{stats.failedPayments}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/studio/structure/order" // Adjust if your Sanity Studio links are different
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 hover:border-orange-500/50 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📦</div>
            <h3 className="font-semibold text-white mb-1">All Orders</h3>
            <p className="text-zinc-400 text-sm">View and manage all orders</p>
          </Link>

          <Link
            href="/admin/studio/structure/order;orderStatus=pending_confirmation" // Example of filtering in Sanity Studio URL
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 hover:border-yellow-500/50 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏳</div>
            <h3 className="font-semibold text-white mb-1">Pending Orders</h3> {/* Label ini juga disesuaikan */}
            <p className="text-zinc-400 text-sm">Process pending confirmations</p> {/* Deskripsi disesuaikan */}
          </Link>

          <Link
            href="/admin/studio/structure/order;paymentStatus=pending" // Example
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 hover:border-blue-500/50 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💳</div>
            <h3 className="font-semibold text-white mb-1">Payment Issues</h3>
            <p className="text-zinc-400 text-sm">Handle payment problems</p>
          </Link>

          <Link
            href="/admin/studio/structure/product" // Adjust for product management in Sanity
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 hover:border-green-500/50 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🍰</div>
            <h3 className="font-semibold text-white mb-1">Products</h3>
            <p className="text-zinc-400 text-sm">Manage product catalog</p>
          </Link>
        </div>

        
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
            <Link
              href="/admin/studio/structure/order" // Link to all orders in Sanity
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[768px]"> 
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Order ID</th>
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Customer</th>
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Amount</th>
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Order Status</th>
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Payment</th>
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Date</th>
                    <th className="text-left py-3 px-3 text-zinc-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => ( // order.orderStatus dan order.paymentStatus sudah dijamin string oleh mapOrderStatuses
                    <tr key={order._id} className="border-b border-zinc-800 hover:bg-zinc-700/30 transition-colors">
                      <td className="py-4 px-3">
                        <span className="font-mono text-xs text-white">
                          #{order.orderId?.slice(-8) || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div>
                          <p className="text-white font-medium text-sm">{order.userName || 'Unknown User'}</p>
                          {order.userEmail && <p className="text-zinc-400 text-xs">{order.userEmail}</p>}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-white font-semibold text-sm">
                          {formatCurrency(order.totalAmount || 0)} {/* Tambahkan fallback */}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {/* Menggunakan getStatusColor yang diimpor */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.orderStatus || '')}`}>
                          {order.orderStatus?.replace('_', ' ').toUpperCase() || 'N/A'} {/* Pastikan UPPERCASE */}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {/* MENGGUNAKAN getPaymentStatusColor untuk status pembayaran */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentStatusColor(order.paymentStatus || '')}`}>
                          {order.paymentStatus?.toUpperCase() || 'N/A'} {/* Pastikan UPPERCASE */}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-zinc-300 text-xs whitespace-nowrap">
                          {formatDate(order._createdAt || '')} {/* Tambahkan fallback */}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {order.orderId && ( // Hanya tampilkan jika orderId ada
                          <Link
                            href={`/admin/orders/${order.orderId}`} // Link ke halaman detail pesanan tertentu
                            className="text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors whitespace-nowrap"
                          >
                            View Details
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl sm:text-6xl mb-4">📦</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Recent Orders Found</h3>
              <p className="text-zinc-400 text-sm sm:text-base">New orders will appear here once they are placed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
