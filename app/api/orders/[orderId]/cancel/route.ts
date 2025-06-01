// app/api/orders/[orderId]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { client } from '../../../../../sanity/lib/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    console.log('🔄 Cancel order API called');
    
    const { userId } = await auth();
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    console.log('📧 User email:', userEmail);

    if (!userEmail) {
      return NextResponse.json({ message: 'User email not found' }, { status: 400 });
    }

    const resolvedParams = await params;
    console.log('📋 Order ID:', resolvedParams.orderId);
    
    const { reason } = await request.json();
    console.log('📝 Cancel reason:', reason);    // First, verify the order belongs to the user
    console.log('🔍 Fetching order from Sanity...');
    const order = await client.fetch(
      `*[_type == "order" && orderId == $orderId && userEmail == $userEmail][0] {
        _id,
        orderStatus,
        orderHistory
      }`,
      { 
        orderId: resolvedParams.orderId,
        userEmail: userEmail
      }
    );
    console.log('📦 Order found:', !!order, order ? { id: order._id, status: order.orderStatus } : 'null');

    if (!order) {
      return NextResponse.json({ message: 'Order not found or access denied' }, { status: 404 });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending_confirmation', 'confirmed'];
    console.log('🔍 Checking if order can be cancelled:', { currentStatus: order.orderStatus, cancellableStatuses });
    
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return NextResponse.json({ 
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only orders with status 'pending_confirmation' or 'confirmed' can be cancelled.` 
      }, { status: 400 });
    }

    // Create new history entry
    const newHistoryEntry = {
      _type: 'object',
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      note: reason || 'Order cancelled by customer',
      updatedBy: userEmail,
    };    // Update order status
    console.log('💾 Updating order status to cancelled...');
    await client
      .patch(order._id)
      .set({
        orderStatus: 'cancelled',
        customerNotes: reason ? `Customer cancellation: ${reason}` : 'Cancelled by customer',
      })
      .setIfMissing({ orderHistory: [] })
      .append('orderHistory', [newHistoryEntry])
      .commit();

    console.log('✅ Order successfully cancelled');
    return NextResponse.json({ 
      success: true, 
      message: 'Order cancelled successfully' 
    });

  } catch (error: any) {
    console.error('❌ Error cancelling order:', error);
    return NextResponse.json(
      { 
        message: 'Failed to cancel order', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
