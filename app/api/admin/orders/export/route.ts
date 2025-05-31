// app/api/admin/orders/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '../../../../../sanity/lib/client';
import { requireAdminAPI } from '../../../../../lib/admin-middleware';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const authError = await requireAdminAPI();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('payment');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter
    let filter = '_type == "order"';
    
    if (status && status !== 'all') {
      filter += ` && orderStatus == "${status}"`;
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      filter += ` && paymentStatus == "${paymentStatus}"`;
    }

    if (startDate) {
      filter += ` && _createdAt >= "${startDate}"`;
    }

    if (endDate) {
      filter += ` && _createdAt <= "${endDate}"`;
    }

    // Fetch orders
    const orders = await client.fetch(
      `*[${filter}] | order(_createdAt desc) {
        _id,
        orderId,
        userName,
        userEmail,
        totalAmount,
        orderStatus,
        paymentStatus,
        _createdAt,
        _updatedAt,
        items,
        shippingAddress,
        paymentDetails,
        adminNotes,
        orderNotes,
        customerNotes,
        estimatedDelivery,
        actualDelivery
      }`
    );

    if (format === 'csv') {
      // Convert to CSV
      const headers = [
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Total Amount',
        'Order Status',
        'Payment Status',
        'Items Count',
        'Created Date',
        'Updated Date',
        'City',
        'Payment Method',
        'Transaction ID',
        'Admin Notes'
      ];

      const csvRows = orders.map((order: any) => [
        order.orderId || '',
        order.userName || '',
        order.userEmail || '',
        order.totalAmount || 0,
        order.orderStatus || '',
        order.paymentStatus || '',
        order.items?.length || 0,
        new Date(order._createdAt).toISOString(),
        new Date(order._updatedAt || order._createdAt).toISOString(),
        order.shippingAddress?.city || '',
        order.paymentDetails?.paymentType || '',
        order.paymentDetails?.transactionId || '',
        order.adminNotes || ''
      ]);      const csvContent = [
        headers.join(','),
        ...csvRows.map((row: any[]) => 
          row.map((field: any) => 
            typeof field === 'string' && field.includes(',') 
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON by default
    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length,
      exportedAt: new Date().toISOString(),
      filters: {
        status,
        paymentStatus,
        startDate,
        endDate
      }
    });

  } catch (error) {
    console.error('Error exporting orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
