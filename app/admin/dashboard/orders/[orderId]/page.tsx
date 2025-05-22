// app/admin/dashboard/orders/[orderId]/page.tsx
import { sanityClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Import types, helper functions for formatting as needed

// Query to fetch a single order by its orderId (NOT _id)
const singleOrderQuery = groq`
  *[_type == "order" && orderId == $orderId][0]{
    // Select all fields you need for the detail view
    ...,
    items[]{...}, // Expand items
    // category->{...} // If you linked anything else
  }
`;

async function getOrderDetails(orderId: string) {
  try {
    const order = await sanityClient.fetch(singleOrderQuery, { orderId });
    return order;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}

export default async function AdminOrderDetailPage({ params }: { params: { orderId: string }}) {
  const order = await getOrderDetails(params.orderId);

  if (!order) {
    notFound();
  }

  // Helper to format currency
  const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };
   const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detail Pesanan: {order.orderId}</h1>
        {/* Add status update dropdown/buttons here later */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Item Dipesan</h2>
          <ul className="space-y-3">
            {order.items?.map((item: any) => (
              <li key={item._key || item.productId} className="flex justify-between items-center border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.productName} (x{item.quantity})</p>
                  <p className="text-sm text-zinc-400">{formatCurrency(item.price)}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
           <div className="text-right mt-4 pt-3 border-t border-zinc-800">
            <p className="text-lg font-bold">Total: {formatCurrency(order.totalAmount)}</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Info Pelanggan</h3>
            <p className="text-sm">{order.userName || 'N/A'}</p>
            <p className="text-sm text-zinc-400">{order.userEmail || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Alamat Pengiriman</h3>
            <p className="text-sm">{order.shippingAddress?.street_address}</p>
            <p className="text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state_province} {order.shippingAddress?.postal_code}</p>
            <p className="text-sm">{order.shippingAddress?.country}</p>
            {order.shippingAddress?.phone_number && <p className="text-sm text-zinc-400">Tel: {order.shippingAddress.phone_number}</p>}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Status</h3>
            <p className="text-sm">Pembayaran: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{order.paymentStatus}</span></p>
            <p className="text-sm">Pesanan: <span className="font-medium">{order.orderStatus}</span></p>
            <p className="text-xs text-zinc-500 mt-1">Dibuat: {formatDate(order._createdAt)}</p>
          </div>
        </div>
      </div>
       <Link href="/admin/dashboard" className="mt-8 inline-block text-indigo-400 hover:underline">← Kembali ke Dashboard</Link>
    </div>
  );
}