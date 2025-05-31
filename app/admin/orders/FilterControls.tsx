'use client';

interface FilterControlsProps {
  currentStatus?: string;
  currentPayment?: string;
}

export default function FilterControls({ currentStatus, currentPayment }: FilterControlsProps) {
  const handleStatusChange = (value: string) => {
    const url = new URL(window.location.href);
    if (value === 'all') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', value);
    }
    window.location.href = url.toString();
  };

  const handlePaymentChange = (value: string) => {
    const url = new URL(window.location.href);
    if (value === 'all') {
      url.searchParams.delete('payment');
    } else {
      url.searchParams.set('payment', value);
    }
    window.location.href = url.toString();
  };

  const handleExport = (format: 'csv' | 'json') => {
    const url = new URL('/api/admin/orders/export', window.location.origin);
    const currentUrl = new URL(window.location.href);
    
    // Copy current search params to export URL
    for (const [key, value] of currentUrl.searchParams) {
      if (key === 'status' || key === 'payment') {
        url.searchParams.set(key, value);
      }
    }
    url.searchParams.set('format', format);
    
    window.open(url.toString(), '_blank');
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-300">Order Status:</label>
        <select
          className="px-3 py-1 bg-zinc-700 border border-zinc-600 rounded-md text-white text-sm"
          defaultValue={currentStatus || 'all'}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending_confirmation">🕐 Pending</option>
          <option value="confirmed">✅ Confirmed</option>
          <option value="processing">👨‍🍳 Processing</option>
          <option value="shipped">🚚 Shipped</option>
          <option value="delivered">📦 Delivered</option>
          <option value="cancelled">❌ Cancelled</option>
          <option value="refunded">💰 Refunded</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-300">Payment Status:</label>
        <select
          className="px-3 py-1 bg-zinc-700 border border-zinc-600 rounded-md text-white text-sm"
          defaultValue={currentPayment || 'all'}
          onChange={(e) => handlePaymentChange(e.target.value)}
        >
          <option value="all">All Payments</option>
          <option value="pending">💳 Pending</option>
          <option value="settlement">💰 Completed</option>
          <option value="failed">⚠️ Failed</option>
          <option value="cancel">❌ Cancelled</option>
          <option value="refund">🔄 Refunded</option>
        </select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => handleExport('csv')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
        >
          📊 Export CSV
        </button>
        <button
          onClick={() => handleExport('json')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
        >
          📄 Export JSON
        </button>
      </div>
    </div>
  );
}
